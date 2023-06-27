# MINMAX

This is a demonstration of a generic minmax algorithm. Individual games are imported from the game folders.

# To create your own game, create a new js file, and export an object with the following properties

### game
a variable that stores all of the state of the game
### get  
a function that takes in a game, and a position, and returns a "token" at that position
### set  
a function that takes in a game, a position, and a token, and returns a __new__ game with the token at that position
### positions  
a function that takes in a game, and returns an array of all possible moves
### winner 
a function that takes in a game, and returns a winner, or null if there is no winner
### other 
a function that takes in a token, and returns the other token (for example, if the tokens are "X" and "O", then other("X") should return "O" and other("O") should return "X"). For now, this is because the game is hard coded to be a two player game, but in the future, this will be changed to allow for more than two players.
### starttoken 
a variable that stores the token of the human player, who goes first. To make the computer go first, you must change the game variable, not this variable. See maxnum.js for an example of this.
### draw 
a function that takes in a game and a canvas, and draws the game on the canvas. It should be easy to
modify this, to draw the game on the console or any other environment. 

You can store any other variables or functions in the object, but they should not encode any information about the state of the game. For example, you can store functions that extract information from the game variable, but you should not store the information itself. This is because the game variable is the only thing that is passed to the minmax algorithm, and so it is the only thing that the algorithm can use to make decisions. Anything you store outside
of the game will be ignored by the algorithm.

# To run the game, open index.html in a browser, and play
