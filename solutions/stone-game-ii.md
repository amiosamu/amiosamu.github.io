---
# Stone Game II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/stone-game-ii/
draft: false
pattern: "Game DP keyed on (index, M)"
time: "O(n^3)"
space: "O(n^2)"
---

## Description

Alice and Bob alternately take the first `X` remaining piles, where `1 <= X <= 2M`, and then set
`M = max(M, X)`. Alice starts with `M = 1`; both players maximize their own stones. Return the
maximum number Alice can obtain.

**Example**

```
Input: piles = [2,7,9,4,4]
Output: 10
```

Explanation: Optimal play gives Alice `10` stones, for example by taking `2` first and the final
two piles later.

## Intuition

At state `(i, m)`, the remaining stone total is fixed. If the current player takes `x` piles,
the opponent can optimally obtain `dp(i + x, max(m, x))`; the current player receives all
remaining stones except that amount. Both `i` and `m` are necessary because they determine the
remaining piles and legal moves.

## Approach

1. Build `suffix[i]`, the total stones in `piles[i:]`.
2. Define memoized `dp(i, m)` as the most stones the player to move can collect from that
   suffix.
3. If at most `2m` piles remain, take all of them and return `suffix[i]`.
4. Otherwise try each `x` from `1` through `2m`; the current player receives
   `suffix[i] - dp(i + x, max(m, x))` under optimal opposing play.
5. Cache the maximum candidate and return `dp(0, 1)` for Alice's initial turn.

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

Use induction on the number of remaining piles. If they all fit in one move, taking all is
optimal and the base case is correct. Otherwise, for every legal `x`, the induction hypothesis
gives the opponent's optimal total on the smaller suffix. Since all remaining stones go to one
of the two players, subtracting that total from `suffix[i]` gives the current player's total for
the move. Maximizing over every legal move therefore gives optimal play at `(i, m)`, including
`(0, 1)`.

**Complexity**

- **Time:** `O(n^3)` for `O(n^2)` states with up to `O(n)` transitions each.
- **Space:** `O(n^2)` for memoization, plus `O(n)` for suffix sums and recursion.
