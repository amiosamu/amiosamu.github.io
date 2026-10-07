---
# Counting Bits · Easy · Bit Manipulation
# https://leetcode.com/problems/counting-bits/
draft: false
pattern: "DP on i >> 1 plus low bit"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number
of `1` bits in the binary representation of `i`, for every `i` from `0` to `n`.

**Example**

```
Input: n = 5
Output: [0,1,1,2,1,2]
```

Explanation: In binary, 0..5 are 0,1,10,11,100,101, whose 1-bit counts are 0,1,1,2,1,2.

## Intuition

The binary representation of `i` is the representation of `i >> 1` followed by its low bit.
Therefore `bits(i) = bits(i >> 1) + (i & 1)`. The shifted value is smaller than `i`, so its
answer is already available during a left-to-right scan.

## Approach

1. Allocate `dp` with `n + 1` zeros; `dp[0]` is the base count for zero.
2. For each `i` from 1 through `n`, set `dp[i] = dp[i >> 1] + (i & 1)`.
3. Return `dp`. When `n == 0`, the loop is empty and `[0]` is returned.

## Code

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```

## Why it works

Every `i` decomposes uniquely into `2 * (i >> 1) + (i & 1)`. The shift contributes the same set
bits as `i >> 1`, while the low bit contributes either zero or one. Thus the recurrence is
exact. Since it reads a smaller index, induction from `dp[0]` proves every output entry correct.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)` auxiliary space and `O(n)` output space.
