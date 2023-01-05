const GameBoard = (() => {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getBoardState = () => board;

  const setTile = (row, col, symbol) => {
    board[row][col] = symbol;
  };

  const render = () => {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile) => {
      const row = tile.getAttribute('data-row');
      const col = tile.getAttribute('data-col');
      const tileContent = board[row][col] || ' ';
      tile.textContent = tileContent;
    });
  };

  return { getBoardState, setTile, render };
})();
