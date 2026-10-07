---
# Merge Sorted Array · Easy · Two Pointers
# https://leetcode.com/problems/merge-sorted-array/
draft: false
pattern: "Merge backwards into the tail"
time: "O(m + n)"
space: "O(1)"
---

## Description

Merge sorted array `nums2` into `nums1` in place. The first `m` values of `nums1` are valid, and
its remaining `n` positions provide space for all values from `nums2`.

**Example**

```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
```

Merging `[1,2,3]` with `[2,5,6]` fills `nums1` as `[1,2,2,3,5,6]`.

## Intuition

Writing from the front could overwrite an unread value in `nums1`. Writing from the back avoids
that problem because the unused capacity is at the end.

At each step, the larger remaining tail value belongs in the rightmost unfilled position.

## Approach

1. Set `i = m - 1`, `j = n - 1`, and output pointer `k = m + n - 1`.
2. While `nums2` has values left, write the larger source tail to `nums1[k]`.
3. Move the chosen source pointer and then decrement `k`.
4. Stop when `nums2` is exhausted; remaining `nums1` values are already correctly placed.
5. If `nums1` empties first, the `i >= 0` guard causes all remaining `nums2` values to be copied.

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

Before each iteration, `nums1[k + 1:]` contains the largest merged values in final sorted order,
and the unmerged values end at `i` and `j`. Since both sources are sorted, the larger tail is the
largest remaining value and belongs at `k`. Also, `k = i + j + 1`, so writing there cannot destroy
an unread `nums1` value. Induction preserves the invariant until `nums2` is exhausted, after which
the untouched `nums1` prefix is already correct.

**Complexity**

- **Time:** `O(m + n)` in the worst case.
- **Space:** `O(1)` auxiliary space; `nums1` is mutated in place.
