---
# Minimum Array End · Medium · Bit Manipulation
# https://leetcode.com/problems/minimum-array-end/
draft: false
pattern: "Scatter bits of n-1 into x's zero bits"
time: "O(log n + log x)"
space: "O(1)"
---

## Description

Given positive integers `n` and `x`, construct a strictly increasing array of `n` positive
integers whose bitwise AND is `x`. Return the smallest possible final array value.

**Example**

```
Input: n = 3, x = 4
Output: 6
```

Explanation: `[4, 5, 6]` is strictly increasing and its bitwise AND is `4`. No valid array
of length three can end below `6`.

## Intuition

Every array value must contain every set bit of `x`; otherwise the final AND would clear that
bit. Only positions where `x` has a zero are available for distinguishing the values.

Map an integer to a valid value by placing its bits, from low to high, into the zero positions
of `x`. This mapping preserves order. Therefore, the `n` smallest valid values correspond to
free-bit patterns `0` through `n - 1`, and only the last pattern needs to be constructed.

## Approach

1. Set `res = x` and `k = n - 1`, the free-bit pattern for the final value.
2. Scan bit positions from least to most significant, skipping positions already set in `x`.
3. At each zero position of `x`, copy the current low bit of `k` into `res`, then shift `k`.
4. Stop after all bits of `k` are consumed and return `res`. If `n == 1`, `k` is zero and
   `x` is returned unchanged.

## Code

```python
class Solution:
    def minEnd(self, n: int, x: int) -> int:
        res = x
        k = n - 1
        bit = 0
        while k:
            while (x >> bit) & 1:
                bit += 1
            if k & 1:
                res |= 1 << bit
            k >>= 1
            bit += 1
        return res
```

## Why it works

Let `f(k)` place the bits of `k` into the zero positions of `x` and retain all set bits of `x`.
Every `f(k)` contains `x`, and `f(0) = x`, so the AND of any sequence containing `f(0)` and only
such values is exactly `x`. Because corresponding bits are placed in increasing significance,
`a < b` implies `f(a) < f(b)`. Thus `f(0), ..., f(n - 1)` is a valid increasing array.

Any valid value must be `x` plus a pattern in its zero positions. Since `f` lists those values in
increasing order, no set of `n` valid values can have a maximum below `f(n - 1)`. The algorithm
constructs exactly `f(n - 1)`, so its answer is minimal.

**Complexity**

- **Time:** `O(log n + log x)` to consume the bits of `n - 1` and scan positions of `x`.
- **Space:** `O(1)` auxiliary space.
