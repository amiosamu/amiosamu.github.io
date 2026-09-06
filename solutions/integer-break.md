---
# Integer Break · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/integer-break/
draft: false
pattern: "Bottom-up DP over the first split"
time: "O(n^2)"
space: "O(n)"
---

## Intuition

Fix the first piece `j`. What is left is `i - j`, and I have a choice: stop there and keep
`i - j` whole, or break it further into its own best product. Those two options are exactly
`j * (i - j)` and `j * dp[i - j]`, and neither dominates the other — for `i = 4`, `2 * 2` beats
`2 * dp[2] = 2`, but for `i = 7`, `2 * dp[5] = 12` beats `2 * 5 = 10`. Taking the max over both
options and over every first piece is the whole solution.

## Approach

1. Let `dp[i]` = the maximum product obtainable by breaking `i` into **two or more** positive
   integers, for `i >= 2`.
2. Base case: `dp[1] = 1`. This entry is a convenience, not a real break — it means "a leftover
   of 1 contributes a factor of 1". `dp[0]` stays 0 and is never read.
3. Recurrence: `dp[i] = max over j in 1..i//2 of max(j * (i - j), j * dp[i - j])`. The first
   term leaves the remainder whole (a genuine two-part split, which is what keeps `dp[i]` legal
   for the "at least two parts" rule); the second term breaks the remainder recursively.
4. Iteration order: `i` ascending from `2` to `n`, inner `j` ascending from `1` to `i // 2`.
   Ascending `i` means `dp[i - j]` is already final. Capping `j` at `i // 2` is just a symmetry
   optimization — the split `(j, i - j)` is the same as `(i - j, j)`.
5. Return `dp[n]`. `n >= 2` by constraint, so `dp[1]` is always in range and `dp[n]` is always
   a real break.
6. Sanity anchors while tracing: `dp[2] = 1`, `dp[3] = 2`, `dp[4] = 4`, `dp[7] = 12`,
   `dp[10] = 36`.

## Code

```python
class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [0] * (n + 1)
        dp[1] = 1

        for i in range(2, n + 1):
            for j in range(1, i // 2 + 1):
                dp[i] = max(dp[i], j * (i - j), j * dp[i - j])

        return dp[n]
```

## Why it works

Every valid break of `i` has a smallest-indexed first part `j`, and the rest of the parts form
either a single number `i - j` or a valid break of `i - j` — the two terms in the recurrence
cover exactly those two cases, so nothing is missed and the product factorizes cleanly as
`j` times the best value of the remainder. The `max(j * (i - j), ...)` term is what makes
`dp[i]` correspond to at least two parts, so the answer at `dp[n]` never degenerates to `n`
itself. Two nested loops over `n` values give `O(n^2)` time and `O(n)` space. (The closed form
is to split into as many 3s as possible, using 2s for a remainder of 1 or 2 — but the DP is
what I want to write under pressure since it needs no proof at the whiteboard.)
