---
# Sort an Array · Medium · Arrays & Hashing
# https://leetcode.com/problems/sort-an-array/
draft: false
pattern: "Top-down merge sort"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given an integer array `nums`, sort it in ascending order without a built-in sort and return it.

**Example**

```
Input: nums = [5,2,3,1]
Output: [1,2,3,5]
```

Explanation: Ascending order is `1, 2, 3, 5`.

## Intuition

Merge sort provides deterministic `O(n log n)` time regardless of input order. Recursively sort
two halves, then merge them by repeatedly taking the smaller unconsumed front value. Using `<=`
for ties also keeps equal values in their original relative order.

## Approach

1. Let `merge_sort(lo, hi)` sort the half-open range `nums[lo:hi]`; ranges of length at most
   one are already sorted.
2. Split at `mid`, then recursively sort `[lo, mid)` and `[mid, hi)`.
3. Compare the two ranges with pointers `i` and `j`, appending the smaller value to `merged`.
4. Append the unconsumed suffixes. These slices allocate additional temporary lists before
   `merged` is written back to `nums[lo:hi]`.
5. Sort the full range and return the mutated `nums`. Empty and one-element inputs stop at the
   base case.

## Code

```python
class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def merge_sort(lo: int, hi: int) -> None:
            if hi - lo <= 1:
                return

            mid = (lo + hi) // 2
            merge_sort(lo, mid)
            merge_sort(mid, hi)

            merged = []
            i, j = lo, mid
            while i < mid and j < hi:
                if nums[i] <= nums[j]:
                    merged.append(nums[i])
                    i += 1
                else:
                    merged.append(nums[j])
                    j += 1

            merged.extend(nums[i:mid])
            merged.extend(nums[j:hi])
            nums[lo:hi] = merged

        merge_sort(0, len(nums))
        return nums
```

## Why it works

During a merge, `merged` is sorted and contains exactly the consumed elements from both halves.
Because each half is sorted, the smaller front is the smallest remaining element, so appending
it preserves the invariant; appending the sole remaining suffix completes the sorted range.
By induction on range length, singleton ranges are sorted and every larger range is correctly
assembled from two sorted children. Therefore the full range is sorted.

**Complexity**

- **Time:** `O(n log n)` because each of `O(log n)` levels merges `O(n)` elements.
- **Space:** `O(n)` peak auxiliary space for `merged`, leftover slices, slice assignment, and
  `O(log n)` recursion. The temporary slicing does not change the linear bound.
