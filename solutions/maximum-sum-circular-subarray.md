---
# Maximum Sum Circular Subarray · Medium · Greedy
# https://leetcode.com/problems/maximum-sum-circular-subarray/
draft: false
pattern: "Kadane max and min, total minus min"
time: "O(n)"
space: "O(1)"
---

## Description

Given a circular integer array `nums` (the element after the last one wraps around to the
first), returns the maximum possible sum of a non-empty contiguous subarray, where the
subarray is allowed to wrap from the end of the array back to the start.

**Example**

```
Input: nums = [1,-2,3,-2]
Output: 3
```

Explanation: the subarray `[3]` alone has sum 3, and no wrapping subarray does better here
since wrapping would have to include the negative elements around it.

## Intuition

A circular subarray is one of exactly two shapes: it does not wrap, in which case plain Kadane
finds it, or it wraps, in which case the elements it *leaves out* form a single ordinary
non-wrapping block. So a wrapping answer equals `total - (sum of some non-wrapping block)`, and to
maximise it I want that removed block as small as possible — a second Kadane run for the minimum
subarray. Answer is the better of the two, with one trap: when every number is negative the minimum
subarray is the whole array, `total - minSum` comes out 0, and 0 means "take nothing", which the
problem forbids. Detecting that is just `maxSum < 0`.

## Approach

1. Compute `total = sum(nums)` once.
2. Run both Kadanes in the same loop. Seed `curMax = maxSum = nums[0]` and
   `curMin = minSum = nums[0]`, then iterate `nums[1:]` as `n`.
3. `curMax = max(n, curMax + n)`, then `maxSum = max(maxSum, curMax)` — best non-wrapping subarray.
4. `curMin = min(n, curMin + n)`, then `minSum = min(minSum, curMin)` — smallest non-wrapping
   subarray, the block a wrapping answer would exclude.
5. Guard the all-negative case first: `if maxSum < 0: return maxSum`. Every element being negative
   is exactly when `maxSum` (which is the largest single element at worst) is negative, and then the
   wrapping candidate is a bogus empty subarray.
6. Otherwise return `max(maxSum, total - minSum)`.
7. Both the excluded block and the wrapping subarray are automatically non-empty here, since
   `maxSum >= 0` guarantees at least one non-negative element that `minSum` will not have swallowed.

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

The case split is exhaustive and the two cases are handled exactly: a non-wrapping candidate is
maximised by Kadane, and the wrapping candidates are in bijection with the non-wrapping blocks they
omit, so maximising `total - block` is the same as minimising `block` — no wrapping subarray is
missed and none is over-counted. The `maxSum < 0` guard is the only place the bijection leaks: it
allows the omitted block to be all of `nums`, whose complement is empty, and that is precisely the
all-negative input, where the true answer is the largest element, i.e. `maxSum`. Both Kadanes share
one O(n) pass over four scalars, so O(n) time and O(1) space.
