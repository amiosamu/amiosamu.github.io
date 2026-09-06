---
# Rotate Image · Medium · Math & Geometry
# https://leetcode.com/problems/rotate-image/
draft: false
pattern: "Transpose then reverse each row"
time: "O(n^2)"
space: "O(1)"
---

## Description

Given an `n x n` 2D integer array `matrix` representing an image, rotate it 90 degrees clockwise
in place, without allocating another 2D array.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

Explanation: The top row `[1,2,3]` becomes the rightmost column read top-to-bottom, so `matrix[0]`
ends up as column 2 of the output, `[1,4,7]` reading down — matching row 0's entries `7,4,1` once
the whole grid is turned a quarter turn clockwise.

## Intuition

A 90-degree clockwise rotation is the map `(i, j) -> (j, n - 1 - i)`: the element in row `i`,
column `j` ends up in row `j`, column `n - 1 - i`. That map factors into two moves I already know
how to do in place. Transposing sends `(i, j) -> (j, i)`, which puts column `j` of the original
into row `j` — the right row, but running bottom-to-top. Reversing each row then sends column `i`
to column `n - 1 - i`, fixing the direction. Compose them and you get exactly the rotation, with no
temporary matrix and no ring-of-four-cells index gymnastics.

## Approach

1. `n = len(matrix)`; the grid is square by constraint.
2. Transpose in place: for `i` in `range(n)`, for `j` in `range(i + 1, n)`, swap
   `matrix[i][j]` with `matrix[j][i]`.
3. The inner bound `j` starting at `i + 1` is the part to get right. If `j` ran over the full
   `range(n)` every pair would be swapped twice and the matrix would come back unchanged; starting
   at `i + 1` visits each off-diagonal pair once and skips the diagonal, which is fixed anyway.
4. Reverse every row: `for row in matrix: row.reverse()`. `list.reverse()` mutates in place, which
   matters because the problem forbids allocating another 2D array — `row[::-1]` would build a new
   list and `matrix[i] = matrix[i][::-1]` would rebind rather than edit, which is still fine for the
   judge but is not the in-place spirit.
5. Return nothing; the signature is `-> None` and the judge reads `matrix` back.
6. Trace `[[1,2,3],[4,5,6],[7,8,9]]`: transpose gives `[[1,4,7],[2,5,8],[3,6,9]]`, reversing rows
   gives `[[7,4,1],[8,5,2],[9,6,3]]`, which is the 90-degree clockwise turn.
7. For counter-clockwise it would be transpose then reverse the *columns* (equivalently, reverse
   the row order first, then transpose) — worth remembering so I do not guess under pressure.

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

Composing the two maps checks out cell by cell: transpose takes `(i, j)` to `(j, i)`, and reversing
row `j` takes column `i` to column `n - 1 - i`, so the net destination is `(j, n - 1 - i)`, the
definition of a clockwise quarter turn. Both stages are self-inverse permutations applied to
disjoint pairs, so a simultaneous Python tuple swap is safe and nothing is read after being
overwritten. The transpose touches `n(n-1)/2` pairs and the reversals touch `n^2 / 2` more, giving
`O(n^2)` time with only the loop counters as extra space.
