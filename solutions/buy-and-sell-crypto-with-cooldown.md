---
# Best Time to Buy And Sell Stock With Cooldown · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
draft: false
pattern: "Three-state machine DP over days"
time: "O(n)"
space: "O(1)"
---

## Description

Given a sequence of daily prices for one stock, find the maximum profit achievable through any
number of buy/sell transactions, holding at most one share at a time, with the rule that after
selling a share you must wait one full day (a cooldown) before buying again.

**Example**

```
Input: prices = [1,2,3,0,2]
Output: 3
```

Explanation: buy on day 0 at price 1, sell on day 1 at price 2 for a profit of 1, cooldown on
day 2, buy on day 3 at price 0, sell on day 4 at price 2 for a profit of 2 — total profit
`1 + 2 == 3`.

## Intuition

The cooldown means current profit depends on whether a share is held, a sale just occurred, or
buying is allowed. These three states contain all information needed for the next day. Keeping
the best profit in each state turns every day's choices into constant-time transitions.

## Approach

1. Before trading, set `rest = 0`; set `held` and `sold` to negative infinity because those
   states are impossible.
2. For each price `p`, compute `sold = old_held + p`, representing a sale today.
3. Compute `held = max(old_held, old_rest - p)` and
   `rest = max(old_rest, old_sold)`. Buying only from `rest` enforces the cooldown.
4. Use tuple assignment so all transitions read the previous day's states.
5. Return `max(sold, rest)`, since an optimal completed strategy does not end holding a share.

## Code

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        sold, held, rest = float("-inf"), float("-inf"), 0

        for p in prices:
            sold, held, rest = held + p, max(held, rest - p), max(rest, sold)

        return max(sold, rest)
```

## Why it works

After each day, each variable is the maximum profit among all legal schedules ending in its
named state. This holds initially. The transitions enumerate every legal previous state and
action that can reach each new state, while omitting a purchase immediately after `sold`.
Induction therefore preserves the invariant. The best non-holding final state is the maximum
realizable profit.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)`.
