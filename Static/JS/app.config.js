(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'Templates/login.html',
                controller: 'LoginController',
                controllerAs: 'vmLogin'
            });

        $stateProvider
            .state('gameboard', {
                url: '/gameboard',
                templateUrl: 'Templates/game-board.html',
                controller: 'GameBoardController',
                controllerAs: 'vmGame',
                params: {
                    host: null,
                    signIn: null
                },
            });
    }

})();