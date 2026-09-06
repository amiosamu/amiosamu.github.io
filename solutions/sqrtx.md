---
# Sqrt(x) · Easy · Binary Search
# https://leetcode.com/problems/sqrtx/
draft: false
pattern: "Binary search on the answer"
time: "O(log x)"
space: "O(1)"
---

## Description

Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer, without using any built-in exponent or square-root function.

**Example**

```
Input: x = 8
Output: 2
```

Explanation: The square root of 8 is about 2.828, and rounding that down gives 2.

## Intuition

The answer is not an index into anything — it is a number in `[0, x]` — but `m * m <= x` is monotone in `m`: true for every `m` up to the true root and false forever after. Any monotone yes/no test over an ordered range can be binary searched, so instead of scanning candidates I halve the range of candidates. The problem asks for the floor of the square root, which is precisely "the largest `m` for which the test still passes".

## Approach

1. Search space: the integer interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = x`. `x` is a safe upper bound since `x * x >= x` for all `x >= 1`, and `x = 0` is covered by the interval `[0, 0]`.
2. Monotone predicate: `P(m) = m * m <= x`. True on a prefix `[0, k]`, false on `(k, x]`, where `k = floor(sqrt(x))` is the answer.
3. Invariant: every value `< l` satisfies `P`, every value `> r` fails `P`.
4. Loop `while l <= r`, `mid = (l + r) // 2`.
5. If `mid * mid <= x`, `mid` is feasible and the answer is at least `mid`, so push the lower bound up: `l = mid + 1`. Otherwise `mid` is too big: `r = mid - 1`.
6. Do not return early on an exact hit — the pure boundary form is shorter and handles non-perfect squares with the same code.
7. On exit `l == r + 1`, so `r` is the last value satisfying `P` and `l` the first that fails. The answer is `r`.
8. `P(0)` is always true (`0 <= x`), so `r >= 0` on exit and there is no empty-answer case to guard.

## Code

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        l, r = 0, x
        while l <= r:
            mid = (l + r) // 2
            if mid * mid <= x:
                l = mid + 1
            else:
                r = mid - 1
        return r
```

## Why it works

Squaring is strictly increasing on non-negative integers, so `m * m <= x` flips from true to false exactly once — that single flip is what lets one probe discard a whole half. The invariant "everything left of `l` passes, everything right of `r` fails" is vacuously true at the start and preserved by both updates, so when the interval empties, `r` and `l` straddle the flip and `r` is the largest passing value, i.e. `floor(sqrt(x))`. The candidate range halves each iteration, giving `O(log x)` iterations and `O(1)` space.
