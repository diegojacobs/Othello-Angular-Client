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

        function minimax(board, evaluatingColor, currentColor, depth, max, min) {

            if (depth >= constantsService.MaxDepth || !utilService.hasEmptySpaces(board)) {
                return { value: (utilService.countPieces(board)[currentColor]), movement: undefined };
            }

            // get all valid moves
            var validMoves = movesService.validMovements(board, currentColor);

            var newBoards = [];
            // get all possible states from legal moves
            for (var i = 0; i < validMoves.length; i++) {
                var move = validMoves[i];
                var next = utilService.getNewBoard(board, currentColor, move);
                newBoards.push({ next: next, movement: move });
            }

            if (validMoves === null || validMoves.length === 0) {
                return { value: (utilService.countPieces(board)[currentColor]), movement: undefined };
            }

            var nextColor = currentColor === constantsService.Black ? constantsService.White : constantsService.Black;

            // maximize 
            if (evaluatingColor === currentColor)
                return maxValue(newBoards, evaluatingColor, nextColor, depth, max, min);
            else //minimize
                return minValue(newBoards, evaluatingColor, nextColor, depth, max, min);
        }

        function maxValue(newBoards, evaluatingColor, currentColor, depth, max, min) {
            var v = -Infinity;

            for (var i = 0; i < newBoards.length; i++) {
                var board = newBoards[i];

                v = Math.max(v, minimax(board.next, evaluatingColor, currentColor, depth + 1, max, min).value);
                max = Math.max(max, v);
                if (min <= max) {
                    return { value: v, movement: board.movement };
                }
            }

            return { value: v, movement: newBoards[0].movement };
        }

        function minValue(newBoards, evaluatingColor, currentColor, depth, max, min) {
            var v = Infinity;

            for (var i = 0; i < newBoards.length; i++) {
                var board = newBoards[i];

                v = Math.min(v, minimax(board.next, evaluatingColor, currentColor, depth + 1, max, min).value);
                min = Math.min(min, v);
                if (min <= max) {
                    return { value: v, movement: board.movement };
                }
            }

            return { value: v, movement: newBoards[0].movement };
        }
    }
})();