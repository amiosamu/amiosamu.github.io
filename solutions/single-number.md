---
# Single Number · Easy · Bit Manipulation
# https://leetcode.com/problems/single-number/
draft: false
pattern: "XOR cancels duplicate pairs"
time: "O(n)"
space: "O(1)"
---

## Description

Given a nonempty array `nums` in which every integer appears twice except for one integer that
appears once, return the single integer using linear time and constant extra space.

**Example**

```
Input: nums = [2,2,1]
Output: 1
```

Explanation: The two copies of `2` cancel under XOR, leaving `1`.

## Intuition

XOR is associative and commutative, `x ^ x == 0`, and `x ^ 0 == x`. Folding the array with
XOR therefore cancels every duplicate pair regardless of order. Only the unpaired value
remains, without a hash table or sorting.

## Approach

1. Initialize `res = 0`, the identity value for XOR.
2. For each `n` in `nums`, update `res ^= n`.
3. Return `res`, which contains the only value without a matching copy.

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

After processing any prefix, `res` equals the XOR of exactly that prefix; this follows directly
by induction from the update. For the complete array, associativity and commutativity allow
equal values to be paired. Every pair contributes zero, and XOR with zero changes nothing, so
the final accumulator is exactly the single unpaired value.

**Complexity**

- **Time:** `O(n)` for one pass through `nums`.
- **Space:** `O(1)` auxiliary space.
