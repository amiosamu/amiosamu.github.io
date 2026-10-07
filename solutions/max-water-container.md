---
# Container With Most Water · Medium · Two Pointers
# https://leetcode.com/problems/container-with-most-water/
draft: false
pattern: "Two pointers, drop the shorter wall"
time: "O(n)"
space: "O(1)"
---

## Description

Given vertical line heights in `height`, choose two lines that form a container with the x-axis
and return its maximum possible area.

**Example**

```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
```

Indices 1 and 8 give width 7 and limiting height 7, so their area is `7 * 7 == 49`.

## Intuition

Start with the widest container. Its shorter wall limits the area. Moving the taller wall inward
reduces width while retaining the same height limit, so it cannot improve any container that keeps
the shorter wall.

Therefore, after measuring a pair, discard its shorter wall. Equal walls allow either one to be
discarded safely.

## Approach

1. Set `l` and `r` to the two ends and initialize `res = 0`.
2. Compute the current area and update `res`.
3. Move the pointer at the shorter wall; on a tie, the code moves `r`.
4. Continue until the pointers meet, then return `res`.

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

Suppose `height[l] <= height[r]`. Any container using `l` and an index inside the current window
has no greater width and is still limited to height at most `height[l]`. It cannot beat the pair
just measured, so discarding `l` cannot lose a better answer. The symmetric argument applies when
the right wall is shorter. By induction, every discarded endpoint has already achieved its best
possible area, so the maximum measured area is globally optimal.

**Complexity**

- **Time:** `O(n)` because one pointer moves on every iteration.
- **Space:** `O(1)` auxiliary space.
