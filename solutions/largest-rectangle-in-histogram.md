---
# Largest Rectangle In Histogram · Hard · Stack
# https://leetcode.com/problems/largest-rectangle-in-histogram/
draft: false
pattern: "Monotonic increasing stack of bar starts"
time: "O(n)"
space: "O(n)"
---

## Description

Given the heights of unit-width histogram bars, return the largest area of a rectangle formed
from contiguous bars.

**Example**

```
Input: heights = [2,1,5,6,2,3]
Output: 10
```

The bars of heights `5` and `6` support a width-two rectangle of height `5`, with area `10`.

## Intuition

For a chosen rectangle height, the widest valid span ends at the first shorter bar on either side.
A monotonic stack delays calculating a bar's area until its first shorter bar on the right appears.
Each entry also stores the earliest index to which that height can extend on the left.

## Approach

1. Keep a stack of `(start, height)` pairs whose heights are non-decreasing, plus `maxArea`.
2. For each bar at `i`, begin with `start = i` and pop every entry whose height exceeds it.
3. A popped `(idx, height)` spans through `i - 1`; update the area with `height * (i - idx)`
   and assign `start = idx` so the shorter current bar inherits that left boundary.
4. Push `(start, h)`. Equal heights remain as separate entries because the loop pops only `>`;
   this preserves a non-decreasing, not strictly increasing, stack.
5. After the scan, measure every remaining entry through the histogram's right edge and return the
   largest area. An empty histogram correctly returns zero.

## Code

```python
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []
        maxArea = 0

        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                idx, height = stack.pop()
                maxArea = max(maxArea, height * (i - idx))
                start = idx
            stack.append((start, h))

        for idx, height in stack:
            maxArea = max(maxArea, height * (len(heights) - idx))

        return maxArea
```

## Why it works

For every stack entry `(start, height)`, all bars from `start` through the current index have height
at least `height`. When a shorter bar appears at `i`, that span cannot extend right, so
`height * (i - start)` is the widest rectangle limited by that entry. Propagating the popped
`start` to the new shorter bar preserves the invariant. Equal-height entries may overlap, but the
earliest one still measures their widest span. Entries never popped during the scan can extend to
the final boundary, so every possible limiting height is measured at its maximum width.

**Complexity**

- **Time:** `O(n)`, because every bar is pushed once and removed or finalized once.
- **Space:** `O(n)` for the stack.
