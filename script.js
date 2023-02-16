/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */

const player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return {
    getName,
    getMarker,
  };
};

const Game = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  let computerPlayer = false;

  const setComputerPlayer = () => {
    computerPlayer = true;
  };

  const isComputerPlayer = () => computerPlayer;

  const computerPlayerSelection = () => {
    let rand = Math.floor(Math.random() * 9);
    return rand;
  };

  const checkForDraw = () => {
    let isFull = true;
    for (let i = 0; i < gameboard.length; i++) {
      if (gameboard[i] === '') {
        isFull = false;
      }
    }
    return isFull;
  };
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const checkForWinner = () => {
    let roundResult;
    let currentPlayerMarker = getCurrentPlayer().getMarker();

    winningCombos.forEach((row) => {
      let a = row[0];
      let b = row[1];
      let c = row[2];

      if (
        gameboard[a] === currentPlayerMarker
        && gameboard[b] === currentPlayerMarker
        && gameboard[c] === currentPlayerMarker
      ) {
        roundResult = 'win';
        DisplayController.showResult();
        return console.log(`WINNER: ${getCurrentPlayer().getName()}`);
      }
    });
    if (checkForDraw() === true) {
      DisplayController.showResult();
    }
  };

  let players = [];

  const resetPlayers = () => {
    players = [];
  };
  let currentPlayer;

  const getCurrentPlayer = () => currentPlayer;

  const addPlayer = (player) => {
    players.push(player);
  };

  const switchPlayer = () => {
    if (currentPlayer === players[0]) {
      currentPlayer = players[1];
    } else if (currentPlayer === players[1]) {
      currentPlayer = players[0];
    }
  };

  const resetGameBoard = () => {
    for (let i = 0; i < gameboard.length; i++) {
      gameboard[i] = '';
    }
  };

  const gameboardPlaceMarker = (selectedPlayerMarker, index) => {
    gameboard[index] = selectedPlayerMarker;
  };

  const playRound = () => {
    // eslint-disable-next-line prefer-destructuring
    currentPlayer = players[0];
  };

  return {
    gameboard,
    resetGameBoard,
    gameboardPlaceMarker,
    addPlayer,
    switchPlayer,
    getCurrentPlayer,
    playRound,
    resetPlayers,
    checkForWinner,
    checkForDraw,
    setComputerPlayer,
    isComputerPlayer,
    computerPlayerSelection,
  };
})();

const DisplayController = (() => {
  // dom elements, setting and retrieving them
  let optionsContainer;
  let playerVsPlayer;
  let playerVsComputer;
  let singlePlayerName;
  let playerNameInput;
  const body = document.querySelector('body');
  let pageContainer = document.querySelector('.page-container');
  let grid;

  const primeGrid = () => {
    // sets event listeners
    // Game.startRound();
    for (let i = 0; i < Game.gameboard.length; i++) {
      let div = document.createElement('div');
      div.classList.add('game--board-box', `box${i}`);
      div.addEventListener('click', () => {
        if (div.textContent === '') {
          // if text content is empty, place current players marker
          Game.gameboardPlaceMarker(Game.getCurrentPlayer().getMarker(), i);
          div.textContent = Game.getCurrentPlayer().getMarker();
          if (Game.isComputerPlayer()) {
            Game.gameboardPlaceMarker(Game.getCurrentPlayer().getMarker(), Game.computerPlayerSelection());
            div.textContent = Game.getCurrentPlayer().getMarker();
          }
          Game.checkForWinner();
          div.textContent = Game.getCurrentPlayer().getMarker();
          console.log(Game.gameboard);
          Game.switchPlayer();
        }
      });
      grid.appendChild(div);
    }
  };

  const loadGame = () => {
    optionsContainer.innerHTML = '';
    grid = document.querySelector('.game--board');
    primeGrid();
    let backButton = document.createElement('button');
    backButton.textContent = 'Go Back';
    backButton.classList.add('back-button');
    backButton.addEventListener('click', () => {
      loadMenuScreen();
    });
    grid.appendChild(backButton);
    Game.playRound();
  };

  const loadMenuScreen = () => {
    const homeScreenHTML = `<div class="page-container">
    <h1>Tic-Tac-Toe</h1>
    <div class="options--container">
      <div id="option-computer">
        <h3>Player vs Computer</h3>
        <input
          type="text"
          class="singlePlayerName"
          placeholder="player name*"
          required
        />
        <button id="computer-play">Play</button>
      </div>
      <div id="option-twoplayer">
        <h3>Player vs Player</h3>
        <input
          type="text"
          class="playerNameInput"
          placeholder="player 1 name*"
        />
        <input
          type="text"
          class="playerNameInput"
          placeholder="player 2 name*"
        />
        <button id="twoplayer-play">Play</button>
      </div>
    </div>
    <section class="game--board"></section>
  </div>`;

    Game.resetPlayers(); // allows user to re-specify names
    body.innerHTML = homeScreenHTML;
    playerVsPlayer = document.querySelector('#twoplayer-play');
    playerVsComputer = document.querySelector('#computer-play');
    optionsContainer = document.querySelector('.options--container');
    playerNameInput = document.querySelectorAll('.playerNameInput');
    singlePlayerName = document.querySelector('.singlePlayerName');

    playerVsPlayer.addEventListener('click', () => {
      if (playerNameInput[0].value && playerNameInput[1].value) {
        Game.addPlayer(player(playerNameInput[0].value, 'x'));
        Game.addPlayer(player(playerNameInput[1].value, 'o'));
        loadGame();
      } else {
        playerNameInput.forEach((inputfield) => {
          if (inputfield.value === '') {
            inputfield.classList.add('required');
          }
        });
      }
    });

    playerVsComputer.addEventListener('click', () => {
      console.log('test');
      if (singlePlayerName.value !== '') {
        Game.addPlayer(player(singlePlayerName.value, 'x'));
        Game.addPlayer(player('Computer', 'o'));
        loadGame();
      }
      Game.setComputerPlayer();
    });
  };

  //   }
  // });
  // else {

  //       if (inputfield.value === '') {
  //         inputfield.classList.add('required');
  //       }

  //   }
  // });

  const showResult = () => {
    pageContainer = document.querySelector('.page-container');
    pageContainer.classList.add('blur');
    const result = document.createElement('div');
    result.classList.add('result');
    if (Game.checkForDraw()) {
      result.textContent = 'DRAW!';
    } else {
      result.textContent = `Winner is: ${Game.getCurrentPlayer().getName()}`;
    }
    document.querySelector('body').appendChild(result);
    grid.innerHTML = '';
    // Game.switchPlayer();
    setTimeout(() => {
      grid.innerHTML = '';
      Game.resetGameBoard();
      pageContainer.classList.remove('blur');
      result.textContent = '';
      loadGame();
    }, 2000);
  };

  return {
    loadMenuScreen,
    loadPlayerVsPlayer: loadGame,
    showResult,
  };
})();
// ======================== end of objects/classes/constructors/IIFE=============================
DisplayController.loadMenuScreen();

console.log(Game.gameboard);
