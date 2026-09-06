---
# Container With Most Water · Medium · Two Pointers
# https://leetcode.com/problems/container-with-most-water/
draft: false
pattern: "Two pointers, drop the shorter wall"
time: "O(n)"
space: "O(1)"
---

## Intuition

Trying every pair is O(n²). Start instead with the widest possible container, `l = 0` and `r = n - 1`, and ask which wall can safely be discarded. The area is `(r - l) * min(height[l], height[r])`, so the shorter wall caps it. Keeping the shorter wall and moving the taller one inward strictly loses width and cannot gain height — the `min` is still bounded by that same short wall — so every container using the shorter wall is already no better than the one just measured. That makes it safe to throw the shorter wall away, and each step removes one line, so the whole scan is linear.

## Approach

1. Set `l, r = 0, len(height) - 1` and `res = 0`.
2. Loop while `l < r`.
3. Measure the current container: `(r - l) * min(height[l], height[r])`, and fold it into `res` with `max`.
4. Move the pointer at the shorter wall: if `height[l] < height[r]` do `l += 1`, else `r -= 1`.
5. Ties don't matter — when the walls are equal, both of them are capped by the same height, so discarding either one is safe; the `else` branch just picks the right.
6. Return `res`. With fewer than two lines the loop never runs and `0` is returned, which is correct.

## Code

```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0
        while l < r:
            res = max(res, (r - l) * min(height[l], height[r]))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return res
```

## Why it works

The exchange argument: suppose `height[l] < height[r]` and the optimal container uses line `l`. Its partner is some `j <= r`, so its width is `j - l <= r - l` and its height is `min(height[l], height[j]) <= height[l] = min(height[l], height[r])`. Both factors are dominated by the container just measured, so discarding `l` cannot discard the unique optimum. By induction the optimum always stays inside `[l, r]`, and it is measured when the pointers reach it. Each iteration shrinks the window by one, so at most `n - 1` containers are measured: O(n) time, O(1) space.
