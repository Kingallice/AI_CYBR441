# AI_CYBR441
Check out the projects [here](https://kingallice.github.io/AI_CYBR441/)

# The How
<details>
  <summary>N*M Puzzle</summary>
  <p>
    
## Concept
The N*M Puzzle is a puzzle that the goal is to get the tiles to a desired pattern. This may seem simple, but the order of the tiles changes what is possible. This is because the tiles can only slide into the open space. So, looking at the open space, one can either go up, down, left, or right.

## Solvability
The solvability of the puzzle can be determined by looking at parity. If one were to move the open space to the bottom corner, they can intiate a sequence of swaps. You start from the first place swapping the tile that should be in the selected place and the tile that are currently within that space. One would continue doing this until the puzzle is solved. After that you check the number of swaps that occurred, and if that number would happen to be odd, then the puzzle is able to  go to the desired goal state. Otherwise a piece would need to be swapped to allow for the player to achieve the desired goal.
  </p>
</details>
