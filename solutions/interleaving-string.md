---
# Interleaving String · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/interleaving-string/
draft: false
pattern: "2D DP merging two prefixes"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given three strings `s1`, `s2`, and `s3`, determines whether `s3` can be formed by
interleaving all characters of `s1` and `s2` while preserving each string's own internal
character order.

**Example**

```
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
```

Explanation: reading `s3` left to right, each character matches the next unused character of
either `s1` or `s2`, so all of `s1` and `s2` are consumed exactly once with their internal
order preserved.

## Intuition

`s3[:i+j]` can only be an interleaving of `s1[:i]` and `s2[:j]` if its last character came from the end of `s1` or the end of `s2` — and whichever it came from, everything before it must already be a valid interleaving of the shorter prefixes. That recursive split on "where did the last character come from" is exactly a 2D boolean DP over `(i, j)`.

## Approach

1. If `len(s1) + len(s2) != len(s3)`, return `False` immediately — the lengths can't line up.
2. Let `m, n = len(s1), len(s2)`. `dp[i][j]` = True if `s3[:i+j]` is an interleaving of `s1[:i]` and `s2[:j]`.
3. Base case: `dp[0][0] = True`.
4. First column: `dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]` (s3 built purely from `s1` so far).
5. First row: `dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]` (s3 built purely from `s2` so far).
6. For `i` from 1 to `m`, `j` from 1 to `n`: `dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or (dp[i][j-1] and s2[j-1] == s3[i+j-1])` — the last character of `s3[:i+j]` either extends a valid interleaving that used `s1` up through `i-1`, or one that used `s2` up through `j-1`.
7. Return `dp[m][n]`.

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

Every character of `s3` is consumed exactly once, from either `s1` or `s2`, so the character at position `i+j-1` must be the one just consumed from `s1[i-1]` or `s2[j-1]` — the OR over those two cases is exhaustive, and each case reduces to a smaller, already-solved `(i, j)` pair. The table has `(m+1)(n+1)` cells each computed in O(1), giving O(m*n) time and space.
