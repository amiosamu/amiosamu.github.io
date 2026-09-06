---
# Range Sum Query 2D Immutable · Medium · Arrays & Hashing
# https://leetcode.com/problems/range-sum-query-2d-immutable/
draft: false
pattern: "2D prefix sum with inclusion-exclusion"
time: "O(m * n) build, O(1) per query"
space: "O(m * n)"
---

## Description

Design a data structure that is built once from a fixed 2D integer matrix and then
answers repeated `sumRegion(row1, col1, row2, col2)` queries, each returning the sum of
the matrix elements inside that rectangle (inclusive of both corners).

**Example**

```
Input: ["NumMatrix", "sumRegion", "sumRegion", "sumRegion"], [[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]
Output: [null, 8, 11, 12]
```

Explanation: `sumRegion(2, 1, 4, 3)` sums every entry with row in `[2, 4]` and column in
`[1, 3]` — `2+0+1+1+0+1+7+1+0+3+0+5` — which totals `8`.

## Intuition

The matrix never changes, and `sumRegion` is called many times — so pay once at
construction and make each query constant. In 1D that means prefix sums; the 2D
version is the same idea with corners.

Let `prefix[r][c]` be the sum of the whole rectangle from the origin to `(r, c)`
exclusive. Any query rectangle is then the big corner rectangle minus the strip
above it, minus the strip to its left, plus the top-left block that those two
strips both removed. That last `+` is the whole trick: inclusion–exclusion, four
lookups, no loop.

## Approach

1. In `__init__`, allocate `self.prefix` with `rows + 1` by `cols + 1` zeros. The
   extra zero row and column remove every out-of-bounds check later.
2. Fill it so that `prefix[r + 1][c + 1]` = sum of `matrix[0..r][0..c]`, using
   `matrix[r][c] + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c]` — add the
   block above and the block to the left, subtract their doubly-counted overlap.
3. In `sumRegion`, all four reads use the `+1` offset, so the inclusive query
   corner `(row2, col2)` becomes `prefix[row2 + 1][col2 + 1]`.
4. Subtract `prefix[row1][col2 + 1]` (everything strictly above the query) and
   `prefix[row2 + 1][col1]` (everything strictly to its left).
5. Add back `prefix[row1][col1]`, the top-left corner removed twice.
6. When `row1 == 0` or `col1 == 0` those terms read the padding row/column and are
   `0`, which is exactly right.

## Code

```python
class NumMatrix:
    def __init__(self, matrix: List[List[int]]):
        rows, cols = len(matrix), len(matrix[0])
        self.prefix = [[0] * (cols + 1) for _ in range(rows + 1)]

        for r in range(rows):
            for c in range(cols):
                self.prefix[r + 1][c + 1] = (
                    matrix[r][c]
                    + self.prefix[r][c + 1]
                    + self.prefix[r + 1][c]
                    - self.prefix[r][c]
                )

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        return (
            self.prefix[row2 + 1][col2 + 1]
            - self.prefix[row1][col2 + 1]
            - self.prefix[row2 + 1][col1]
            + self.prefix[row1][col1]
        )
```

## Why it works

The build recurrence is inclusion–exclusion on two overlapping rectangles, and it
is well-founded because every term it reads sits strictly above or strictly left
of the cell being written, so it is already final. The query is the same identity
run backwards on four corners, which is why it is `O(1)`. Construction touches
each of the `m * n` cells once and stores one integer per cell, giving
`O(m * n)` time and space up front and constant time forever after.
