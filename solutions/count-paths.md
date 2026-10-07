---
# Unique Paths · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/unique-paths/
draft: false
pattern: "Grid path counting, rolled to one row"
time: "O(m * n)"
space: "O(n)"
---

## Description

Given the dimensions of an `m x n` grid, a robot starts at the top-left corner and can move
only down or right at each step. Return the number of distinct paths from the top-left corner
to the bottom-right corner.

**Example**

```
Input: m = 3, n = 7
Output: 28
```

Explanation: there are 28 distinct sequences of down/right moves that take the robot from
`(0, 0)` to `(2, 6)` on a 3-row, 7-column grid.

## Intuition

Every route to a cell arrives from above or from the left. These cases are disjoint, so the
number of routes to a cell is the sum of the two predecessor counts. Since a row only depends
on the row above and its newly computed left neighbor, one array can represent the current row.

## Approach

1. Initialize `row = [1] * n`; the first grid row has one route to every cell.
2. For each remaining grid row, sweep columns from left to right starting at index 1.
3. Set `row[j] += row[j - 1]`. Before the update, `row[j]` is the count from above; after the
   previous update, `row[j - 1]` is the count from the left.
4. Return `row[n - 1]`. The untouched first entry remains the one-route first-column base case,
   so one-row and one-column grids need no special handling.

## Code

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n

        for _ in range(m - 1):
            for j in range(1, n):
                row[j] += row[j - 1]

        return row[n - 1]
```

## Why it works

Before updating column `j` in a row, `row[j]` counts routes from above and `row[j - 1]` counts
routes from the left. Every route has exactly one of those final moves, so their sum is exact.
The initialized first row establishes the invariant, and the left-to-right updates preserve it
for every later row. The last entry therefore counts all routes to the destination.

**Complexity**

- **Time:** `O(m * n)`.
- **Space:** `O(n)` for the rolling row.
