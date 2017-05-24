(function() {
    'use strict';

    angular
        .module('app')
        .controller('BaseController', baseController);

    baseController.$inject = [
        '$rootScope',
        '$state'
    ];

    function baseController($rootScope, $state) {
        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
            console.log("From " + fromState.name + " to " + toState.name, toState);
        });
    }
})();