---
# Best Time to Buy And Sell Stock II · Medium · Arrays & Hashing
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
draft: false
pattern: "Sum every positive daily gain"
time: "O(n)"
space: "O(1)"
---

## Intuition

With unlimited transactions there is nothing to plan. Holding through a rise from day `i` to day `j` earns `prices[j] - prices[i]`, and that telescopes into the sum of the day-to-day differences along the way — so any long hold is worth exactly the same as buying and selling on each individual day inside it. Since I can also decline any day, I keep the positive differences and drop the negative ones, and that upper bound is achievable: it corresponds to buying at every local minimum and selling at every local maximum.

## Approach

1. Set `profit = 0`.
2. Walk `i` from `1` to `len(prices) - 1`, comparing each day with the one before it.
3. If `prices[i] > prices[i - 1]`, add `prices[i] - prices[i - 1]` to `profit`.
4. Skip the day otherwise — a falling day is never held through.
5. Return `profit`. Arrays of length 0 or 1 return `0` because the loop never runs.
6. There is no need to track a buy price or a holding flag; the differences already encode the trades.

## Code

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
```

## Why it works

Any legal set of non-overlapping trades has total profit equal to a sum of consecutive daily differences, and that sum is at most the sum of the *positive* differences — so the value computed is an upper bound on every strategy. It is also attainable: the runs of consecutive rising days are disjoint intervals, so buying at the start of each run and selling at its end is a legal transaction sequence earning exactly this amount. One pass with a single accumulator gives O(n) time and O(1) space.
