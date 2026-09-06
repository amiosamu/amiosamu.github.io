---
# Minimum Path Sum · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/minimum-path-sum/
draft: false
pattern: "Grid DP, rolled to one row"
time: "O(m * n)"
space: "O(n)"
---

## Intuition

Greedily stepping toward the smaller neighbour fails — a cheap first step can dump you into an
expensive row. But the cost of finishing from `(i, j)` depends only on `(i, j)`, never on which
route got you there, so the cheapest route *into* `(i, j)` can be summarized by a single
number. That number is `grid[i][j]` plus the cheaper of the two ways in, and the whole grid
resolves in one pass.

## Approach

1. `dp[i][j]` is the minimum sum of any down/right route from `(0, 0)` to `(i, j)` inclusive,
   considering only cells on rows `0..i`.
2. Recurrence: the last move into an interior cell was down from `(i-1, j)` or right from
   `(i, j-1)`, so `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.
3. Base cases: `dp[0][0] = grid[0][0]`; the first row can only come from the left,
   `dp[0][j] = dp[0][j-1] + grid[0][j]`; the first column only from above,
   `dp[i][0] = dp[i-1][0] + grid[i][0]`.
4. Roll to a single array `row` of length `n`. Seed it as a virtual row above row 0:
   `row = [inf] * n` with `row[0] = 0`. The infinities make "no cell above" lose every `min`,
   so the first-row base case needs no branch; the `0` at `row[0]` starts the column running
   total.
5. Sweep `i` from `0` to `m - 1`. First do `row[0] += grid[i][0]`, which handles column 0 (only
   an above-neighbour exists). Then sweep `j` **left to right** from `1` to `n - 1` with
   `row[j] = grid[i][j] + min(row[j], row[j - 1])`.
6. Left to right is required so that at the read, `row[j]` is still `dp[i-1][j]` (the neighbour
   above, not yet overwritten) while `row[j-1]` is already `dp[i][j-1]` (the neighbour to the
   left, just written). Any other order would mix rows.
7. The answer is `dp[m-1][n-1]`, i.e. `row[n - 1]` after the final sweep.

## Code

```python
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        row = [float("inf")] * n
        row[0] = 0

        for i in range(m):
            row[0] += grid[i][0]
            for j in range(1, n):
                row[j] = grid[i][j] + min(row[j], row[j - 1])

        return row[n - 1]
```

## Why it works

Every route to `(i, j)` ends with exactly one of two moves, so taking the min over both cases
considers every route without enumerating any — an optimal route to `(i, j)` must use an
optimal route to its predecessor, otherwise swapping in the cheaper prefix would beat it. The
subproblems are path-independent because the remaining decisions and their costs depend only on
the coordinates, so different prefixes reaching the same cell are interchangeable and only
their minimum cost matters. One `O(1)` update per cell gives `O(m * n)` time, and keeping only
the previous row gives `O(n)` space.
