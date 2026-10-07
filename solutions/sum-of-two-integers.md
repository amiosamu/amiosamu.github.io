---
# Sum of Two Integers · Medium · Bit Manipulation
# https://leetcode.com/problems/sum-of-two-integers/
draft: false
pattern: "XOR sum plus shifted carry, 32-bit masked"
time: "O(1)"
space: "O(1)"
---

## Description

Given two integers `a` and `b`, return their sum, computed without using the `+` or `-`
operators.

**Example**

```
Input: a = 2, b = 3
Output: 5
```

`a ^ b = 1` gives the carry-free sum and `(a & b) << 1 = 4` gives the carry. Combining
those values produces `5`.

## Intuition

XOR adds two bit columns without carrying. AND finds columns that do carry, and shifting moves
those carries to their destination columns. Repeating these operations finishes binary addition.

Python integers do not have a fixed sign bit, so negative values behave like infinitely extended
two's-complement values. Mask every intermediate result to emulate the problem's 32-bit range.

## Approach

1. Define `MASK` for 32 bits and mask both inputs into unsigned two's-complement patterns.
2. While the carry word `b` is nonzero, compute the next carry as `(a & b) << 1`.
3. Replace `a` with the carry-free sum `a ^ b` and `b` with the carry, masking both to 32 bits.
4. Once no carry remains, interpret `a` as positive when its sign bit is clear.
5. Otherwise convert the unsigned pattern back to a negative Python integer with `~(a ^ MASK)`.

## Code

```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        MASK = 0xFFFFFFFF
        MAX_INT = 0x7FFFFFFF
        a &= MASK
        b &= MASK
        while b:
            carry = ((a & b) << 1) & MASK
            a = (a ^ b) & MASK
            b = carry
        return a if a <= MAX_INT else ~(a ^ MASK)
```

## Why it works

Modulo `2^32`, the invariant is that the numeric sum of `a` and `b` equals the original sum.
For each bit, XOR records the result without carry, while shifted AND records exactly the carry
owed to the next bit. Thus each iteration preserves the invariant. Carries move strictly left and
leave the 32-bit word after at most 32 iterations, so the final `a` is the correct result pattern.
Two's-complement decoding then gives the corresponding signed integer.

**Complexity**

- **Time:** `O(1)` under the fixed 32-bit convention; more generally `O(w)` for `w` bits.
- **Space:** `O(1)` fixed-width words.
