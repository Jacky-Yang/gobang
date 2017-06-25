(function(global) {
    'use strict';

    var count = 0;
    var wins = []; //赢法数组, [][][k] 代表第k中赢法
    var playerWins;
    var computerWins;
    var tics; //一行多少个棋子
    var chessMap; //棋盘落子统计

    var calcHorizontalWins = function() {
        for (var i = 0; i < tics; i++) {
            for (var j = 0; j < tics - 4; j++) {
                for (var k = 0; k < 5; k++) {
                    wins[i][j + k][count] = true;
                }
                count++;
            }
        }
    };

    var calcVerticalWins = function() {
        for (var i = 0; i < tics; i++) {
            for (var j = 0; j < tics - 4; j++) {
                for (var k = 0; k < 5; k++) {
                    wins[j + k][i][count] = true;
                }
                count++;
            }
        }
    };

    var calcSlashWins = function() {
        for (var i = 0; i < tics - 4; i++) {
            for (var j = 0; j < tics - 4; j++) {
                for (var k = 0; k < 5; k++) {
                    wins[i + k][j + k][count] = true;
                }
                count++;
            }
        }
    };

    var calcBackSlashWins = function() {
        for (var i = 0; i < tics - 4; i++) {
            for (var j = 14; j > 3; j--) {
                for (var k = 0; k < 5; k++) {
                    wins[i + k][j - k][count] = true;
                }
                count++;
            }
        }
    };

    var initWinsArray = function() {
        for (var i = 0; i < tics; i++) {
            wins[i] = [];
            for (var j = 0; j < tics; j++) {
                wins[i][j] = [];
            }
        }
    };

    var initPlayersWinStates = function() {
        playerWins = [];
        computerWins = [];
        for (var i = 0; i < count; i++) {
            playerWins[i] = 0;
            computerWins[i] = 0;
        }
    };

    var initChessMap = function() {
        chessMap = [];
        for (var i = 0; i < CHESS_COUNT; i++) {
            chessMap[i] = [];
            for (var j = 0; j < CHESS_COUNT; j++) {
                chessMap[i][j] = 0;
            }
        }
    };

    var updateChessMap = function(x, y, value) {
        chessMap[x][y] = value;
    };

    var hasChess = function(x, y) {
        return chessMap[x][y] !== 0;
    };


    var init = function(_tics) {
        tics = _tics;

        initWinsArray();
        initChessMap();

        calcHorizontalWins();
        calcVerticalWins();
        calcSlashWins();
        calcBackSlashWins();

        initPlayersWinStates();

        console.log(count);
    };

    var nextStep = function() {
        var playerScore = [];
        var computerScore = [];

        for (var i = 0; i < tics; i++) {
            playerScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < tics; j++) {
                playerScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        var maxScore = 0;
        var v = 0;
        var u = 0;
        var over = false;

        for (var i = 0; i < tics; i++) {
            for (var j = 0; j < tics; j++) {
                if (!hasChess(i, j)) {
                    for (var k = 0; k < count; k++) {
                        if (wins[i][j][k]) {

                            var thisPointPlayerWin = playerWins[k];
                            if (thisPointPlayerWin === 1) {
                                playerScore[i][j] += 100;
                            } else if (thisPointPlayerWin === 2) {
                                playerScore[i][j] += 200;
                            } else if (thisPointPlayerWin === 3) {
                                playerScore[i][j] += 2000;
                            } else if (thisPointPlayerWin === 4) {
                                playerScore[i][j] += 10000;
                            }

                            var thisPointCompWin = computerWins[k];

                            if (thisPointCompWin === 1) {
                                computerScore[i][j] += 120;
                            } else if (thisPointCompWin === 2) {
                                computerScore[i][j] += 220;
                            } else if (thisPointCompWin === 3) {
                                computerScore[i][j] += 3000;
                            } else if (thisPointCompWin === 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }

                    //计算得分最高点的坐标
                    if (playerScore[i][j] > maxScore) {
                        maxScore = playerScore[i][j];
                        v = i;
                        u = j;
                    } else if (playerScore[i][j] === maxScore) {
                        // ?
                        if (computerScore[i][j] > computerScore[v][u]) {
                            v = i;
                            u = j;
                        }
                    }

                    if (computerScore[i][j] > maxScore) {
                        maxScore = computerScore[i][j];
                        v = i;
                        u = j;
                    } else if (computerScore[i][j] === maxScore) {
                        if (playerScore[i][j] > playerScore[v][u]) {
                            v = i;
                            u = j;
                        }
                    }
                }
            }
        }

        updateChessMap(v, u, 2);
        for (var k = 0; k < count; k++) {
            if (wins[v][u][k]) {
                computerWins[k]++;
                playerWins[k] = 6;
            }

            if (computerWins[k] === 5) {
                over = true;
            }
        }
        return {
            x: v,
            y: u,
            over: over
        }
    };

    //player step
    var update = function(x, y) {
        updateChessMap(x, y, 1);
        var over = false;
        for (var k = 0; k < count; k++) {
            if (wins[x][y][k]) {
                playerWins[k]++;
                computerWins[k] = 6;
            }

            if (playerWins[k] === 5) {
                over = true;
            }
        }
        return over;
    };

    var reset = function() {
        initPlayersWinStates();
        initChessMap();
    };


    global.algorithm = {
        init: init,
        nextStep: nextStep,
        update: update,
        reset: reset
    };
})(this);