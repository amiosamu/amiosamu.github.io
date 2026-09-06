---
# Set Matrix Zeroes · Medium · Math & Geometry
# https://leetcode.com/problems/set-matrix-zeroes/
draft: false
pattern: "First row and column as zero flags"
time: "O(m * n)"
space: "O(1)"
---

## Intuition

The naive fix — zero a row the moment you see a 0 — is wrong, because the zeros you write are
indistinguishable from the zeros that were already there and they cascade. So the real job is to
record *which* rows and columns to clear, then clear them in a second pass. Two boolean arrays of
size `m` and `n` are the obvious storage, but the follow-up wants `O(1)`, and the matrix already
contains a length-`m` column and a length-`n` row I can overwrite for exactly that purpose: row 0
and column 0. They overlap at `matrix[0][0]`, which can only carry one bit, so I hoist column 0's
flag into a separate boolean `first_col_zero` and let `matrix[0][0]` mean "row 0 has a zero".

## Approach

1. `m, n = len(matrix), len(matrix[0])`.
2. `first_col_zero = any(matrix[i][0] == 0 for i in range(m))`. Do this *before* anything is
   written, since column 0 is about to become scratch space.
3. Marker pass over `i in range(m)`, `j in range(1, n)` — column 0 deliberately excluded. If
   `matrix[i][j] == 0`, set `matrix[i][0] = 0` and `matrix[0][j] = 0`.
4. Write pass over rows **bottom to top**: `for i in range(m - 1, -1, -1)`. For each `j in
   range(n - 1, 0, -1)`, if `matrix[i][0] == 0 or matrix[0][j] == 0`, set `matrix[i][j] = 0`.
   Then, after that row's columns are done, `if first_col_zero: matrix[i][0] = 0`.
5. The bottom-up direction is the subtle part and the thing to remember. Row 0 is the column-flag
   row; if it is processed first and gets zeroed out, every later row reads corrupted flags. Take
   `[[0,1],[1,1]]`: top-down, row 0's flag `matrix[0][0] == 0` sets `matrix[0][1] = 0`, which then
   reads as "column 1 is flagged" and wrongly zeros `matrix[1][1]`. Going bottom-up, row 0 is
   consumed last, so destroying its flags harms nothing.
6. Column 0 is written only at the end of each row's inner loop, after `matrix[i][0]` has been read
   as the row flag for every `j` in that row. That is why the inner loop stops at `j == 1`.
7. Return nothing; the signature is `-> None` and the judge reads `matrix` back.

## Code

```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        for i in range(m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        for i in range(m - 1, -1, -1):
            for j in range(n - 1, 0, -1):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
            if first_col_zero:
                matrix[i][0] = 0
```

## Why it works

After the marker pass, `matrix[i][0] == 0` holds exactly when row `i` contained an original zero in
some column `>= 1` (or `i == 0` and row 0 did), and `matrix[0][j] == 0` holds exactly when column
`j >= 1` did — the pass only reads original values, since every cell it writes lies in row 0 or
column 0, which it never reads. The write pass then consumes each flag before overwriting it: a
row's flag `matrix[i][0]` survives until that row's inner loop finishes, and column 0's flag lives
outside the matrix in `first_col_zero`, while the bottom-up order keeps the column-flag row intact
until nothing else needs it. Two full sweeps give `O(m * n)` time with a single extra boolean.
