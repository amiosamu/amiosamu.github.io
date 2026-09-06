---
# Sliding Window Maximum · Hard · Sliding Window
# https://leetcode.com/problems/sliding-window-maximum/
draft: false
pattern: "Monotonic decreasing deque of indices"
time: "O(n)"
space: "O(k)"
---

## Description

Given an array `nums` and a window size `k`, return an array of the maximum value in each contiguous window of size `k` as it slides from the start of `nums` to the end.

**Example**

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

Explanation: the first window `[1,3,-1]` has max 3, the next `[3,-1,-3]` has max 3, and so on through `[6,7]`'s implicit predecessor `[5,3,6]` (max 6) and `[3,6,7]` (max 7).

## Intuition

Rescanning each window is O(n * k). The observation that kills it: if `nums[i] <= nums[j]` for some `i < j`, then `nums[i]` can never be the maximum of any window that still contains it, because such a window also contains the newer and bigger `nums[j]`. So those dominated values can be thrown away permanently, and what survives is a deque of indices whose values strictly decrease — its front is the current window's maximum, its back is the newest element.

## Approach

1. Keep `dq`, a `collections.deque` of *indices* (indices, not values, so I can tell when one falls out of the window), and `res` for the answers.
2. For each `r` in `range(len(nums))`: while `dq` is non-empty and `nums[dq[-1]] <= nums[r]`, pop from the back — those elements are dominated by `nums[r]` and can never win again.
3. Append `r` to the back. The deque's values are now non-increasing from front to back.
4. Expire the front: if `dq[0] <= r - k`, `popleft` — that index has slid out of the window `[r - k + 1, r]`. One check suffices, since at most one index leaves per step.
5. Once `r >= k - 1` the window is fully formed, so append `nums[dq[0]]` to `res`.
6. Return `res`. With `k = 1` this degenerates correctly: the front is always `r` itself.

## Code

```python
import collections

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq = collections.deque()
        res = []
        for r in range(len(nums)):
            while dq and nums[dq[-1]] <= nums[r]:
                dq.pop()
            dq.append(r)
            if dq[0] <= r - k:
                dq.popleft()
            if r >= k - 1:
                res.append(nums[dq[0]])
        return res
```

## Why it works

The invariant is that `dq` holds exactly the indices in `[r - k + 1, r]` that are not dominated by any later index in the window, in increasing index order and strictly decreasing value order. Discarding a dominated index is safe because every future window containing it also contains its dominator, so it can never be an answer; and the largest surviving value sits at the front, which is why `nums[dq[0]]` is the window maximum. Every index is pushed once and popped at most once, so the total deque work is O(n) despite the inner while loop, and the deque never holds more than `k` indices.
