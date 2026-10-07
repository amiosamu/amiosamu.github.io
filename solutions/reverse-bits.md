---
# Reverse Bits · Easy · Bit Manipulation
# https://leetcode.com/problems/reverse-bits/
draft: false
pattern: "Pop low bit, push into result"
time: "O(1)"
space: "O(1)"
---

## Description

Given a 32-bit unsigned integer `n`, return the integer represented by its bits in reverse order.

**Example**

```
Input: n = 1
Output: 2147483648
```

Explanation: Reversal moves the only set bit from position `0` to position `31`, producing `2^31`.

## Intuition

Read the input from least significant bit to most significant bit. Before appending each bit to
the result, shift the result left. After exactly 32 rounds, the first bit read has moved to the
highest position and the final bit read occupies the lowest position.

## Approach

1. Initialize `res = 0`.
2. Repeat exactly 32 times. Set `res = (res << 1) | (n & 1)` to append `n`'s low bit, then
   shift `n` right to discard that bit.
3. Return `res`. A fixed iteration count preserves leading zeros; `while n` would stop before
   shifting them into their required positions.

## Code

```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
```

## Why it works

On round `i`, the algorithm reads input bit `i`. That bit is subsequently shifted left once in
each of the remaining `31 - i` rounds, so its final position is `31 - i`. Every one of the 32
bits is placed at exactly its reversed position, including zeros above the highest set input bit.

**Complexity**

- **Time:** `O(1)` for exactly 32 iterations.
- **Space:** `O(1)`.
