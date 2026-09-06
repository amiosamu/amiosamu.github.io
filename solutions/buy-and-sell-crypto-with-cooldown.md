---
# Best Time to Buy And Sell Stock With Cooldown · Medium · 2-D Dynamic Programming
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
draft: false
pattern: "Three-state machine DP over days"
time: "O(n)"
space: "O(1)"
---

## Intuition

Without the cooldown you would just bank every upward move. The cooldown breaks that because
selling today forbids buying tomorrow, so the decision depends on what happened yesterday. But
"what happened yesterday" collapses to three possibilities: I am holding a share, I just sold
today (so tomorrow is blocked), or I am free to buy. Track the best cash balance in each of
those three states and each day is a constant-time update.

## Approach

1. `dp[i][s]` is the maximum cash after processing day `i`, considering only prices
   `prices[0..i]`, given the position `s` at the end of that day. Three values of `s`:
   - `held` — I own one share.
   - `sold` — I sold today, so day `i + 1` is a cooldown.
   - `rest` — I own nothing and am free to buy tomorrow.
2. Recurrence at price `p`, each case spelled out against the *previous* day's values:
   - `sold = held + p` — the only way to be in `sold` is to sell the share I was holding.
   - `held = max(held, rest - p)` — keep holding, or buy today, which is legal only from
     `rest` (never from `sold`, and that omission is the whole cooldown rule).
   - `rest = max(rest, sold)` — stay free, or arrive from yesterday's `sold` now that the
     cooldown day has passed.
3. Base cases before day 0: `rest = 0` (no stock, no cash spent); `held = -inf` and
   `sold = -inf`, because owning or having just sold is impossible before trading starts. The
   sentinels keep those branches from being chosen instead of needing an `if`.
4. Iterate `p` over `prices` **forward**, left to right, and assign all three states in one
   tuple assignment so every right-hand side reads day `i - 1`. Forward is forced: each state
   is defined in terms of the day before it.
5. The answer is `max(sold, rest)` after the last day — ending while still holding a share is
   never better than not having bought it, so `held` is excluded.
6. Only the previous day's triple is ever read, so no array is needed at all.

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

The three states partition every legal position at the end of a day, and each transition lists
every legal way to arrive there, so no schedule is missed and none illegal is allowed — the
cooldown is enforced structurally by the absence of a `sold -> buy` edge. The subproblems are
path-independent because future profit depends only on the day index and whether I hold a share
or am cooling down, not on which earlier trades produced the current cash; the running maximum
per state therefore dominates every prefix that lands in it. One pass with three `max`
operations per day is `O(n)` time and `O(1)` space.
