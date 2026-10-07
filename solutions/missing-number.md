---
# Missing Number · Easy · Bit Manipulation
# https://leetcode.com/problems/missing-number/
draft: false
pattern: "XOR indices against values"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums` containing `n` distinct numbers drawn from the range `[0, n]`, return
the one number in that range that is missing from `nums`.

**Example**

```
Input: nums = [3,0,1]
Output: 2
```

Explanation: The range is `[0, 3]`; `0`, `1`, and `3` are present, so `2` is missing.

## Intuition

XOR cancels equal values because `v ^ v == 0`. The indices supply every number from `0` through
`n - 1`, and an initial seed supplies `n`. XORing that complete range with all array values pairs
every present number, leaving only the missing one. This avoids a set and does not mutate `nums`.

## Approach

1. Initialize `res = len(nums)` to include `n`, which is not produced by `enumerate`.
2. For each `(i, num)`, update `res ^= i ^ num`.
3. Return the uncancelled value in `res`. Sorting is unnecessary.

## Code

```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        res = len(nums)
        for i, num in enumerate(nums):
            res ^= i ^ num
        return res
```

## Why it works

The seed and indices contain each number in `[0, n]` exactly once. The array contains each number
in that range except the missing number exactly once. Since XOR is associative and commutative,
the terms can be paired by value. Every present value cancels with its matching range value, while
the missing value has no partner and remains in `res`.

**Complexity**

- **Time:** `O(n)` for one pass through `nums`.
- **Space:** `O(1)` auxiliary space.
