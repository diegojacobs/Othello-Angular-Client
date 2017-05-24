// import { legalMove, transformBoard, mapMatrix } from './game_core';
// import { 
//     changeState, 
//     getOpponentTileColor, 
//     judge, fullBoard } from './board_functions';
// import { BLACK, WHITE, N, EMPTY, TERMINAL, SQUARE_WEIGHTS } from './constants';

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