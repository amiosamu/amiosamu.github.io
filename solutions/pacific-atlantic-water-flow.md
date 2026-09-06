---
# Pacific Atlantic Water Flow · Medium · Graphs
# https://leetcode.com/problems/pacific-atlantic-water-flow/
draft: false
pattern: "Multi-source DFS from ocean borders"
time: "O(rows * cols)"
space: "O(rows * cols)"
---

## Intuition

Checking, for each cell, whether water can reach both oceans means tracing every downhill path out of that cell — exponential blowup. Flip the direction instead: start at the ocean and walk backward, from a border cell into any neighbor whose height is >= the current cell's (forward flow needs non-increasing height, so the reverse walk needs non-decreasing). Two DFS sweeps, one per ocean, mark every cell that ocean can reach; the answer is the intersection of the two marked sets.

## Approach

1. Handle the empty-grid edge case; read `rows`, `cols` from `heights`.
2. Allocate two `rows x cols` boolean grids, `pacific` and `atlantic`, both initially `False`.
3. Write `dfs(r, c, visited)`: mark `visited[r][c] = True`, then for each of the 4 neighbors `(nr, nc)`, recurse if it's in bounds, not yet visited, and `heights[nr][nc] >= heights[r][c]`.
4. Seed the Pacific DFS from every cell in row 0 and column 0 — the borders the Pacific touches.
5. Seed the Atlantic DFS from every cell in row `rows - 1` and column `cols - 1` — the borders the Atlantic touches.
6. After both sweeps finish, scan every `(r, c)` and collect it into the result if `pacific[r][c]` and `atlantic[r][c]` are both `True`.
7. Return the collected list of `[r, c]` pairs; order doesn't matter.

## Code

```python
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []

        rows, cols = len(heights), len(heights[0])
        pacific = [[False] * cols for _ in range(rows)]
        atlantic = [[False] * cols for _ in range(rows)]

        def dfs(r: int, c: int, visited: List[List[bool]]) -> None:
            visited[r][c] = True
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if (
                    0 <= nr < rows
                    and 0 <= nc < cols
                    and not visited[nr][nc]
                    and heights[nr][nc] >= heights[r][c]
                ):
                    dfs(nr, nc, visited)

        for c in range(cols):
            dfs(0, c, pacific)
            dfs(rows - 1, c, atlantic)
        for r in range(rows):
            dfs(r, 0, pacific)
            dfs(r, cols - 1, atlantic)

        return [
            [r, c]
            for r in range(rows)
            for c in range(cols)
            if pacific[r][c] and atlantic[r][c]
        ]
```

## Why it works

Water flows from a cell to a neighbor only when the neighbor's height is <= the cell's, so walking from an ocean border into a neighbor with height >= the current cell exactly retraces a valid flow path in reverse — anything reached this way can genuinely drain into that ocean. Seeding the DFS from all border cells at once, guarded by a visited grid, means every cell is expanded at most once per ocean, so the two sweeps together cost O(rows * cols) time; the two boolean grids plus the DFS call stack cost O(rows * cols) space in the worst case.
