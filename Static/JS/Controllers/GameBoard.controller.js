(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameBoardController', gameBoardController);

    gameBoardController.$inject = [
        'socketFactory',
        '$state',
        '$stateParams',
        'MovesService'
    ];

    function gameBoardController(socketFactory, $state, $stateParams, movesService) {
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
            vm.game.board = movesService.transformBoard(data.board);

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
            for (var x = 0; x < vm.game.board.length; x++) {
                for (var y = 0; y < vm.game.board[x].length; y++) {
                    var isLegal = movesService.legalMove(x, y, vm.game.turnId, vm.game.board);
                    if (isLegal === true) {
                        validMoves.push(x * 8 + y);
                    }
                }
            }
            console.log(validMoves);
            vm.move = validMoves[0];
            console.log("Move: ", vm.move);
        }
    }
})();