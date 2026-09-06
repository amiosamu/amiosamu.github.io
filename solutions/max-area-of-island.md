---
# Max Area of Island · Medium · Graphs
# https://leetcode.com/problems/max-area-of-island/
draft: false
pattern: "DFS flood fill, track component size"
time: "O(m * n)"
space: "O(m * n)"
---

## Intuition

Same graph as Number of Islands: nodes are the `1` cells, edges join land cells sharing a
side, and an island is a connected component. The only change is that I want each component's
*size* rather than a count of them, and size is just how many cells the flood fill consumes —
so I count pops and keep a running max.

Connectivity, not distance, is what I need, so DFS is as good as BFS. I sink cells by writing
`0` into the grid instead of keeping a separate `visited` set: it costs nothing extra and the
sunk cell can never be re-entered. I sink at *push* time for the same reason BFS marks
visited on enqueue — two cells on the stack must not be able to push the same neighbour twice
and inflate the area. The stack is explicit because a 50 × 50 grid of all land gives a
recursion depth of 2500, past CPython's default limit.

## Approach

1. `rows, cols = len(grid), len(grid[0])`; `best = 0`.
2. Sweep every cell; `continue` unless `grid[r][c] == 1`.
3. Start a fill: `area = 0`, `stack = [(r, c)]`, and sink the seed with `grid[r][c] = 0`.
4. While the stack is non-empty, pop `(cr, cc)` and `area += 1` — every cell is counted
   exactly once, at pop.
5. For each of the four neighbours `(cr±1, cc)`, `(cr, cc±1)`: if it is in bounds and equals
   `1`, sink it (`grid[nr][nc] = 0`) **before** pushing, then push.
6. After the fill drains, `best = max(best, area)`.
7. Return `best`. An all-water grid never enters step 3, so `best` stays `0`, which is the
   required answer.

## Code

```python
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        best = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != 1:
                    continue

                area = 0
                stack = [(r, c)]
                grid[r][c] = 0

                while stack:
                    cr, cc = stack.pop()
                    area += 1
                    for nr, nc in ((cr + 1, cc), (cr - 1, cc), (cr, cc + 1), (cr, cc - 1)):
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                            grid[nr][nc] = 0
                            stack.append((nr, nc))

                best = max(best, area)

        return best
```

## Why it works

Sinking a cell the instant it is pushed means the set of cells that ever reach the stack is
exactly the connected component of the seed, each appearing once — so `area` counts that
component's cells with no double counting and no omission. Every island is reached because
the sweep visits every cell and the first surviving `1` of an island seeds its fill, while
already-consumed islands are now zeros and are skipped. Each cell is sunk and popped at most
once with 4 neighbour checks, so the whole scan is `O(m * n)`, and the stack can hold
`O(m * n)` cells when the grid is one big island.
