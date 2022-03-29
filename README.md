# AI_CYBR441
Check out the projects [here](https://kingallice.github.io/AI_CYBR441/)

# The How
<details>
  <summary>N*M Puzzle</summary>
  <p>
    
## Concept
The N*M Puzzle is a puzzle that the goal is to get the tiles to a desired pattern. This may seem simple, but the order of the tiles changes what is possible. This is because the tiles can only slide into the open space. So, looking at the open space, one can either go up, down, left, or right. Our version creates a puzzle that has a max size of 25x25, however, this is rare and size in practice stays much closer to the range 15.

## Solvability
The solvability of the puzzle can be determined by looking at parity. If one were to move the open space to the bottom corner, they can intiate a sequence of swaps. You start from the first place swapping the tile that should be in the selected place and the tile that are currently within that space. One would continue doing this until the puzzle is solved. After that you check the number of swaps that occurred, and if that number would happen to be odd, then the puzzle is able to  go to the desired goal state. Otherwise a piece would need to be swapped to allow for the player to achieve the desired goal.
    
## Algorithm
The algorithm to solve the puzzle works by first solving the lines, and its remaining corner, until only two lines remain. Then it solves those lines to simplify the puzzle down to a 2x3 puzzle. This is then solved using a brute force method.
    <details><summary>In Depth</summary>
### Row[0] -> Row[LastRow-2]
#### Line
The lines are solved by first moving the open space next to the desired piece to place in its correct position. From here we rotate so that the piece moves up and move nearby again. This occurs until the piece is located within the row below its correct row . Next, the piece is rotated so that it moves horizontally until the piece is placed in the correct column. From here a rotation occurs that places the piece in the correct location.
#### Remaining Line Corners
The remaining corners within each line are solved by first placing the open space below the second to last index in the row. Then a rotation occurs placing this tile in the corner. Next is to find the tile which is to go in the corner. We move the open space so that it is within the column to the left of the tile. We then move down until rows are matching. From here we move to the right of tile and implement {Up, Right, Right, Down, Left} until the tile reaches the far-most right column. From here we rotate so that the tile is within the row above the open space, and move the open space below this tile. Then we can implement {Left, Up, Up, Right, Down} until the tile is within the corner. Doing this places both of the tiles at the end of each row into the correct places, as the move is essentially a rotate of {Up, Right, Down, Left}. As this rotate is the final part of placing these tiles when tile[n-1] of the row is located above tile[n] of the row.
### Last Two Rows
#### Simplifying

    </details>
  </p>
</details>
