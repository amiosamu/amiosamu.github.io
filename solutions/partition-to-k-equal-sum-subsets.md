---
# Partition to K Equal Sum Subsets · Medium · Backtracking
# https://leetcode.com/problems/partition-to-k-equal-sum-subsets/
draft: false
pattern: "Backtracking numbers into k sorted buckets"
time: "O(k^n)"
space: "O(n + k)"
---

## Description

Given an integer array `nums` and an integer `k`, determine whether the array can be divided into `k` non-empty subsets with equal sums, using every element exactly once.

**Example**

```
Input: nums = [4,3,2,3,5,2,1], k = 4
Output: true
```

Explanation: The elements sum to 20, so each subset must total 5; one valid split is {5}, {1,4}, {2,3}, {2,3}, four subsets each summing to 5.

## Intuition

This generalizes Matchsticks to Square from 4 fixed buckets to `k`: I need `k` groups each summing to `total / k`, and only the multiset of values in a bucket matters, not their order. Sorting descending lets the largest numbers commit or fail first, and treating all-empty buckets as interchangeable kills the redundant branches where a number gets tried against several buckets that are all still at 0.

## Approach

1. Compute `total = sum(nums)`. If `total % k != 0`, return `False` — the sum can't split evenly into `k` equal parts.
2. Set `target = total // k`. Sort `nums` descending; if `nums[0] > target`, the largest number alone can't fit in any bucket, so return `False`.
3. Keep a length-`k` list `buckets`, all zeros — the running sum currently assigned to each bucket.
4. `backtrack(i)`: if `i == len(nums)`, every number has been placed without any bucket exceeding `target`, and since the total divides evenly, all `k` buckets must equal `target` — return `True`.
5. Otherwise try each bucket index `j` in `0..k-1`: if `buckets[j] + nums[i] <= target`, add `nums[i]` to `buckets[j]` and recurse on `i + 1`.
6. Propagate `True` immediately on success; otherwise remove `nums[i]` from `buckets[j]` before moving to the next `j`.
7. Prune duplicate empty buckets: after handling bucket `j`, if `buckets[j] == 0`, stop — every other still-empty bucket would behave identically for this number.
8. If no bucket accepts `nums[i]`, return `False`.
9. Return `backtrack(0)`.

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

The recursion assigns every number to some bucket that doesn't overflow `target`, covering every way to distribute `nums` into `k` bounded groups, and once all numbers are placed, the bucket sums must hit `target` exactly since they can't exceed it and their total is fixed at `k * target`. Skipping repeat trials against empty buckets is safe because those buckets are indistinguishable before anything is placed in them, so it only cuts symmetric duplicate work, never a correct assignment. Branching over `k` buckets for each of the `n` numbers gives the O(k^n) time bound, with O(n) recursion depth plus the O(k) `buckets` array as auxiliary space.
