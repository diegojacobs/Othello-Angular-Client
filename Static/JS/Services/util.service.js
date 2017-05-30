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
        service.getNewBoard = getNewBoard;
        service.countPieces = countPieces;
        service.getPositionsToFlip = getPositionsToFlip;
        service.hasEmptySpaces = hasEmptySpaces;

        function getNewBoard(board, currentColor, movement) {
            //Copy array
            var boardCopy = board.slice();
            var positionsToFlip = getPositionsToFlip(boardCopy, currentColor, movement);

            for (var i = 0; i < positionsToFlip.length; i++) {
                boardCopy[positionsToFlip[i]] = currentColor;
            }

            boardCopy[movement] = currentColor;

            return boardCopy;
        }

        function getPositionsToFlip(board, currentColor, position) {
            var otherColor = currentColor === constantsService.Black ? constantsService.White : constantsService.Black;

            var directions = {
                left: (-1) * constantsService.N + (0), // Left
                right: 1 * constantsService.N + 0, // Right
                down: 0 * constantsService.N + 1, // Down
                up: 0 * constantsService.N + (-1), // Up
                leftDown: (-1) * constantsService.N + 1, // Left down
                rightDown: 1 * constantsService.N + 1, // Right down
                leftUp: (-1) * constantsService.N + (-1), // Left up
                rightUp: 1 * constantsService.N + (-1) // Right up
            };

            var lefts = [
                    directions.left,
                    directions.leftDown,
                    directions.leftUp
                ],
                rights = [
                    directions.right,
                    directions.rightDown,
                    directions.rightUp
                ];

            var tilePositionsToFlip = [];

            // For each movement direction
            for (var movementKey in directions) {

                // Movement delta
                var movementDelta = directions[movementKey],
                    cPosition = position,
                    positionsToFlip = [],
                    foundCurrentColor = false,
                    changedColor = false;

                // While position is on board
                while (cPosition >= 0 && cPosition < (constantsService.N * constantsService.N)) {
                    if (cPosition !== position) {

                        // If in this new position is an opponent tile
                        if (board[cPosition] === otherColor) {
                            positionsToFlip.push(cPosition);
                            changedColor = true;
                        } else if (changedColor) {
                            foundCurrentColor = board[cPosition] !== constantsService.Empty;
                            break;
                        }
                    }

                    if ((cPosition % constantsService.N === 0 && lefts.indexOf(movementDelta) > -1) || ((cPosition % constantsService.N === constantsService.N - 1) && rights.indexOf(movementDelta) > -1))
                        break;

                    // Move
                    cPosition += movementDelta;
                }

                if (foundCurrentColor) {
                    for (var i = 0; i < positionsToFlip.length; i++) {
                        tilePositionsToFlip.push(positionsToFlip[i]);
                    }
                }
            }

            return tilePositionsToFlip;
        }

        function countPieces(board) {
            var pieces = [];
            pieces[constantsService.Empty] = 0;
            pieces[constantsService.Black] = 0;
            pieces[constantsService.White] = 0;

            for (var i = 0; i < board.length; i++)
                pieces[board[i]]++;

            return pieces;
        }

        function hasEmptySpaces(board) {
            return countPieces(board)[constantsService.Empty] > 0;
        }
    }
})();