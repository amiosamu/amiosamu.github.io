---
# N Queens · Hard · Backtracking
# https://leetcode.com/problems/n-queens/
draft: false
pattern: "Backtracking with column/diagonal conflict sets"
time: "O(n!)"
space: "O(n^2)"
---

## Description

Given an integer `n`, place `n` queens on an `n x n` chessboard so that no two queens attack each other, and return all distinct board configurations, each rendered as a list of strings using 'Q' for a queen and '.' for an empty square.

**Example**

```
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

Explanation: On a 4x4 board there are exactly two arrangements of 4 queens with no shared row, column, or diagonal, and both are returned.

## Intuition

Placing queens row by row turns the 2D constraint into a 1D choice: no two queens can ever share a row, so each row just needs one safe column. A queen at `(row, col)` attacks its whole column, its `row - col` diagonal, and its `row + col` diagonal, so tracking those three quantities in sets lets me check a candidate column in O(1) instead of rescanning the board. Brute force would try all `n^n` column assignments; pruning a row the moment a conflict shows up cuts that down drastically.

## Approach

1. Maintain three sets: `cols` (occupied columns), `diag1` (occupied `row - col` values, the "/" diagonals), `diag2` (occupied `row + col` values, the "\" diagonals).
2. Maintain an `n x n` grid `board` initialized to `'.'`.
3. `backtrack(row)`: if `row == n`, every row has a queen — join each row of `board` into a string, append that list to `res`, and return.
4. Otherwise try every `col` from `0` to `n - 1`, skipping it if `col in cols`, `row - col in diag1`, or `row + col in diag2`.
5. For a valid `col`: add `col`, `row - col`, `row + col` to the three sets and set `board[row][col] = 'Q'`, then recurse into `backtrack(row + 1)`.
6. After the recursive call returns, undo the placement — remove the three values from the sets and reset `board[row][col]` to `'.'` — so the next candidate column at this row starts clean.
7. Call `backtrack(0)` and return `res`.

## Code

```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []
        board = [['.'] * n for _ in range(n)]
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> None:
            if row == n:
                res.append([''.join(r) for r in board])
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)
                board[row][col] = 'Q'

                backtrack(row + 1)

                board[row][col] = '.'
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)

        backtrack(0)
        return res
```

## Why it works

Every valid board has exactly one queen per row, so enumerating row-by-row column choices covers every possible arrangement without missing any, and the three conflict sets are a complete description of "under attack" — column plus both diagonal directions — so a column that clears all three checks is genuinely safe. Undoing the sets and the board cell on the way back up keeps that state in sync with the partial board at every step, which is what makes the recursion explore each branch independently and correctly. The search still visits every safe partial assignment, giving the O(n!) time bound; the board is the only structure that scales with `n^2`, so that's the auxiliary space.
