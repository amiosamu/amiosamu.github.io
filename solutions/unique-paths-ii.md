---
# Unique Paths II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/unique-paths-ii/
draft: false
pattern: "Grid path counting with zeroed obstacles"
time: "O(m * n)"
space: "O(n)"
---

## Description

Given an `m x n` grid where each cell is either open (`0`) or blocked by an obstacle (`1`), a
robot starts at the top-left corner and can move only down or right, and may never step onto
an obstacle. Return the number of distinct paths from the top-left corner to the bottom-right
corner.

**Example**

```
Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
Output: 2
```

The two valid routes pass around the center obstacle on opposite sides.

## Intuition

Every path into an open cell arrives from above or from the left, so its count is the sum of those
two predecessor counts. A blocked cell has count zero. A one-dimensional array can represent the
previous row and the already-updated portion of the current row at the same time.

## Approach

1. Initialize `row` with zeros and set `row[0] = 1` as a virtual path into the start.
2. Scan each row from left to right. Before updating, `row[j]` is the count from above and
   `row[j - 1]` is the count from the left.
3. Set `row[j] = 0` at an obstacle so no path can enter or continue through it.
4. At an open non-first-column cell, add `row[j - 1]` into `row[j]`.
5. Return the final column count; blocked starts or destinations naturally produce zero.

## Code

```python
class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        row = [0] * n
        row[0] = 1

        for i in range(m):
            for j in range(n):
                if obstacleGrid[i][j] == 1:
                    row[j] = 0
                elif j > 0:
                    row[j] += row[j - 1]

        return row[n - 1]
```

## Why it works

After processing cell `(i, j)`, maintain that `row[j]` equals the number of valid paths to that
cell. An obstacle correctly sets this count to zero. Otherwise every valid path arrives uniquely
from above or left, whose counts are `row[j]` before the update and `row[j - 1]` after its update.
Their sum is therefore exact. Row-major induction proves the invariant for every cell, including
the destination.

**Complexity**

- **Time:** `O(m * n)` because every cell is processed once.
- **Space:** `O(n)` for the rolling row.
