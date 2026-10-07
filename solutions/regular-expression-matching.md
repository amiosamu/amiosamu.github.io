---
# Regular Expression Matching · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/regular-expression-matching/
draft: false
pattern: "2D DP over pattern/text prefixes"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given a string `s` and pattern `p`, determine whether the pattern matches the entire string.
`.` matches any single character, and `*` matches zero or more copies of the preceding element.

**Example**

```
Input: s = "aa", p = "a"
Output: false
```

Explanation: The pattern consumes one `a`, but a full match must consume both characters.

## Intuition

Naive backtracking revisits the same text and pattern prefixes whenever `*` can consume different
numbers of characters. A dynamic-programming state can record whether `s[:i]` matches `p[:j]`.
A literal or `.` consumes one character from each prefix. A starred element either consumes zero
characters or consumes one matching character while remaining available.

## Approach

1. Define `dp[i][j]` to mean that `s[:i]` matches `p[:j]`, and set `dp[0][0] = True`.
2. Initialize the empty-text row. A pattern prefix can match empty only when its final `x*`
   is omitted and the preceding pattern prefix also matches empty.
3. For a literal or `.`, set `dp[i][j]` from `dp[i - 1][j - 1]` only when the final
   characters match.
4. For `*`, first omit the preceding element with `dp[i][j - 2]`. If that element matches
   `s[i - 1]`, also allow `dp[i - 1][j]`, consuming one occurrence while retaining `x*`.
5. Return `dp[m][n]`. The code assumes the problem's valid-pattern constraint, so every `*`
   has a preceding element.

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

We prove each state by considering the final pattern construct. If it is a literal or `.`, a match
exists exactly when the final text character matches and the two shorter prefixes match. If it is
`x*`, every match either uses zero copies of `x`, represented by `dp[i][j - 2]`, or at least one
copy. In the latter case the final text character must match `x`, and removing that character
leaves `dp[i - 1][j]`. These cases are exhaustive and the table evaluates their smaller states
first, so `dp[m][n]` is correct.

**Complexity**

- **Time:** `O(m * n)` for the `m + 1` by `n + 1` table.
- **Space:** `O(m * n)` for the table.
