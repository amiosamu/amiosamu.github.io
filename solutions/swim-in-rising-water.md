---
# Swim In Rising Water · Hard · Advanced Graphs
# https://leetcode.com/problems/swim-in-rising-water/
draft: false
pattern: "Dijkstra on minimax path"
time: "O(V log V) with V = n * n"
space: "O(V) with V = n * n"
---

## Description

Given an `n x n` grid where `grid[r][c]` is the elevation of cell `(r, c)`, and water level
rises to match elapsed time `t`, so a cell is only usable once `t >= grid[r][c]`, return the
least time `t` at which it is possible to swim from the top-left cell to the bottom-right
cell by moving between adjacent usable cells.

**Example**

```
Input: grid = [[0,2],[1,3]]
Output: 3
```

Explanation: At `t = 3` every cell's elevation is `<= 3`, so all four cells are usable and
connected; at any smaller `t` the bottom-right cell (elevation 3) is not yet usable, so 3 is
the earliest time a path exists.

## Intuition

At time `t` I can stand on every cell with `grid[r][c] <= t`, so a path is swimmable at
time `t` exactly when `t` is at least the largest elevation on it. The answer is
therefore the path that minimizes its own maximum cell — a bottleneck path, not a
shortest one.

BFS is the wrong tool because every cell is reachable eventually and step count is
irrelevant; what matters is the ordering of elevations. Dijkstra with `max` instead of
`+` walks the grid in increasing order of "water level needed to get here", so the
first time the corner is popped, that level is the answer.

## Approach

1. Keep a `visited` grid and a min-heap of `(t, r, c)` where `t` is the highest
   elevation on the best path found to `(r, c)`.
2. Seed the heap with `(grid[0][0], 0, 0)` and mark `(0,0)` visited — the start cell's
   own elevation is already a floor on the answer.
3. Pop the smallest `t`. If it is `(n-1, n-1)`, return `t`.
4. For every in-bounds unvisited neighbour, mark it visited **at push time** and push
   `(max(t, grid[nr][nc]), nr, nc)`.
5. Marking at push is safe here (unlike sum-Dijkstra) because pops come out in
   non-decreasing `t`: any later parent `u'` has `t_u' >= t_u`, so
   `max(t_u', grid[v]) >= max(t_u, grid[v])` and the first value pushed for a cell can
   never be improved.
6. The trailing `return -1` never fires — a grid is always fully connected once the
   water is high enough.

## Code

```python
import heapq

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        visited = [[False] * n for _ in range(n)]
        visited[0][0] = True
        heap = [(grid[0][0], 0, 0)]

        while heap:
            t, r, c = heapq.heappop(heap)
            if r == n - 1 and c == n - 1:
                return t
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                    visited[nr][nc] = True
                    heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))

        return -1
```

## Why it works

The heap pops cells in non-decreasing bottleneck value, so when `(n-1, n-1)` comes out
with value `t`, every other route into it passes through a cell that is still unpopped
and therefore already costs at least `t`. Since `max` is monotone — adding a cell can
only raise a path's bottleneck — no cheaper route can appear later, which is exactly
the greedy exchange argument Dijkstra needs. With `V = n * n` cells and `E = 4V` edges,
each edge triggers at most one push: `O(E log V) = O(n^2 log n)`.
