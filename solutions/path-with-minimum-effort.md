---
# Path with Minimum Effort · Medium · Advanced Graphs
# https://leetcode.com/problems/path-with-minimum-effort/
draft: false
pattern: "Dijkstra on bottleneck edges"
time: "O(V log V) with V = m * n"
space: "O(V) with V = m * n"
---

## Description

Given a grid of cell heights, find a path from the top-left cell to the bottom-right cell
using four-directional moves. A path's effort is the maximum absolute height difference
between consecutive cells; return the minimum possible effort.

**Example**

```
Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
Output: 2
```

Explanation: The path `(0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)` has jumps
`2, 2, 2, 2`, so its effort is `2`, and no path has a smaller maximum jump.

## Intuition

This is a bottleneck path: path cost is its largest edge weight, not the sum of edge weights.
Extending a path changes its effort to `max(current_effort, next_jump)`, which can never decrease.
That monotonicity allows Dijkstra's algorithm to work with `max` in place of addition. Plain BFS
cannot work because fewer steps do not imply a smaller height jump.

## Approach

1. Let `effort[r][c]` be the best known bottleneck cost from `(0, 0)` to `(r, c)`. Initialize
   all values to infinity except `effort[0][0] = 0`.
2. Pop `(e, r, c)` from a min-heap and skip it if `e` exceeds the current recorded effort.
3. Return `e` when the destination is popped. A `1 x 1` grid therefore returns zero.
4. For each valid neighbor, compute
   `ne = max(e, abs(heights[nr][nc] - heights[r][c]))`.
5. If `ne` improves the neighbor, update its effort and push the new entry. The grid is not
   mutated; the final fallback is unreachable because every valid grid is connected.

## Code

```python
import heapq

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        rows, cols = len(heights), len(heights[0])
        effort = [[float("inf")] * cols for _ in range(rows)]
        effort[0][0] = 0
        heap = [(0, 0, 0)]

        while heap:
            e, r, c = heapq.heappop(heap)
            if e > effort[r][c]:
                continue
            if r == rows - 1 and c == cols - 1:
                return e
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols:
                    ne = max(e, abs(heights[nr][nc] - heights[r][c]))
                    if ne < effort[nr][nc]:
                        effort[nr][nc] = ne
                        heapq.heappush(heap, (ne, nr, nc))

        return 0
```

## Why it works

Consider a cell popped with the smallest non-stale effort `e`. If a path with effort below `e`
existed, take the first cell on that path not yet finalized. Its predecessor was finalized and
would have inserted that cell with effort below `e`, contradicting the heap minimum. Thus every
non-stale pop is optimal. In particular, the destination's first non-stale pop is the minimum
possible path effort, so returning it is correct.

**Complexity**

- **Time:** `O(V log V)` for `V = m * n`; the grid graph has `O(V)` edges.
- **Space:** `O(V)` auxiliary space for the effort table and heap.
