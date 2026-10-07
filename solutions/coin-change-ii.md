---
# Coin Change II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/coin-change-ii/
draft: false
pattern: "Unbounded knapsack counting combinations"
time: "O(n * amount)"
space: "O(amount)"
---

## Description

Given a target amount and an array of coin denominations with an unlimited supply of each,
count the number of distinct combinations of coins that sum to exactly the target amount.
Combinations are unordered — using coin `1` then coin `2` is the same combination as coin `2`
then coin `1`.

**Example**

```
Input: amount = 5, coins = [1,2,5]
Output: 4
```

Explanation: the 4 combinations summing to 5 are `5`, `2+2+1`, `2+1+1+1`, and `1+1+1+1+1`.

## Intuition

The loop order determines what is counted. Processing one coin denomination at a time forces
every combination into a canonical denomination order, so arrangements such as `1 + 2` and
`2 + 1` are not counted separately. Sweeping amounts upward allows the current coin to be used
again, as required by the unlimited supply.

## Approach

1. Let `dp[a]` be the number of combinations totaling `a` using only coin types processed so
   far. Initialize `dp[0] = 1` for the empty combination.
2. For each denomination `c`, sweep `a` upward from `c` through `amount`.
3. Add `dp[a - c]` to `dp[a]`. Those combinations gain one `c`, and the upward sweep permits
   repeated copies of `c`.
4. Return `dp[amount]`. Keeping coins in the outer loop prevents different orders of the same
   multiset from being counted separately; neither input nor `coins` is mutated.

## Code

```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1

        for c in coins:
            for a in range(c, amount + 1):
                dp[a] += dp[a - c]

        return dp[amount]
```

## Why it works

After processing a coin `c`, `dp[a]` counts exactly the combinations for `a` using all coin
types seen so far. The old value counts combinations without `c`; `dp[a - c]` counts those
ending with at least one `c`. These cases are disjoint and exhaustive. The upward sweep makes
the invariant true for unlimited copies, and induction over the coin types proves the result.

**Complexity**

- **Time:** `O(n * amount)`, where `n` is the number of coin denominations.
- **Space:** `O(amount)`.
