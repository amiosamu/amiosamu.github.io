---
# Excel Sheet Column Title · Easy · Math & Geometry
# https://leetcode.com/problems/excel-sheet-column-title/
draft: false
pattern: "Bijective base-26, shift by one"
time: "O(log n)"
space: "O(log n)"
---

## Description

Given a positive Excel column number, return its title. The sequence begins `A, B, ...,
Z, AA, AB, ...` for numbers `1, 2, ..., 26, 27, 28, ...`.

**Example**

```
Input: columnNumber = 701
Output: "ZY"
```

After shifting each digit to zero-based indexing, 701 produces `Y` and then `Z`. Reversing
those least-significant-first characters gives `"ZY"`.

## Intuition

Excel titles use bijective base 26: digits are `A = 1` through `Z = 26`, with no zero
digit. Ordinary remainder arithmetic expects digits `0..25`. Subtracting one before each
digit extraction shifts the current digit into that range and makes multiples of 26 map
to `Z` rather than to a nonexistent zero symbol.

## Approach

1. Keep `letters` for characters generated from least to most significant.
2. While `columnNumber` is positive, subtract one to convert the next bijective digit to
   `0..25`. The positive-input constraint ensures at least one iteration.
3. Append the character at `columnNumber % 26`, then divide `columnNumber` by 26.
4. Reverse and join `letters` because remainders are produced in reverse order.

## Code

```python
class Solution:
    def convertToTitle(self, columnNumber: int) -> str:
        letters = []
        while columnNumber:
            columnNumber -= 1
            letters.append(chr(ord('A') + columnNumber % 26))
            columnNumber //= 26
        return ''.join(reversed(letters))
```

## Why it works

For any positive `n`, `((n - 1) % 26) + 1` is its unique least-significant bijective
base-26 digit, and `(n - 1) // 26` is the remaining prefix. Each loop iteration emits
exactly that digit and continues with the prefix. Induction on the number of digits shows
that the reversed emitted sequence is the unique Excel title for the original number.

**Complexity**

- **Time:** `O(log n)` because each iteration divides the remaining number by 26.
- **Space:** `O(log n)` auxiliary space because the characters are buffered before joining.
- **Output:** `O(log n)` for the returned title.
