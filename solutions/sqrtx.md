---
# Sqrt(x) · Easy · Binary Search
# https://leetcode.com/problems/sqrtx/
draft: false
pattern: "Binary search on the answer"
time: "O(log x)"
space: "O(1)"
---

## Description

Given a nonnegative integer `x`, return `floor(sqrt(x))` without using exponentiation or a
built-in square-root function.

**Example**

```
Input: x = 8
Output: 2
```

Explanation: `sqrt(8)` is about `2.828`, whose floor is `2`.

## Intuition

For nonnegative integers, `m * m <= x` is true through `floor(sqrt(x))` and false afterward.
Binary search can locate this last true candidate in `[0, x]`. Keeping the boundary form rather
than returning on a perfect square handles exact and inexact roots uniformly.

## Approach

1. Search the inclusive candidate interval `[0, x]`.
2. If `mid * mid <= x`, record it implicitly by moving `l` to `mid + 1`; otherwise move `r`
   to `mid - 1`.
3. Maintain that every candidate below `l` passes and every candidate above `r` fails.
4. Return `r` when the interval empties. Since zero always passes, `r` is valid even for
   `x == 0`.

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

Squaring is increasing over nonnegative integers. If `mid` passes, every smaller candidate also
passes; if it fails, every larger candidate also fails. Thus each update preserves the boundary
invariant. At termination, `r` is immediately before `l`, all values through `r` pass, and all
values from `l` fail. Therefore `r` is the largest integer whose square is at most `x`, which is
`floor(sqrt(x))`.

**Complexity**

- **Time:** `O(log(x + 1))` binary-search iterations.
- **Space:** `O(1)` auxiliary space.
