---
# Valid Sudoku · Medium · Arrays & Hashing
# https://leetcode.com/problems/valid-sudoku/
draft: false
pattern: "Three sets for rows, columns, boxes"
time: "O(1)"
space: "O(1)"
---

## Description

Given a partially filled `9x9` Sudoku `board` (each cell is a digit `1`-`9` or `"."` for
empty), determine whether the digits already placed make it valid: no digit repeats
within any row, any column, or any of the nine `3x3` sub-boxes. The board does not need
to be solvable, only free of conflicts as filled in.

**Example**

```
Input: board =
[["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]]
Output: true
```

No filled digit repeats within any row, column, or `3 x 3` box.

## Intuition

The board need not be solved; only existing conflicts matter. During one scan, record the digits
already seen in each row, column, and box. Cell `(r, c)` belongs to box
`(r // 3) * 3 + c // 3`, which numbers the boxes from `0` through `8`.

## Approach

1. Create nine sets each for rows, columns, and boxes.
2. Scan every cell, skipping `'.'` because empty cells impose no constraint.
3. Compute the cell's box index from its row and column.
4. Reject the digit if it already appears in any of its three group sets.
5. Otherwise add it to all three sets; return `True` after the complete scan.

## Code

```python
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                digit = board[r][c]
                if digit == ".":
                    continue

                b = (r // 3) * 3 + c // 3
                if digit in rows[r] or digit in cols[c] or digit in boxes[b]:
                    return False

                rows[r].add(digit)
                cols[c].add(digit)
                boxes[b].add(digit)

        return True
```

## Why it works

After each processed cell, the invariant is that every set contains exactly the nonempty digits
already encountered in that group, with no duplicates. A membership hit proves the current digit
would violate a row, column, or box. Otherwise insertion preserves the invariant. If the scan
finishes, no group contains a duplicate, which is exactly Sudoku validity for a partial board.

**Complexity**

- **Time:** `O(1)` because the board always contains 81 cells.
- **Space:** `O(1)` because the 27 sets each hold at most nine digits.
