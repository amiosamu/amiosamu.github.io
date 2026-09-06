---
# Search a 2D Matrix · Medium · Binary Search
# https://leetcode.com/problems/search-a-2d-matrix/
draft: false
pattern: "Binary search a flattened matrix"
time: "O(log(m * n))"
space: "O(1)"
---

## Intuition

Each row is sorted and the first value of a row exceeds the last value of the row above it, so reading the matrix row by row gives one globally sorted sequence of `m * n` numbers. That means this is plain binary search on a virtual array — I never build the array, I just convert a flat index `i` into `(i // cols, i % cols)` on the fly. The two-step "binary search the row, then binary search inside it" is the same `O(log(m*n))` and twice the code.

## Approach

1. Read `rows = len(matrix)` and `cols = len(matrix[0])`; `cols` is the divisor used for every index conversion, so name it once.
2. Search space: the flat index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = rows * cols - 1`.
3. Invariant: if `target` is in the matrix, its flat index lies in `[l, r]`. An empty interval therefore proves absence.
4. Loop `while l <= r`, `mid = (l + r) // 2`, and read `val = matrix[mid // cols][mid % cols]`.
5. Three-way compare: `val == target` returns `True`; `val < target` discards `[l, mid]` with `l = mid + 1`; otherwise `r = mid - 1`.
6. Both updates exclude `mid`, so the interval strictly shrinks and the loop terminates.
7. On exit `l == r + 1`, the interval is empty and the target is absent — return `False`.
8. The constraints guarantee at least one row and one column, so `matrix[0]` is safe and `r` starts at `>= 0`.

## Code

```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        l, r = 0, rows * cols - 1
        while l <= r:
            mid = (l + r) // 2
            val = matrix[mid // cols][mid % cols]
            if val == target:
                return True
            if val < target:
                l = mid + 1
            else:
                r = mid - 1
        return False
```

## Why it works

The row-major flattening is order-preserving: within a row the values increase, and across a row boundary the problem guarantees `matrix[i][cols-1] < matrix[i+1][0]`, so flat index order equals value order. Once the sequence is sorted, the standard invariant applies — the discarded half provably cannot contain the target — and `divmod` by `cols` is an exact bijection between flat indices and cells, so no element is skipped or visited twice. The interval halves each step over `m * n` cells, giving `O(log(m * n))` time and `O(1)` space.
