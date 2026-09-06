---
# Transpose Matrix · Easy · Math & Geometry
# https://leetcode.com/problems/transpose-matrix
draft: false
pattern: "res[j][i] = matrix[i][j]"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given a 2D integer array `matrix` of size `m x n`, return its transpose: the `n x m` array whose
row `j`, column `i` entry equals `matrix[i][j]`, i.e. the matrix flipped over its main diagonal.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[1,4,7],[2,5,8],[3,6,9]]
```

Explanation: The entry at row 0, column 1 (`matrix[0][1] == 2`) moves to row 1, column 0 of the
output, and every other entry swaps position the same way across the main diagonal.

## Intuition

The transpose flips over the main diagonal: the element at row `i`, column `j` ends up at row `j`,
column `i`. The only thing worth being careful about is that the input is `m x n`, not necessarily
square, so the output has shape `n x m` — I have to allocate a fresh grid with the dimensions
swapped. The in-place "swap across the diagonal" trick that works for Rotate Image does *not*
apply here unless `m == n`, because a non-square matrix has no place to put the extra cells.

## Approach

1. Read `m, n = len(matrix), len(matrix[0])`. `m` is the row count of the input, `n` the column
   count; the answer is `n` rows by `m` columns.
2. Allocate `res = [[0] * m for _ in range(n)]`. Build it with a comprehension, not `[[0] * m] * n`
   — the latter aliases one row object `n` times and every write shows up in all rows.
3. Double loop `i` over `range(m)` and `j` over `range(n)`, assigning `res[j][i] = matrix[i][j]`.
   Index `j` is a valid row of `res` because `res` has `n` rows, and `i` is a valid column because
   each row has `m` entries.
4. Return `res`.
5. Sanity check on shapes: a `2 x 3` input yields a `3 x 2` output, so `[[1,2,3],[4,5,6]]` becomes
   `[[1,4],[2,5],[3,6]]`. A single row `[[1,2,3]]` becomes three single-element rows.

## Code

```python
class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        m, n = len(matrix), len(matrix[0])
        res = [[0] * m for _ in range(n)]
        for i in range(m):
            for j in range(n):
                res[j][i] = matrix[i][j]
        return res
```

## Why it works

`(i, j) -> (j, i)` is a bijection between the `m * n` cells of the input and the `n * m` cells of
the output, so every output cell is written exactly once and none is left at its initial 0. Reading
from `matrix` and writing to a separate `res` means no cell is overwritten before it is read, which
is the failure mode of doing this in place on a rectangular grid. The two loops touch each cell
once for `O(m * n)` time, with `O(1)` auxiliary space beyond the returned matrix.
