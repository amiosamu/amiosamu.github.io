---
# Single Number · Easy · Bit Manipulation
# https://leetcode.com/problems/single-number/
draft: false
pattern: "XOR cancels duplicate pairs"
time: "O(n)"
space: "O(1)"
---

## Description

Given a non-empty array `nums` where every integer appears exactly twice except for one,
which appears exactly once, find and return that single integer. The intended solution runs
in linear time using only constant extra space, ruling out a hash-set/counting approach.

**Example**

```
Input: nums = [2,2,1]
Output: 1
```

Explanation: 2 appears twice and cancels itself out under XOR, leaving 1 as the only value
that survives.

## Intuition

The obvious solve is a counter dict, but that costs O(n) memory and the problem asks for
constant space. The one property that kills it: XOR is associative and commutative, and
`a ^ a == 0`. So if I fold the whole array with XOR, order stops mattering and every value
that appears twice annihilates itself. What survives is `0 ^ single`, which is the answer.

## Approach

1. Start `res = 0` — the identity for XOR, so an empty fold is harmless.
2. Walk every `n` in `nums` and do `res ^= n`.
3. Return `res`.
4. No sorting, no dict, no second pass. The array is guaranteed to have exactly one element
   appearing once and all others exactly twice, which is what makes the fold collapse cleanly.

## Code

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0
        for n in nums:
            res ^= n
        return res
```

## Why it works

Because XOR is commutative and associative, I can mentally reorder the fold so each duplicated
pair sits next to itself; every pair contributes `x ^ x = 0`, and `0` is the XOR identity, so
the accumulator ends at exactly the unpaired value. One pass over `n` elements with a single
integer of state gives O(n) time and O(1) space.
