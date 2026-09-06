---
# Find Minimum In Rotated Sorted Array · Medium · Binary Search
# https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
draft: false
pattern: "Binary search against the last element"
time: "O(log n)"
space: "O(1)"
---

## Description

An array of distinct integers, originally sorted in ascending order, has been rotated between 1 and n times at an unknown pivot. Given the rotated array `nums`, return its minimum element in O(log n) time.

**Example**

```
Input: nums = [3,4,5,1,2]
Output: 1
```

Explanation: The original sorted array `[1,2,3,4,5]` was rotated so that 1 is the first element of the second run, making it the smallest value present.

## Intuition

A rotated sorted array is two increasing runs, and the minimum is the first element of the second run. The array is not globally sorted, so `nums[mid]` compared to a *target* tells me nothing — but compared to the fixed value `nums[n-1]` it does: every element of the first run is greater than `nums[n-1]`, and every element of the second run is less than or equal to it. That comparison is a monotone predicate over the indices, so the standard boundary search finds the run break directly. If the array was not rotated at all, the predicate is true everywhere and the boundary is index `0`, which is still the minimum.

## Approach

1. Fix `pivot = nums[-1]`, the last element, before the loop — comparing against a moving `nums[r]` works too, but a fixed pivot makes the predicate obviously monotone.
2. Search space: the index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = len(nums) - 1`.
3. Monotone predicate: `P(i) = nums[i] <= pivot`, i.e. "index `i` belongs to the second run". Values are distinct, so `P` is false on the whole first run and true on the whole second run — false prefix, true suffix. The answer is the first true index.
4. Invariant: every index `< l` fails `P` (first run), every index `> r` satisfies `P` (second run).
5. Loop `while l <= r`, `mid = (l + r) // 2`.
6. If `nums[mid] > pivot`, `mid` is in the first run and the minimum is strictly right: `l = mid + 1`. Otherwise `mid` is in the second run and is a candidate, but maybe not the first: `r = mid - 1`.
7. On exit `l == r + 1`: `r` is the last index of the first run and `l` is the first index of the second run. Return `nums[l]`.
8. `P(n-1)` is always true (`pivot <= pivot`), so `l` never exceeds `n - 1` and the return is always in bounds — that also covers the unrotated array, where `l` lands on `0`, and the single-element array.

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

Rotation splits the array into two increasing runs where every value in the first run exceeds every value in the second, so `nums[i] <= nums[n-1]` is false exactly on the first run and true exactly on the second — one clean flip, which is all a binary search needs. The invariant "left of `l` is first run, right of `r` is second run" is preserved by both branches, so when the interval empties `l` sits on the run boundary, and the first element of the second run is the array minimum. The interval halves each iteration, giving `O(log n)` time and `O(1)` space.
