---
# Range Sum Query 2D Immutable · Medium · Arrays & Hashing
# https://leetcode.com/problems/range-sum-query-2d-immutable/
draft: false
pattern: "2D prefix sum with inclusion-exclusion"
time: "O(m * n) build, O(1) per query"
space: "O(m * n)"
---

## Description

Build a data structure for an immutable integer matrix. Each
`sumRegion(row1, col1, row2, col2)` call must return the sum inside the inclusive rectangle
defined by those corners.

**Example**

```
Input: ["NumMatrix", "sumRegion", "sumRegion", "sumRegion"], [[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]
Output: [null, 8, 11, 12]
```

Explanation: `sumRegion(2, 1, 4, 3)` adds `[2,0,1]`, `[1,0,1]`, and `[0,3,0]`,
which totals `8`.

## Intuition

Because the matrix never changes, preprocessing can make every query constant time. Let
`prefix[r][c]` store the sum in the half-open rectangle from `(0, 0)` to `(r, c)`. A query is
the large origin rectangle minus the regions above and left of the target, plus their overlap,
which was subtracted twice.

## Approach

1. Allocate `self.prefix` with one extra zero row and column. This padding handles rectangles
   touching the top or left edge without conditionals.
2. For each matrix cell `(r, c)`, add the prefixes above and left, subtract their overlap, and
   add `matrix[r][c]` to form `prefix[r + 1][c + 1]`.
3. For a query, start with the prefix through `(row2, col2)`. Subtract the rectangle above the
   query and the rectangle to its left.
4. Add `prefix[row1][col1]` because the top-left overlap was removed twice. Construction reads
   but does not mutate `matrix`.

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

By induction over row-major construction, `prefix[r][c]` is the sum of the half-open rectangle
`[0, r) x [0, c)`: the recurrence joins the rectangle above with the rectangle to the left,
subtracts their shared prefix, and adds the new cell. For a query, the full prefix through the
bottom-right corner contains the target plus the regions above and left. Subtracting those two
regions and restoring their overlap leaves exactly the requested rectangle.

**Complexity**

- **Time:** `O(m * n)` to build and `O(1)` per query.
- **Space:** `O(m * n)` for the prefix table.
