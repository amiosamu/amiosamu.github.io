---
# Maximum Product Subarray · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/maximum-product-subarray/
draft: false
pattern: "Track running max and min product"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array of integers that may include negative numbers and zeros, find the contiguous
subarray with the largest product and return that product.

**Example**

```
Input: nums = [2,3,-2,4]
Output: 6
```

Explanation: the subarray `[2,3]` has product `2 * 3 == 6`, and no contiguous subarray
(including ones that reach the negative `-2` or the trailing `4`) beats it.

## Intuition

The sum version of this (Kadane) works because a running total only ever gets worse by keeping
a negative prefix. Products break that: a very negative running product is one negative number
away from being the largest thing in the array. So the max ending at `i` can come from the *min*
ending at `i - 1`. Carry both extremes forward and a sign flip just swaps their roles. Zeros are
handled for free by allowing the subarray to restart at `n` itself.

## Approach

1. `res = max(nums)` — this seeds the answer with the best single element, which is the right
   answer when every extension makes things worse (all-negative arrays, arrays with zeros).
2. Keep two running values, `curMax` and `curMin`: the largest and smallest product of a
   subarray that **ends at the current index**. Initialize both to `1` (the empty product).
3. For each `n` in `nums`, compute `cand = curMax * n` **first**, before overwriting `curMax` —
   otherwise the update to `curMin` reads a stale value.
4. New `curMax = max(cand, curMin * n, n)` and new `curMin = min(cand, curMin * n, n)`.
   The three candidates are: extend the best-ending-here, extend the worst-ending-here (the
   sign-flip case), and start a fresh subarray at `n`.
5. After each update, `res = max(res, curMax)`.
6. Return `res`. When `n == 0` both running values collapse to `0`, and the `n` term in the max
   lets the next index start over cleanly, so no special zero handling is needed.

## Code

```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = max(nums)
        curMax, curMin = 1, 1

        for n in nums:
            cand = curMax * n
            curMax = max(cand, curMin * n, n)
            curMin = min(cand, curMin * n, n)
            res = max(res, curMax)

        return res
```

## Why it works

Every subarray ending at index `i` is either `nums[i]` alone or a subarray ending at `i - 1`
extended by `nums[i]`, and multiplying by `nums[i]` is monotone in the running product — it
preserves order when `nums[i] > 0` and reverses it when `nums[i] < 0`. So the extremes at `i`
are reachable only from the extremes at `i - 1`, which is exactly what the two-value state
tracks; every subarray gets considered when it ends. One pass, two scalars: O(n) time, O(1)
space.
