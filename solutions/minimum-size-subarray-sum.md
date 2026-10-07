---
# Minimum Size Subarray Sum · Medium · Sliding Window
# https://leetcode.com/problems/minimum-size-subarray-sum/
draft: false
pattern: "Shrink window while sum qualifies"
time: "O(n)"
space: "O(1)"
---

## Description

Given positive integers `nums` and a positive integer `target`, return the length of the shortest
contiguous subarray whose sum is at least `target`. Return `0` if no such subarray exists.

**Example**

```
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
```

Explanation: `[4, 3]` sums to `7`, and no length-one subarray reaches the target.

## Intuition

Because every value is positive, extending a window can only increase its sum and removing its
leftmost value can only decrease it. For each right endpoint, repeatedly shrinking a qualifying
window finds every shorter qualifying window ending there. Neither pointer ever moves backward.

## Approach

1. Track a window starting at `l`, its sum `total`, and a sentinel `best = len(nums) + 1`.
2. Move `r` from left to right and add `nums[r]` to `total`.
3. While the sum reaches `target`, record the window length, remove `nums[l]`, and advance `l`.
4. Return `best`, or `0` if the sentinel was never replaced. The array is not mutated.

## Code

```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        l = 0
        total = 0
        best = len(nums) + 1
        for r in range(len(nums)):
            total += nums[r]
            while total >= target:
                best = min(best, r - l + 1)
                total -= nums[l]
                l += 1
        return best if best <= len(nums) else 0
```

## Why it works

For a fixed right endpoint `r`, positivity makes window sums strictly decrease as `l` advances.
The inner loop records every qualifying start and stops immediately after the window becomes too
small, so it includes the shortest qualifying window ending at `r`. Applying this to every `r`
includes the globally shortest qualifying subarray. Once a left endpoint is removed, no earlier
right endpoint could benefit from revisiting it, so advancing `l` only forward loses no candidate.

**Complexity**

- **Time:** `O(n)` because each element enters and leaves the window at most once.
- **Space:** `O(1)` auxiliary space.
