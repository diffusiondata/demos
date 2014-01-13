Conway's Game of Life (multiplayer) demo
========================================

Overview
--------

Conway's Game of Life is a well known example of cellular automata.
A simple grid contains cells which can possess a state - on or off (alive or dead).
In Conway's Game of Life, the subsequent state of a cell is defined by the state of 
its eight neighbouring cells.

Traditionally, Conway's Game of Life is a 'zero-player' game, meaning an initial configuration 
is defined, and no other interaction takes place other than observing the evolution of the game.

This version adds multiple 'tribes' defined by distinct colours, with an additional rule 
governing the interaction of one colour with another.

Ruleset
-------

1. If a live cell has less than 2 live (friendly) cells adjacent, it dies.

2. If a live cell has more than 3 live (friendly) cells adjacent, it dies.

3. If an empty cell has exactly 3 live (friendly) cells adjacent, it becomes a live cell.

4. If a live cell has more than 2 live (enemy) cells adjacent, it dies.

Prerequisites
-------------

- Diffusion (Tested with v4.6.0)
- At least JDK 1.6
- A web-browser supporting the HTML5 Canvas

Building and Installing
-----------------------

1. Install Diffusion

2. Set an environment variable, `DIFFUSION_HOME`, to point to the Diffusion install

3. `mvn package` packages a DAR file containing the conway publisher

4. Deploy the DAR file to the Diffusion deploy/ folder

Running the game
----------------

Start Diffusion and navigate to `http://localhost:8080/demos/conway`
