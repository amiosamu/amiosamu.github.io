---
# Longest Increasing Subsequence · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/longest-increasing-subsequence/
draft: false
pattern: "LIS starting at each index"
time: "O(n^2)"
space: "O(n)"
---

## Description

Given an integer array, return the length of its longest strictly increasing subsequence.
Selected elements retain their relative order but do not need to be contiguous.

**Example**

```
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
```

For example, `[2,3,7,101]` is a strictly increasing subsequence of maximum length `4`.

## Intuition

Once `nums[i]` is chosen as the first value, the next value may be any larger element at a later
index. The best continuation from each such index is another instance of the same problem. A
right-to-left dynamic program computes these continuations before they are needed.

## Approach

1. Define `dp[i]` as the longest increasing subsequence that starts at index `i`.
2. Initialize every state to one because a single element is a valid subsequence.
3. Process `i` from right to left and inspect every later index `j`.
4. When `nums[j] > nums[i]`, update `dp[i]` with `1 + dp[j]`. The strict comparison excludes
   equal values.
5. Return `max(dp)` because the optimal subsequence may start anywhere. The input is guaranteed
   non-empty, so this maximum is defined.

## Code

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [1] * n

        for i in range(n - 1, -1, -1):
            for j in range(i + 1, n):
                if nums[i] < nums[j]:
                    dp[i] = max(dp[i], 1 + dp[j])

        return max(dp)
```

## Why it works

For a fixed starting index `i`, any longer valid subsequence chooses a next index `j > i` with
`nums[j] > nums[i]`; its best possible remaining length is `dp[j]`. Conversely, prefixing
`nums[i]` to any such continuation is valid. The recurrence therefore considers every valid next
choice and returns the exact optimum for `i`. Right-to-left evaluation makes those continuation
states final, and the maximum over all starts covers every increasing subsequence.

**Complexity**

- **Time:** `O(n^2)` for all pairs `i < j`.
- **Space:** `O(n)` for the dynamic-programming array.
