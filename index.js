/* eslint-disable no-param-reassign */
const Events = (() => {
  const events = {};

  const on = (eventName, fn) => {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  };

  const off = (eventName, fn) => {
    if (events[eventName]) {
      for (let i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] === fn) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };

  const emit = (eventName, data) => {
    if (events[eventName]) {
      events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  };

  return { on, off, emit };
})();

const GameBoard = (() => {
  const _board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getBoardState = () => _board;

  const _setTile = ({ row, col, symbol }) => {
    if (_board[row][col] !== null) throw new SyntaxError('Tile is already set');

    _board[row][col] = symbol;
    Events.emit('updateBoard');
  };

  const render = () => {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile) => {
      const row = tile.getAttribute('data-row');
      const col = tile.getAttribute('data-col');
      const tileContent = _board[row][col] || ' ';
      tile.textContent = tileContent;
    });
  };

  Events.on('updateBoard', render);
  Events.on('updateTile', _setTile);

  return { getBoardState, render };
})();

const PlayerFactory = (playerSymbol) => {
  const symbol = (() => {
    if (['x', 'X'].includes(playerSymbol)) return 'X';
    if (['o', 'O'].includes(playerSymbol)) return 'O';

    throw new TypeError("Symbol should be 'X' or 'O'");
  })();

  const markTile = (row, col) => {
    Events.emit('updateTile', { row, col, symbol });
  };

  return { symbol, markTile };
};

const Game = (() => {
  const _playerX = PlayerFactory('X');
  const _playerO = PlayerFactory('O');
  let currentPlayer = _playerX;

  (() => {
    document.querySelectorAll('.tile').forEach((tile) => {
      const row = tile.getAttribute('data-row');
      const col = tile.getAttribute('data-col');

      tile.addEventListener('click', () => {
        const { symbol } = Game.currentPlayer;
        Events.emit('updateTile', { row, col, symbol });
        Game.nextTurn();
      });
    });
  })();

  function switchPlayers() {
    currentPlayer = currentPlayer === _playerX ? _playerO : _playerX;
  }

  function toggleActivePlayer() {
    const playerX = document.querySelector('#playerX');
    const playerO = document.querySelector('#playerO');
    playerX.classList.toggle('active');
    playerO.classList.toggle('active');
  }

  const nextTurn = () => {
    toggleActivePlayer();
    switchPlayers();

    return Game.currentPlayer;
  };

  return {
    get currentPlayer() {
      return currentPlayer;
    },
    nextTurn,
  };
})();
