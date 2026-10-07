---
# Find Minimum In Rotated Sorted Array · Medium · Binary Search
# https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
draft: false
pattern: "Binary search against the last element"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a rotated, ascending array `nums` of distinct integers, return its minimum element.
The required running time is `O(log n)`.

**Example**

```
Input: nums = [3,4,5,1,2]
Output: 1
```

Explanation: Rotation moved the sorted suffix `[1,2]` after `[3,4,5]`, so `1` is the
minimum.

## Intuition

A rotation creates two increasing runs. Every value in the left run is greater than the
last array value, while every value in the right run is less than or equal to it. Therefore,
`nums[i] <= nums[-1]` changes from false to true exactly at the minimum.

This monotone boundary can be found with binary search. In an unrotated or one-element
array, the predicate is already true at index `0`, so the same search handles both cases.

## Approach

1. Save `pivot = nums[-1]` and search the inclusive interval from `l = 0` to
   `r = len(nums) - 1`.
2. Compute `mid`. If `nums[mid] > pivot`, `mid` belongs to the left run, so set
   `l = mid + 1`.
3. Otherwise, `mid` may be the first index of the right run. Keep earlier candidates by
   setting `r = mid - 1`.
4. When the interval is empty, `l` is the first index whose value is at most `pivot`.
   Return `nums[l]`.

## Code

```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        pivot = nums[-1]
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] > pivot:
                l = mid + 1
            else:
                r = mid - 1
        return nums[l]
```

## Why it works

At every iteration, indices below `l` are known to be in the left run, and indices above
`r` are known to be in the right run. Each branch preserves this invariant by discarding
only indices on the identified side. Because the final element always satisfies the
predicate, a valid right-run index remains. When the interval empties, `l` is its first
index, which is exactly the minimum.

**Complexity**

- **Time:** `O(log n)` because each iteration halves the search interval.
- **Space:** `O(1)` auxiliary space.
