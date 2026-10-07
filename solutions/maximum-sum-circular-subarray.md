---
# Maximum Sum Circular Subarray · Medium · Greedy
# https://leetcode.com/problems/maximum-sum-circular-subarray/
draft: false
pattern: "Kadane max and min, total minus min"
time: "O(n)"
space: "O(1)"
---

## Description

Given a circular integer array `nums`, return the maximum sum of a non-empty contiguous subarray.
The subarray may wrap from the array's end to its beginning.

**Example**

```
Input: nums = [1,-2,3,-2]
Output: 3
```

The single-element subarray `[3]` has sum 3, and no wrapping choice has a larger sum.

## Intuition

A circular subarray either does not wrap or wraps. Kadane's algorithm finds the best non-wrapping
sum. A wrapping subarray excludes one contiguous middle block, so its sum is `total - minSum`,
where `minSum` is the minimum non-wrapping subarray sum.

If every value is negative, excluding the whole array creates an invalid empty subarray. In that
case, the best non-wrapping sum, which is the largest element, is the answer.

## Approach

1. Compute `total` and initialize maximum- and minimum-ending Kadane states from `nums[0]`.
2. For each remaining value, update `curMax` and `maxSum` for non-wrapping maxima.
3. Update `curMin` and `minSum` for the contiguous block a wrapping result would exclude.
4. If `maxSum < 0`, return it to avoid selecting the empty complement of the entire array.
5. Otherwise return the larger of `maxSum` and `total - minSum`.

## Code

```python
class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        total = sum(nums)
        curMax = maxSum = nums[0]
        curMin = minSum = nums[0]

        for n in nums[1:]:
            curMax = max(n, curMax + n)
            maxSum = max(maxSum, curMax)
            curMin = min(n, curMin + n)
            minSum = min(minSum, curMin)

        if maxSum < 0:
            return maxSum

        return max(maxSum, total - minSum)
```

## Why it works

Kadane's recurrence proves by induction that `maxSum` and `minSum` are the extreme sums of all
ordinary subarrays. Every non-wrapping candidate is therefore bounded by `maxSum`. Every proper
wrapping subarray is the complement of a non-empty contiguous block, so maximizing it is equivalent
to minimizing the excluded block, yielding `total - minSum`. These cases are exhaustive. When all
values are negative, `minSum` may be the whole array and its complement is empty; the guard returns
the largest valid one-element sum instead.

**Complexity**

- **Time:** `O(n)` for the sum and Kadane pass.
- **Space:** `O(1)` auxiliary space.
