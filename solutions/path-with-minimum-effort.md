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
(moving up/down/left/right) that minimizes the effort of the path, where the effort of a
path is the maximum absolute height difference between two consecutive cells on it — not
the sum of the differences.

**Example**

```
Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
Output: 2
```

Explanation: The route (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) has consecutive height
differences 1, 0, 1, 2, so its effort is the largest of those, 2, and no route to the
corner achieves a smaller maximum difference.

## Intuition

The cost of a path is not the sum of its steps, it is the single worst step — the
largest height jump anywhere along it. So I want the path whose *maximum* edge is
smallest, the bottleneck path.

That one change is what rules out plain BFS: BFS finds the fewest cells, and the
fewest cells is unrelated to the gentlest climb. But Dijkstra never actually needs
addition — all it needs is that extending a path can only make it worse, and
`max(cost_so_far, new_jump) >= cost_so_far` is just as monotone as `+`. So I run
Dijkstra with `max` in place of `+`.

## Approach

1. `effort[r][c]` = the smallest possible "worst jump" over all paths from `(0,0)` to
   `(r, c)`. Initialize everything to infinity, `effort[0][0] = 0`.
2. Push `(0, 0, 0)` — `(effort, row, col)` — onto a min-heap keyed by effort.
3. Pop the cell with the smallest effort. If it is the bottom-right corner, that value
   is the answer: nothing still in the heap can reach it more cheaply.
4. Skip a stale pop (`e > effort[r][c]`) — a cell can sit in the heap several times
   with outdated values.
5. For each of the four neighbours in bounds, the candidate effort is
   `ne = max(e, abs(heights[nr][nc] - heights[r][c]))`. Relax only if `ne < effort[nr][nc]`,
   then push.
6. The `return 0` at the end is unreachable for a valid grid (the grid is always
   connected); a 1x1 grid returns 0 on the very first pop.

## Code

```python
import heapq

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        rows, cols = len(heights), len(heights[0])
        effort = [[float('inf')] * cols for _ in range(rows)]
        effort[0][0] = 0
        heap = [(0, 0, 0)]

        while heap:
            e, r, c = heapq.heappop(heap)
            if r == rows - 1 and c == cols - 1:
                return e
            if e > effort[r][c]:
                continue
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols:
                    ne = max(e, abs(heights[nr][nc] - heights[r][c]))
                    if ne < effort[nr][nc]:
                        effort[nr][nc] = ne
                        heapq.heappush(heap, (ne, nr, nc))

        return 0
```

## Why it works

Dijkstra's correctness rests on one property of the combining operator, not on
addition: extending a path must never decrease its cost. `max` satisfies that, so when
a cell is popped with value `e`, every unpopped cell already has cost `>= e` and any
route through them into this cell would have bottleneck `>= e` — the popped value is
final. The graph has `V = m * n` cells and `E = 4V` edges, and each edge causes at most
one push, giving `O(E log V) = O(V log V)`.
