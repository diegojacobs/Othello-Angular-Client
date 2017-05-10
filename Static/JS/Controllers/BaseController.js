(function() {
    'use strict';

    angular
        .module('app')
        .controller('BaseController', baseController);

    baseController.$inject = ['socketFactory'];

    function baseController(socketFactory) {
        var vm = this;

        //Models
        vm.Host = prompt("Coordinator Host and Port:");
        connect();
        vm.mainSocket.on('connect', function() {
            vm.mainSocket.emit('signin', {
                user_name: 'djacobs',
                tournament_id: 12,
                user_role: 'player'
            });
        });
        vm.signIn = {
            Username: 'djacobs',
            TournamentId: 12,
            PlayerRole: 'player'
        };
        vm.game = {
            id: 0,
            turnId: 0,
            board: [],
            finished: false
        };
        vm.move = 0;

        //Functions
        vm.connect = connect;
        vm.logIn = logIn;

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
            vm.game.board = data.board;

            play();
            console.log(vm.signIn.TournamentId);
            console.log(vm.game.turnId);
            console.log(vm.game.id);
            console.log(vm.move);
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
            console.log("Finished");

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

        }

        function play() {
            vm.move = prompt("Movement:");
            console.log(vm.move);
        }
    }
})();