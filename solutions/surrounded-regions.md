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

Explanation: the `'O'`s at `(1,1)`, `(1,2)`, `(2,2)` never touch the border, so they flip to
`'X'`, while the `'O'` at `(3,1)` touches the bottom border and is left alone.


## Intuition

A region of 'O's only survives if it isn't connected, directly or through other 'O's, to the border — anything touching the border can never be fully surrounded, no matter how it winds through the grid. Rather than testing every region for enclosure, flip it around: flood-fill from every border 'O' first to mark the safe cells, then everything left unmarked afterward is provably surrounded and gets flipped to 'X'.

## Approach

1. Handle the empty-board edge case; read `rows`, `cols` from `board`.
2. Write `dfs(r, c)`: if `board[r][c] != 'O'`, return immediately; otherwise mark it with a temporary sentinel `'#'` and recurse into the 4 in-bounds neighbors.
3. Call `dfs` on every cell along row 0, row `rows - 1`, column 0, and column `cols - 1` — this marks every 'O' reachable from the border as `'#'`.
4. Sweep the whole board once: any cell still `'O'` was never reached from the border, so flip it to `'X'`.
5. In the same sweep, flip every `'#'` back to `'O'` — these are the safe, border-connected cells.
6. The board is mutated in place; the function returns nothing, matching the LeetCode signature.

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

Capture requires a region to be walled in by 'X' on every side with no path of adjacent 'O's escaping to an edge; the border-seeded flood-fill visits exactly the set of cells that have such an escape path, so anything left as plain 'O' after it runs is guaranteed surrounded. The sentinel marker stops each cell from being revisited, so the flood-fill and the final sweep each touch every cell once, giving O(rows * cols) time and O(rows * cols) space for the recursion stack in the worst case, e.g. a board that's all 'O'.
