---
# Search a 2D Matrix · Medium · Binary Search
# https://leetcode.com/problems/search-a-2d-matrix/
draft: false
pattern: "Binary search a flattened matrix"
time: "O(log(m * n))"
space: "O(1)"
---

## Description

Given an `m x n` matrix whose rows are sorted and whose first value in each row exceeds the last
value of the previous row, return whether `target` occurs in the matrix.

**Example**

```
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
```

Explanation: `3` occurs in the first row, so the result is `true`.

## Intuition

Reading the matrix in row-major order produces one globally sorted sequence. It need not be
materialized: flat index `i` corresponds to row `i // cols` and column `i % cols`. Standard
binary search can therefore operate directly on the matrix with constant extra space.

## Approach

1. Treat the `rows * cols` cells as flat indices in the inclusive range `[l, r]`.
2. Convert `mid` to `matrix[mid // cols][mid % cols]` without allocating a flat array.
3. Return `True` on equality. If the value is smaller than `target`, discard the left half;
   otherwise discard the right half.
4. Return `False` when the interval is empty. The constraints guarantee a nonempty matrix, so
   reading `matrix[0]` is safe.

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

Within each row, values increase; across rows, the previous last value is smaller than the next
first value. Thus row-major order is sorted. The loop invariant is that any occurrence of
`target` lies in `[l, r]`: comparing the middle value safely removes the half whose values are
all too small or all too large. The index conversion is a bijection between this range and the
matrix cells. When the range becomes empty, no occurrence remains.

**Complexity**

- **Time:** `O(log(m * n))` because the flat search interval halves each iteration.
- **Space:** `O(1)` auxiliary space.
