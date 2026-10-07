---
# Surrounded Regions · Medium · Graphs
# https://leetcode.com/problems/surrounded-regions/
draft: false
pattern: "DFS flood-fill from border cells"
time: "O(rows * cols)"
space: "O(rows * cols)"
---

## Description

Given an `m x n` board of `'X'` and `'O'` characters, capture in place every region of
`'O'`s that is fully surrounded by `'X'`s (not connected to the border) by flipping it to
`'X'`; regions of `'O'` that touch the border stay unchanged.

**Example**

```
Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
```

The three connected interior cells are captured. The `'O'` at `(3, 1)` touches the border and
therefore remains unchanged.


## Intuition

An `'O'` cannot be captured exactly when a path of adjacent `'O'` cells connects it to the border.
It is simpler to mark all such safe cells than to test each interior region for enclosure. After
that flood-fill, every unmarked `'O'` is surrounded.

## Approach

1. Return immediately for an empty board and record its dimensions.
2. Define `dfs(r, c)` to replace a reachable `'O'` with the temporary marker `'#'`, then visit
   its four in-bounds neighbors.
3. Start the flood-fill from every cell on all four borders.
4. Sweep the board: replace unmarked `'O'` cells with `'X'` and restore `'#'` cells to `'O'`.
5. Mutate `board` in place and return no value, as required by the API.

## Code

```python
class Solution:
    def solve(self, board: List[List[str]]) -> None:
        if not board or not board[0]:
            return

        rows, cols = len(board), len(board[0])

        def dfs(r: int, c: int) -> None:
            if board[r][c] != 'O':
                return
            board[r][c] = '#'
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    dfs(nr, nc)

        for r in range(rows):
            dfs(r, 0)
            dfs(r, cols - 1)
        for c in range(cols):
            dfs(0, c)
            dfs(rows - 1, c)

        for r in range(rows):
            for c in range(cols):
                if board[r][c] == 'O':
                    board[r][c] = 'X'
                elif board[r][c] == '#':
                    board[r][c] = 'O'
```

## Why it works

The flood-fill invariant is that every marked cell is an `'O'` connected to a border, and every
border-connected `'O'` reachable from a seed is eventually marked. Thus the marked set is exactly
the set that cannot be captured. Every remaining `'O'` has no path to a border and is surrounded,
so flipping precisely those cells is correct; restoring the marked cells preserves all safe regions.

**Complexity**

- **Time:** `O(rows * cols)` because each cell is processed a constant number of times.
- **Space:** `O(rows * cols)` in the worst case for the recursive DFS stack.
