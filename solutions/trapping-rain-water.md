---
# Trapping Rain Water · Hard · Two Pointers
# https://leetcode.com/problems/trapping-rain-water/
draft: false
pattern: "Two pointers with running maxes"
time: "O(n)"
space: "O(1)"
---

## Description

Given bar heights of width `1`, return the total rainwater trapped by the elevation map.

**Example**

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

The water above each bar is bounded by the shorter maximum wall on its two sides; the total is `6`.

## Intuition

At index `i`, water depth is the smaller of the tallest walls to its left and right, minus the
bar's height. Two pointers avoid storing all prefix and suffix maxima. Whichever running maximum is
smaller already determines the next cell on that side, regardless of unknown bars in the middle.

## Approach

1. Return `0` for an empty input; otherwise initialize pointers at both ends and their maxima.
2. While `l < r`, process the side with the smaller running maximum.
3. On the left, advance `l`, update `leftMax`, and add `leftMax - height[l]`.
4. Otherwise advance `r` inward, update `rightMax`, and add `rightMax - height[r]`.
5. Updating the maximum first keeps each added depth nonnegative; return the accumulated total.

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

Maintain that `leftMax` and `rightMax` are the true maxima outside and at the current pointers,
and that all cells outside `[l, r]` have their final water counted. If `leftMax < rightMax`, the
right side of the next left cell has a wall at least `rightMax`, so `leftMax` is its limiting wall;
the algorithm computes its exact depth. The other branch is symmetric. Each step preserves the
invariant and removes one cell, so all cells are counted exactly once.

**Complexity**

- **Time:** `O(n)` because each pointer moves inward at most `n` times total.
- **Space:** `O(1)` auxiliary space.
