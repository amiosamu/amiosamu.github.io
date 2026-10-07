---
# Rotate Image · Medium · Math & Geometry
# https://leetcode.com/problems/rotate-image/
draft: false
pattern: "Transpose then reverse each row"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given an `n x n` integer matrix, rotate it 90 degrees clockwise in place without allocating
another matrix.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

Explanation: The original first row becomes the rightmost column, producing the displayed matrix.

## Intuition

A clockwise rotation maps position `(i, j)` to `(j, n - 1 - i)`. Transposition performs the
first part, `(i, j) -> (j, i)`. Reversing every transposed row then maps its column index `i` to
`n - 1 - i`, completing the rotation with only pairwise swaps.

## Approach

1. Set `n = len(matrix)`; the square-matrix constraint makes both dimensions equal.
2. Transpose in place by swapping `matrix[i][j]` with `matrix[j][i]` only for `j > i`.
   Restricting the loop to one triangle visits each off-diagonal pair exactly once.
3. Reverse every row with `row.reverse()`, which mutates each existing row instead of creating
   a replacement matrix.
4. Return nothing; the caller observes the modified matrix. A one-cell matrix remains unchanged.

## Code

```python
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()
```

## Why it works

Transposition sends every original element from `(i, j)` to `(j, i)`. Reversing row `j` then sends
that element from column `i` to column `n - 1 - i`. The composed destination is therefore
`(j, n - 1 - i)`, exactly the coordinate rule for a clockwise quarter-turn. Each operation is an
in-place permutation, so all values are preserved exactly once.

**Complexity**

- **Time:** `O(n^2)` for the transpose and row reversals.
- **Space:** `O(1)` auxiliary space.
