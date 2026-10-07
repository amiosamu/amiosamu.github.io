---
# Find in Mountain Array · Hard · Binary Search
# https://leetcode.com/problems/find-in-mountain-array
draft: false
pattern: "Find peak, then two binary searches"
time: "O(log n)"
space: "O(1)"
---

## Description

Through `MountainArray.length()` and `MountainArray.get(index)`, search an array that
strictly increases to one peak and then strictly decreases. Return the smallest target
index, or `-1` if absent, while respecting the API-call limit.

**Example**

```
Input: target = 3, mountain_arr = [1,2,3,4,5,3,1]
Output: 2
```

The target occurs at indices 2 and 5, so the required smallest index is 2.

## Intuition

A mountain array consists of two monotonic ranges joined at the peak. First locate the
peak from the change in adjacent direction. Then binary-search the increasing side before
the decreasing side; searching left first guarantees the smallest matching index.

The peak search uses two `get()` calls per iteration, and each slope search uses one. For
`n <= 10^4`, each search takes at most 14 iterations, so the code makes at most 56 `get()`
calls. It calls `length()` once; that separate method does not count toward the 100-call
limit on `get()`.

## Approach

1. Call `length()` once. Binary-search indices `0..n - 2` for the first `i` where
   `get(i) > get(i + 1)`; that index is the peak, and both adjacent reads are valid.
2. Define `find(lo, hi, asc)` as an inclusive binary search. Read `get(mid)` once per
   iteration and return immediately on equality.
3. Move right when `(value < target) == asc`: ascending search moves right for a small
   value, while descending search moves right for a large value.
4. Search `0..peak` first and return its match. Only if absent, search
   `peak + 1..n - 1`, so the two slope ranges do not overlap.

## Code

```python
class Solution:
    def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
        n = mountain_arr.length()

        l, r = 0, n - 2
        while l <= r:
            mid = (l + r) // 2
            if mountain_arr.get(mid) < mountain_arr.get(mid + 1):
                l = mid + 1
            else:
                r = mid - 1
        peak = l

        def find(lo: int, hi: int, asc: bool) -> int:
            while lo <= hi:
                mid = (lo + hi) // 2
                v = mountain_arr.get(mid)
                if v == target:
                    return mid
                # ascending: go right when too small; descending: when too big
                if (v < target) == asc:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return -1

        left = find(0, peak, True)
        return left if left != -1 else find(peak + 1, n - 1, False)
```

## Why it works

The predicate `get(i) < get(i + 1)` is true exactly before the peak and false from the
peak onward, so the first binary search returns the unique peak. Each resulting side is
strictly monotonic, and the direction-aware update preserves the standard binary-search
invariant that a possible target remains inside `[lo, hi]`. If both sides contain the
target, every left-side index is smaller, so searching and returning from that side first
satisfies the required tie rule.

**Complexity**

- **Time:** `O(log n)`, with one `length()` call and at most 56 `get()` calls when
  `n <= 10^4`.
- **Space:** `O(1)` auxiliary space.
