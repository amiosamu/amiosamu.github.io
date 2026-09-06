---
# Burst Balloons · Hard · 2-D Dynamic Programming
# https://leetcode.com/problems/burst-balloons/
draft: false
pattern: "Interval DP, last burst as split point"
time: "O(n^3)"
space: "O(n^2)"
---

## Description

Given an array `nums` where `nums[i]` is the number painted on the `i`-th balloon, describes
bursting every balloon one at a time; bursting balloon `i` earns
`nums[left] * nums[i] * nums[right]` coins where `left` and `right` are the indices currently
adjacent to it (treating a missing neighbor past either end as `1`), and asks for the maximum
total coins obtainable by choosing the burst order.

**Example**

```
Input: nums = [3,1,5,8]
Output: 167
```

Explanation: bursting in the order (index 1, then 2, then 0, then 3) earns
`3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15 + 120 + 24 + 8 = 167`.

## Intuition

Bursting balloons forward is hard to reason about — bursting one balloon makes two others become neighbors, so the "neighbors" of a future burst depend on burst order. Thinking backward fixes this: pick which balloon in a range is burst *last*. At that moment every other balloon in the range is already gone, so its neighbors are exactly the two balloons bounding the range — a clean interval DP with no order-tracking needed.

## Approach

1. Pad `nums` with a `1` on each end into `arr`, so out-of-range neighbors are automatically `1`.
2. `dp[left][right]` = max coins from bursting every balloon strictly between indices `left` and `right`, leaving `arr[left]` and `arr[right]` as the untouched boundary.
3. Base case: `dp[left][right] = 0` when `right == left + 1` (nothing strictly between them).
4. Iterate over interval length `gap` from 2 up to `n+1` (where `n = len(nums)`), and for each `left` set `right = left + gap`.
5. For every `k` strictly between `left` and `right`, treat `k` as the *last* balloon burst in that interval: its neighbors at that point are `arr[left]` and `arr[right]`, so bursting it nets `arr[left] * arr[k] * arr[right]`, plus whatever the two sub-intervals `dp[left][k]` and `dp[k][right]` already earned.
6. `dp[left][right]` = the max of that quantity over all valid `k`.
7. The answer is `dp[0][n+1]`, the whole padded array.

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

`dp[left][right]` only depends on strictly smaller intervals `dp[left][k]` and `dp[k][right]`, so filling by increasing gap guarantees every subproblem exists before it's needed. Choosing the *last* burst rather than the first removes the need to track which neighbors survive — the formula `arr[left]*arr[k]*arr[right]` is exact, not an approximation, because nothing else in `(left, right)` remains when `k` finally goes. Trying every `k` as the split point covers every possible burst order, and the triple loop over `gap`, `left`, `k` gives O(n^3) time with an O(n^2) table.
