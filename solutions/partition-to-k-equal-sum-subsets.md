---
# Partition to K Equal Sum Subsets · Medium · Backtracking
# https://leetcode.com/problems/partition-to-k-equal-sum-subsets/
draft: false
pattern: "Backtracking numbers into k sorted buckets"
time: "O(k^n)"
space: "O(n + k)"
---

## Description

Given an integer array `nums` and an integer `k`, determine whether all elements can be divided
into `k` non-empty subsets with equal sums.

**Example**

```
Input: nums = [4,3,2,3,5,2,1], k = 4
Output: true
```

Explanation: One valid split is `{5}`, `{1, 4}`, `{2, 3}`, and `{2, 3}`; each sums to `5`.

## Intuition

Each subset must sum to `sum(nums) / k`. Assign numbers to `k` bucket sums without allowing any
bucket to exceed that target. Sorting numbers from largest to smallest exposes impossible choices
early. Empty buckets are interchangeable, so after a failed placement into one empty bucket there
is no reason to try the same number in another.

## Approach

1. Reject totals not divisible by `k`; otherwise compute the common `target`.
2. Sort `nums` in place from largest to smallest and reject a largest value above `target`.
3. In `backtrack(i)`, try `nums[i]` in each bucket that would not exceed `target`.
4. Recurse after adding the value, then subtract it on failure to restore the bucket state.
5. Stop after a failed empty bucket because all other empty buckets are symmetric. When every
   number is placed, return `True`; the fixed total forces every bucket to equal `target`.

## Code

```python
class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k != 0:
            return False
        target = total // k

        nums.sort(reverse=True)
        if nums[0] > target:
            return False

        buckets = [0] * k

        def backtrack(i: int) -> bool:
            if i == len(nums):
                return True
            for j in range(k):
                if buckets[j] + nums[i] <= target:
                    buckets[j] += nums[i]
                    if backtrack(i + 1):
                        return True
                    buckets[j] -= nums[i]
                if buckets[j] == 0:
                    break
            return False

        return backtrack(0)
```

## Why it works

Without pruning, the recursion tries every assignment of each number to one of `k` buckets, while
rejecting only assignments that exceed `target`. Restoring a bucket after a failed branch keeps
these assignments independent. Empty-bucket pruning removes only permutations of bucket labels,
not distinct partitions. If all numbers are placed, all bucket sums are at most `target` and sum
to `k * target`, so each must equal `target`; conversely, any valid partition appears in the
search. The returned result is therefore exact.

**Complexity**

- **Time:** `O(k^n)` in the worst case for `n = len(nums)`.
- **Space:** `O(n + k)` auxiliary space for recursion and bucket sums. Sorting mutates `nums`.
