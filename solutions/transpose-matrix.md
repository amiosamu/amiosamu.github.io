---
# Transpose Matrix · Easy · Math & Geometry
# https://leetcode.com/problems/transpose-matrix
draft: false
pattern: "res[j][i] = matrix[i][j]"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given an `m x n` integer matrix, return its `n x m` transpose. In the result, row `j`, column
`i` contains `matrix[i][j]`.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[1,4,7],[2,5,8],[3,6,9]]
```

For example, `matrix[0][1] == 2` moves to output position `(1, 0)`.

## Intuition

Transposition swaps the row and column of every element. Because the matrix may be rectangular,
the destination must be allocated with swapped dimensions; a general rectangular transpose cannot
be performed by simply swapping cells in place.

## Approach

1. Read the input dimensions `m` and `n`.
2. Allocate `res` with `n` independent rows of length `m`; avoid multiplying a nested list,
   which would alias its rows.
3. For every input coordinate `(i, j)`, assign `res[j][i] = matrix[i][j]`.
4. Return the new matrix, leaving the input unchanged.

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

The mapping `(i, j) -> (j, i)` is a bijection from the input coordinates to the output
coordinates. The nested loops apply that mapping once to every input cell, so each output cell
receives exactly the value required by the transpose definition. Writing into a separate matrix
also prevents unread input values from being overwritten.

**Complexity**

- **Time:** `O(m * n)` because every cell is copied once.
- **Space:** `O(1)` auxiliary space, plus `O(m * n)` for the required output.
