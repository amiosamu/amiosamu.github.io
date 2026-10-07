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

Explanation: `11` is `1011` in binary, which contains three set bits.

## Intuition

Subtracting one flips the lowest set bit to zero and all lower zeros to ones. ANDing the original
value with that result therefore clears exactly its lowest set bit. Repeating this operation counts
only set bits rather than examining all 32 positions.

## Approach

1. Initialize `count = 0`.
2. While `n` is nonzero, replace it with `n & (n - 1)` and increment `count`.
3. Return `count`. An input of zero skips the loop and returns zero.

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

For nonzero `n`, `n - 1` matches `n` above its lowest set bit, clears that bit, and changes only
lower bits. Consequently, `n & (n - 1)` removes exactly one set bit and preserves all others.
After `k` iterations, exactly `k` original set bits have been removed. The loop reaches zero only
after all of them are removed, so `count` is the Hamming weight.

**Complexity**

- **Time:** `O(1)` for a 32-bit input, more precisely `O(k)` for `k` set bits.
- **Space:** `O(1)` auxiliary space.
