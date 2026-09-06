---
# Number of 1 Bits · Easy · Bit Manipulation
# https://leetcode.com/problems/number-of-1-bits/
draft: false
pattern: "Brian Kernighan bit clearing"
time: "O(1)"
space: "O(1)"
---

## Description

Given an unsigned 32-bit integer `n`, return the number of `1` bits in its binary
representation (its Hamming weight).

**Example**

```
Input: n = 11
Output: 3
```

Explanation: 11 in binary is 1011, which has three 1 bits.

## Intuition

The naive loop tests all 32 positions with `n & 1` and shifts, doing 32 iterations regardless
of how sparse `n` is. Brian Kernighan's trick does one iteration per set bit instead:
`n - 1` flips the lowest set bit to 0 and turns every bit below it into 1, so `n & (n - 1)`
clears exactly the lowest set bit and leaves everything above untouched. Count how many times
I can do that before `n` hits zero.

## Approach

1. Keep `count = 0`.
2. While `n` is non-zero: do `n &= n - 1`, then `count += 1`.
3. Return `count`.
4. Trace on `n = 11` (`1011`): `1011 & 1010 = 1010`, `1010 & 1001 = 1000`, `1000 & 0111 = 0`.
   Three iterations, answer 3.
5. `n = 0` returns 0 without entering the loop. Python ints are non-negative here (the problem
   hands you a value in `[0, 2^32)`), so `n` strictly decreases and the loop always terminates.

## Code

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count
```

## Why it works

Subtracting 1 borrows through the trailing zeros, so `n - 1` agrees with `n` above the lowest
set bit, has 0 where that bit was, and 1 everywhere below; ANDing therefore removes exactly one
1-bit and no others. Each iteration removes precisely one set bit, so the iteration count is the
popcount. At most 32 set bits in a 32-bit input makes this O(1) time and O(1) space.
