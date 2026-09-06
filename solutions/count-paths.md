---
# Unique Paths · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/unique-paths/
draft: false
pattern: "Grid path counting, rolled to one row"
time: "O(m * n)"
space: "O(n)"
---

## Intuition

Enumerating routes is `C(m+n-2, m-1)` of them — exponential to walk one at a time. But every
route into a cell arrives either from directly above or directly left, and once you are on a
cell it makes no difference which of those two it was: the remaining grid looks identical. So
the count of ways to reach `(i, j)` is just the sum of the counts for its two predecessors, and
the whole table fills in `m * n` additions.

## Approach

1. `dp[i][j]` is the number of distinct down/right routes from the start `(0, 0)` to cell
   `(i, j)`, considering only moves made so far — nothing about the route's shape is retained.
2. Recurrence, two cases: for an interior cell the last move was either a *down* step from
   `(i-1, j)` or a *right* step from `(i, j-1)`, and these are disjoint (they differ in the
   final move), so `dp[i][j] = dp[i-1][j] + dp[i][j-1]`.
3. Base cases: `dp[0][0] = 1` (the empty route). The entire first row has `dp[0][j] = 1` and
   the first column `dp[i][0] = 1` — there is exactly one straight-line way along an edge.
4. Since a row only ever reads the row directly above it, keep one array `row` of length `n`
   instead of the full table. Initialize `row = [1] * n`, which *is* row 0.
5. Repeat `m - 1` times: sweep `j` from `1` to `n - 1` doing `row[j] += row[j - 1]`. At the
   moment of the read, `row[j]` still holds `dp[i-1][j]` (not yet overwritten) and `row[j-1]`
   already holds `dp[i][j-1]` (just overwritten). That is exactly the recurrence, and it is why
   the inner loop must run **left to right** — reversing it would read the old `row[j-1]` and
   count row `i-1` twice.
6. `row[0]` is never touched, so it stays `1` for every row, which is the first-column base
   case for free.
7. The answer is `dp[m-1][n-1]`, i.e. `row[n - 1]` after the last sweep.

## Code

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n

        for _ in range(m - 1):
            for j in range(1, n):
                row[j] += row[j - 1]

        return row[n - 1]
```

## Why it works

Every route to `(i, j)` has a unique last move, so splitting on that move partitions the route
set into two disjoint groups counted by `dp[i-1][j]` and `dp[i][j-1]` — the cases are
exhaustive and never double count. The subproblems are path-independent because the moves
available from `(i, j)` and the distance to the goal are functions of the coordinates alone,
never of the history, which is what lets one number per cell stand in for a whole family of
routes. Two nested loops over `m * n` cells with `O(1)` work each gives `O(m * n)` time, and
carrying a single row gives `O(n)` space.
