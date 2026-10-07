---
# Interleaving String · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/interleaving-string/
draft: false
pattern: "2D DP merging two prefixes"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given strings `s1`, `s2`, and `s3`, return whether `s3` can be formed by interleaving all
characters of `s1` and `s2` while preserving each source string's order.

**Example**

```
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
```

Explanation: Reading `s3` left to right can consume every character from `s1` and `s2` in
their original relative orders.

## Intuition

If `s3[:i+j]` interleaves `s1[:i]` and `s2[:j]`, its last character comes from either
`s1[i-1]` or `s2[j-1]`. Removing that character must leave a valid interleaving of the
corresponding shorter prefixes.

This gives a boolean DP state for every pair of consumed prefix lengths. A total-length
mismatch can be rejected before allocating the table.

## Approach

1. Return `False` unless `len(s1) + len(s2) == len(s3)`.
2. Define `dp[i][j]` to mean that `s3[:i+j]` interleaves `s1[:i]` and `s2[:j]`, and
   initialize `dp[0][0] = True`.
3. Fill the first column and row by matching prefixes composed entirely from one source.
4. For each remaining cell, accept a matching final character from `s1` when
   `dp[i-1][j]` is true, or from `s2` when `dp[i][j-1]` is true.
5. Return `dp[m][n]`. Empty source strings are handled by the initialized row or column.

## Code

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True
        for i in range(1, m + 1):
            dp[i][0] = dp[i - 1][0] and s1[i - 1] == s3[i - 1]
        for j in range(1, n + 1):
            dp[0][j] = dp[0][j - 1] and s2[j - 1] == s3[j - 1]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                dp[i][j] = (dp[i - 1][j] and s1[i - 1] == s3[i + j - 1]) or \
                           (dp[i][j - 1] and s2[j - 1] == s3[i + j - 1])
        return dp[m][n]
```

## Why it works

The base state correctly represents three empty prefixes. For any other state, the last
character of the target prefix must come from the last consumed character of one source.
The recurrence checks both exhaustive possibilities and requires the preceding prefixes to
be valid. By induction on `i + j`, every true state describes an interleaving and every
possible interleaving makes one branch true. Therefore `dp[m][n]` answers the full problem.

**Complexity**

- **Time:** `O(mn)`, where `m = len(s1)` and `n = len(s2)`.
- **Space:** `O(mn)` for the DP table.
