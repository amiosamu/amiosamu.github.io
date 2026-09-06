---
# Best Time to Buy And Sell Stock · Easy · Sliding Window
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
draft: false
pattern: "Track cheapest price so far"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `prices` where `prices[i]` is the stock price on day `i`, choose one day to buy and a later day to sell to maximize profit. If no profitable transaction exists, return 0.

**Example**

```
Input: prices = [7,1,5,3,6,4]
Output: 5
```

Explanation: buying on day 1 at price 1 and selling on day 4 at price 6 gives profit `6 - 1 == 5`, the best of any buy/sell pair.

## Intuition

Brute force tries every buy/sell pair, O(n²). The insight: when I stand on day `r` as the seller, the only buy day I care about is the cheapest day strictly before `r` — every other earlier day gives less profit. So sweeping left to right while remembering the minimum price seen so far answers each sell day in O(1). It is the degenerate sliding window where the left edge jumps straight to any new low.

## Approach

1. Set `cheapest = prices[0]` (the only buy option before day 1) and `best = 0` — the "do nothing" profit, which is why a strictly falling array returns 0.
2. Walk `price` over `prices[1:]`; each one is a candidate sell day.
3. If `price < cheapest`, this day is a better buy day than anything before it, so set `cheapest = price` and sell nothing today — selling on a new minimum can never beat 0.
4. Otherwise update `best = max(best, price - cheapest)`.
5. Return `best`. The invariant is that at the top of each iteration `cheapest` is the minimum of all prices strictly left of the current day, and `best` is the best profit over all sell days already seen.
6. A one-element array skips the loop and returns 0, which is correct.

## Code

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        cheapest = prices[0]
        best = 0
        for price in prices[1:]:
            if price < cheapest:
                cheapest = price
            else:
                best = max(best, price - cheapest)
        return best
```

## Why it works

Every legal transaction is some pair `buy < sell`; when the loop reaches `sell`, `cheapest` is at most `prices[buy]`, so the profit it records is at least `prices[sell] - prices[buy]` — no pair can beat the running maximum. Skipping the update on a new minimum is safe because `price - cheapest` would be 0 there, never better than the initial `best`. One pass over the array with two scalars gives O(n) time and O(1) space.
