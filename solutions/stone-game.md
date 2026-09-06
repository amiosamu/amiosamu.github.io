---
# Stone Game · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/stone-game/
draft: false
pattern: "Interval DP on score difference"
time: "O(n^2)"
space: "O(n^2)"
---

## Intuition

Instead of tracking each player's score separately, track the difference the player-to-move can force on the remaining range `piles[i..j]`. Whichever end they take, the opponent then plays optimally on what's left, so the best achievable difference is the pile just taken minus the opponent's best difference on the remainder.

## Approach

1. Let `n = len(piles)`. `dp[i][j]` = the maximum `(current player's stones - opponent's stones)` achievable from the subarray `piles[i..j]`, with the current player choosing which end to take.
2. Base case: `dp[i][i] = piles[i]` — with one pile left, take it.
3. For interval length from 2 up to `n`, and each `i` with `j = i + length - 1`: `dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])` — take the left pile and subtract the opponent's best net on `piles[i+1..j]`, or take the right pile and subtract the opponent's best net on `piles[i..j-1]`.
4. The answer is `dp[0][n-1] > 0` — Alice, who moves first on the full array, can force a strictly positive difference.

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

Every stone in `piles[i..j]` ends up with exactly one player, so "my best difference" is always "the pile I take" minus "the opponent's best difference on the rest" — a zero-sum recurrence — and considering both choices (take left or take right) makes the max truly optimal for both sides. The table has O(n^2) cells each computed in O(1), giving O(n^2) time and space.
