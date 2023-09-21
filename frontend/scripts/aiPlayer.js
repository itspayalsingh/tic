let origBoard;
let huPlayer = 'O';
let aiPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function selectSym(sym) {
  huPlayer = sym;
  aiPlayer = sym === 'O' ? 'X' : 'O';
  origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }
  if (aiPlayer === 'X') {
    turn(bestSpot(), aiPlayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}

function startGame() {
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText = "";
  document.querySelector('.selectSym').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

function turnClick(square) {
  // console.log(origBoard);
  if (typeof origBoard[square.target.id] === 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) {
      setTimeout(function() {
        turn(bestSpot(), aiPlayer);
    }, 500);
    
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
  checkTie();
}


function checkWin(board, player) {
  let plays = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      plays.push(i)
    }
  }
  let gameWon = null
  for (let i = 0; i < winCombos.length; i++) {
    let isWinningCombo = true;
    for (let j = 0; j < winCombos[i].length; j++) {
      if (!plays.includes(winCombos[i][j])) {
        isWinningCombo = false;
        break;
      }
    }
    if (isWinningCombo) {
      gameWon = { index: i, player: player }
      break;
    }
  }
  return gameWon
}

function gameOver(gameWon) {
  for (let i of winCombos[gameWon.index]) {
    document.getElementById(i).style.backgroundColor =
      gameWon.player === huPlayer ? "rgba(191, 170, 170, 0.131)" : "rgba(60, 182, 32, 0.222)";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick);
  }
  declareWinner(gameWon.player === huPlayer ?   `<img src="./photos/youwin.png" alt="">` :
  `<img src="./photos/youlos-transformed-fotor-bg-remover-2023072713829.png" alt=""></img>`);
}


function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerHTML = who;
}

function emptySquares() {
  return origBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let cell of cells) {
      cell.style.backgroundColor = "rgba(191, 170, 170, 0.131)";
      cell.removeEventListener('click', turnClick, false);
    }
    declareWinner(`<img src="./photos/ezgif.com-video-to-gif.gif" alt="">`);
    return true;
  }
  return false;
}


function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);
  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player === aiPlayer) {
      move.score = minimax(newBoard, huPlayer).score;
    } else {
      move.score = minimax(newBoard, aiPlayer).score;
    }
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) ||
      (player === huPlayer && move.score === -10)) {
      return move;
    }
    else {
      moves.push(move);
    }
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (bestScore<moves[i].score) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
 
setTimeout(() => {
  document.querySelector(".alert").style.display="block"
}, 3000);




