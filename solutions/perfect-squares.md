---
# Perfect Squares · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/perfect-squares/
draft: false
pattern: "Unbounded coin change on squares"
time: "O(n * sqrt(n))"
space: "O(n)"
---

## Description

Given an integer `n`, return the fewest perfect squares (`1, 4, 9, 16, ...`) that sum to
exactly `n`. A perfect square may be used more than once.

**Example**

```
Input: n = 12
Output: 3
```

Explanation: `12 == 4 + 4 + 4`, three perfect squares, and no combination of fewer perfect
squares sums to 12.

## Intuition

This is coin change where the coin denominations are `1, 4, 9, 16, ...` and every coin can be
reused. Greedily taking the largest square is wrong — `12` greedily goes `9 + 1 + 1 + 1` (four)
when `4 + 4 + 4` is three. So peel off one square at a time and let the table decide which one:
the answer for `i` is one more than the best answer for `i - s*s`, minimized over all squares
that fit.

## Approach

1. Let `dp[i]` = the minimum count of perfect squares summing to exactly `i`, for `i` in
   `0..n`.
2. Base case: `dp[0] = 0`. Initialize every other entry to `n`, which is a valid upper bound
   because `i` can always be written as `i` ones and `i <= n` — so no infinity sentinel is
   needed and the `min` never has to special-case unreachability.
3. Recurrence: `dp[i] = 1 + min(dp[i - s*s]) over all s >= 1 with s*s <= i`.
4. Iteration order: `i` ascending from `1` to `n`; inside, walk `s = 1, 2, 3, ...` while
   `s * s <= i`. Ascending guarantees `dp[i - s*s]` is already final, and since `s*s >= 1` the
   index read is always strictly smaller than `i`.
5. Because squares are reusable, there is no "descending inner loop" trick here — this is
   unbounded knapsack, and reading an already-updated smaller cell is exactly what we want.
6. Return `dp[n]`.

## Code

```python
class Solution:
    def numSquares(self, n: int) -> int:
        dp = [0] + [n] * n

        for i in range(1, n + 1):
            s = 1
            while s * s <= i:
                dp[i] = min(dp[i], 1 + dp[i - s * s])
                s += 1

        return dp[n]
```

## Why it works

Any optimal decomposition of `i` contains at least one square `s*s`; removing it leaves an
optimal decomposition of `i - s*s` (otherwise you could swap in a better one and beat the
original), so the recurrence has optimal substructure and trying every `s` covers every
possible last term. Lagrange's four-square theorem says the answer is always 1, 2, 3 or 4, so
the table is never unreachable. Each of the `n` states scans `sqrt(i)` squares: `O(n * sqrt(n))`
time, `O(n)` space.
