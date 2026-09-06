---
# Distinct Subsequences · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/distinct-subsequences/
draft: false
pattern: "2D counting DP over prefix pairs"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given two strings `s` and `t`, returns the number of distinct ways `t` can be produced by
deleting some (possibly zero) characters from `s`, without reordering the characters that
remain.

**Example**

```
Input: s = "rabbbit", t = "rabbit"
Output: 3
```

Explanation: `s` has three `b`s in a row while `t` needs only two, so there are 3 ways to
choose which single `b` to delete, each leaving `rabbit`.

## Intuition

Brute force would enumerate every subset of positions in `s` and check if it spells `t` — exponential. Instead, count for each prefix of `s` and prefix of `t` how many ways the `s`-prefix can produce the `t`-prefix as a subsequence: each character of `s` either gets skipped entirely, or — if it matches the current character of `t` — gets used to extend a match built from one-shorter prefixes of both strings.

## Approach

1. Let `m = len(s)`, `n = len(t)`. `dp[i][j]` = number of ways `s[:i]` contains `t[:j]` as a subsequence.
2. Base case: `dp[i][0] = 1` for every `i` — the empty target is matched exactly once, by using none of `s`.
3. Base case: `dp[0][j] = 0` for `j > 0` — a non-empty target can't come from an empty source.
4. For `i` from 1 to `m`, `j` from 1 to `n`: start with `dp[i][j] = dp[i-1][j]` (don't use `s[i-1]` at all).
5. If `s[i-1] == t[j-1]`, add `dp[i-1][j-1]` (use `s[i-1]` to match `t[j-1]`, delegating the rest to the shorter prefixes).
6. Return `dp[m][n]`.

## Code

```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = 1
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                dp[i][j] = dp[i - 1][j]
                if s[i - 1] == t[j - 1]:
                    dp[i][j] += dp[i - 1][j - 1]
        return dp[m][n]
```

## Why it works

`dp[i][j]` partitions every way of matching `t[:j]` inside `s[:i]` by whether the last character of `s[:i]` participates in that match — those two cases are disjoint and exhaustive, so summing them counts every distinct subsequence exactly once with no double counting. Each cell only reads the row above and one diagonal cell, so filling row by row costs O(m*n) time and the table takes O(m*n) space.
