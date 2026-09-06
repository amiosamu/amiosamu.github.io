---
# Search In Rotated Sorted Array II · Medium · Binary Search
# https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
draft: false
pattern: "Rotated binary search with duplicate shrink"
time: "O(log n) average, O(n) worst"
space: "O(1)"
---

## Description

An array of integers, originally sorted in ascending order but possibly containing duplicates, has been rotated at an unknown pivot. Given the rotated array `nums` and a `target` value, return whether `target` occurs anywhere in `nums`.

**Example**

```
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true
```

Explanation: 0 appears at indices 3 and 4 of `nums`, so `true` is returned.

## Intuition

The version-one trick — decide which half is sorted with `nums[l] <= nums[mid]` — breaks when duplicates appear, because `nums[l] == nums[mid] == nums[r]` gives no information at all: `[1,0,1,1,1]` and `[1,1,1,0,1]` look identical at those three positions. The fix is to admit defeat on exactly that case and shrink the interval by one from each end, which is safe since `nums[l]` and `nums[r]` are not the target (we just checked `nums[mid]`, and they equal it). Every other case is handled exactly as before, so the worst case degrades to `O(n)` only on runs of equal values.

## Approach

1. Search space: the index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = len(nums) - 1`.
2. Invariant: if `target` occurs in `nums`, an occurrence is in `[l, r]`, and `nums[l..r]` is still a rotated sorted array.
3. Loop `while l <= r`, `mid = (l + r) // 2`. Return `True` on `nums[mid] == target`.
4. Ambiguity check first: if `nums[l] == nums[mid] == nums[r]`, neither endpoint comparison can tell which half is sorted, so do `l += 1` and `r -= 1` and continue. This is sound precisely because `nums[mid] != target` was just established and both endpoints equal `nums[mid]`.
5. Otherwise `nums[l] <= nums[mid]` correctly identifies `[l, mid]` as a sorted run; if false, `[mid, r]` is the sorted run.
6. Left half sorted: go left with `r = mid - 1` iff `nums[l] <= target < nums[mid]`, else `l = mid + 1`.
7. Right half sorted: go right with `l = mid + 1` iff `nums[mid] < target <= nums[r]`, else `r = mid - 1`.
8. Every branch shrinks `r - l` by at least one, so the loop terminates; on exit `l == r + 1`, the interval is empty and the target is absent — return `False`.

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

When the three probes are not all equal, at least one of `nums[l] <= nums[mid]` and its negation pins down a genuinely sorted half, and the range check on that half is exact — so the discarded half provably cannot hold the target, exactly as in the distinct-values version. When all three are equal, dropping both endpoints removes only values equal to `nums[mid] != target`, so the invariant survives and no occurrence is lost. Each iteration shrinks the interval, halving it except in the ambiguous case, which gives `O(log n)` typically and `O(n)` when the array is nearly all one value (`[1,1,1,1,1]` searching for `0` is unavoidably linear), with `O(1)` space.
