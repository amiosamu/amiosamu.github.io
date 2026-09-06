---
# Edit Distance · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/edit-distance/
draft: false
pattern: "2D DP over insert/delete/replace"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given two strings `word1` and `word2`, returns the minimum number of single-character insert,
delete, or replace operations needed to turn `word1` into `word2`.

**Example**

```
Input: word1 = "horse", word2 = "ros"
Output: 3
```

Explanation: `horse` -> `rorse` (replace `h` with `r`) -> `rose` (delete `r`) -> `ros`
(delete `e`), three operations in total.

## Intuition

The minimum number of operations to turn `word1[:i]` into `word2[:j]` only depends on three smaller prefix pairs, because whatever the *last* operation applied was — insert, delete, or replace/match — it reduces the problem to one of those three. That turns a search over edit sequences into a grid DP.

## Approach

1. Let `m, n = len(word1), len(word2)`. `dp[i][j]` = edit distance between `word1[:i]` and `word2[:j]`.
2. Base cases: `dp[i][0] = i` (delete all `i` characters of `word1`'s prefix), `dp[0][j] = j` (insert all `j` characters of `word2`'s prefix).
3. For `i` from 1 to `m`, `j` from 1 to `n`: if `word1[i-1] == word2[j-1]`, `dp[i][j] = dp[i-1][j-1]` — the characters already match, no operation spent.
4. Otherwise `dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])`, covering replace, delete from `word1`, and insert into `word1` respectively.
5. Return `dp[m][n]`.

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

Any sequence of edits turning `word1[:i]` into `word2[:j]` must end in one of exactly three moves — match/replace the last characters, delete `word1`'s last character, or insert `word2`'s last character — and each move reduces to a strictly smaller subproblem that's already computed, so taking the min over all three gives the true optimum. Filling the `(m+1) x (n+1)` table row by row costs O(m*n) time and the table itself is the only auxiliary space, O(m*n).
