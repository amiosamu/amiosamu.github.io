---
# Island Perimeter · Easy · Graphs
# https://leetcode.com/problems/island-perimeter/
draft: false
pattern: "Count land cells minus shared borders"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given a `grid` of 0s (water) and 1s (land) representing a single island with no lakes, return the perimeter of that island, treating each land cell as a unit square.

**Example**

```
Input: grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
Output: 16
```

Explanation: Summing, over every land cell, the sides that border water or the grid edge (4 minus 1 for each land-to-land adjacency) totals 16.

## Intuition

The graph is the land: every `1` is a node, and two land cells are joined by an edge when
they share a side. Each land cell brings 4 unit sides to the outline, and each edge of that
graph hides exactly 2 of them — one from each endpoint. So the perimeter is
`4 * (land cells) - 2 * (adjacent land pairs)`, and I never have to traverse anything.

Both counts fall out of a single sweep if, at each land cell, I only look *up* and *left*:
every adjacent pair then gets seen exactly once, from its lower/right member. No visited
set, no queue, `O(1)` extra space.

## Approach

1. `perimeter = 0`; grab `rows, cols`.
2. Sweep `r` over `range(rows)` and `c` over `range(cols)`. Skip the cell if `grid[r][c] == 0`.
3. For a land cell, add `4` — its four unit sides, provisionally all exposed.
4. If `r > 0` and `grid[r - 1][c] == 1`, subtract `2`: that shared border removes one side
   from this cell and one from the neighbour above.
5. If `c > 0` and `grid[r][c - 1] == 1`, subtract `2` for the same reason.
6. Do **not** also check down and right — those pairs are already accounted for when the
   sweep reaches the other member. Checking all four directions would double-count.
7. Return `perimeter`.

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

Every unit side of a land cell is either on the outline or shared with another land cell,
and there is no third case — so counting all `4L` sides and removing the `2E` shared ones is
exact. Looking only up and left is what makes each shared border contribute a single
subtraction, since a pair is scanned once from its second member in row-major order. The
formula is oblivious to connectivity, so it stays correct even without the problem's
one-island guarantee, and the whole thing is one pass: `O(m * n)` time, `O(1)` space.
