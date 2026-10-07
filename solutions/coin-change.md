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

Greedy choice is not reliable for arbitrary denominations. Instead, consider the last coin `c`
in an optimal solution for amount `a`. Removing it leaves an optimal solution for `a - c`;
otherwise that remainder could be improved and so could the original solution. This gives a
bottom-up recurrence over smaller amounts.

## Approach

1. Let `dp[a]` be the minimum number of coins needed for exactly `a`. Set `dp[0] = 0` and use
   `amount + 1` as an unreachable sentinel for every positive amount.
2. Process amounts from 1 through `amount`, so every predecessor `dp[a - c]` is final before
   it is read.
3. For each coin `c <= a`, update `dp[a]` with `dp[a - c] + 1`. The same denomination can be
   reused because the state records only the remaining amount.
4. Return `dp[amount]`, or `-1` if it still exceeds `amount`. An amount of zero returns zero
   without entering the loops, and the input list is not mutated.

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

Assume `dp[0]` through `dp[a - 1]` are correct. Every solution for `a` has a final coin `c`, and
its remaining coins form a solution for `a - c`; replacing a nonminimal remainder would improve
the whole solution. Therefore the minimum over all valid `dp[a - c] + 1` is both attainable and
no larger than any solution. Induction establishes correctness through `dp[amount]`.

**Complexity**

- **Time:** `O(amount * len(coins))`.
- **Space:** `O(amount)`.
