---
# Search In Rotated Sorted Array II · Medium · Binary Search
# https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
draft: false
pattern: "Rotated binary search with duplicate shrink"
time: "O(log n) average, O(n) worst"
space: "O(1)"
---

## Description

An ascending array that may contain duplicates has been rotated at an unknown pivot. Given the
rotated array `nums` and `target`, return whether `target` occurs in `nums`.

**Example**

```
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true
```

Explanation: `0` appears at indices `3` and `4`, so the result is `true`.

## Intuition

Without duplicates, one half around `mid` is visibly sorted. Duplicates create an ambiguous case
when `nums[l] == nums[mid] == nums[r]`; neither half can then be identified from the endpoints.
After confirming the middle value is not `target`, both equal endpoints can safely be removed.

Outside that case, identify a sorted half and use its endpoint range to decide whether it can
contain `target`. Long duplicate runs explain the linear worst case.

## Approach

1. Search the inclusive interval `[l, r]`; return `True` if `nums[mid] == target`.
2. If both endpoints equal `nums[mid]`, remove them. They cannot equal `target` after step 1.
3. If `[l, mid]` is sorted, keep it exactly when `nums[l] <= target < nums[mid]`;
   otherwise keep the other half.
4. If the left half is not sorted, the right half is; keep it exactly when
   `nums[mid] < target <= nums[r]`.
5. Return `False` once every possible position has been discarded. An empty input starts with
   an empty interval and is handled directly.

## Code

```python
class Solution:
    def search(self, nums: List[int], target: int) -> bool:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                return True
            if nums[l] == nums[mid] == nums[r]:
                l += 1
                r -= 1
            elif nums[l] <= nums[mid]:
                if nums[l] <= target < nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
            else:
                if nums[mid] < target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1
        return False
```

## Why it works

The invariant is that any occurrence of `target` remains in `[l, r]`. In an unambiguous
iteration, one half is sorted, so its endpoint range determines exactly whether `target` can
lie there; the other half can be discarded without violating the invariant. In an ambiguous
iteration, both removed endpoints equal the already rejected middle value and are not targets.
Every update shrinks the interval, so an empty interval proves absence.

**Complexity**

- **Time:** `O(log n)` when intervals usually halve, but `O(n)` in the worst case because
  duplicate ambiguity may remove only two positions per iteration.
- **Space:** `O(1)` auxiliary space.
