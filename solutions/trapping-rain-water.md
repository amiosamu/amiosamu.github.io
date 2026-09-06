---
# Trapping Rain Water · Hard · Two Pointers
# https://leetcode.com/problems/trapping-rain-water/
draft: false
pattern: "Two pointers with running maxes"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `height` representing an elevation map where each bar has width 1, return the total amount of rainwater that can be trapped between the bars after it rains.

**Example**

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

Explanation: Summing `min(leftMax, rightMax) - height[i]` at every index where that value is positive totals 6 trapped units.

## Intuition

Water sits on top of a single column, not in a "valley" you have to find: the level above index `i` is `min(prefix max to the left, suffix max to the right)`, so the trapped amount there is `min(prefix[i], suffix[i]) - height[i]`. Precomputing both arrays already solves it in O(n) time, but it costs O(n) space. The observation that removes the arrays: only the *smaller* of the two running maxes decides the water level, and if `leftMax < rightMax` then whatever the true right-hand maximum turns out to be it is at least `rightMax`, so `leftMax` is already the binding wall — that column can be settled immediately. So I walk two pointers inwards and always advance the side whose running max is smaller.

## Approach

1. Return `0` on an empty `height`.
2. Set `l, r = 0, len(height) - 1` and seed `leftMax, rightMax = height[l], height[r]`; `res = 0`.
3. Loop while `l < r`. Exactly one pointer moves per iteration, so the loop always terminates.
4. If `leftMax < rightMax`, the left wall is the binding one: advance `l += 1`, refresh `leftMax = max(leftMax, height[l])`, then add `leftMax - height[l]` to `res`.
5. Otherwise do the mirror on the right: `r -= 1`, refresh `rightMax`, add `rightMax - height[r]`.
6. Note the ordering — the max is refreshed *before* the water is added, so `leftMax - height[l]` is never negative and no `max(0, ...)` guard is needed.
7. Return `res`.

## Code

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0
        l, r = 0, len(height) - 1
        leftMax, rightMax = height[l], height[r]
        res = 0
        while l < r:
            if leftMax < rightMax:
                l += 1
                leftMax = max(leftMax, height[l])
                res += leftMax - height[l]
            else:
                r -= 1
                rightMax = max(rightMax, height[r])
                res += rightMax - height[r]
        return res
```

## Why it works

The invariant is that `leftMax` is the true maximum of `height[0..l]` and `rightMax` the true maximum of `height[r..n-1]`. When `leftMax < rightMax`, the real suffix maximum for the new `l` is at least `rightMax > leftMax`, so `min(prefix, suffix)` at that index equals `leftMax` regardless of what lies in the untouched middle — the column can be finalised without ever computing the suffix array. Every index between the original ends is visited exactly once by one pointer or the other, so each column's water is counted once: O(n) time with four scalars of state, O(1) space.
