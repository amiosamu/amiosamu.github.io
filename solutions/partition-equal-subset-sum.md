---
# Partition Equal Subset Sum · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/partition-equal-subset-sum/
draft: false
pattern: "0/1 knapsack on reachable sums"
time: "O(n * S)"
space: "O(S)"
---

## Description

Given an array of positive integers, determine whether it can be split into two subsets whose
elements sum to the same value. Every element must be used in exactly one of the two subsets.

**Example**

```
Input: nums = [1,5,11,5]
Output: true
```

Explanation: `[1, 5, 5]` and `[11]` both sum to `11`.

## Intuition

An equal partition exists exactly when one subset sums to half of the total; all remaining values
then form the other half. An odd total is impossible. For an even total, track which sums up to
`target` are reachable, processing each number once as a 0/1 knapsack item.

## Approach

1. Compute `total`; return `False` if it is odd, and set `target = total // 2` otherwise.
2. Let `dp[t]` mean that a subset of processed values sums to `t`. Initialize only `dp[0]` true.
3. For each number `n`, scan `t` downward from `target` to `n` and set
   `dp[t] = dp[t] or dp[t - n]`.
4. Scanning downward prevents the current number from being reused in the same iteration.
5. Return early when `target` becomes reachable; otherwise return `dp[target]` at the end.

## Code

```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False

        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True

        for n in nums:
            for t in range(target, n - 1, -1):
                dp[t] = dp[t] or dp[t - n]
            if dp[target]:
                return True

        return dp[target]
```

## Why it works

After processing a prefix of `nums`, `dp[t]` is true exactly for sums achievable from that prefix.
For a new number `n`, an achievable sum either excludes it and keeps the old `dp[t]`, or includes
it on top of an old sum `t - n`. The descending scan ensures that `dp[t - n]` still describes the
previous prefix, so each array element is used at most once. By induction, reaching `target`
corresponds to a real subset whose complement has the same sum, and every such subset is detected.

**Complexity**

- **Time:** `O(n * S)`, where `S = sum(nums) // 2`.
- **Space:** `O(S)` auxiliary space.
