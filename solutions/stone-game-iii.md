---
# Stone Game III · Hard · 1-D Dynamic Programming
# https://leetcode.com/problems/stone-game-iii/
draft: false
pattern: "Suffix minimax on score difference"
time: "O(n)"
space: "O(n)"
---

## Intuition

Tracking both players' absolute scores would need a two-dimensional state, and there is no need:
the game is symmetric, both players play the same way, and the only thing the final answer needs
is the *sign of the difference*. So define the state as the best score difference the player to
move can force from a given suffix. Then whatever the current player takes, the opponent faces
the same kind of problem on the rest, and their optimal difference simply flips sign — the
recurrence is `take - dp[next]`.

## Approach

1. Let `n = len(stoneValue)` and `dp[i]` = the maximum value of `(current player's score) -
   (other player's score)` over the suffix `stoneValue[i:]`, assuming both play optimally from
   there. Note `dp[i]` is *not* Alice-specific: it is always "whoever moves at `i`".
2. Base case: `dp[n] = 0` — no stones left, no difference.
3. Recurrence: `dp[i] = max over k in 1..3 (with i + k <= n) of (sum(stoneValue[i:i+k]) - dp[i+k])`.
   The subtraction is the minimax step: from `i + k` the roles swap, so the opponent's forced
   difference counts against me.
4. Iteration order: `i` from `n - 1` down to `0`, so `dp[i+1]`, `dp[i+2]`, `dp[i+3]` are already
   computed.
5. Inner loop: accumulate `take` as `k` grows (`take += stoneValue[i + k]` for `k = 0, 1, 2`)
   instead of re-slicing, guarded by `i + k < n`. Seed `best` with `-inf`; every `i < n` has at
   least the `k = 0` option so `best` is always overwritten.
6. Decide from `dp[0]`, which is Alice's forced difference since she moves first: `> 0` returns
   `"Alice"`, `< 0` returns `"Bob"`, `== 0` returns `"Tie"`.
7. Values can be negative, so never assume taking more stones is better — `[1,2,3,-9]` is
   exactly the case where Alice must take all three to hand Bob the `-9`.

## Code

```python
class Solution:
    def stoneGameIII(self, stoneValue: List[int]) -> str:
        n = len(stoneValue)
        dp = [0] * (n + 1)

        for i in range(n - 1, -1, -1):
            take = 0
            best = float("-inf")
            for k in range(3):
                if i + k < n:
                    take += stoneValue[i + k]
                    best = max(best, take - dp[i + k + 1])
            dp[i] = best

        if dp[0] > 0:
            return "Alice"
        return "Bob" if dp[0] < 0 else "Tie"
```

## Why it works

The identity that makes the one-dimensional state legal is that the score difference from a
position is player-independent: both players face identical rules, so `diff(i)` for the mover
is well defined, and the mover's total after taking `take` is `take` minus whatever the opponent
forces from `i + k`. Maximizing over the only three legal moves therefore explores the entire
game tree without ever enumerating it, and the right-to-left order resolves each state from
strictly shorter suffixes. Each of the `n + 1` states does constant work: `O(n)` time and
`O(n)` space, reducible to `O(1)` by keeping only the last three values.
