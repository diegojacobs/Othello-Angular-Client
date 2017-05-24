(function() {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', loginController);

    loginController.$inject = ['$state'];

    function loginController($state) {
        var vm = this;

        //Models
        vm.Host = "localhost:3000";

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

        activate();

        function activate() {

        }

        function connect() {
            $state.go('gameboard', { host: vm.Host, signIn: vm.signIn });
        }
    }
})();