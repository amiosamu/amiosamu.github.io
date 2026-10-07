---
# N Queens II · Hard · Backtracking
# https://leetcode.com/problems/n-queens-ii/
draft: false
pattern: "Backtracking with conflict sets, count leaves only"
time: "O(n!)"
space: "O(n)"
---

## Description

Given `n`, return the number of distinct ways to place `n` queens on an `n x n` board so that
no two queens share a row, column, or diagonal.

**Example**

```
Input: n = 4
Output: 2
```

Explanation: A `4 x 4` board has exactly two non-attacking queen arrangements.

## Intuition

Placing one queen per row removes row conflicts by construction. A candidate `(row, col)` is safe
exactly when `col`, `row - col`, and `row + col` have not been used. Backtracking can enumerate
all safe column choices while storing only those three conflict sets. A completed placement
contributes one to the count, so no board representation is needed.

## Approach

1. Maintain sets for occupied columns and both diagonal identifiers.
2. In `backtrack(row)`, return `1` when `row == n`; a complete valid placement was found.
3. Try each column not present in any conflict set, add its three identifiers, and recurse.
4. Remove the identifiers after recursion so the next branch sees the original state.
5. Sum all successful descendants and return `backtrack(0)`.

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

At recursion depth `row`, exactly one safe queen has been placed in each earlier row, and the sets
describe all columns and diagonals they attack. The membership checks therefore accept exactly the
safe placements in the current row. Trying every accepted column covers every valid continuation;
undoing the placement keeps branches independent. Every complete board has a unique sequence of
column choices, so reaching `row == n` counts each solution exactly once.

**Complexity**

- **Time:** `O(n!)` as a standard upper bound on the pruned row-by-row search.
- **Space:** `O(n)` auxiliary space for conflict sets and recursion depth.
