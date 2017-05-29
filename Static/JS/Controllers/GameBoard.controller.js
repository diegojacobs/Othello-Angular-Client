(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameBoardController', gameBoardController);

    gameBoardController.$inject = [
        'socketFactory',
        '$state',
        '$stateParams',
        'MovesService',
        "IntelligenceService"
    ];

    function gameBoardController(socketFactory, $state, $stateParams, movesService, intelligenceService) {
        var vm = this;

        //Models
        vm.Host = $stateParams.host;
        vm.signIn = $stateParams.signIn;
        vm.game = {
            id: 0,
            turnId: 0,
            board: [],
            finished: false
        };
        vm.play = 0;
        vm.invalidMoves = 0;
        vm.countMoves = 0;

        activate();

        function activate() {
            connect();
            logIn();
        }

        vm.mainSocket.on('ok_signin', function() {
            console.log("Successfully signed in!");
        });

        vm.mainSocket.on('ready', function(data) {
            vm.game.finished = false;
            vm.game.id = data.game_id;
            vm.game.turnId = data.player_turn_id;
            var board = data.board;

            if (vm.game.board === board)
                vm.invalidMoves++;

            vm.game.board = board;
            play();
            vm.countMoves++;

            vm.mainSocket.emit('play', {
                tournament_id: vm.signIn.TournamentId,
                player_turn_id: vm.game.turnId,
                game_id: vm.game.id,
                movement: Number(vm.play.movement)
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
            vm.countMoves = 0;
            var win = playerTurnID == winnerTurnID;

            if (win)
                console.log("You Won");
            else
                console.log("You Lost");

            console.log("Total Movements: ", vm.countMoves);
            console.log("Invalid Movements: ", vm.invalidMoves);

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
            vm.play = intelligenceService.minimax(vm.game.board, vm.game.turnId, vm.game.turnId, 0, -Infinity, Infinity);
            console.log("Move: ", vm.play);
            console.log("Valid Moves: ", movesService.legalMovements(vm.game.board, vm.game.turnId));
        }
    }
})();