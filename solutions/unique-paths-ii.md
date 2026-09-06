---
# Unique Paths II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/unique-paths-ii/
draft: false
pattern: "Grid path counting with zeroed obstacles"
time: "O(m * n)"
space: "O(n)"
---

## Intuition

Same additive count as Unique Paths — a cell's route count is the sum of the cell above and the
cell to the left — with one extra rule: a blocked cell has zero routes through it. Writing `0`
into an obstacle rather than special-casing it makes the obstacle propagate on its own, since
anything downstream that adds it in contributes nothing. The combinatorial closed form dies
here, but the table does not care.

## Approach

1. `dp[i][j]` is the number of down/right routes from `(0, 0)` to `(i, j)` that avoid every
   obstacle, considering only the cells on rows `0..i`.
2. Recurrence, three cases. If `obstacleGrid[i][j] == 1` then `dp[i][j] = 0`, no route may
   stand there. Otherwise the last move was down or right, disjoint alternatives, so
   `dp[i][j] = dp[i-1][j] + dp[i][j-1]` with out-of-grid neighbours read as `0`.
3. Base case: `dp[0][0] = 1` if the start is clear, else `0` — and note the start or the target
   can themselves be obstacles, in which case the answer is `0` and this falls out with no
   special handling.
4. Roll the table to a single array `row` of length `n` holding the row above. Initialize
   `row = [0] * n` and `row[0] = 1`; this is a *virtual* row above row 0 whose single `1` seeds
   the start cell.
5. Sweep `i` from `0` to `m - 1`, and inside sweep `j` **left to right** from `0` to `n - 1`.
   At `(i, j)`: if the cell is an obstacle set `row[j] = 0`; else if `j > 0` do
   `row[j] += row[j - 1]`; else leave `row[0]` alone.
6. Left-to-right is forced for the same reason as in Unique Paths: `row[j]` must still be the
   value from row `i-1` when read, while `row[j-1]` must already be the value from row `i`.
7. Leaving `row[0]` untouched carries the first column down correctly — it stays `1` until an
   obstacle in column 0 zeroes it, after which every cell below it is unreachable, which is
   exactly right.
8. Return `row[n - 1]`, which holds `dp[m-1][n-1]`.

## Code

```python
class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        row = [0] * n
        row[0] = 1

        for i in range(m):
            for j in range(n):
                if obstacleGrid[i][j] == 1:
                    row[j] = 0
                elif j > 0:
                    row[j] += row[j - 1]

        return row[n - 1]
```

## Why it works

Splitting on the last move partitions the obstacle-free routes into two disjoint sets, and
setting a blocked cell to `0` removes exactly the routes that would pass through it — no valid
route is lost, no invalid one survives. The subproblems are path-independent because whether a
route can continue from `(i, j)` depends only on the obstacles ahead of `(i, j)`, so the count
of prefixes reaching it can be collapsed to one integer. Every cell is visited once with `O(1)`
work: `O(m * n)` time, `O(n)` space for the rolling row.
