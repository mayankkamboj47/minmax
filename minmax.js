if(typeof window === 'undefined' && typeof require!=='undefined') {
    tictactoe = require('./tictactoe'); // not using let or var here, so that it is global
    maxnum = require('./maxnum');
}

function createOptimalPlay({positions, get, set, winner, other}){
    // todo : make these depend on the current game. 
    const memo = {};
    function optimalPlay(game, player, depth=0) {
        console.log(`game : ${game}, depth : ${depth}, currentPlayer : ${player}`);
        // REQUIREMENT : game should be immutable, and you should be able to set it as keys on an object
        if(game in memo){
            console.log('Found in memo, returning', memo[game]);
            return memo[game];
        } 
        let draw, current;
        for(let pos of positions(game)) {
            // REQUIREMENTS : positions should be iterable
            console.log(`checking position ${pos} of ${positions(game).join(',')}`)
            if(get(game, pos)){
                console.log('it is occupied by', get(game, pos), 'continuing...');
                continue; // REQUIREMENT : get should return truthy tokens, and falsy values for empty space
            }
            let moveAtPos = set(game, pos, player);
            console.log('trying the empty position', pos, 'in game', game, 'for player', player, 'at depth', depth, 'of', game, 'which gives', moveAtPos);
            // REQUIREMENT : player should be a token
            let currentWinner = winner(moveAtPos, game, pos, player);
            if(currentWinner){
                console.log('moving to position', pos, 'gives a winner', currentWinner, 'in game', game);
                return memo[game] = {game : game, winner : currentWinner, moveTo : pos};
            }
            // won : returns true or false for whether a game has been won or not. 
            console.log('now giving the opponent chance to do his best, and seeing the outcome');
            current = optimalPlay(moveAtPos, other(player), depth+1);
            console.log(`back after a long journey at depth ${depth}.`);
            console.log('we predict that if',  player ,'plays at', pos, 'in game', game, ', the winner will be', current.winner, 'and the game will be', current.game, 'and the closing move will be', current.moveTo);
            if(current.winner === player) return memo[game]={...current, winner : player, moveTo : pos};
            else if(current.winner !== other(player)) draw = {...current, winner: null, moveTo : pos};
        }
        if(draw) return memo[game]=draw;
        else if(current) return memo[game]={...current, moveTo : positions(game)[0]};
        else return memo[game] = {game, winner : winner(game), moveTo : null};
    }
    return optimalPlay;
}