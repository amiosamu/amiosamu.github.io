---
# Maximum Product Subarray · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/maximum-product-subarray/
draft: false
pattern: "Track running max and min product"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array that may contain negative values and zeros, return the largest product of
any non-empty contiguous subarray.

**Example**

```
Input: nums = [2,3,-2,4]
Output: 6
```

The subarray `[2,3]` has product 6, which is larger than every other contiguous product.

## Intuition

A negative value can turn the smallest product into the largest product. Therefore, each index
needs both the maximum and minimum products of subarrays ending there.

For the current value, either start a new subarray or extend one of the previous extremes. This
also handles zero naturally because starting at the next value remains an available choice.

## Approach

1. Initialize `res` to the largest single element and both running products to `1`.
2. For each `n`, save `curMax * n` before overwriting `curMax`.
3. Set the new maximum and minimum from `n`, `old curMax * n`, and `old curMin * n`.
4. Update `res` with `curMax`; zeros reset both ending products to zero without special handling.

## Code

```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = max(nums)
        curMax, curMin = 1, 1

        for n in nums:
            cand = curMax * n
            curMax = max(cand, curMin * n, n)
            curMin = min(cand, curMin * n, n)
            res = max(res, curMax)

        return res
```

## Why it works

After processing index `i`, `curMax` and `curMin` are the extreme products among all subarrays
ending at `i`. The base case follows from allowing the first value to start a subarray. For the
inductive step, every ending subarray is either `nums[i]` alone or a previous ending subarray
multiplied by `nums[i]`. Multiplication preserves or reverses order according to the sign, so only
the previous two extremes can produce the new extremes. Every subarray is considered at its final
index, making `res` the global maximum.

**Complexity**

- **Time:** `O(n)` for one pass through `nums`.
- **Space:** `O(1)` auxiliary space.
