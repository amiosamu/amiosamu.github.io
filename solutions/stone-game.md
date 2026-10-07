---
# Stone Game · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/stone-game/
draft: false
pattern: "Interval DP on score difference"
time: "O(n^2)"
space: "O(n^2)"
---

## Description

Given an even-length array `piles`, Alice and Bob alternately remove one pile from either end.
Alice starts, and both maximize their own stones. Return whether Alice can guarantee a win.

**Example**

```
Input: piles = [5,3,4,5]
Output: true
```

Explanation: Alice can choose an end so that her final total is greater than Bob's.

## Intuition

Track the score difference the player to move can force on each interval. Taking either end adds
that pile to the current player's score, then gives the opponent the same type of problem on the
remaining interval. The opponent's optimal advantage must therefore be subtracted.

## Approach

1. Define `dp[i][j]` as the maximum current-player score minus opponent score on
   `piles[i..j]`.
2. Set `dp[i][i] = piles[i]`, since the only move takes the remaining pile.
3. Fill intervals by increasing length using
   `max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1])`.
4. Return whether `dp[0][n - 1] > 0`, meaning Alice can force a positive difference.

## Code

```python
class Solution:
    def stoneGame(self, piles: List[int]) -> bool:
        n = len(piles)
        dp = [[0] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = piles[i]
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                dp[i][j] = max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1])
        return dp[0][n - 1] > 0
```

## Why it works

Use induction on interval length. For length one, the current player takes the only pile, so the
base value is exact. For a longer interval, the first move must take either the left or right
pile. By the induction hypothesis, the corresponding smaller interval stores the opponent's
optimal advantage. Subtracting it gives the current player's final advantage for that move, and
taking the larger of the only two legal choices is optimal. Thus the full-interval value is
Alice's forced advantage.

**Complexity**

- **Time:** `O(n^2)` because every interval is computed once in constant time.
- **Space:** `O(n^2)` for the DP table.
