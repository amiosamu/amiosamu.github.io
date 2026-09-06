---
# Find in Mountain Array · Hard · Binary Search
# https://leetcode.com/problems/find-in-mountain-array
draft: false
pattern: "Find peak, then two binary searches"
time: "O(log n)"
space: "O(1)"
---

## Description

Given read-only access to a mountain array — strictly increasing to a single peak, then strictly decreasing — through a `MountainArray` interface exposing only `get(index)` and `length()`, find and return the leftmost index at which `target` occurs, or `-1` if it never occurs. The array cannot be scanned directly, and the number of `get` calls is capped, which is what rules out a linear search and pushes toward two binary searches instead.

**Example**

```
Input: target = 3, mountain_arr = [1,2,3,4,5,3,1]
Output: 2
```

Explanation: 3 occurs twice, at index 2 on the ascending side and index 5 on the descending side; the search returns the leftmost match, index 2.

## Intuition

A mountain array is not sorted, but it is two sorted arrays glued at the peak: strictly increasing up to it, strictly decreasing after. So the whole problem is finding the peak, after which I run a normal ascending binary search on the left slope and a descending one on the right. The peak itself is a boundary problem: `get(i) < get(i+1)` is true on the whole ascent and false on the whole descent, one clean flip. The 100-call budget is the real constraint: the peak search spends two `get` calls per step and each slope search one, which lands around 40 calls at `n = 10^4`.

## Approach

1. Read `n = mountain_arr.length()` once. Never call `get` twice for the same index inside a comparison you can restructure.
2. Peak search space: the index interval `[l, r]`, **inclusive on both ends**, with `l = 0`, `r = n - 2` — the last index at which `i + 1` is still valid. `n >= 3` is guaranteed, so this interval is non-empty.
3. Monotone predicate: `P(i) = get(i) < get(i+1)`, "still ascending at `i`". True on `[0, peak)`, false on `[peak, n-2]`. The answer is the first false index, which is the peak.
4. Loop `while l <= r`, `mid = (l + r) // 2`; if ascending, `l = mid + 1`, else `r = mid - 1`. On exit `l == r + 1`, `r` is the last ascending index and `l` is the peak — set `peak = l`.
5. Helper `find(lo, hi, asc)`: the standard inclusive binary search over `[lo, hi]`, returning the index or `-1`. Fetch `v = get(mid)` once, return `mid` on a hit, and move `lo = mid + 1` when `(v < target) == asc` — on an ascending slope go right when the value is too small, on a descending slope go right when it is too big.
6. Run `find(0, peak, True)` first. Return it if it is not `-1`, since ties must resolve to the smallest index and the left slope holds every smaller index.
7. Otherwise return `find(peak + 1, n - 1, False)`, which is `-1` if the target is absent everywhere.
8. Note `peak` is included in the first search and excluded from the second, so the peak value is probed exactly once across the two calls.

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

The mountain shape guarantees `get(i) < get(i+1)` holds for exactly a prefix of indices and fails for exactly a suffix, so the first search converges on the unique peak, and each of the two slopes is strictly monotone, which is all a binary search requires. Searching the ascending slope first and returning on a hit satisfies the "smallest index" rule, because every index on the left slope is smaller than every index on the right. Three binary searches over `n` indices cost `O(log n)` time and `O(1)` space; the peak search spends two `get` calls per iteration and each slope search one, well inside the 100-call limit.
