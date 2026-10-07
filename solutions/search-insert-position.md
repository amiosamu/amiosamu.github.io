---
# Search Insert Position · Easy · Binary Search
# https://leetcode.com/problems/search-insert-position/
draft: false
pattern: "Lower bound via binary search"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a sorted array of distinct integers `nums`, return the index of `target` if present or the
index where it should be inserted to preserve sorted order.

**Example**

```
Input: nums = [1,3,5,6], target = 5
Output: 2
```

Explanation: `5` already appears at index `2`.

## Intuition

The required position is the first index whose value is at least `target`. If such a value
equals `target`, it is the existing position; otherwise it is the insertion point. Values less
than `target` form a prefix, so binary search can find the boundary after that prefix.

## Approach

1. Search the inclusive interval `[l, r]`, maintaining that indices before `l` are too small
   and indices after `r` are at least `target`.
2. If `nums[mid] < target`, move `l` to `mid + 1`; otherwise move `r` to `mid - 1`.
3. When the interval empties, return `l`, the boundary between the two regions.
4. This also handles boundary cases: `l` remains `0` for a new minimum and becomes `n` for a
   value larger than every element.

## Code

```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return l
```

## Why it works

Initially the classified regions outside `[l, r]` are empty. If `nums[mid] < target`, sortedness
proves every index through `mid` is too small. Otherwise every index from `mid` onward is at
least `target`. Each update therefore preserves the invariant. At termination the regions are
adjacent, making `l` the first index with value at least `target`, exactly the required position.

**Complexity**

- **Time:** `O(log n)` because the search interval halves each iteration.
- **Space:** `O(1)` auxiliary space.
