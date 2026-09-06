---
# Regular Expression Matching · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/regular-expression-matching/
draft: false
pattern: "2D DP over pattern/text prefixes"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an input string `s` and a pattern `p` containing `.` (matches any single character) and
`*` (matches zero or more occurrences of the preceding element), determines whether `p`
matches the entire string `s`.

**Example**

```
Input: s = "aa", p = "a"
Output: false
```

Explanation: the pattern `"a"` has no `*` and can only match a single character, but `s` has
two, so the whole string cannot be matched.

## Intuition

Backtracking on a `*` branch — try using it zero more times, or one more time — re-explores the same `(i, j)` prefix pair over and over, so memoizing "does `s[:i]` match `p[:j]`" turns it into a grid DP. Only two pattern constructs matter: a literal or `.` that must consume exactly one character, and a `*` quantifier whose count is resolved entirely by looking one column back in the pattern.

## Approach

1. Let `m, n = len(s), len(p)`. `dp[i][j]` = True if `s[:i]` matches `p[:j]`.
2. Base case: `dp[0][0] = True` (empty matches empty).
3. Fill `dp[0][j]` for `j` from 1 to `n`: only possible if `p[j-1] == '*'` and `dp[0][j-2]` is True (the preceding element is used zero times).
4. For `i` from 1 to `m`, `j` from 1 to `n`:
5. If `p[j-1] == '*'`: `dp[i][j] = dp[i][j-2]` (use "x*" zero times) OR, when `p[j-2] == '.'` or `p[j-2] == s[i-1]` (the starred element can absorb the current text character), also OR in `dp[i-1][j]` (consume one more text character while keeping "x*" available).
6. Else (a plain literal or `.`): `dp[i][j] = dp[i-1][j-1]` if `p[j-1] == '.'` or `p[j-1] == s[i-1]`, else `False`.
7. Return `dp[m][n]`.

## Code

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True
        for j in range(1, n + 1):
            if p[j - 1] == '*' and j >= 2:
                dp[0][j] = dp[0][j - 2]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 2]
                    if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                        dp[i][j] = dp[i][j] or dp[i - 1][j]
                else:
                    if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                        dp[i][j] = dp[i - 1][j - 1]
        return dp[m][n]
```

## Why it works

`dp[i][j]` enumerates the only two ways a pattern column can be consumed — a plain character matched one-for-one, or a `*` quantifier whose occurrence count is decided by trying "zero more" (fall back to `dp[i][j-2]`) versus "one more" (fall back to `dp[i-1][j]`) — and both fallbacks point at strictly smaller subproblems, so filling the table in row-major order is safe and covers every match. Each of the O(m*n) cells does O(1) work.
