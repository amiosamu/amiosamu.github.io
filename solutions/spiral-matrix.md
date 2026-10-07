---
# Spiral Matrix · Medium · Math & Geometry
# https://leetcode.com/problems/spiral-matrix/
draft: false
pattern: "Four shrinking boundaries"
time: "O(m * n)"
space: "O(1)"
---

## Description

Given an `m x n` matrix, return its elements in clockwise spiral order, beginning at the
top-left corner.

**Example**

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

Explanation: The outer layer contributes `1,2,3,6,9,8,7,4`, followed by the center `5`.

## Intuition

Four boundaries enclose the unvisited rectangle. Traverse its top, right, bottom, and left edges,
moving each boundary inward after consuming its edge. A layer can collapse to one row or one
column, so the bottom and left traversals must recheck that their boundaries are still valid.
Those checks prevent duplicate visits at the center of a rectangular matrix.

## Approach

1. Initialize inclusive boundaries `top`, `bottom`, `left`, and `right` around the matrix.
2. Append the top row left-to-right and move `top`; append the right column top-to-bottom and
   move `right`.
3. If rows remain, append the bottom row right-to-left and move `bottom`.
4. If columns remain, append the left column bottom-to-top and move `left`.
5. Repeat while both boundary intervals are nonempty. The mid-layer checks handle a final single
   row or column without duplicating it.

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

At each loop start, the boundary rectangle contains exactly the unvisited cells. Every traversal
appends one current edge and then excludes it by moving its boundary. The bottom and left guards
ensure an edge is traversed only if it still exists after earlier moves. Thus the invariant is
preserved without overlap. Since each layer's edges cover its rectangle boundary, repeated layers
eventually append every cell exactly once in spiral order.

**Complexity**

- **Time:** `O(m * n)` because each cell is appended once.
- **Space:** `O(1)` auxiliary space, plus `O(m * n)` for the returned list.
