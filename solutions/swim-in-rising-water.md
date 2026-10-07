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

The destination has elevation `3`, so it is unavailable earlier. At time `3`, a complete path
exists.

## Intuition

A path becomes usable when the water reaches its highest cell. The objective is therefore to
minimize the maximum elevation on a path, not its number of steps. Dijkstra's algorithm applies
after replacing additive path cost with this monotone maximum: extending a path can never lower
its required water level.

## Approach

1. Store `(level, row, col)` in a min-heap, where `level` is the maximum elevation on the path
   used to discover that cell.
2. Seed the heap with the start cell and mark cells when they are pushed.
3. Pop the smallest level; if the cell is the destination, return that level.
4. Push each unvisited neighbor with `max(level, grid[nr][nc])` as its path cost.
5. Return `-1` only as a defensive fallback; the finite grid is connected by its grid edges.

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

Maintain the invariant that every popped cell has the minimum possible bottleneck among all paths
to that cell. Consider the first unpopped cell on any alternative path to the next popped cell.
Its predecessor was already popped, so the algorithm offered it with no greater bottleneck than
that alternative path. The heap minimum can therefore not exceed any alternative. By induction,
the destination's first pop has the globally minimum required level. Marking on push is safe here:
a later parent has no smaller level, so taking `max` with the same neighbor cannot improve its cost.

**Complexity**

- **Time:** `O(V log V)`, equivalently `O(n^2 log n)`, for `V = n^2` cells.
- **Space:** `O(V)` for the heap and visited grid.
