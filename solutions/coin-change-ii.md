---
# Coin Change II · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/coin-change-ii/
draft: false
pattern: "Unbounded knapsack counting combinations"
time: "O(n * amount)"
space: "O(amount)"
---

## Intuition

The trap is counting *permutations* instead of *combinations*: a naive `dp[a] += dp[a - c]`
with coins on the inner loop counts `1+2` and `2+1` as different answers. Fixing it is an
ordering trick — decide the coins in a fixed order, one coin type fully processed before the
next is introduced. Then every combination is built exactly once, in the canonical order of the
coin list, and the count is right.

## Approach

1. `dp[i][a]` is the number of distinct combinations summing to `a` using only the first `i`
   coin types, each usable any number of times.
2. Recurrence, two cases: either coin `i` is used zero times (`dp[i-1][a]`) or it is used at
   least once, which leaves `a - coins[i]` still allowed to use coin `i` again
   (`dp[i][a - coins[i]]`, note the `i` not `i-1`). So
   `dp[i][a] = dp[i-1][a] + dp[i][a - coins[i]]` for `a >= coins[i]`, and `dp[i-1][a]`
   otherwise. The two cases are disjoint — they differ in whether coin `i` appears at all.
3. Base case: the padding row `dp[0][0] = 1` — there is exactly one way to make zero, the empty
   selection — and `dp[0][a] = 0` for `a > 0`.
4. Roll to one array `dp` of length `amount + 1` with `dp[0] = 1`. The outer loop runs over
   coins `c`, the inner over amounts.
5. The inner sweep must run **upward**, `range(c, amount + 1)`, so that `dp[a - c]` has already
   been updated for the current coin — that is what encodes "use coin `c` again" and gives
   unbounded reuse. Sweeping downward would restrict each coin to one use (0/1 knapsack).
6. The coin loop must be **outside** the amount loop. Swapping the two loops is the permutation
   bug: it would let a combination be assembled in any coin order and count each ordering
   separately.
7. Return `dp[amount]`.

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

Fixing the coin order turns every multiset of coins into a unique sequence of "how many of coin
1, then how many of coin 2, ..." decisions, so the recurrence enumerates each combination
exactly once — the split on whether coin `i` is used at all is exhaustive and non-overlapping.
Nothing about *which* coins produced a partial amount is retained, only the amount itself, which
is exactly why counts for the same `a` can be merged into a single cell. The loops touch `n *
amount` cells with one addition each: `O(n * amount)` time, `O(amount)` space.
