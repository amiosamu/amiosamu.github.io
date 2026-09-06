---
# Median of Two Sorted Arrays · Hard · Binary Search
# https://leetcode.com/problems/median-of-two-sorted-arrays/
draft: false
pattern: "Binary search the partition point"
time: "O(log(min(m, n)))"
space: "O(1)"
---

## Intuition

Merging is `O(m + n)` and the requirement is logarithmic, so I never merge. The median is defined by a *cut*: split the combined elements into a left part and a right part of fixed sizes such that everything on the left is `<= `everything on the right; then the median is read off the two elements adjacent to the cut. A cut is fully determined by how many elements `i` it takes from `A` — the count from `B` is forced as `j = half - i` — so the unknown is a single number in `[0, m]`, and the condition on it is monotone. Searching the shorter array keeps it `O(log(min(m, n)))`.

## Approach

1. Swap so `A` is the shorter array; set `m, n = len(A), len(B)` and `half = (m + n + 1) // 2`, the size of the left part. The `+ 1` puts the extra element on the left when the total is odd, so the odd-case median is just the left part's maximum.
2. Search space: `i`, the number of elements taken from `A`, over the interval `[l, r]` **inclusive on both ends**, with `l = 0`, `r = m`. Note the upper end is `m`, not `m - 1` — taking all of `A` is a legal cut. `j = half - i` is automatically inside `[0, n]` because `m <= n`.
3. Sentinels: `Aleft = A[i-1] if i > 0 else -inf`, `Aright = A[i] if i < m else +inf`, same for `B` with `j`. They make the empty-side cases fall out with no branching.
4. Monotone predicate: `P(i) = Aleft <= Bright`. As `i` grows, `Aleft` only grows and `Bright` only shrinks, so `P` is true on a prefix of `[0, m]` and false after. `P(0)` is always true, so a true value always exists. The answer is the **last** true `i`.
5. Loop `while l <= r`, `i = (l + r) // 2`, `j = half - i`; if `Aleft <= Bright` then `l = i + 1`, else `r = i - 1`.
6. On exit `l == r + 1`, so `r` is the last `i` satisfying `P`. Set `i = r`, `j = half - i` and recompute the four boundary values.
7. The other half of the cut condition, `Bleft <= Aright`, comes for free: `P(i+1)` being false means `A[i] > B[j-1]`, which is exactly `Bleft < Aright`.
8. If `m + n` is odd, return `max(Aleft, Bleft)`. Otherwise return `(max(Aleft, Bleft) + min(Aright, Bright)) / 2`. The division must be float — LeetCode expects a `float` return.

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

A cut is valid exactly when `Aleft <= Bright` and `Bleft <= Aright`; the first condition is monotone in `i`, so binary search finds the largest `i` satisfying it, and maximality forces the second condition, since the search only stopped because `i + 1` violated `Aleft <= Bright` in `A`'s favour. With both conditions holding, the `half` elements on the left of the cut are precisely the `half` smallest overall, so their maximum and the minimum of the right side straddle the median by definition. The loop runs `O(log(min(m, n)))` iterations over the shorter array with `O(1)` extra space.
