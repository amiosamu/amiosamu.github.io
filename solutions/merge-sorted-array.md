---
# Merge Sorted Array · Easy · Two Pointers
# https://leetcode.com/problems/merge-sorted-array/
draft: false
pattern: "Merge backwards into the tail"
time: "O(m + n)"
space: "O(1)"
---

## Description

Given two sorted integer arrays `nums1` and `nums2`, merge `nums2` into `nums1` in place so that `nums1` becomes one sorted array. `nums1` has length `m + n`, where the first `m` elements are the array to merge and the last `n` elements are unused placeholders that make room for `nums2`'s `n` elements.

**Example**

```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
```

Explanation: Merging the real elements of `nums1` (`[1,2,3]`) with `nums2` (`[2,5,6]`) in sorted order fills the padding slots and produces `[1,2,2,3,5,6]`.

## Intuition

Merging front to back is the natural instinct, but writing into `nums1[0]` would clobber a value I
have not read yet, which forces a copy of the first `m` elements. The free real estate is at the
*end*: `nums1` has exactly `m + n` slots and the last `n` are padding zeros. So fill from the back
with the largest remaining element — every write lands on a cell that is either padding or one whose
value has already been consumed.

## Approach

1. Three pointers: `i = m - 1` (last real element of `nums1`), `j = n - 1` (last element of
   `nums2`), `k = m + n - 1` (last slot of `nums1`).
2. Loop while `j >= 0`. Once `nums2` is exhausted the remaining `nums1` values are already sitting
   in their correct positions, so there is nothing left to do — that is why the condition is on `j`
   alone.
3. Each step, write the larger of `nums1[i]` and `nums2[j]` into `nums1[k]` and step that source
   pointer back. All three pointers only ever move left; moving forward would overwrite an unread
   value, which is the whole reason for going backwards.
4. Guard the comparison with `i >= 0`: when `nums1` runs out first, the `else` branch must take from
   `nums2`. Written as `if i >= 0 and nums1[i] > nums2[j]`, so `i < 0` falls through to copying
   `nums2[j]`.
5. Decrement `k` after every write. Return nothing — `nums1` is mutated in place.
6. Edge cases: `n == 0` skips the loop entirely; `m == 0` copies all of `nums2` down via the
   `i >= 0` guard.

## Code

```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
```

## Why it works

The invariant is `k == i + j + 1`, so the write cursor is always strictly ahead of the read cursor
`i` — no live value in `nums1` is ever overwritten before it is copied. Since both inputs are sorted,
the maximum of the two tails is the maximum of everything remaining, so placing it at `nums1[k]`
builds the merged array right to left in sorted order. Each element is moved at most once, giving
O(m + n) time with three integer variables and no auxiliary array.
