---
# Median of Two Sorted Arrays · Hard · Binary Search
# https://leetcode.com/problems/median-of-two-sorted-arrays/
draft: false
pattern: "Binary search the partition point"
time: "O(log(min(m, n)))"
space: "O(1)"
---

## Description

Given two arrays sorted in ascending order, return the median of all their elements in
`O(log(min(m, n)))` time.

**Example**

```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0
```

The conceptual merged order is `[1,2,3]`, whose middle element is `2`.

## Intuition

Partition the combined order into a left half and a right half such that every left value is at
most every right value. If the partition takes `i` values from shorter array `A`, it must take
`j = half - i` values from `B`.

As `i` increases, `A` contributes larger left-boundary values while `B` contributes smaller
right-boundary values. This monotonicity permits binary search without merging the arrays.

## Approach

1. Make `A` the shorter array. Set `half = (m + n + 1) // 2`, placing any extra value left.
2. Binary-search `i` over the inclusive range `[0, m]`; taking none or all of `A` is valid.
   Because `m <= n`, `j = half - i` always lies in `[0, n]` for this search range.
3. Use `-inf` and `inf` when a partition side is empty. Search for the largest `i` satisfying
   `A[i - 1] <= B[j]`, moving right when it holds and left otherwise.
4. At the resulting cut, maximality also gives `B[j - 1] <= A[i]`; boundary sentinels cover
   `i == m` or `j == 0`.
5. For an odd total, return the left side's maximum. For an even total, average the left maximum
   and right minimum.

## Code

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        A, B = nums1, nums2
        if len(A) > len(B):
            A, B = B, A
        m, n = len(A), len(B)
        half = (m + n + 1) // 2

        l, r = 0, m
        while l <= r:
            i = (l + r) // 2
            j = half - i
            Aleft = A[i - 1] if i > 0 else float('-inf')
            Bright = B[j] if j < n else float('inf')
            if Aleft <= Bright:
                l = i + 1
            else:
                r = i - 1

        i = r
        j = half - i
        Aleft = A[i - 1] if i > 0 else float('-inf')
        Bleft = B[j - 1] if j > 0 else float('-inf')
        if (m + n) % 2:
            return max(Aleft, Bleft)
        Aright = A[i] if i < m else float('inf')
        Bright = B[j] if j < n else float('inf')
        return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
```

## Why it works

Let `P(i)` be `A[i - 1] <= B[half - i]`, with sentinels at array boundaries. As `i` grows,
the left side cannot decrease and the right side cannot increase, so `P` is true on a prefix.
Binary search returns its largest true index `i`. If `i < m`, `P(i + 1)` is false, which states
`A[i] > B[j - 1]`; if `i == m`, `A[i]` is `inf`. Thus `Bleft <= Aright` in both cases. Along with
`P(i)`, this proves every left-part value is at most every right-part value. Since the left part has
exactly `half` elements, its maximum and the right part's minimum determine the median.

**Complexity**

- **Time:** `O(log(min(m, n)))`.
- **Space:** `O(1)` auxiliary space.
