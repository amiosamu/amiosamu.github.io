---
# Pow(x, n) · Medium · Math & Geometry
# https://leetcode.com/problems/powx-n/
draft: false
pattern: "Binary exponentiation (fast power)"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a floating-point base `x` and integer exponent `n`, compute `x` raised to `n`. A negative
exponent represents the corresponding power of `1 / x`.

**Example**

```
Input: x = 2.00000, n = 10
Output: 1024.00000
```

Explanation: `2^10 = 1024`.

## Intuition

Binary exponentiation uses `x^(2e) = (x * x)^e` to halve even exponents. For an odd exponent,
one factor of `x` first moves into the result, leaving an even exponent. Normalizing a negative
exponent to a positive exponent of the reciprocal lets the same loop handle both signs.

## Approach

1. If `n < 0`, replace `x` with `1 / x` and negate `n`. The remaining exponent is
   nonnegative.
2. Initialize `result = 1`. Maintain the invariant that `result * x^n` equals the requested
   value after normalization.
3. While `n > 0`, move one factor of `x` into `result` when `n` is odd. When `n` is even,
   square `x` and halve `n`.
4. Return `result` when the remaining exponent reaches zero. The local variables are modified,
   but the caller's numeric arguments are immutable.

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

After sign normalization, let the current variables be `result`, `x`, and `n`. Initially,
`result * x^n` is the desired power. If `n` is odd, replacing the pair with
`result * x` and `n - 1` preserves that product. If `n` is even, replacing `x` with `x^2` and
`n` with `n / 2` also preserves it. The exponent strictly decreases, so eventually `n = 0`;
the invariant then says `result` is the desired value.

**Complexity**

- **Time:** `O(log |n|)` because every one or two iterations at least halve the exponent.
- **Space:** `O(1)`.
