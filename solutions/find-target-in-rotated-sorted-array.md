---
# Search In Rotated Sorted Array · Medium · Binary Search
# https://leetcode.com/problems/search-in-rotated-sorted-array/
draft: false
pattern: "Binary search on the sorted half"
time: "O(log n)"
space: "O(1)"
---

## Description

Given an ascending array of distinct integers rotated at an unknown pivot, return the index
of `target`, or `-1` if `target` is absent. The solution must run in `O(log n)` time.

**Example**

```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

Explanation: `nums[4]` equals the target `0`.

## Intuition

Rotation introduces one break in sorted order. For any midpoint, at least one of the ranges
`[l, mid]` and `[mid, r]` does not contain that break and is therefore sorted.

Once the sorted half is known, its endpoint values determine whether it can contain the
target. The search keeps that half when it contains the target and otherwise keeps the
other half.

## Approach

1. Search the inclusive interval `[l, r]`. Return `mid` immediately when
   `nums[mid] == target`.
2. If `nums[l] <= nums[mid]`, the left half is sorted. Keep it only when
   `nums[l] <= target < nums[mid]`; otherwise keep the right half.
3. Otherwise, the right half is sorted. Keep it only when
   `nums[mid] < target <= nums[r]`; otherwise keep the left half.
4. Return `-1` if the interval becomes empty. Distinct values make the sorted-half tests
   unambiguous, including when `l == mid`.

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

If the target exists, its index remains in `[l, r]`. At least one half is sorted, and the
range check is exact on that half because all values are distinct. The algorithm therefore
discards only a half that cannot contain the target, preserving the invariant. Each update
also removes `mid`, so the search terminates. A found index is correct by direct comparison;
an empty interval proves the target is absent.

**Complexity**

- **Time:** `O(log n)` because the remaining interval is halved each iteration.
- **Space:** `O(1)` auxiliary space.
