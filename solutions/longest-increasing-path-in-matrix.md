---
# Longest Increasing Path In a Matrix · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
draft: false
pattern: "DFS with memoization on a grid"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` integer matrix, determines the length of the longest strictly increasing
path, where each step moves to a horizontally or vertically adjacent cell whose value is
greater than the current one.

**Example**

```
Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4
```

Explanation: the path `1 -> 2 -> 6 -> 9` moves between adjacent cells with strictly
increasing values and has length 4, the longest such path in the matrix.

## Intuition

Every step of a valid path strictly increases in value, so the "can move to" relation between cells has no cycles — a path can never lead back to a cell it already visited. That means the longest increasing path starting at a given cell is a fixed number independent of how you got there, so a DFS from each cell can be memoized safely instead of re-explored.

## Approach

1. Let `rows, cols` be the matrix dimensions. `memo[r][c]` = length of the longest increasing path starting at `(r, c)`, `0` if not yet computed.
2. `dfs(r, c)`: if `memo[r][c]` is already set, return it directly.
3. Otherwise start with `best = 1` (the cell alone counts as a path of length 1).
4. For each of the 4 neighbors `(nr, nc)`: if in bounds and `matrix[nr][nc] > matrix[r][c]`, update `best = max(best, 1 + dfs(nr, nc))`.
5. Store `memo[r][c] = best` and return it.
6. The answer is `max(dfs(r, c) for every cell (r, c))`.

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

Strictly increasing values mean the move graph is a DAG, so `dfs(r, c)` is well defined and terminates, and memoization guarantees each cell's answer is computed exactly once no matter how many other cells' searches pass through it. Every cell does O(1) work beyond checking its four neighbors, so total time is O(rows*cols); the memo table dominates auxiliary space at O(rows*cols), plus an O(rows*cols) worst-case recursion stack.
