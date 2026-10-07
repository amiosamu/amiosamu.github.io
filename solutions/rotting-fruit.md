---
# Rotting Oranges · Medium · Graphs
# https://leetcode.com/problems/rotting-oranges/
draft: false
pattern: "Multi-source BFS, count levels"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` grid where `0` is empty, `1` is a fresh orange, and `2` is a rotten orange,
return the minimum number of minutes until no fresh orange remains. Each minute, every rotten
orange rots its fresh orthogonal neighbors. Return `-1` if this is impossible.

**Example**

```
Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
```

Explanation: Rot spreads one grid edge per minute. The final fresh orange is reached after four
minutes.

## Intuition

Rot reaches all adjacent cells simultaneously, so each minute is one breadth-first search
level. The search must start with every initially rotten orange because all sources spread at
the same time.

`fresh` tracks how many oranges remain. Marking an orange rotten when it is enqueued prevents
two neighbors from enqueueing and counting the same orange twice. This mutates `grid`, using
its values as the visited state.

## Approach

1. Scan `grid`, enqueue every rotten cell in `q`, and count fresh oranges in `fresh`.
2. While both `q` and `fresh` are nonempty, process exactly `len(q)` cells as one minute.
3. For each fresh neighbor, write `2`, decrement `fresh`, and enqueue its coordinates.
4. Increment `minutes` after each complete level, then return it if `fresh == 0`; otherwise
   return `-1`. If there are no fresh oranges initially, the loop is skipped and the result is
   `0`.

## Code

```python
import collections

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        q = collections.deque()
        fresh = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1

        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1

        return minutes if fresh == 0 else -1
```

## Why it works

At the start of minute `t`, the queue contains exactly the oranges that became rotten at minute
`t - 1`. This holds initially for all sources at minute zero. Processing one queue level rots
exactly their fresh neighbors, which are precisely the cells at shortest distance `t` from any
source. Marking at enqueue time ensures each such cell enters the next level once, preserving
the invariant by induction. Thus `minutes` is the first time all reachable fresh oranges rot.
If the queue empties with `fresh > 0`, those cells have no path from a source and can never rot.

**Complexity**

- **Time:** `O(m * n)` because each cell is scanned and enqueued at most once.
- **Space:** `O(m * n)` for the queue in the worst case; `grid` is modified in place.
