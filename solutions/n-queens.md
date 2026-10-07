---
# N Queens · Hard · Backtracking
# https://leetcode.com/problems/n-queens/
draft: false
pattern: "Backtracking with column/diagonal conflict sets"
time: "O(n! + S * n^2)"
space: "O(n^2)"
---

## Description

Given `n`, return every distinct placement of `n` queens on an `n x n` chessboard in which no
two queens attack each other. Render a queen as `"Q"` and an empty square as `"."`.

**Example**

```
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

Explanation: A `4 x 4` board has exactly two non-attacking queen arrangements.

## Intuition

Place one queen in each row. This prevents row conflicts automatically, leaving only columns and
the two diagonal directions. Every cell on one descending diagonal has the same `row - col`, and
every cell on one ascending diagonal has the same `row + col`. Three sets therefore provide
constant-time conflict checks while backtracking explores only safe prefixes.

## Approach

1. Create an empty board and sets for occupied columns and both diagonal identifiers.
2. At `backtrack(row)`, serialize and copy the board when `row == n`.
3. Otherwise try every column absent from all three conflict sets.
4. Mark the cell and identifiers, recurse to the next row, then undo every mutation.
5. Start at row zero and return all recorded boards.

## Code

```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []
        board = [["."] * n for _ in range(n)]
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> None:
            if row == n:
                res.append(["".join(r) for r in board])
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)
                board[row][col] = "Q"

                backtrack(row + 1)

                board[row][col] = "."
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)

        backtrack(0)
        return res
```

## Why it works

At depth `row`, the board has one queen in each earlier row, and the sets contain exactly their
columns and diagonals. A candidate accepted by all three checks attacks none of those queens.
Conversely, every valid board chooses one accepted column at each row, so its unique sequence of
choices is explored. Restoring all mutations after recursion preserves the invariant for sibling
branches. Thus every valid board is produced once and no invalid board is produced.

**Complexity**

- **Time:** `O(n! + S * n^2)` for the search and serialization of `S` solutions.
- **Space:** `O(n^2)` auxiliary space for the board, sets, and recursion stack, plus
  `O(S * n^2)` output space for `S` solutions.
