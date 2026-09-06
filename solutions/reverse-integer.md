---
# Reverse Integer · Medium · Bit Manipulation
# https://leetcode.com/problems/reverse-integer/
draft: false
pattern: "Pop digits with %10, push with *10"
time: "O(1)"
space: "O(1)"
---

## Description

Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing
overflows the signed 32-bit range `[-2^31, 2^31 - 1]`, return `0` instead.

**Example**

```
Input: x = 123
Output: 321
```

Explanation: Reversing the digits of 123 gives 321, which fits comfortably within the 32-bit
signed range.

## Intuition

Reversing the digits is a pop-push loop: `x % 10` peels the last digit off, `res * 10 + digit`
pushes it onto the growing answer, `x //= 10` drops it. The two Python-specific traps are what
make this a Medium here. First, `%` and `//` floor toward negative infinity, so `-123 % 10` is
`7`, not `-3`, and running the loop directly on a negative `x` silently produces garbage — strip
the sign up front. Second, Python ints never overflow, so the 32-bit constraint is not enforced
for me; I have to compare against `[-2^31, 2^31 - 1]` explicitly and return 0 if I am outside it.

## Approach

1. Bind `INT_MIN, INT_MAX = -2**31, 2**31 - 1`.
2. Record `sign = -1 if x < 0 else 1`, then set `x = abs(x)`. `abs(-2**31)` is safe in Python
   precisely because ints are unbounded, so no special case is needed for `INT_MIN`.
3. Loop while `x`: `res = res * 10 + x % 10`, then `x //= 10`. Both operands are now
   non-negative, so floor division and modulo behave the way the C-style algorithm assumes.
4. After the loop, apply the sign with `res *= sign`.
5. Return `res` if `INT_MIN <= res <= INT_MAX`, else `0`. Checking after the fact is only legal
   because Python did not wrap around during the loop — in a fixed-width language this test has
   to move inside the loop, before the multiply.
6. Trace `x = 120`: digits pushed are `0`, then `2` giving `2`, then `1` giving `21`; leading
   zeros of the reversal disappear on their own because `res * 10 + 0` is still 0.
7. Trace `x = 1534236469`: the reversal is `9646324351`, which exceeds `INT_MAX`, so return 0.
   `x = 0` returns 0 without entering the loop.

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

The invariant is that after `k` iterations `res` holds the last `k` digits of the original number
in reverse order and `x` holds the rest, since `x % 10` is the current last digit and multiplying
`res` by 10 shifts room for it. Reversal commutes with negation on the digit string, so handling
the sign separately and reattaching it at the end is exact. The loop runs once per decimal digit
and the input has at most 10 of them, so this is O(1) time and O(1) space.
