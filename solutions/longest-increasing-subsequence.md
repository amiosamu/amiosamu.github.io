---
# Longest Increasing Subsequence · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/longest-increasing-subsequence/
draft: false
pattern: "LIS starting at each index"
time: "O(n^2)"
space: "O(n)"
---

## Intuition

Brute force tries all `2^n` subsequences. The observation that collapses it: once I commit to
`nums[i]` being the first element of the subsequence, the rest of the choice depends only on
`i` — I need the longest increasing subsequence starting at some `j > i` with `nums[j] > nums[i]`.
That is `n` subproblems, each answered by scanning the indices to its right.

## Approach

1. Let `dp[i]` = the length of the longest strictly increasing subsequence that **starts at
   index `i`** (so `nums[i]` is always included, and every `dp[i] >= 1`).
2. Base case: initialize `dp = [1] * n`. An index with nothing larger to its right is a
   subsequence of length 1 on its own.
3. Recurrence: `dp[i] = max(1, max(1 + dp[j] for j > i if nums[j] > nums[i]))`.
4. Iteration order: `i` from `n - 1` down to `0`, and for each `i` an inner loop `j` from
   `i + 1` to `n - 1`. Going right to left guarantees `dp[j]` is final before it is read.
5. Use a strict `<` comparison (`nums[i] < nums[j]`) — the problem wants strictly increasing,
   so equal values must not chain.
6. Return `max(dp)`, not `dp[0]`: the best subsequence can start anywhere.
7. If asked to beat `O(n^2)`: keep a `tails` list where `tails[L]` is the smallest possible tail
   of an increasing subsequence of length `L + 1`, and for each `x` use `bisect_left` to replace
   the first element `>= x` (append if none). `tails` stays sorted, its length is the answer,
   and the whole thing is `O(n log n)`.

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

Every increasing subsequence has a unique first index `i`, and after fixing it the remainder is
itself an increasing subsequence starting at some later index with a strictly larger value — so
the recurrence partitions the search space rather than double-counting it, and taking the max
over `i` covers all of them. The right-to-left sweep respects the dependency `dp[i] -> dp[j>i]`.
Filling `n` cells with an `O(n)` scan each gives `O(n^2)` time and `O(n)` space.
