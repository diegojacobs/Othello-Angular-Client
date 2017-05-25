(function() {
    'use strict';

    angular
        .module('app')
        .service('MiniMaxService', miniMaxService);

    miniMaxService.$inject = [];

    function miniMaxService() {
        var service = this;

        //Functions
        service.miniMax = miniMax;

        function miniMax() {

        }
    }
})();