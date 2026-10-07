---
# Subarray Sum Equals K · Medium · Arrays & Hashing
# https://leetcode.com/problems/subarray-sum-equals-k/
draft: false
pattern: "Prefix sums counted in a hash map"
time: "O(n)"
space: "O(n)"
---

## Description

Given integer array `nums` and integer `k`, return the number of contiguous subarrays whose sum
is exactly `k`. Values may be negative, zero, or duplicated.

**Example**

```
Input: nums = [1,1,1], k = 2
Output: 2
```

Explanation: `nums[0:2]` and `nums[1:3]` both sum to `2`.

## Intuition

If the prefix sum through the current index is `curSum`, a subarray ending there has sum `k`
exactly when its preceding prefix sum is `curSum - k`. A frequency map counts how many such
prefixes have already appeared. Counts, rather than a set, are necessary because equal prefix
sums at different positions define different subarrays. Negative values prevent a monotonic
sliding-window solution.

## Approach

1. Initialize `curSum = 0`, `res = 0`, and `prefixCount = {0: 1}` for the empty prefix.
2. For each value, update `curSum` and add the frequency of `curSum - k` to `res`.
3. Record the current prefix only after querying, preventing an empty subarray from being counted
   when `k == 0`.
4. Return `res`. The initial zero prefix allows subarrays beginning at index zero to count.

## Code

```python
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        curSum = 0
        res = 0
        prefixCount = {0: 1}

        for n in nums:
            curSum += n
            res += prefixCount.get(curSum - k, 0)
            prefixCount[curSum] = prefixCount.get(curSum, 0) + 1

        return res
```

## Why it works

Before processing an index, `prefixCount` contains exactly the frequencies of all prefixes ending
before it. After adding the current value, every stored prefix equal to `curSum - k` determines a
unique start position whose subarray ends here and sums to `k`. Conversely, every matching
subarray ending here has exactly such a preceding prefix, so all and only valid subarrays are
added. Recording the current prefix then restores the invariant for the next index.

**Complexity**

- **Time:** `O(n)` expected time with constant-time hash-map operations.
- **Space:** `O(n)` for distinct prefix sums.
