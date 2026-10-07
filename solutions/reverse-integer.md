---
# Reverse Integer · Medium · Bit Manipulation
# https://leetcode.com/problems/reverse-integer/
draft: false
pattern: "Pop digits with %10, push with *10"
time: "O(1)"
space: "O(1)"
---

## Description

Given a signed 32-bit integer `x`, reverse its decimal digits. Return `0` if the result lies
outside `[-2^31, 2^31 - 1]`.

**Example**

```
Input: x = 123
Output: 321
```

Explanation: Reversing `123` gives `321`, which fits in the required range.

## Intuition

Repeatedly taking `% 10` removes the final decimal digit, while `res * 10 + digit` appends it to
the reversed value. Python's modulo behavior for negative numbers is inconvenient here, so record
the sign and process `abs(x)`. Python integers do not overflow, which allows one explicit range
check after all digits have been processed.

## Approach

1. Store the 32-bit bounds, record `sign`, and replace `x` with `abs(x)`. Python safely represents
   `abs(-2**31)`.
2. While digits remain, append `x % 10` to `res` and discard that digit with `x //= 10`.
3. Apply `sign` to `res`.
4. Return `res` when it is within the signed 32-bit bounds; otherwise return `0`. For `x = 0`,
   the loop is skipped and the result remains `0`.

## Code

```python
class Solution:
    def reverse(self, x: int) -> int:
        INT_MIN, INT_MAX = -2**31, 2**31 - 1
        sign = -1 if x < 0 else 1
        x = abs(x)
        res = 0
        while x:
            res = res * 10 + x % 10
            x //= 10
        res *= sign
        return res if INT_MIN <= res <= INT_MAX else 0
```

## Why it works

After `k` iterations, `res` contains the last `k` digits of the original magnitude in reverse
order, and `x` contains the unprocessed prefix. Modulo extracts the next required digit and
multiplication by ten creates its destination place, preserving the invariant. Reattaching the
original sign gives the mathematical reversal; the final bounds check enforces the required
32-bit behavior.

**Complexity**

- **Time:** `O(1)` for a 32-bit input; equivalently `O(log |x|)` for an unbounded integer.
- **Space:** `O(1)`.
