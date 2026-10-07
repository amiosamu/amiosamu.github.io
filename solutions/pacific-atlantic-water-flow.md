---
# Pacific Atlantic Water Flow · Medium · Graphs
# https://leetcode.com/problems/pacific-atlantic-water-flow/
draft: false
pattern: "Multi-source DFS from ocean borders"
time: "O(rows * cols)"
space: "O(rows * cols)"
---

## Description

Given an `m x n` grid of cell heights, where the Pacific Ocean touches the top and left
edges and the Atlantic touches the bottom and right edges, find every cell from which water
can flow to both oceans, moving only to a neighboring cell whose height is less than or
equal to the current one.

**Example**

```
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

Explanation: `(0, 4)` touches both the Pacific top edge and the Atlantic right edge.

## Intuition

Searching downhill from every cell repeats the same work. Reverse the edges instead: start from an
ocean border and move to neighbors of equal or greater height. Every reached cell can flow back to
that ocean in the original direction. Two iterative depth-first traversals mark cells that reach
each ocean, and their intersection is the answer.

## Approach

1. Return an empty list for an empty grid. Build the Pacific and Atlantic border start lists.
2. In `reach(starts)`, mark all starts and traverse with a stack.
3. From `(r, c)`, add each unseen in-bounds neighbor whose height is at least `heights[r][c]`.
4. Run `reach` for both oceans and return every coordinate present in both visited grids.
5. The grid is read only. An explicit stack avoids Python recursion-depth failures on large grids.

## Code

```python
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []

        rows, cols = len(heights), len(heights[0])

        def reach(starts):
            visited = [[False] * cols for _ in range(rows)]
            stack = list(starts)
            for r, c in starts:
                visited[r][c] = True

            while stack:
                r, c = stack.pop()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if (
                        0 <= nr < rows
                        and 0 <= nc < cols
                        and not visited[nr][nc]
                        and heights[nr][nc] >= heights[r][c]
                    ):
                        visited[nr][nc] = True
                        stack.append((nr, nc))
            return visited

        pacific_starts = [(0, c) for c in range(cols)] + [
            (r, 0) for r in range(rows)
        ]
        atlantic_starts = [(rows - 1, c) for c in range(cols)] + [
            (r, cols - 1) for r in range(rows)
        ]
        pacific = reach(pacific_starts)
        atlantic = reach(atlantic_starts)

        return [
            [r, c]
            for r in range(rows)
            for c in range(cols)
            if pacific[r][c] and atlantic[r][c]
        ]
```

## Why it works

A forward water-flow edge goes from a cell to a neighbor of no greater height. `reach` traverses
exactly the reverse of those edges, beginning at every cell adjacent to its ocean. Thus a cell is
marked precisely when it has a valid forward path to that ocean. A coordinate marked by both
traversals has paths to both oceans, and any cell with both paths is reached by reversing them.
Therefore, the returned intersection is exact.

**Complexity**

- **Time:** `O(rows * cols)` because each cell is processed at most once per ocean.
- **Space:** `O(rows * cols)` auxiliary space for visited grids, start lists, and traversal stacks,
  plus up to `O(rows * cols)` for the output.
