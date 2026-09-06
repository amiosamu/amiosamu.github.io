---
# Sort an Array · Medium · Arrays & Hashing
# https://leetcode.com/problems/sort-an-array/
draft: false
pattern: "Top-down merge sort"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

The point of the problem is that `nums.sort()` is banned, so I have to write an
`O(n log n)` sort myself. Merge sort is the right pick over quicksort here: its bound is
worst-case, not expected, and LeetCode's test set for this problem includes the adversarial
inputs that make naive pivot choice quadratic. Merging is the only real work — two sorted
halves become one sorted whole by repeatedly taking the smaller front element.

## Approach

1. Write a recursive helper `merge_sort(lo, hi)` that sorts the half-open range
   `nums[lo:hi]` in place; call it with `(0, len(nums))`.
2. Base case: `hi - lo <= 1` means zero or one element, already sorted, return.
3. Split at `mid = (lo + hi) // 2` and recurse on `[lo, mid)` and `[mid, hi)`.
4. Merge: with `i = lo` walking the left half and `j = mid` the right, append the smaller
   of `nums[i]` and `nums[j]` to a fresh `merged` list; use `<=` so equal elements keep
   left-half-first order (stability).
5. When one side is exhausted, `extend` `merged` with the leftovers of both ranges —
   `nums[i:mid]` and `nums[j:hi]`. One of those slices is always empty, so extending both
   is safe and avoids a second while loop.
6. Write back with the slice assignment `nums[lo:hi] = merged`, then return `nums` from the
   outer method.
7. Edge cases: an empty or single-element array hits the base case immediately; recursion
   depth is `log n`, far under Python's limit.

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

The merge step is correct because both halves are sorted, so the smallest unplaced element
is always at the front of one of them — taking it maintains the invariant that `merged` is
sorted and holds exactly the smallest elements seen so far. Induction on range length then
gives the whole sort: the base case is trivially sorted and each level assembles a sorted
range from two sorted children. Splitting in half gives `log n` levels with `O(n)` merging
work each, so `O(n log n)` time regardless of input order, and the scratch `merged` list
plus `O(log n)` stack frames make it `O(n)` space.
