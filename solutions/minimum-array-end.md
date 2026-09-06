---
# Minimum Array End · Medium · Bit Manipulation
# https://leetcode.com/problems/minimum-array-end/
draft: false
pattern: "Scatter bits of n-1 into x's zero bits"
time: "O(log n + log x)"
space: "O(1)"
---

## Intuition

Every element has to AND down to `x`, so every element must be a superset of `x`'s set bits —
which means each element is `x` with some subset of the *zero* positions of `x` turned on. Those
free positions are the only degrees of freedom, and the array must be strictly increasing, so the
cheapest array uses the `n` smallest such supersets. Ordering supersets by value is exactly
ordering their free-bit patterns as binary numbers `0, 1, 2, ..., n-1`, so the last element is
`x` with the bits of `n - 1` scattered into `x`'s zero positions, low to high.

## Approach

1. Start `res = x` and `k = n - 1` — the index of the last element among the free-bit patterns.
2. Keep a cursor `bit = 0` walking the positions of `x` from the least significant end.
3. While `k` is non-zero:
   - advance `bit` past every position where `x` already has a 1: `while (x >> bit) & 1: bit += 1`.
     Those positions are locked and cannot carry information.
   - if `k & 1`, set that free position in the answer: `res |= 1 << bit`.
   - drop the consumed bit with `k >>= 1` and move the cursor on with `bit += 1`.
4. Return `res`.
5. Trace `n = 3, x = 4` (`100`): `k = 2` (`10`). Position 0 is free, `k & 1 = 0`, nothing set;
   `k = 1`, `bit = 1`. Position 1 is free, `k & 1 = 1`, so `res = 4 | 2 = 6`. Answer 6.
6. Trace `n = 2, x = 7` (`111`): `k = 1`. The cursor skips positions 0, 1, 2 (all set in `x`) and
   lands on 3, which gets the bit: `res = 7 | 8 = 15`.
7. Edge case `n = 1`: `k = 0`, the loop never runs, and the answer is `x` itself.

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

The AND of the whole array equals `x` iff every element contains `x`'s bits and, jointly, the
elements leave at least one 0 in each free position — using the patterns `0..n-1` satisfies both,
since pattern `0` is `x` itself and contributes a 0 everywhere free. Mapping free-bit patterns to
values is order preserving because it places the pattern's bits in increasing significance, so the
`n` smallest supersets are strictly increasing and their maximum is the image of `n - 1`, which is
the minimum achievable last element. The loop consumes one bit of `n - 1` per round and the cursor
scans each position of `x` at most once, giving O(log n + log x) time and O(1) space.
