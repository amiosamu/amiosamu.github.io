---
# Pow(x, n) · Medium · Math & Geometry
# https://leetcode.com/problems/powx-n/
draft: false
pattern: "Binary exponentiation (fast power)"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a float `x` and an integer `n`, compute `x` raised to the power `n` (`x^n`) without
relying on a built-in power operator. `n` may be negative, which means computing the power
of the reciprocal `1/x`.

**Example**

```
Input: x = 2.00000, n = 10
Output: 1024.00000
```

Explanation: 2 raised to the 10th power is 1024, since 2*2*...*2 (ten times) equals 1024.

## Intuition

Multiplying `x` by itself `n` times is O(n); but `x^n` can be built from `(x*x)^(n/2)` (with an
extra factor of `x` peeled off when `n` is odd), which halves the exponent every step - the
classic fast/binary exponentiation trick. A negative `n` just means computing `(1/x)^(-n)`, so
normalizing that up front leaves only a non-negative exponent to deal with in the main loop.

## Approach

1. If `n < 0`, replace `x` with `1 / x` and `n` with `-n`, since `x^n = (1/x)^(-n)`; from here
   on `n >= 0`.
2. Initialize `result = 1`.
3. While `n > 0`:
   - if `n` is odd, multiply `result` by `x` and decrement `n` by 1 - this peels off one factor
     of `x` for the current low bit of `n`.
   - otherwise, square `x` in place (`x *= x`) and halve `n` (`n //= 2`) - this is the step that
     does the actual work-halving.
4. Return `result` once `n` reaches 0.

## Code

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x = 1 / x
            n = -n

        result = 1
        while n > 0:
            if n % 2 == 1:
                result *= x
                n -= 1
            else:
                x *= x
                n //= 2
        return result
```

## Why it works

Writing `n` in binary, `x^n` is the product of `x^(2^k)` over every set bit `k`; repeatedly
squaring `x` builds exactly those powers-of-two values in sequence, and multiplying one into
`result` whenever the current low bit of `n` is 1 reconstructs the full product. Each iteration
either halves `n` or clears its lowest bit, so the loop runs `O(log n)` times instead of `O(n)`,
using only a constant amount of extra state.
