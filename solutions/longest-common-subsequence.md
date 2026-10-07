---
# Longest Common Subsequence · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/longest-common-subsequence/
draft: false
pattern: "Two-pointer suffix DP on strings"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given two strings, return the length of their longest common subsequence. A subsequence keeps
relative character order but need not use contiguous positions.

**Example**

```
Input: text1 = "abcde", text2 = "ace"
Output: 3
```

`"ace"` appears in both strings in order and has length `3`.

## Intuition

For suffixes beginning at `i` and `j`, equal leading characters can be matched and both pointers
advanced. If they differ, at least one leading character is absent from an optimal first match, so
try discarding either one. Only the pair of suffix positions matters, yielding `m * n` states.

## Approach

1. Define `dp[i][j]` as the LCS length of `text1[i:]` and `text2[j:]`.
2. Add a zero row and column for states where either suffix is empty.
3. For equal characters, set `dp[i][j] = 1 + dp[i + 1][j + 1]`.
4. Otherwise set `dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])`, discarding one leading character.
5. Fill both indices backward so dependencies are final, then return `dp[0][0]`.

## Code

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                if text1[i] == text2[j]:
                    dp[i][j] = 1 + dp[i + 1][j + 1]
                else:
                    dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])

        return dp[0][0]
```

## Why it works

Consider the two suffixes at `(i, j)`. If their first characters match, an optimal subsequence can
start with that character: replacing any later occurrence of the same first match with these
earlier positions leaves at least as much of both suffixes available. The remaining optimum is
therefore `dp[i + 1][j + 1]`. If the characters differ, no common subsequence can use both as its
first matched character, so every candidate omits at least one and is covered by the two recurrence
branches. Backward evaluation applies these exhaustive cases to every state.

**Complexity**

- **Time:** `O(m * n)` for string lengths `m` and `n`.
- **Space:** `O(m * n)` for the table.
