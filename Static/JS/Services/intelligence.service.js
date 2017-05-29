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
                return { value: (utilService.countPieces(board)[playingColor]), movement: undefined };
            }

            // get all valid moves
            var validMoves = movesService.legalMovements(board, playingColor);

            var newBoards = [];
            // get all possible states from legal moves
            for (var i = 0; i < validMoves.length; i++) {
                var move = validMoves[i];
                var next = utilService.getNewBoard(board, playingColor, move);
                newBoards.push({ next: next, movement: move });
            }

            if (validMoves === null || validMoves.length === 0) {
                return { value: (utilService.countPieces(board)[playingColor]), movement: undefined };
            }

            var nextPlayingColor = playingColor === constantsService.Black ? constantsService.White : constantsService.Black;

            // maximize 
            if (playerColor === playingColor)
                return maxValue(newBoards, playerColor, nextPlayingColor, depth, max, min);
            else //minimize
                return minValue(newBoards, playerColor, nextPlayingColor, depth, max, min);
        }

        function maxValue(newBoards, playerColor, playingColor, depth, max, min) {
            var v = -Infinity;

            for (var i = 0; i < newBoards.length; i++) {
                var board = newBoards[i];

                v = Math.max(v, minimax(board.next, playerColor, playingColor, depth + 1, max, min).value);
                max = Math.max(max, v);
                if (min <= max) {
                    return { value: v, movement: board.movement };
                }
            }

            return { value: v, movement: newBoards[0].movement };
        }

        function minValue(newBoards, evaluatingColor, playingColor, depth, max, min) {
            var v = Infinity;

            for (var i = 0; i < newBoards.length; i++) {
                var board = newBoards[i];

                v = Math.min(v, minimax(board.next, evaluatingColor, playingColor, depth + 1, max, min).value);
                min = Math.min(min, v);
                if (min <= max) {
                    return { value: v, movement: board.movement };
                }
            }

            return { value: v, movement: newBoards[0].movement };
        }
    }
})();