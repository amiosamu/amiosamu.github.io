---
# Largest Rectangle In Histogram · Hard · Stack
# https://leetcode.com/problems/largest-rectangle-in-histogram/
draft: false
pattern: "Monotonic increasing stack of bar starts"
time: "O(n)"
space: "O(n)"
---

## Intuition

Every maximal rectangle is limited by one bar: it has some height `h` from the histogram and extends left and right until it hits a bar shorter than `h`. So the answer is `max over i of heights[i] * (span of bars at least as tall as heights[i] around i)`, and the brute force is scanning outwards from each bar, O(n²). A stack kept increasing in height gives both edges for free — when a bar shorter than the top arrives, that top's right edge is exactly here, and its left edge is where it was first allowed to extend to. I store `(start, height)` so a popped bar carries its own left edge with it.

## Approach

1. Keep `stack` of `(index, height)` pairs, increasing in height from bottom to top, and `maxArea = 0`.
2. For each `i, h` from `enumerate(heights)`, set `start = i` — provisionally, the current bar begins where it stands.
3. While the stack is non-empty and `stack[-1][1] > h`, pop `(idx, height)`. That bar cannot extend past `i`, so its rectangle is `height * (i - idx)` and it is folded into `maxArea`.
4. After each pop set `start = idx`. This is the key step: the current bar is shorter, so it can be extended back over everything the popped bar covered.
5. Push `(start, h)` once the popping stops.
6. After the scan, everything left on the stack extends to the far right edge, so for each `(idx, height)` fold `height * (len(heights) - idx)` into `maxArea`.
7. Return `maxArea`. Equal heights are not popped (`>`, not `>=`), which is fine — the later, taller-or-equal duplicate inherits the earlier `start` when a shorter bar eventually pops both.

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

Because the stack is increasing, the bar below any entry is strictly shorter, so an entry's recorded `start` is one past the nearest shorter bar to its left — its true left boundary. When it is popped at index `i`, `heights[i]` is the first bar to its right that is shorter, so `i` is its true right boundary, and `height * (i - idx)` is the largest rectangle with that bar as the limiting height. Every bar is pushed exactly once and popped at most once, either mid-scan or in the final sweep, so every candidate rectangle is measured and the run is O(n) time with an O(n) stack.
