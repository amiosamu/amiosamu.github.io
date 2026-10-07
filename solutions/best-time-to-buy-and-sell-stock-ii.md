---
# Best Time to Buy And Sell Stock II · Medium · Arrays & Hashing
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
draft: false
pattern: "Sum every positive daily gain"
time: "O(n)"
space: "O(1)"
---

## Description

Given daily stock prices, return the maximum profit from any number of transactions. At most one
share may be held at a time.

**Example**

```
Input: prices = [7,1,5,3,6,4]
Output: 7
```

Buying at 1 and selling at 5 earns 4; buying at 3 and selling at 6 earns 3 more.

## Intuition

Profit across a rising interval equals the sum of its positive day-to-day changes. Therefore a
long transaction over that interval earns the same amount as collecting each increase. Negative
or zero changes add no useful profit and can be skipped.

## Approach

1. Initialize `profit = 0`.
2. Compare every price with the previous day's price.
3. Add the difference when it is positive; otherwise add nothing.
4. Return `profit`. Fewer than two prices naturally produce zero.

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

Every transaction's profit telescopes into daily differences, so any legal strategy earns at most
the sum of all positive differences. That bound is attainable by buying at the start of each
maximal rising run and selling at its end. The algorithm computes exactly this attainable upper
bound and is therefore optimal.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)`.
