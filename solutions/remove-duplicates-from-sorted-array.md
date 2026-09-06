---
# Remove Duplicates From Sorted Array · Easy · Two Pointers
# https://leetcode.com/problems/remove-duplicates-from-sorted-array/
draft: false
pattern: "Slow write pointer, fast read pointer"
time: "O(n)"
space: "O(1)"
---

## Description

Given a sorted integer array `nums`, remove the duplicates in place so each distinct value appears only once, keeping the remaining elements in their original order, and return the count `k` of unique values; the first `k` elements of `nums` after the operation must hold the deduplicated values.

**Example**

```
Input: nums = [1,1,2]
Output: 2
```

Explanation: The only duplicate is the second `1`; removing it leaves `[1,2]` as the deduplicated prefix, and its length, 2, is what gets returned.

## Intuition

Because the array is sorted, equal values are contiguous — so a value is a duplicate exactly when it
equals the previous *kept* value. There is no need for a set or for shifting the tail on every
deletion (which would be O(n²)); one read pointer scans every element while a write pointer trails
behind marking the boundary of the deduplicated prefix. The write pointer only moves when something
new is found, so it can never overtake the reader and clobber unread data.

## Approach

1. `k = 1`: the first element is always kept, and the constraints guarantee at least one element, so
   the deduplicated prefix starts as `nums[0:1]`.
2. Read pointer `i` runs over `range(1, len(nums))`, advancing every iteration regardless of what it
   finds.
3. Compare `nums[i]` against `nums[k - 1]`, the last value written — not against `nums[i - 1]`,
   which may be a slot already overwritten by an earlier copy.
4. If they differ, `nums[i]` starts a new run: write `nums[k] = nums[i]` and increment `k`. If they
   are equal, skip — `i` moves on alone.
5. The write pointer moves right only, and never faster than the reader (`k <= i` always), which is
   why the in-place copy is safe.
6. Return `k`. The tail beyond index `k` is ignored by the judge, so nothing needs cleaning up.

## Code

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
```

## Why it works

The invariant is that `nums[0:k]` holds the distinct values seen so far in sorted order, with
`nums[k - 1]` the largest of them. Sortedness means any element equal to some earlier one is equal to
`nums[k - 1]` specifically, so the single comparison detects every duplicate and never rejects a
genuinely new value. One pass with `k` advancing at most once per step gives O(n) time and O(1)
extra space.
