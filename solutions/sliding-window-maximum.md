---
# Sliding Window Maximum · Hard · Sliding Window
# https://leetcode.com/problems/sliding-window-maximum/
draft: false
pattern: "Monotonic decreasing deque of indices"
time: "O(n)"
space: "O(k)"
---

## Description

Given `nums` and window size `k`, return the maximum value in every contiguous window of size
`k`, from left to right.

**Example**

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

Explanation: The six windows have maxima `3, 3, 5, 5, 6, 7` respectively.

## Intuition

If `i < j` and `nums[i] <= nums[j]`, index `i` cannot become a future maximum while `j`
remains in the window: `j` is newer and at least as large. Remove such dominated indices from
the back of a deque. The remaining indices increase from front to back while their values
strictly decrease, so the front is always the maximum candidate.

Indices, rather than values, are stored so expired elements can be removed as the window moves.

## Approach

1. For each right endpoint `r`, pop deque indices from the back while their values are at most
   `nums[r]`, then append `r`.
2. Remove the front if its index is at most `r - k`, placing every retained index in the current
   window `[r - k + 1, r]`.
3. Once `r >= k - 1`, append `nums[dq[0]]`, the largest retained value.
4. Continue through `nums`. For `k == 1`, each element becomes its own window maximum.

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

After processing `r`, the deque contains in increasing index order exactly the undominated
candidates in the current window, with strictly decreasing values. Back removals preserve this
invariant because a removed index is older and no larger than `r`, so it cannot beat `r` in any
future shared window. Front removal discards only an expired index. Every other window element
is dominated by a retained later element, so the largest possible value is at the deque front.

**Complexity**

- **Time:** `O(n)` amortized because each index is appended once and removed at most once.
- **Space:** `O(k)` for the deque, plus `O(n - k + 1)` for the output.
