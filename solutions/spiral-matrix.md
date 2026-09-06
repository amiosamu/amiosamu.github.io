---
# Spiral Matrix · Medium · Math & Geometry
# https://leetcode.com/problems/spiral-matrix/
draft: false
pattern: "Four shrinking boundaries"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given an `m x n` 2D integer array `matrix`, return all of its elements in spiral order: starting
at the top-left, walking right across the top row, down the right column, left across the bottom
row, and up the left column, shrinking inward until every element has been visited once.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

Explanation: The top row gives `1,2,3`; the right column (excluding the corner already taken)
gives `6,9`; the bottom row walked right-to-left gives `8,7`; the left column walked bottom-to-top
gives `4`; only the center, `5`, remains and closes the spiral.

## Intuition

Track four boundaries — `top`, `bottom`, `left`, `right` — that fence in the un-visited rectangle,
and peel one edge at a time: top row left-to-right, right column top-to-bottom, bottom row
right-to-left, left column bottom-to-top. After each edge, retract that boundary by one. The whole
difficulty is the degenerate finish: when the remaining rectangle collapses to a single row or a
single column, the "bottom row" and the "top row" are the same row, and walking it twice duplicates
elements. That is why the third and fourth walks are guarded by `if top <= bottom` and
`if left <= right` re-checked *mid-iteration*, after `top` and `right` have already moved.

## Approach

1. `res = []`; `top, bottom = 0, len(matrix) - 1`; `left, right = 0, len(matrix[0]) - 1`.
   All four are inclusive indices.
2. Loop while `top <= bottom and left <= right`.
3. Top row: `for j in range(left, right + 1): res.append(matrix[top][j])`, then `top += 1`.
4. Right column: `for i in range(top, bottom + 1): res.append(matrix[i][right])`, then
   `right -= 1`. Note the range starts at the *already incremented* `top`, so the corner is not
   emitted twice.
5. Bottom row, guarded: `if top <= bottom:` walk `for j in range(right, left - 1, -1)` and then
   `bottom -= 1`. The guard is what stops a one-row rectangle from being replayed backwards.
6. Left column, guarded: `if left <= right:` walk `for i in range(bottom, top - 1, -1)` and then
   `left += 1`. Same reasoning for a one-column rectangle.
7. Return `res`, whose length ends up `m * n`.
8. Trace `[[1,2,3]]` (single row): top row emits `1,2,3`, `top` becomes 1, the right-column range
   `range(1, 1)` is empty, and both guards fail or produce empty ranges, so the loop exits with
   exactly three elements. Trace `[[1],[2],[3]]`: top row emits `1`, right column emits `2,3`,
   `right` goes to `-1`, the bottom-row range `range(-1, -1, -1)` is empty and the left-column
   guard `left <= right` is false. Both come out right.

## Code

```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                res.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1):
                res.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    res.append(matrix[bottom][j])
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    res.append(matrix[i][left])
                left += 1
        return res
```

## Why it works

The invariant is that `[top, bottom] x [left, right]` is exactly the set of cells not yet appended,
and each of the four walks empties one full edge of that rectangle before retracting its boundary,
so no cell is emitted twice and none is skipped. The mid-iteration guards are necessary because the
first two walks can shrink the rectangle to nothing partway through the body of the loop, and the
outer `while` condition is only re-tested at the top. Every cell is appended once and each boundary
moves monotonically, so the total work is `O(m * n)` with `O(1)` space beyond the output list.
