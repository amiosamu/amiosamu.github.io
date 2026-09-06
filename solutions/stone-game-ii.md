---
# Stone Game II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/stone-game-ii/
draft: false
pattern: "Game DP keyed on (index, M)"
time: "O(n^3)"
space: "O(n^2)"
---

## Description

Given piles of stones where Alice and Bob alternately take stones from the front of the row
(Alice first), and on a turn with move-limit `M` a player may take between 1 and `2*M` piles
(after which `M` becomes at least the number just taken), both playing to maximize their own
total, returns the maximum number of stones Alice can end up with.

**Example**

```
Input: piles = [2,7,9,4,4]
Output: 10
```

Explanation: if Alice takes just the first pile (2), Bob then takes the next two (7+9), and
Alice takes the last two (4+4), giving Alice 2 + 4 + 4 = 10, which beats any other opening move.

## Intuition

Both players play optimally and the stones left from any point on are fixed in total, so whatever the opponent doesn't get, the current player does — "maximize my stones" becomes "maximize the remaining sum minus whatever the opponent can force from what's left." The state that matters isn't just the pile index but also `M`, since `M` bounds how many piles can be taken next.

## Approach

1. Precompute `suffix[i] = sum(piles[i:])` for `i` from `n` down to `0`.
2. `dp(i, M)` = the maximum stones the player to move can get from `piles[i:]`, given move-limit `M`.
3. Base case: if `i + 2*M >= n`, the current player can take every remaining pile in one turn, so `dp(i, M) = suffix[i]`.
4. Otherwise, for each `X` from 1 to `2*M` (piles taken this turn), the opponent then plays `dp(i+X, max(M, X))` optimally on what remains, so this turn nets `suffix[i] - dp(i+X, max(M, X))` for the current player.
5. `dp(i, M) = max` of that expression over all valid `X` from 1 to `2*M`.
6. Memoize `dp` on `(i, M)`, since the same state recurs across different branches.
7. The answer is `dp(0, 1)` — Alice moves first with `M = 1`.

## Code

```python
class Solution:
    def stoneGameII(self, piles: List[int]) -> int:
        n = len(piles)
        suffix = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            suffix[i] = suffix[i + 1] + piles[i]

        memo = {}

        def dp(i: int, m: int) -> int:
            if i + 2 * m >= n:
                return suffix[i]
            if (i, m) in memo:
                return memo[(i, m)]
            best = 0
            for x in range(1, 2 * m + 1):
                best = max(best, suffix[i] - dp(i + x, max(m, x)))
            memo[(i, m)] = best
            return best

        return dp(0, 1)
```

## Why it works

`suffix[i] - dp(i+X, newM)` is exactly "everything left" minus "what the opponent takes under optimal play," which is precisely what the current player is left with, so the recurrence directly encodes optimal play for both sides at once, not just the mover. `M` only ranges over `1..n`, so memoizing on `(i, M)` gives at most O(n^2) distinct states, each doing up to O(n) work in the `X` loop, for O(n^3) time and O(n^2) space.
