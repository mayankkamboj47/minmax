const maxnumPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const maxnum = {
  game: 2555555555,
  bounty: [9, 2, 7, 4, 8, 1, 5, 6, 3, 10],
  other: (token) => (token === 1 ? 2 : 1),
  get: (game, pos) => {
    if (pos < 0 || pos > maxnumPositions.length - 1)
      throw new Error("Setting value at an invalid position : " + pos);
    return Math.floor((game % Math.pow(10, pos + 1)) / Math.pow(10, pos)) % 5;
  },
  starttoken: 1,
  draw: (game, canvas) => {
    // we will draw the bounty values, and at each position, the token that is there
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < maxnumPositions.length; i++) {
      let x = (i * canvas.width) / maxnumPositions.length + canvas.width / 18;
      let y = canvas.height / 2;
      const token = maxnum.get(game, i);
      // draw a blue circle around the text if token is 1, and a red circle if token is 2
      if (token) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        if (token === 1) {
          ctx.fillStyle = "blue";
          ctx.fill();
        } else if (token === 2) {
          ctx.fillStyle = "red";
          ctx.fill();
        }
        ctx.fillStyle = "white";
      }
      else {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'none';
      }
      console.log("drawing", maxnum.bounty[i], "at", x, y);
      ctx.fillText(maxnum.bounty[i] + "", x, y);
    }
    // write the scores
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const score = (game, token) => {
      total = 0;
      for (let i = 0; i < maxnumPositions.length; i++) {
        if (maxnum.get(game, i) === token) {
          total += maxnum.bounty[i];
        }
      }
      return total;
    }
    ctx.fillText("Human : " + score(game, 1), 10, 10);
    ctx.fillText("Computer : " + score(game, 2), 10, 40);
  },
  winner : (game) => {
    if (maxnumPositions.every((pos) => maxnum.get(game, pos))) {
      let scores = {};
      for (let pos of maxnumPositions) {
        let token = maxnum.get(game, pos);
        if (scores[token]) scores[token] += maxnum.bounty[pos];
        else scores[token] = maxnum.bounty[pos];
      }
      return scores[1] > scores[2] ? 1 : 2;
    }
    return null;
  }, 
  set : (game, pos, token) => {
    if (token !== 1 && token !== 2)
      throw new Error(`Setting unknown token ${token} in ${game} at ${pos}`);
    if (maxnum.positions(game).indexOf(pos) === -1)
      throw new Error("Setting value at an invalid position : " + pos + " in " + game);
    let before = Math.floor(game / Math.pow(10, pos + 1));
    let after = game % Math.pow(10, pos);
    return Number(`${before}${token}${after || ""}`);
  },
  positions : (game) => {
    let left = maxnumPositions[0];
    let right = maxnumPositions[maxnumPositions.length - 1];
    try {
      while (maxnum.get(game, left)) left++;
      maxnum.get(game, left);
    } catch {
      return [];
    }
    try {
      while (maxnum.get(game, right)) right--;
      maxnum.get(game, right);
    } catch {
      return [];
    }
    return [left, right];
  }
};

/** 
 * If CommonJS is available, we export the maxnum object, which can be used in minimax.js
 * If CommonJS is not available, we check if we're in a browser. In that case, both maxnum and createOptimalPlay are available in the global scope, if minimax and maxnum are
 * loaded in the right order.
 */
try {
  if (module && module.exports) module.exports = maxnum;
} catch {
  console.log("CommonJS not available");
}

if (typeof window !== "undefined") {
  let elt = (tag, attrs = {}, children = []) => {
    let e = document.createElement(tag);
    for (let attr in attrs) e.setAttribute(attr, attrs[attr]);
    for (let child of children) e.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    return e;
  };
  window.maxnum = maxnum;
  const canvas = elt("canvas");
  canvas.width = 600;
  canvas.height = 300;
  maxnum.draw(maxnum.game, canvas);
  document.body.appendChild(elt("div", { id: "game" }, [elt("h1", {}, ["Maxnum"]), elt("p", {}, ["Pick from the outer edges, and try to get the maximum score possible. Computer moves first (this game has a strong first mover advantage [1])"]), canvas]));
  let player = maxnum.starttoken;
  let optimalPlay = createOptimalPlay(maxnum);
  let game = maxnum.game;
  canvas.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    let pos = Math.floor(
      ((e.clientX - rect.left) / (rect.right - rect.left)) * maxnumPositions.length // 0.5 to round to nearest integer
    );
    game = maxnum.set(game, pos, player);
    maxnum.draw(game, canvas);
    if (checkWinner()) return;
    game = maxnum.set(
      game,
      optimalPlay(game, maxnum.other(player)).winner !== player ?
        optimalPlay(game, maxnum.other(player)).moveTo :
        (maxnum.bounty[maxnum.positions(game)[0]] > maxnum.bounty[maxnum.positions(game)[1]] ? maxnum.positions(game)[0] : maxnum.positions(game)[1]),
      maxnum.other(player)
    );
    maxnum.draw(game, canvas);
    console.log(game);
    checkWinner();
  });
  function checkWinner() {
    let winner = maxnum.winner(game);
    if (winner) {
      alert(winner === 1 ? 'human' : 'computer' + " wins!");
      // reset the game
      game = maxnum.game;
      maxnum.draw(game, canvas);
      return true;
    }
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = maxnum;