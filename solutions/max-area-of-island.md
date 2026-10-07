---
# Max Area of Island · Medium · Graphs
# https://leetcode.com/problems/max-area-of-island/
draft: false
pattern: "DFS flood fill, track component size"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` binary grid, return the area of its largest island. Land cells contain `1`,
water cells contain `0`, and land is connected only horizontally or vertically.

**Example**

```
Input: grid = [[1,1,0],[1,1,0],[0,0,1]]
Output: 4
```

The top-left block is a four-cell island; the bottom-right land cell has area one.


## Intuition

Treat each land cell as a graph vertex connected to its four land neighbors. A flood fill visits
one connected component, and the number of visited cells is that island's area.

Mark cells as water when pushing them onto an explicit DFS stack. This avoids both a separate
visited set and duplicate pushes. It intentionally mutates `grid`, and the explicit stack avoids
recursion-depth limits on a large island.

## Approach

1. Scan every grid cell and skip water.
2. For unseen land, push it onto a stack, change it to `0`, and initialize `area = 0`.
3. Pop cells, count them, and push each in-bounds land neighbor after changing it to `0`.
4. When the stack empties, update `best` with that component's area.
5. Return `best`; an all-water grid leaves it at `0`.

## Code

```python
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        best = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != 1:
                    continue

                area = 0
                stack = [(r, c)]
                grid[r][c] = 0

                while stack:
                    cr, cc = stack.pop()
                    area += 1
                    for nr, nc in ((cr + 1, cc), (cr - 1, cc), (cr, cc + 1), (cr, cc - 1)):
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                            grid[nr][nc] = 0
                            stack.append((nr, nc))

                best = max(best, area)

        return best
```

## Why it works

For each fill, the stack contains discovered but uncounted cells from the seed's component. Marking
at push time ensures each such cell appears once. Every pushed neighbor is connected to the seed,
and every connected land cell is eventually reached by following its path from the seed. Thus
`area` is exactly the component size. The outer scan starts one fill per island, so `best` is the
largest area.

**Complexity**

- **Time:** `O(m * n)` because every cell is processed at most once.
- **Space:** `O(m * n)` in the worst case for the explicit stack; `grid` is mutated in place.
