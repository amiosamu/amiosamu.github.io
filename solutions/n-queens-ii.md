---
# N Queens II · Hard · Backtracking
# https://leetcode.com/problems/n-queens-ii/
draft: false
pattern: "Backtracking with conflict sets, count leaves only"
time: "O(n!)"
space: "O(n)"
---

## Intuition

Same problem as N Queens, minus the requirement to reconstruct the boards — I only need how many valid placements exist, so there's no reason to build or store an `n x n` grid. Same row-by-row column search, same three conflict sets for column and both diagonals, but each successful leaf just contributes `1` to a running count instead of a formatted board.

## Approach

1. Maintain `cols`, `diag1` (`row - col` values), `diag2` (`row + col` values) as sets tracking occupied columns and diagonals.
2. `backtrack(row)`: if `row == n`, every row has a queen placed safely — return `1`.
3. Otherwise set `count = 0` and try every `col` from `0` to `n - 1`, skipping any where `col in cols`, `row - col in diag1`, or `row + col in diag2`.
4. For a valid `col`, add `col`, `row - col`, `row + col` to the sets, add `backtrack(row + 1)` into `count`, then remove those three values again before trying the next column.
5. Return `count` once every column at this row has been tried.
6. Call `backtrack(0)` and return the result.

## Code

```python
class Solution:
    def totalNQueens(self, n: int) -> int:
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> int:
            if row == n:
                return 1
            count = 0
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)

                count += backtrack(row + 1)

                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)
            return count

        return backtrack(0)
```

## Why it works

The recursion enumerates exactly the same safe row-by-row assignments as N Queens, so every unit it returns corresponds to one full, conflict-free board, and summing `backtrack(row + 1)` over every safe column at `row` counts each completed board exactly once with no double-counting or gaps. Dropping the board means the only state carried is the three O(n)-sized sets plus the recursion stack, so space falls from O(n^2) to O(n); the time bound is unchanged since it's the same search tree, just without materializing a grid at each leaf.
