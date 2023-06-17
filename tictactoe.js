const ticTacToePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const tictactoe = {
  game: 555555555,
  other: (token) => (token === 1 ? 2 : 1),
  get: (game, pos) =>
    Math.floor((game % Math.pow(10, pos + 1)) / Math.pow(10, pos)) % 5,
  set: (game, pos, token) => {
    if (token !== 1 && token !== 2)
      throw new Error(`Setting unknown token ${token} in ${game} at ${pos}`);
      if (tictactoe.get(game, pos)) throw new Error(`Setting already set position ${pos} in ${game} at ${pos}`);
    let before = Math.floor(game / Math.pow(10, pos + 1));
    let after = game % Math.pow(10, pos);
    return Number(`${before}${token}${after || ""}`);
  },
  positions: () => ticTacToePositions,
  starttoken: 1,
  draw: (canvas, game) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, (canvas.height * 2) / 3);
    ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo((canvas.width * 2) / 3, 0);
    ctx.lineTo((canvas.width * 2) / 3, canvas.height);
    ctx.stroke();
    // now draw the tokens
    for (let pos of ticTacToePositions) {
      let token = tictactoe.get(game, pos);
      if (token) {
        ctx.fillStyle = token === 1 ? "red" : "blue";
        let x = pos % 3;
        let y = Math.floor(pos / 3);
        if (token === 1) {
          ctx.beginPath();
          ctx.arc(
            (canvas.width * (x + 0.5)) / 3,
            (canvas.height * (y + 0.5)) / 3,
            canvas.width / 10,
            0,
            2 * Math.PI
          );
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(
            (canvas.width * (x + 0.3)) / 3,
            (canvas.height * (y + 0.3)) / 3
          );
          ctx.lineTo(
            (canvas.width * (x + 0.7)) / 3,
            (canvas.height * (y + 0.7)) / 3
          );
          ctx.moveTo(
            (canvas.width * (x + 0.7)) / 3,
            (canvas.height * (y + 0.3)) / 3
          );
          ctx.lineTo(
            (canvas.width * (x + 0.3)) / 3,
            (canvas.height * (y + 0.7)) / 3
          );
          ctx.stroke();
        }
      }
    }
  },
};

tictactoe.winner = (game) => {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of winCombos) {
    if (
      tictactoe.get(game, a) !== 0 &&
      tictactoe.get(game, a) === tictactoe.get(game, b) &&
      tictactoe.get(game, b) === tictactoe.get(game, c)
    )
      return tictactoe.get(game, a);
  }
  return null;
};

const tictactoeCanvas = document.createElement("canvas");
tictactoeCanvas.width = 300;
tictactoeCanvas.height = 300;
let elt = (tag, attrs = {}, children = []) => {
    let e = document.createElement(tag);
    for (let attr in attrs) e.setAttribute(attr, attrs[attr]);
    for (let child of children) e.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    return e;
    };
tictactoe.draw(tictactoeCanvas, tictactoe.game);
if(typeof window !== 'undefined') {
    let optimalPlay = createOptimalPlay(tictactoe); // this function will be available as window.optimalPlay in the browser, through the minmax.js script's globals
    document.body.appendChild(elt("div", {id : "game"}, [elt("h1", {}, ["Tic Tac Toe"]), tictactoeCanvas]));
    let game = tictactoe.game;
    let currentPlayer = tictactoe.starttoken;
    tictactoeCanvas.addEventListener("click", (e) => {
        let x = Math.floor((e.offsetX / tictactoeCanvas.width) * 3);
        let y = Math.floor((e.offsetY / tictactoeCanvas.height) * 3);
        let pos = x + y * 3;
        game = tictactoe.set(game, pos, currentPlayer);
        tictactoe.draw(tictactoeCanvas, game);
        if(checkWinner()) return;
        console.log('Player 1 moved', game);
        // write "thinking ..." on the canvas
        let ctx = tictactoeCanvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.font = '30px sans-serif';
        ctx.fillText('Thinking ...', 10, 30);
        game = tictactoe.set(game, optimalPlay(game, tictactoe.other(currentPlayer)).moveTo, tictactoe.other(currentPlayer));
        console.log('Player 2 moved', game);
        tictactoe.draw(tictactoeCanvas, game);
        if(checkWinner()) return;
        });
        function checkWinner(){
            let winner = tictactoe.winner(game);
            if(ticTacToePositions.every(pos => tictactoe.get(game, pos))) {
                console.log('Draw!');
                setTimeout(()=>{
                    alert('Draw!');
                    game = tictactoe.game;
                    tictactoe.draw(tictactoeCanvas, tictactoe.game);
                    optimalPlay = createOptimalPlay(tictactoe);    
                }, 50);
                return true;
            }
            if (winner) {
                console.log(winner);
                setTimeout(()=>{
                    alert(`Player ${winner} wins!`);
                    game = tictactoe.game;
                    tictactoe.draw(tictactoeCanvas, tictactoe.game);
                    optimalPlay = createOptimalPlay(tictactoe);    
                }, 50);
                return true;
            }
        }
}

if(typeof module !== 'undefined') module.exports = tictactoe;
