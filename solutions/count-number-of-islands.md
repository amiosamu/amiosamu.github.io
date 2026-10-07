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
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```

Explanation: every `'1'` cell is reachable from every other `'1'` cell through an orthogonal
move sequence, so the whole grid forms a single connected island.

## Intuition

Treat each land cell as a graph node connected to its four orthogonal land neighbors. During a
grid scan, every unvisited land cell begins a new connected component. BFS marks that entire
island before the scan continues, preventing it from being counted again. An explicit queue
avoids recursion-depth limits.

## Approach

1. Return zero for an empty grid, then initialize `visited` and `islands`.
2. Scan every cell. For each unvisited land cell, increment `islands` and start BFS there.
3. During BFS, inspect four orthogonal neighbors. Add an in-bounds, unvisited land neighbor to
   `visited` when it is enqueued so it cannot enter the queue twice.
4. Return `islands` after the scan. The grid itself is only read, not changed.

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

Each BFS starts from land and follows exactly the grid's land edges, so it visits all and only
the cells in one island. Marking on enqueue ensures that island cannot start another BFS.
Conversely, the scan reaches at least one cell of every island, and its first unvisited cell
starts one. Therefore the counter increases exactly once per connected component.

**Complexity**

- **Time:** `O(m * n)` because each cell is scanned and each land cell is enqueued once.
- **Space:** `O(m * n)` in the worst case for `visited` and the BFS queue.
