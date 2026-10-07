---
# Set Matrix Zeroes · Medium · Math & Geometry
# https://leetcode.com/problems/set-matrix-zeroes/
draft: false
pattern: "First row and column as zero flags"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given an `m x n` integer matrix, set an entire row and column to zero whenever either contains
an original zero. Modify `matrix` in place using constant extra space.

**Example**

```
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

Explanation: The zero at `(1, 1)` clears row `1` and column `1`.

## Intuition

Clearing cells while discovering zeros would create new zeros that incorrectly trigger more
rows and columns. Instead, first record all affected rows and columns. The first column stores
row flags, and the first row stores column flags. Their shared cell cannot represent both
facts, so `first_col_zero` separately records whether column zero must be cleared.

## Approach

1. Record whether the original first column contains a zero in `first_col_zero`.
2. Scan columns `1..n-1`. For every zero at `(i, j)`, write row marker `matrix[i][0] = 0`
   and column marker `matrix[0][j] = 0`.
3. Traverse rows from bottom to top and columns from right to left. Clear `(i, j)` when either
   corresponding marker is zero.
4. After processing a row's other cells, clear its first cell when `first_col_zero` is true.
   Bottom-up order preserves row zero's column markers until all other rows have read them.

## Code

```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        for i in range(m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        for i in range(m - 1, -1, -1):
            for j in range(n - 1, 0, -1):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
            if first_col_zero:
                matrix[i][0] = 0
```

## Why it works

The marker-pass invariant is that every processed original zero has set its row and column
markers. Consequently, after that pass, `matrix[i][0]` is zero exactly when row `i` had an
original zero, and `matrix[0][j]` is zero exactly when column `j > 0` had one. The second pass
clears precisely cells whose row or column marker is set. It reads each row marker before
overwriting it and processes row zero last, while `first_col_zero` handles the excluded first
column. Therefore every required cell, and no other cell, is cleared.

**Complexity**

- **Time:** `O(m * n)` for the marker and write passes.
- **Space:** `O(1)` auxiliary space; `matrix` is modified in place.
