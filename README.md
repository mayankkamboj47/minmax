# MINMAX

This is a demonstration of a generic minmax algorithm. Individual games are imported from their respective files, which follow this convention : 

# Conventions for games

The interface that each game should expose is marked with the keyword 'REQUIREMENT' in the minmax.js file. You can also look at the two examples `tictactoe.js` and `maxnum.js` to see how they adhere to the required interface. The interface is pretty generic, and require games to expose some basic functions, such as possible positions, a game variable which stores _all_ of the game state, functions to check whether someone is winning etc. 
