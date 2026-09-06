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

Explanation: a ^ b = 1 gives the sum ignoring carries, and (a & b) << 1 = 4 is the carry;
folding the carry back in one more round produces 5.

## Intuition

Addition splits into two independent pieces: `a ^ b` is the sum of every column ignoring carries,
and `(a & b) << 1` is exactly the carries those columns generate, shifted into the next column.
Adding those two back together is the same subproblem, so I loop until the carry is empty. In
Python there is a second problem on top of that: ints are arbitrary precision and negatives are
conceptually infinite two's complement, so `(a & b) << 1` on a negative number never runs out of
carry bits and the loop spins forever. The fix is to simulate a 32-bit register by hand.

## Approach

1. Define `MASK = 0xFFFFFFFF` (32 ones) and `MAX_INT = 0x7FFFFFFF`.
2. Do `a &= MASK` and `b &= MASK` first. This converts a negative Python int into its 32-bit
   two's complement *bit pattern* held as a non-negative int, which is what the arithmetic below
   needs.
3. While `b` is non-zero: compute `carry = ((a & b) << 1) & MASK`, then `a = (a ^ b) & MASK`,
   then `b = carry`. Order matters — compute `carry` from the old `a` before overwriting it, or
   assign both in one tuple unpack. Masking after the shift is what drops the bit that fell off
   the top of the imaginary 32-bit register and guarantees termination.
4. When the loop ends, `a` holds the 32-bit result pattern as a non-negative int.
5. Decode the sign: if `a <= MAX_INT` the top bit is clear and `a` is already the answer.
   Otherwise the pattern is negative, and the value is `~(a ^ MASK)` — flip the low 32 bits to
   get the magnitude minus one, then take Python's `~` to restore the sign.
6. Trace `a = 2, b = 3`: `carry = (2 & 3) << 1 = 4`, `a = 2 ^ 3 = 1`; next round `carry = 0`,
   `a = 1 ^ 4 = 5`. Trace `a = -1, b = 1`: `a` becomes `0xFFFFFFFF`, carries propagate up to bit
   31, and the final shift falls off the mask leaving `a = 0`.

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

Column by column, `a ^ b` is the correct sum bit wherever at most one input bit is set, and
`(a & b) << 1` is precisely what the doubled columns owe the next position, so `a + b` is
invariant across the loop body while the carry word strictly moves left. After at most 32 rounds
the carry is shifted out of the masked register and `b` is 0. Two's complement addition is bit
identical for signed and unsigned operands, which is why masking to a raw 32-bit pattern and
decoding the sign only at the end is valid; the whole thing is O(1) time and O(1) space.
