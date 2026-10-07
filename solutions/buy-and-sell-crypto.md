---
# Best Time to Buy And Sell Stock · Easy · Sliding Window
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
draft: false
pattern: "Track cheapest price so far"
time: "O(n)"
space: "O(1)"
---

## Description

Given daily stock prices, choose one day to buy and a later day to sell. Return the maximum
profit, or zero when no profitable transaction exists.

**Example**

```
Input: prices = [7,1,5,3,6,4]
Output: 5
```

Buying at 1 and later selling at 6 earns the maximum profit, `6 - 1 = 5`.

## Intuition

For a fixed sell day, the best buy is the lowest price on an earlier day. A left-to-right scan can
maintain that minimum and evaluate the best profit ending at each day in constant time.

## Approach

1. Initialize `cheapest` with the first price and `best = 0`.
2. Treat each later `price` as a possible sale. If it is a new minimum, update `cheapest`.
3. Otherwise update `best` with `price - cheapest`.
4. Return `best`. A one-day or strictly falling input returns zero; the problem guarantees at
   least one price.

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

Before each candidate sale, `cheapest` is the minimum earlier price and `best` is the maximum
profit for earlier sale days. The update computes the optimal profit for the current sale day,
then preserves the best over all processed days. By induction, after the final day `best` is the
maximum over every legal buy-sell pair, with zero representing no transaction.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)`.
