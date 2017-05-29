(function() {
    'use strict';

    angular
        .module('app')
        .service('IntelligenceService', intelligenceService);

    intelligenceService.$inject = [
        "MovesService",
        "ConstantsService",
        "UtilService"
    ];

    function intelligenceService(movesService, constantsService, utilService) {
        var service = this;

        //Functions
        service.minimax = minimax;

        function minimax(board, playerColor, playingColor, depth, max, min) {

            if (depth >= constantsService.MaxDepth || !utilService.hasEmptySpaces(board)) {
                return { value: (utilService.judge(board)[playingColor]), movement: undefined };
            }

            // get all valid moves
            var validMoves = movesService.legalMovements(board, playingColor);

            var nextStates = [];
            // get all possible states from legal moves
            for (var i = 0; i < validMoves.length; i++) {
                var move = validMoves[i];
                var next = utilService.changeState(board, playingColor, move);
                nextStates.push({ nextBoard: next, movement: move });
            }

            if (validMoves === null || validMoves.length === 0) {
                return { value: (utilService.judge(board)[playingColor]), movement: undefined };
            }

            var nextPlayingColor = playingColor === constantsService.Black ? constantsService.White : constantsService.Black;

            // maximize 
            if (playerColor === playingColor)
                return maxValue(nextStates, playerColor, nextPlayingColor, depth, max, min);
            else //minimize
                return minValue(nextStates, playerColor, nextPlayingColor, depth, max, min);
        }

        function maxValue(nextState, playerColor, playingColor, depth, max, min) {
            var v = -Infinity;

            for (var i = 0; i < nextState.length; i++) {
                var state = nextState[i];

                v = Math.max(v, minimax(state.nextBoard, playerColor, playingColor, depth + 1, max, min).value);
                max = Math.max(max, v);
                if (min <= max) {
                    return { value: v, movement: state.movement };
                }
            }

            return { value: v, movement: nextState[0].movement };
        }

        function minValue(nextState, evaluatingColor, playingColor, depth, max, min) {
            var v = Infinity;

            for (var i = 0; i < nextState.length; i++) {
                var state = nextState[i];

                v = Math.min(v, minimax(state.nextBoard, evaluatingColor, playingColor, depth + 1, max, min).value);
                min = Math.min(min, v);
                if (min <= max) {
                    return { value: v, movement: state.movement };
                }
            }

            return { value: v, movement: nextState[0].movement };
        }
    }
})();