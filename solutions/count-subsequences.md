---
# Distinct Subsequences · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/distinct-subsequences/
draft: false
pattern: "2D counting DP over prefix pairs"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given two strings `s` and `t`, return the number of distinct ways `t` can be produced by
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

For each pair of prefixes, classify matches by whether they use the source prefix's final
character. Skipping it preserves every match from the shorter source prefix. If it equals the
target prefix's final character, using it extends every match of both shorter prefixes.

## Approach

1. Let `dp[i][j]` count ways that `s[:i]` contains `t[:j]` as a subsequence.
2. Set `dp[i][0] = 1` for every `i`, since deleting the entire source is the one way to form
   an empty target. Other cells in row zero remain zero.
3. For each nonempty prefix pair, begin with `dp[i - 1][j]`, the matches that skip `s[i - 1]`.
4. If `s[i - 1] == t[j - 1]`, add `dp[i - 1][j - 1]` for matches that use this source
   character. Return `dp[m][n]`.

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

Assume the table is correct for shorter source prefixes. Every match of `t[:j]` in `s[:i]`
either skips `s[i - 1]`, counted by `dp[i - 1][j]`, or uses it. The second case exists only
when the final characters match and is then counted by `dp[i - 1][j - 1]`. The cases are
disjoint and exhaustive, so induction over `i` and `j` proves the returned count.

**Complexity**

- **Time:** `O(m * n)`.
- **Space:** `O(m * n)` for the table.
