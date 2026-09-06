---
# Coin Change · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/coin-change/
draft: false
pattern: "Bottom-up unbounded knapsack over amounts"
time: "O(amount * len(coins))"
space: "O(amount)"
---

## Description

Given an array of coin denominations and a target amount, return the fewest coins needed to
make exactly that amount, using an unlimited supply of each denomination. Return `-1` if the
amount cannot be made with any combination of the given coins.

**Example**

```
Input: coins = [1,2,5], amount = 11
Output: 3
```

Explanation: `11 = 5 + 5 + 1`, three coins, and no combination reaches 11 with fewer than
three.

## Intuition

Greedy — always take the largest coin that fits — is wrong for arbitrary denominations:
`coins = [1, 3, 4]`, `amount = 6` gives `4 + 1 + 1` when `3 + 3` is better. The right framing is
that the coins in an optimal solution are unordered, so fix any one of them as "the last coin
used": if it has value `c`, the rest must be an optimal way to make `amount - c`. That turns the
search into a scan over `amount + 1` subproblems, each trying every coin once.

## Approach

1. State: `dp[a]` is the fewest coins that sum to exactly `a`, considering only amounts from `0`
   to `a`. Coins are unlimited, so there is no second dimension — the same coin may be reused.
2. Base case: `dp[0] = 0`. Every other cell starts at the sentinel `amount + 1`, which is
   unreachable as a real answer since every coin has value at least `1`, so no solution can use
   more than `amount` coins. Using this instead of `float("inf")` keeps everything an int and
   makes the final "was it filled in" test a plain comparison.
3. Recurrence: `dp[a] = 1 + min(dp[a - c] for c in coins if c <= a)`, and `dp[a]` stays at the
   sentinel when no coin fits or every predecessor is itself unreachable.
4. Iteration direction: increasing `a` from `1` to `amount`, inner loop over `coins`. Since
   `c >= 1`, `a - c < a`, so every cell read is already final.
5. Guard with `if c <= a` before indexing — a negative index would silently wrap around in
   Python and read the wrong end of the table.
6. Answer: `dp[amount]`, or `-1` if it is still above `amount`, meaning no combination reaches
   the target.
7. `amount = 0` returns `0` without entering the loop, which is correct.

## Code

```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [0] + [amount + 1] * amount

        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    dp[a] = min(dp[a], dp[a - c] + 1)

        return dp[amount] if dp[amount] <= amount else -1
```

## Why it works

Any multiset of coins summing to `a` has some coin `c` in it, and removing it leaves a multiset
summing to `a - c`; if that remainder were not minimal you could swap in a smaller one and beat
the original, so optimal substructure holds and taking the min over all `c` covers every
possibility. Unbounded reuse is automatic because `dp[a - c]` is free to use `c` again — nothing
in the state records which coins were spent. Filling `amount` cells with an inner loop over the
coins is `O(amount * len(coins))` time and one table of `O(amount)` space.
