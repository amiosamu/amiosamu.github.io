---
# Longest Common Subsequence · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/longest-common-subsequence/
draft: false
pattern: "Two-pointer suffix DP on strings"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given two strings, find the length of their longest common subsequence — a sequence of
characters that appears in both strings in the same relative order, though not necessarily
contiguously. Return 0 if the two strings share no characters in common order.

**Example**

```
Input: text1 = "abcde", text2 = "ace"
Output: 3
```

Explanation: `"ace"` is a subsequence of both `"abcde"` and `"ace"` itself, and no common
subsequence longer than 3 exists.

## Intuition

Brute force compares all `2^m` subsequences of `text1` against `text2`. The insight that kills
it: walk both strings with a pointer each and look only at the current pair of characters. If
they match, pairing them is never worse than not pairing them, so take the match and advance
both. If they do not, at least one of the two characters can never be used again, so branch on
which one to discard. That leaves only `m * n` pointer positions, each with a fixed answer.

## Approach

1. `dp[i][j]` is the length of the longest common subsequence of the suffixes `text1[i:]` and
   `text2[j:]`, considering only those suffixes — the characters already consumed are
   irrelevant.
2. Recurrence, two cases:
   - `text1[i] == text2[j]`: pair them and recurse on both suffixes,
     `dp[i][j] = 1 + dp[i+1][j+1]`.
   - otherwise: the two characters cannot both be part of the same aligned pair, so one of them
     is dropped, `dp[i][j] = max(dp[i+1][j], dp[i][j+1])`.
3. Base cases: the padding row and column. `dp[m][j] = 0` for all `j` and `dp[i][n] = 0` for
   all `i` — an empty suffix shares nothing. Allocating `dp` as `(m+1) x (n+1)` zeros gives
   both for free and makes `dp[i+1][j+1]` always in range.
4. Iterate `i` from `m - 1` down to `0` and `j` from `n - 1` down to `0`. Every read is at a
   strictly larger `i` or `j`, so **both loops must descend**; ascending would read cells that
   are still zero.
5. Return `dp[0][0]`, the LCS of the two full strings.
6. If space matters, note each row only reads the row below plus one cell to its right, so two
   arrays of length `n + 1` suffice for `O(n)` space. The full table is kept here because it is
   what you would reconstruct the actual subsequence from.

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

Matching on equality is safe by an exchange argument: if some optimal LCS of the two suffixes
does not pair `text1[i]` with `text2[j]` when they are equal, the first character it does use
from each can be swapped for this pair without shortening it. When the characters differ, no
common subsequence can use both as its next character, so discarding one of them loses nothing
and the two branches cover every possibility. The subproblems depend only on the pair of
suffix start indices — not on which characters were matched earlier — so `m * n` states with
`O(1)` work each give `O(m * n)` time and `O(m * n)` space.
