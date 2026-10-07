---
# Longest Increasing Path In a Matrix · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
draft: false
pattern: "DFS with memoization on a grid"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` integer matrix, return the length of its longest strictly increasing path.
Each step may move to a horizontally or vertically adjacent cell with a greater value.

**Example**

```
Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4
```

The adjacent path `1 -> 2 -> 6 -> 9` is strictly increasing and has the maximum length `4`.

## Intuition

Direct every valid move from a cell to a greater neighbor. Values strictly increase along these
edges, so the resulting graph has no cycle. The longest path starting at a cell is therefore a
fixed subproblem that can be computed by DFS and reused wherever that cell is reached.

## Approach

1. Let `memo[r][c]` store the longest increasing path starting at `(r, c)`, with zero meaning
   that the state has not been computed.
2. In `dfs`, return a cached result immediately; otherwise initialize `best = 1` for the cell alone.
3. For each in-bounds neighbor with a greater value, consider `1 + dfs(nr, nc)`.
4. Cache and return the greatest candidate for the current cell.
5. Run `dfs` from every cell and return the maximum. The empty-matrix guard returns zero.

## Code

```python
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        memo = [[0] * cols for _ in range(rows)]

        def dfs(r: int, c: int) -> int:
            if memo[r][c]:
                return memo[r][c]
            best = 1
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            memo[r][c] = best
            return best

        return max(dfs(r, c) for r in range(rows) for c in range(cols))
```

## Why it works

Strict increases make the move graph acyclic, so every path from a cell either stops there or first
moves to one of its greater neighbors. Therefore `dfs(r, c)` takes the maximum over exactly all
possible first moves, with one for the current cell. Induction in decreasing value order shows each
cached result is the true longest path from that cell. Every path has some starting cell, so taking
the maximum over all starts gives the global optimum.

**Complexity**

- **Time:** `O(m * n)`, because each cell is solved once and checks four neighbors.
- **Space:** `O(m * n)` for memoization and the worst-case recursion stack.
