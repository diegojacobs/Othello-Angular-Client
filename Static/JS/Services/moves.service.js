(function() {
    'use strict';

    angular
        .module('app')
        .service('MovesService', movesService);

    movesService.$inject = [
        "ConstantsService"
    ];

    function movesService(constantsService) {
        var service = this;

        //Functions
        service.transformBoard = transformBoard;
        service.validMovements = validMovements;

        function transformBoard(board) {
            var newBoard = [];
            var row = [];
            for (var i = 1; i < board.length + 1; i++) {
                row.push(board[i - 1]);
                if (i % constantsService.N === 0 && i !== 0) {
                    newBoard.push(row);
                    row = [];
                }
            }
            return newBoard;
        }

        function validMovements(board, color) {
            var validMoves = [];
            var newBoard = transformBoard(board);
            for (var x = 0; x < newBoard.length; x++) {
                for (var y = 0; y < newBoard[x].length; y++) {
                    var isValid = isValidMove(x, y, color, newBoard);
                    if (isValid === true) {
                        validMoves.push(x * constantsService.N + y);
                    }
                }
            }

            return validMoves;
        }

        function isValidMove(row, column, color, board) {
            if (board[row][column] !== 0)
                return false;

            var valid = false;
            var rival = (color === constantsService.Black) ? constantsService.White : constantsService.Black;
            var left = (column > 0) ? board[row][column - 1] : -1;
            var right = (column < 7) ? board[row][column + 1] : -1;
            var down = (row < 7) ? board[row + 1][column] : -1;
            var up = (row > 0) ? board[row - 1][column] : -1;

            if (left === rival)
                valid = checkLeft(row, column, board, color, rival);

            if (valid)
                return true;

            if (right === rival)
                valid = checkRight(row, column, board, color, rival);

            if (valid)
                return true;

            if (down === rival)
                valid = checkDown(row, column, board, color, rival);

            if (valid)
                return true;

            if (up === rival)
                valid = checkUp(row, column, board, color, rival);

            if (valid)
                return true;


            var bottomLeft = (column > 0 && row > 7) ? board[row + 1][column - 1] : -1;
            var bottomRight = (column < 7 && row < 7) ? board[row + 1][column + 1] : -1;
            var topLeft = (column > 0 && row > 0) ? board[row - 1][column - 1] : -1;
            var topRight = (column < 7 && row > 0) ? board[row - 1][column + 1] : -1;


            if (bottomLeft === rival)
                valid = checkBottomLeft(row, column, board, color, rival);

            if (valid)
                return true;

            if (bottomRight === rival)
                valid = checkBottomRight(row, column, board, color, rival);

            if (valid)
                return true;

            if (topLeft === rival)
                valid = checkTopLeft(row, column, board, color, rival);

            if (valid)
                return true;

            if (topRight === rival)
                valid = checkTopRight(row, column, board, color, rival);

            if (valid)
                return true;

            return false;
        }

        function checkLeft(row, column, board, color, rival) {
            var changeColor = false;
            for (var y = column - 1; y >= 0; y--) {
                if (board[row][y] === 0)
                    return false;

                if (changeColor && board[row][y] === color)
                    return true;

                if (!changeColor && board[row][y] === rival)
                    changeColor = true;
            }

            return false;
        }

        function checkRight(row, column, board, color, rival) {
            var changeColor = false;
            for (var y = column + 1; y < 8; y++) {
                if (board[row][y] === 0)
                    return false;

                if (changeColor && board[row][y] === color)
                    return true;

                if (!changeColor && board[row][y] === rival)
                    changeColor = true;
            }

            return false;
        }

        function checkDown(row, column, board, color, rival) {
            var changeColor = false;
            for (var x = row + 1; x < 8; x++) {
                if (changeColor && board[x][column] === 0)
                    return false;

                if (changeColor && board[x][column] === color)
                    return true;

                if (!changeColor && board[x][column] === rival)
                    changeColor = true;
            }

            return false;
        }

        function checkUp(row, column, board, color, rival) {
            var changeColor = false;
            for (var x = row - 1; x >= 0; x--) {
                if (changeColor && board[x][column] === 0)
                    return false;

                if (changeColor && board[x][column] === color)
                    return true;

                if (!changeColor && board[x][column] === rival)
                    changeColor = true;
            }

            return false;
        }

        function checkBottomLeft(row, column, board, color, rival) {
            var changeColor = false;
            var y = column - 1;
            for (var x = row + 1; x < 8 && y >= 0; x++) {
                if (changeColor && board[x][y] === 0)
                    return false;

                if (changeColor && board[x][y] === color)
                    return true;

                if (!changeColor && board[x][y] === rival)
                    changeColor = true;

                y--;
            }

            return false;
        }

        function checkBottomRight(row, column, board, color, rival) {
            var changeColor = false;
            var y = column + 1;
            for (var x = row + 1; x < 8 && y < 8; x++) {
                if (changeColor && board[x][y] === 0)
                    return false;

                if (changeColor && board[x][y] === color)
                    return true;

                if (!changeColor && board[x][y] === rival)
                    changeColor = true;

                y++;
            }

            return false;
        }

        function checkTopLeft(row, column, board, color, rival) {
            var changeColor = false;
            var y = column - 1;
            for (var x = row - 1; x >= 0 && y >= 0; x--) {
                if (changeColor && board[x][y] === 0)
                    return false;

                if (changeColor && board[x][y] === color)
                    return true;

                if (!changeColor && board[x][y] === rival)
                    changeColor = true;

                y--;
            }

            return false;
        }

        function checkTopRight(row, column, board, color, rival) {
            var changeColor = false;
            var y = column + 1;
            for (var x = row - 1; x >= 0 && y < 0; x--) {
                if (changeColor && board[x][y] === 0)
                    return false;

                if (changeColor && board[x][y] === color)
                    return true;

                if (!changeColor && board[x][y] === rival)
                    changeColor = true;

                y++;
            }

            return false;
        }
    }
})();