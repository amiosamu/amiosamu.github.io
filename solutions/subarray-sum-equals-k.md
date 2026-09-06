---
# Subarray Sum Equals K · Medium · Arrays & Hashing
# https://leetcode.com/problems/subarray-sum-equals-k/
draft: false
pattern: "Prefix sums counted in a hash map"
time: "O(n)"
space: "O(n)"
---

## Description

Given an integer array `nums` and an integer `k`, return the number of contiguous subarrays whose elements sum to exactly `k`. `nums` may contain negative numbers, zero, and duplicates.

**Example**

```
Input: nums = [1,1,1], k = 2
Output: 2
```

Explanation: The subarray `nums[0:2]` (`[1,1]`) and the subarray `nums[1:3]` (`[1,1]`) each sum to 2, giving two matching subarrays.

## Intuition

The sum of `nums[i..j]` is `prefix[j] - prefix[i - 1]`, so asking "which subarrays ending at `j` sum to `k`" is the same as asking "how many earlier prefix sums equal `curSum - k`". That turns an O(n²) double loop into one pass with a frequency map of prefix sums seen so far. Note that a sliding window is *not* available here — `nums` may contain negatives, so the running sum isn't monotonic and shrinking from the left doesn't reliably reduce it.

## Approach

1. Keep `curSum = 0`, `res = 0`, and `prefixCount`, a map from a prefix sum to how many times it has occurred.
2. Seed it with `{0: 1}`. That entry represents the empty prefix and is what lets a subarray starting at index 0 be counted.
3. For each `n` in `nums`, add it to `curSum` first, so `curSum` is the prefix sum through the current index.
4. Add `prefixCount.get(curSum - k, 0)` to `res` — every earlier prefix with that sum marks a subarray ending here that totals `k`.
5. Then record the current prefix: `prefixCount[curSum] = prefixCount.get(curSum, 0) + 1`.
6. The order of steps 4 and 5 matters when `k == 0`: querying before inserting prevents a zero-length subarray from being counted.
7. Return `res`.

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

Every subarray is uniquely identified by its (start, end) pair, and the map keeps *counts* rather than a set of prefix sums, so repeated prefix values each contribute their own subarray — that is what makes the tally exact rather than a distinct-count. When index `j` is processed, `prefixCount` holds exactly the prefixes ending strictly before `j`'s subarray start, so every counted pair is a genuine subarray and every genuine one is counted at its right endpoint. One pass with O(1) hash operations gives O(n) time; the map can hold up to one entry per index, O(n) space.
