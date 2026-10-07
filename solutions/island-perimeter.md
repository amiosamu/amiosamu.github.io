---
# Island Perimeter · Easy · Graphs
# https://leetcode.com/problems/island-perimeter/
draft: false
pattern: "Count land cells minus shared borders"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given a grid of water cells (`0`) and land cells (`1`) representing one island without lakes,
return the island's perimeter. Each land cell is a unit square.

**Example**

```
Input: grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
Output: 16
```

The land cells have 16 sides exposed to water or the grid boundary.

## Intuition

Every land cell contributes four sides before neighboring cells are considered. A side shared by
two land cells is internal, so that adjacency removes two sides from the perimeter. Looking only
up and left while scanning row by row counts every shared side exactly once.

## Approach

1. Initialize `perimeter` to zero and scan every cell in row-major order.
2. Skip water cells because they contribute no island boundary.
3. Add four for each land cell, provisionally counting all of its sides.
4. Subtract two when the cell above is land, and two when the cell to the left is land.
5. Return the resulting perimeter. Down and right are omitted so each adjacency is counted once.

## Code

```python
class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        perimeter = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 0:
                    continue
                perimeter += 4
                if r > 0 and grid[r - 1][c] == 1:
                    perimeter -= 2
                if c > 0 and grid[r][c - 1] == 1:
                    perimeter -= 2

        return perimeter
```

## Why it works

Let `L` be the number of land cells and `E` the number of side-sharing land pairs. Counting each
cell separately gives `4L` sides. Every shared border contributes two of those sides, neither of
which belongs to the perimeter, so the correct result is `4L - 2E`. In row-major order, every
shared pair has exactly one lower or right-hand cell, and that cell detects the pair by looking up
or left. Thus the algorithm subtracts exactly once for every shared border.

**Complexity**

- **Time:** `O(m * n)` for an `m` by `n` grid.
- **Space:** `O(1)` auxiliary space.
