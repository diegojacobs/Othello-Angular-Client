(function() {
    'use strict';

    angular
        .module('app')
        .service('UtilService', utilService);

    utilService.$inject = [
        "ConstantsService"
    ];

    function utilService(constantsService) {
        var service = this;

        //functions
        service.changeState = changeState;
        service.judge = judge;
        service.getTilePositionsToFlip = getTilePositionsToFlip;
        service.hasEmptySpaces = hasEmptySpaces;

        function changeState(modBoard, playingColor, movement) {
            var board = modBoard.slice();
            var tilePositionsToFlip = getTilePositionsToFlip(board, playingColor, movement);
            // Flip and place all the captured tiles
            for (var i = 0; i < tilePositionsToFlip.length; i++) {
                board[tilePositionsToFlip[i]] = playingColor;
            }

            board[movement] = playingColor;

            return board;
        }

        function getTilePositionsToFlip(board, playingColor, position) {
            var otc = playingColor === constantsService.Black ? constantsService.White : constantsService.Black;

            // Possible move directions
            var deltaDirections = {
                down: mapMatrix(0, 1), // Down
                right_down: mapMatrix(1, 1), // Right down
                right: mapMatrix(1, 0), // Right
                right_up: mapMatrix(1, -1), // Right up
                up: mapMatrix(0, -1), // Up
                left_up: mapMatrix(-1, -1), // Left up
                left: mapMatrix(-1, 0), // Left
                left_down: mapMatrix(-1, 1) // Left down
            };

            // Auxiliar movement directions
            var lefts = [
                    deltaDirections.left,
                    deltaDirections.left_down,
                    deltaDirections.left_up
                ],
                rights = [
                    deltaDirections.right,
                    deltaDirections.right_down,
                    deltaDirections.right_up
                ];

            // Calculate which tiles to flip
            var tilePositionsToFlip = [];

            // For each movement direction
            for (var movementKey in deltaDirections) {

                // Movement delta
                var movementDelta = deltaDirections[movementKey],

                    // Position tracker
                    cPosition = position,

                    // Tiles positions captured over this movement direction
                    positionsToFlip = [],

                    // Flag indicating if theere are tiles to capture in this movement direction
                    shouldCaptureInThisDirection = false;

                // While position tracker is on board
                while (cPosition >= 0 && cPosition < (constantsService.N * constantsService.N)) {

                    // Avoid logic on first tile
                    if (cPosition !== position) {

                        // If in this new position is an opponent tile
                        if (board[cPosition] === otc) {
                            positionsToFlip.push(cPosition);
                        } else {

                            // If the current position contains an empty tile, means that we didn't
                            // reach a tile of the same color, therefore shouldn't flip any coin in
                            // this direction. Else, if the current position holds a tile with the
                            // same color of the playing turn, we should mark our findings to turn
                            shouldCaptureInThisDirection = board[cPosition] !== constantsService.Empty;
                            break;
                        }
                    }

                    // Check if next movement is going to wrap a row

                    // Off board
                    if ((cPosition % constantsService.N === 0 && lefts.indexOf(movementDelta) > -1) ||
                        ((cPosition % constantsService.N === constantsService.N - 1) && rights.indexOf(movementDelta) > -1))
                        break;

                    // Move
                    cPosition += movementDelta;
                }

                // If we should capture
                if (shouldCaptureInThisDirection) {
                    for (var i = 0; i < positionsToFlip.length; i++) {
                        tilePositionsToFlip.push(positionsToFlip[i]);
                    }
                }
            }

            return tilePositionsToFlip;
        }

        function mapMatrix(x, y) {
            return x + y * constantsService.N;
        }

        function judge(board) {
            var judgement = [];
            judgement[constantsService.Empty] = 0;
            judgement[constantsService.Black] = 0;
            judgement[constantsService.White] = 0;

            for (var i = 0; i < board.length; i++)
                judgement[board[i]]++;

            return judgement;
        }

        function hasEmptySpaces(board) {
            return judge(board)[constantsService.Empty] > 0;
        }
    }
})();