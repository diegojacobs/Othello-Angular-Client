(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameBoardController', gameBoardController);

    gameBoardController.$inject = [
        'socketFactory',
        '$state',
        '$stateParams'
    ];

    function gameBoardController(socketFactory, $state, $stateParams) {
        var vm = this;

        //Models
        vm.Host = $stateParams.host;
        vm.signIn = $stateParams.signIn;
        connect();
        logIn();


        vm.game = {
            id: 0,
            turnId: 0,
            board: [],
            finished: false
        };
        vm.move = 0;
        vm.invalidMoves = 0;

        activate();

        function activate() {

        }

        vm.mainSocket.on('ok_signin', function() {
            console.log("Successfully signed in!");
        });

        vm.mainSocket.on('ready', function(data) {
            vm.game.finished = false;
            vm.game.id = data.game_id;
            vm.game.turnId = data.player_turn_id;
            vm.game.board = transformBoard(data.board);

            play();

            vm.mainSocket.emit('play', {
                tournament_id: vm.signIn.TournamentId,
                player_turn_id: vm.game.turnId,
                game_id: vm.game.id,
                movement: Number(vm.move)
            });
        });

        vm.mainSocket.on('finish', function(data) {
            var gameID = data.game_id;
            var playerTurnID = data.player_turn_id;
            var winnerTurnID = data.winner_turn_id;
            var board = data.board;

            // TODO: Your cleaning board logic here
            vm.game = {
                id: 0,
                turnId: 0,
                board: [],
                finished: false
            };
            vm.move = 0;
            vm.invalidMoves = 0;
            var win = playerTurnID == winnerTurnID;
            if (win)
                console.log("You Won");
            else
                console.log("You Lost");

            vm.mainSocket.emit('player_ready', {
                tournament_id: vm.signIn.TournamentId,
                player_turn_id: playerTurnID,
                game_id: gameID
            });
        });

        function connect() {
            console.log("Coordinator: ", vm.Host);
            vm.mainSocket = socketFactory({
                ioSocket: io.connect(vm.Host, { 'sync disconnect on unload': true })
            });
        }

        function logIn() {
            console.log("Sign In: ", vm.signIn);
            vm.mainSocket.on('connect', function() {
                vm.mainSocket.emit('signin', {
                    user_name: vm.signIn.Username,
                    tournament_id: vm.signIn.TournamentId,
                    user_role: vm.signIn.PlayerRole
                });
            });
        }

        function play() {
            var validMoves = [];
            var otherValid = [];
            for (var x = 0; x < vm.game.board.length; x++) {
                for (var y = 0; y < vm.game.board[x].length; y++) {
                    var legal = legalMove(x, y, vm.game.turnId, vm.game.board);
                    if (legal.legal === true) {
                        validMoves.push({ pos: (x * 8 + y), weight: legal.weight });
                        otherValid.push({ x, y });
                    }
                }
            }

            vm.move = validMoves[0].pos;
            console.log("Move: ", vm.move);
        }

        function transformBoard(board) {
            var returnArray = [];
            var innerArray = [];
            for (var i = 1; i < board.length + 1; i++) {
                innerArray.push(board[i - 1]);
                if (i % 8 === 0 && i !== 0) {
                    returnArray.push(innerArray);
                    innerArray = [];
                }
            }
            return returnArray;
        }


        function legalMove(r, c, color, boardMod) {
            var board = boardMod.map(a => Object.assign({}, a));
            var legalObj = { legal: false, weight: 0 };
            if (board[r][c] === 0) {
                // Initialize variables
                var posX;
                var posY;
                var found;
                var current;

                // Searches in each direction
                // x and y describe a given direction in 9 directions
                // 0, 0 is redundant and will break in the first check
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        // Variables to keep track of where the algorithm is and
                        // whether it has found a valid move
                        posX = c + x;
                        posY = r + y;
                        found = false;

                        try {
                            current = board[posY][posX];
                        } catch (err) {
                            continue;
                        }

                        // Check the first cell in the direction specified by x and y
                        // If the cell is empty, out of bounds or contains the same color
                        // skip the rest of the algorithm to begin checking another direction
                        if (current === undefined || current === 0 || current === color) {
                            continue;
                        }

                        // Otherwise, check along that direction
                        while (!found) {
                            posX += x;
                            posY += y;


                            try {
                                current = board[posY][posX];
                            } catch (err) {
                                current = undefined;
                            }
                            // If the algorithm finds another piece of the same color along a direction
                            // end the loop to check a new direction, and set legal to true
                            if (current === color) {
                                found = true;
                                legalObj.legal = true;
                                legalObj.weight += 1

                            }
                            // If the algorithm reaches an out of bounds area or an empty space
                            // end the loop to check a new direction, but do not set legal to true yet
                            else if (current !== 0) {
                                //keep searching
                                found = true;

                                while (true) {
                                    try {
                                        current = board[posY][posX];
                                    } catch (err) {
                                        break;
                                    }
                                    posX += x;
                                    posY += y;
                                    legalObj.weight += 1;
                                    if (current === color) {
                                        legalObj['legal'] = true;
                                        break;
                                    }
                                    if (current === 0 || current === undefined) {
                                        break;
                                    }

                                }
                            } else {
                                found = true; //current = 0 break looop
                            }
                        }
                    }
                }
            }
            return legalObj;
        }

    }
})();