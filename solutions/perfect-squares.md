---
# Perfect Squares · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/perfect-squares/
draft: false
pattern: "Unbounded coin change on squares"
time: "O(n * sqrt(n))"
space: "O(n)"
---

## Description

Given a positive integer `n`, return the minimum number of perfect squares whose sum is
exactly `n`. Each square may be used any number of times.

**Example**

```
Input: n = 12
Output: 3
```

Explanation: `12 = 4 + 4 + 4`, and no representation using one or two squares exists.

## Intuition

Treat every perfect square as an unlimited coin denomination. A largest-square greedy rule is
not reliable: for `12` it chooses `9 + 1 + 1 + 1`, while `4 + 4 + 4` is better.

For each total `i`, consider which square appears last. Removing that square leaves a smaller
total whose optimum has already been computed.

## Approach

1. Define `dp[i]` as the fewest squares needed to form `i`. Set `dp[0] = 0` and initialize
   every other entry to `n`, the count obtained by using only ones.
2. Visit totals `i` from `1` through `n`, so every state `dp[i - s * s]` needed by `i` is
   already final.
3. For each square `s * s <= i`, update `dp[i]` with `1 + dp[i - s * s]`. Reusing an
   already-computed state allows the same square to appear repeatedly.
4. Return `dp[n]` after all candidate final squares have been considered.

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

We prove by induction on `i` that `dp[i]` is optimal. The base `dp[0] = 0` is exact. For
`i > 0`, any representation has a final square `s * s`; by the induction hypothesis, its
remaining total needs at least `dp[i - s * s]` squares. The recurrence therefore considers a
value no larger than every valid representation. Conversely, each candidate appends one square
to a valid representation of `i - s * s`, so it cannot be smaller than the optimum. Thus the
minimum candidate is exactly optimal, including the reusable-square case.

**Complexity**

- **Time:** `O(n * sqrt(n))`, because state `i` examines `floor(sqrt(i))` squares.
- **Space:** `O(n)` for the dynamic-programming table.
