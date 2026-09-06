---
# Valid Sudoku · Medium · Arrays & Hashing
# https://leetcode.com/problems/valid-sudoku/
draft: false
pattern: "Three sets for rows, columns, boxes"
time: "O(1)"
space: "O(1)"
---

## Intuition

Only the board as filled matters — no solving, no backtracking, just three
independent "no duplicates" checks. Doing them as three separate passes works but
means visiting the board three times and writing the box-walk twice.

One pass is enough if each cell reports itself to all three of its groups at once.
The only piece worth remembering is the box index: cell `(r, c)` lives in box
`(r // 3) * 3 + c // 3`, which flattens the 3×3 grid of boxes into `0..8` the same
way row-major indexing flattens any grid.

## Approach

1. Create three lists of nine empty sets: `rows`, `cols`, `boxes`.
2. Scan every cell `(r, c)` with two nested loops over `range(9)`.
3. Skip immediately if `board[r][c] == "."` — empties never conflict, and the
   board is deliberately allowed to be unsolvable.
4. Compute `b = (r // 3) * 3 + c // 3`.
5. If the digit is already in `rows[r]`, `cols[c]`, or `boxes[b]`, return `False`.
6. Otherwise add it to all three sets and continue.
7. Return `True` if the scan completes. Check-then-insert, never insert-then-check,
   or a cell will collide with itself.

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

A board is valid exactly when no group contains a repeated digit, and each cell
belongs to exactly one row, one column and one box — so testing membership in
those three sets before inserting catches the first repeat in whichever group it
occurs, and reaching the end means no group ever saw one. The board is fixed at
9×9, so the 81 cells and the 27 sets of at most 9 digits are both constant work
and constant space.
