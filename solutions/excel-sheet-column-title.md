---
# Excel Sheet Column Title · Easy · Math & Geometry
# https://leetcode.com/problems/excel-sheet-column-title/
draft: false
pattern: "Bijective base-26, shift by one"
time: "O(log n)"
space: "O(log n)"
---

## Description

Given an integer `columnNumber` as it would appear as a column title in an Excel sheet (where
`A, B, ..., Z, AA, AB, ...` are `1, 2, ..., 26, 27, 28, ...`), return the corresponding column
title as a string.

**Example**

```
Input: columnNumber = 701
Output: "ZY"
```

Explanation: `701` decrements to `700`; `700 % 26 == 24` gives `'Y'` and `700 // 26 == 26`;
decrementing `26` to `25` gives `25 % 26 == 25`, `'Z'`, with quotient 0. Reading the digits in the
order they were produced, last to first, gives `"ZY"`.

## Intuition

This is base 26, except there is no zero digit: the alphabet spells out 1..26, not 0..25, so
`A` is 1 and `Z` is 26 and there is nothing that means "empty". That one difference breaks the
usual `n % 26` / `n //= 26` loop — for `n = 26` it hands me digit 0 and quotient 1, i.e. "A?"
instead of "Z". The fix is a single `n -= 1` at the top of each iteration: it slides the digit
range from `1..26` down to `0..25`, which is exactly the offset from `A`, and the same decrement
makes the quotient borrow correctly so 26 fully consumes itself instead of leaving a stray 1.

## Approach

1. Keep a list `letters` of characters produced least-significant first.
2. While `columnNumber` is non-zero:
   - `columnNumber -= 1` first. This is the whole trick; everything below assumes 0-indexed digits.
   - Append `chr(ord('A') + columnNumber % 26)`.
   - `columnNumber //= 26`.
3. Return `''.join(reversed(letters))` — the loop emits the last letter first.
4. Trace `1`: decrement to 0, digit 0 -> `A`, quotient 0, stop. Output `"A"`.
5. Trace `26`: decrement to 25, digit 25 -> `Z`, quotient `25 // 26 == 0`, stop. Output `"Z"`.
   Without the decrement the quotient would have been 1 and I would have emitted a bogus `A`.
6. Trace `701`: decrement to 700, `700 % 26 == 24` -> `Y`, quotient 26; decrement to 25 ->
   `Z`, quotient 0. Reversed gives `"ZY"`.
7. `columnNumber >= 1` by constraint, so the loop always runs at least once and I never return
   the empty string.

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

In bijective base 26 every positive integer has a unique representation with digits in `1..26`,
and `((n - 1) % 26) + 1` is that least-significant digit while `(n - 1) // 26` is the rest of the
number — the decrement moves me into ordinary base 26 for exactly one digit extraction and the
floor division carries the borrow. Each pass divides `columnNumber` by 26, so the loop runs
`O(log n)` times and the output holds that many letters (at most 7 for a 32-bit input).
