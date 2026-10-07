---
# Burst Balloons · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/burst-balloons/
draft: false
pattern: "Interval DP, last burst as split point"
time: "O(n^3)"
space: "O(n^2)"
---

## Description

Given balloon values, burst every balloon in an order that maximizes coins. Bursting a balloon
earns its value times the values of its current neighbors; a missing boundary neighbor has value
one.

**Example**

```
Input: nums = [3,1,5,8]
Output: 167
```

Explanation: bursting in the order (index 1, then 2, then 0, then 3) earns
`3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15 + 120 + 24 + 8 = 167`.

## Intuition

Choosing the first balloon is difficult because its removal changes future neighbors. Instead,
choose the last balloon burst inside an interval. At that moment, its neighbors are the fixed
interval boundaries. This choice splits the earlier work into independent left and right
subintervals.

## Approach

1. Pad the values with boundary ones: `arr = [1] + nums + [1]`.
2. Let `dp[left][right]` be the maximum coins from balloons strictly inside `(left, right)`,
   while both boundary balloons remain.
3. Fill intervals by increasing `gap`. For every possible last balloon `k`, combine
   `dp[left][k]`, `arr[left] * arr[k] * arr[right]`, and `dp[k][right]`.
4. Store the best choice for each interval and return the value for the full padded interval.
   Adjacent boundaries contain no balloon and retain the initialized value zero.

## Code

```python
class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        arr = [1] + nums + [1]
        n = len(arr)
        dp = [[0] * n for _ in range(n)]
        for gap in range(2, n):
            for left in range(n - gap):
                right = left + gap
                best = 0
                for k in range(left + 1, right):
                    coins = arr[left] * arr[k] * arr[right] + dp[left][k] + dp[k][right]
                    best = max(best, coins)
                dp[left][right] = best
        return dp[0][n - 1]
```

## Why it works

For any non-empty interval, every burst order has one last balloon `k`. Before that final burst,
the balloons on each side of `k` can be optimized independently, and `k` then has the fixed
boundary neighbors. By induction on interval length, the recurrence computes the optimum for
both smaller intervals and checks every possible `k`, so it computes the interval optimum.
Increasing `gap` ensures those smaller values are already available.

**Complexity**

- **Time:** `O(n^3)`.
- **Space:** `O(n^2)` for the dynamic-programming table.
