---
# Minimum Path Sum · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/minimum-path-sum/
draft: false
pattern: "Grid DP, rolled to one row"
time: "O(m * n)"
space: "O(n)"
---

## Description

Given an `m x n` grid of non-negative integers, return the minimum sum along a path from the
top-left cell to the bottom-right cell. Each move must go one cell right or down.

**Example**

```
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
```

Explanation: The path `1 -> 3 -> 1 -> 1 -> 1` has the minimum sum, `7`.

## Intuition

A path reaches an interior cell only from above or from the left. Therefore, its minimum path sum
is the cell value plus the smaller minimum sum of those two predecessors. Once a row has been
processed, only its values are needed to compute the next row, so the full table can be rolled into
one array.

## Approach

1. Let `row[j]` hold the minimum sum to column `j` of the previous or current row.
2. Initialize `row` to infinity and set `row[0] = 0`, representing a virtual predecessor of
   the starting cell.
3. For each grid row, first add its column-zero value to `row[0]`.
4. Scan the remaining columns left to right. Update `row[j]` from the old value above and the
   new value to its left: `grid[i][j] + min(row[j], row[j - 1])`.
5. Return the final `row[-1]`. The input grid is read but not mutated.

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

Induct on cells in row-major order. Before updating `(i, j)`, `row[j]` is the minimum path sum to
the cell above, while `row[j - 1]` is the minimum path sum to the cell on the left. Every valid
path to `(i, j)` ends at exactly one of those cells. Adding `grid[i][j]` to the smaller value is
therefore both achievable and no larger than any other valid path. The first row and column obey
the same invariant because each has only one valid predecessor. Hence the final value is optimal.

**Complexity**

- **Time:** `O(m * n)` for one update per cell.
- **Space:** `O(n)` auxiliary space for the rolling row.
