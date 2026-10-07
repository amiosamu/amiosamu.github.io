---
# Edit Distance · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/edit-distance/
draft: false
pattern: "2D DP over insert/delete/replace"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given `word1` and `word2`, return the minimum number of single-character insertions,
deletions, and replacements needed to transform `word1` into `word2`.

**Example**

```
Input: word1 = "horse", word2 = "ros"
Output: 3
```

Replace `h` with `r`, then delete the second `r` and the final `e`.

## Intuition

Consider the final characters of two prefixes. If they match, no new edit is needed. If
they differ, the final edit must replace the source character, delete it, or insert the
target character. Each choice leaves a smaller prefix problem, forming a two-dimensional
dynamic program.

## Approach

1. Let `dp[i][j]` be the edit distance from `word1[:i]` to `word2[:j]`.
2. Initialize `dp[i][0] = i` for deletions and `dp[0][j] = j` for insertions.
3. For matching final characters, copy `dp[i - 1][j - 1]`.
4. Otherwise add one to the minimum of replacement `dp[i - 1][j - 1]`, deletion
   `dp[i - 1][j]`, and insertion `dp[i][j - 1]`.
5. Return `dp[m][n]` after filling the table in row order. The initialized row and column
   also handle either input being empty.

## Code

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]
```

## Why it works

Induct on `i + j`. The empty-prefix rows and columns are optimal because every character
must be inserted or deleted. For non-empty prefixes with equal final characters, an
optimal transformation can leave them matched and use the optimal smaller diagonal
problem. Otherwise its final edit is exactly a replacement, deletion, or insertion.
Removing that edit leaves the corresponding smaller subproblem. One plus their minimum is
therefore achievable and no greater than the cost of any valid transformation.

**Complexity**

- **Time:** `O(m * n)` for the DP table.
- **Space:** `O(m * n)` for the DP table.
