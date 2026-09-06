---
# Search In Rotated Sorted Array · Medium · Binary Search
# https://leetcode.com/problems/search-in-rotated-sorted-array/
draft: false
pattern: "Binary search on the sorted half"
time: "O(log n)"
space: "O(1)"
---

## Intuition

Rotation destroys the global order, so there is no single monotone predicate over the whole array to search on. What survives is local: wherever I cut at `mid`, at least one of the two halves is a contiguous un-rotated run, because the array contains only one break point and it can sit in only one half. In a sorted half I can decide membership with two comparisons against its endpoints; if the target is in there I recurse into it, otherwise it must be in the other half. That is still one probe per halving, so `O(log n)` in a single pass.

## Approach

1. Search space: the index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = len(nums) - 1`.
2. Invariant: if `target` is in `nums`, its index is in `[l, r]`, and `nums[l..r]` is itself a rotated sorted array (possibly with zero rotation).
3. Loop `while l <= r`, `mid = (l + r) // 2`. Return `mid` immediately if `nums[mid] == target`.
4. Decide which side is clean with `nums[l] <= nums[mid]`: true means `[l, mid]` is sorted (the `<=` handles `l == mid`), false means the break is in the left half and therefore `[mid, r]` is sorted.
5. Left half sorted: the target lives there iff `nums[l] <= target < nums[mid]`, in which case `r = mid - 1`; otherwise `l = mid + 1`.
6. Right half sorted: the target lives there iff `nums[mid] < target <= nums[r]`, in which case `l = mid + 1`; otherwise `r = mid - 1`.
7. Every branch excludes `mid`, so the interval strictly shrinks and the loop terminates.
8. On exit `l == r + 1`, the interval is empty and by the invariant the target is absent — return `-1`. Distinct values are what make the strict/non-strict boundaries above unambiguous.

## Code

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                return mid
            if nums[l] <= nums[mid]:
                if nums[l] <= target < nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
            else:
                if nums[mid] < target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1
        return -1
```

## Why it works

There is exactly one descent in the array, so it can lie in at most one of `[l, mid]` and `[mid, r]`; whichever half is free of it is fully sorted and a two-sided range check decides membership there exactly. When the check says "in the sorted half" the other half is provably excluded, and when it says "not in the sorted half" that half is excluded — either way one probe kills half the interval while preserving the invariant that the surviving range is itself a rotated sorted array. The interval halves every iteration, giving `O(log n)` time and `O(1)` space; the two-pass alternative (find the minimum first, then binary search the correct run) has the same cost.
