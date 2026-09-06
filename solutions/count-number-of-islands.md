---
# Number of Islands · Medium · Graphs
# https://leetcode.com/problems/number-of-islands/
draft: false
pattern: "BFS flood fill, count components"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` binary grid where `'1'` marks land and `'0'` marks water, count the number
of islands, where an island is a group of land cells connected horizontally or vertically.

**Example**

```
Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
Output: 1
```

Explanation: every `'1'` cell is reachable from every other `'1'` cell through up/down/left/
right moves, so the whole grid forms a single connected island.


## Intuition

The grid is a graph in disguise: each `"1"` cell is a node, and there is an edge between two
land cells that share a side (no diagonals). "Number of islands" is then literally the number
of connected components, and counting components is a traversal problem, not a comparison
problem — pairing up cells to see who touches whom is quadratic and pointless.

So sweep the grid, and every time I hit land that isn't already accounted for, that cell must
belong to a component I have never seen: bump the counter and flood the whole component so it
can never start another count. Because I only need reachability and not distance, BFS or DFS
are equally valid; I use BFS with an explicit `deque` so a 300 × 300 all-land grid can't blow
the recursion limit.

## Approach

1. Guard `if not grid: return 0`, then take `rows, cols`.
2. Keep `visited` as a set of `(r, c)` pairs and `islands = 0`.
3. Sweep every cell. If `grid[r][c] == "1"` and `(r, c) not in visited`, do `islands += 1`
   and flood from there.
4. To flood: `q = deque([(r, c)])` and immediately `visited.add((r, c))`.
5. While `q`, pop a cell and try its four neighbours `(r±1, c)`, `(r, c±1)`. A neighbour is
   pushed only if it is in bounds, is `"1"`, and is not in `visited`.
6. **Mark `visited` when pushing, not when popping.** If a cell were only marked on pop, two
   cells already in the queue could each enqueue the same neighbour, so cells would be
   expanded more than once and the queue could grow past `O(m * n)`. Marking on push makes
   "in the queue" and "visited" the same state, so each cell enters exactly once.
7. When the sweep ends, return `islands`.

## Code

```python
import collections

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0

        rows, cols = len(grid), len(grid[0])
        visited = set()
        islands = 0

        def bfs(sr, sc):
            q = collections.deque([(sr, sc)])
            visited.add((sr, sc))
            while q:
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if (0 <= nr < rows and 0 <= nc < cols
                            and grid[nr][nc] == "1"
                            and (nr, nc) not in visited):
                        visited.add((nr, nc))
                        q.append((nr, nc))

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1" and (r, c) not in visited:
                    islands += 1
                    bfs(r, c)

        return islands
```

## Why it works

A BFS from a land cell visits precisely its connected component, so after the flood every
cell of that island is in `visited` and the sweep can never re-count it — meaning the counter
increments exactly once per component. Conversely no component is missed, because the sweep
touches every cell and the first unvisited land cell of any island triggers its flood. Each
cell is added to `visited` at most once and expanded at most once, examining 4 neighbours, so
the total work is `O(m * n)` with `O(m * n)` for the visited set and the worst-case queue.
