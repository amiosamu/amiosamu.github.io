---
# Find K Closest Elements · Medium · Sliding Window
# https://leetcode.com/problems/find-k-closest-elements/
draft: false
pattern: "Binary search the window start"
time: "O(log(n - k + 1) + k)"
space: "O(1)"
---

## Description

Given sorted `arr`, return the `k` values closest to `x` in ascending order. Prefer the
smaller value when distances tie.

**Example**

```
Input: arr = [1,2,3,4,5], k = 4, x = 3
Output: [1,2,3,4]
```

Values 1 and 5 tie at distance 2, so the smaller value 1 is selected.

## Intuition

In a sorted array, the `k` selected values form one contiguous window: skipping an interior
value for an exterior one cannot improve closeness. The problem becomes choosing a start
index in `0..n-k`.

Adjacent candidate windows share `k - 1` values. Compare only the left value being removed
with the right value being added to decide whether the optimum lies farther right.

## Approach

1. Binary-search window starts with `lo = 0` and `hi = len(arr) - k`.
2. At `mid`, compare `x - arr[mid]` with `arr[mid + k] - x`, the two values that
   differ between neighboring windows.
3. If the left boundary is strictly farther, set `lo = mid + 1`; otherwise set
   `hi = mid`. Equality stays left to prefer the smaller value.
4. Return the sorted slice `arr[lo:lo + k]` when both bounds meet. If `k == len(arr)`,
   the search range already has one start and the full array is copied immediately.

## Code

```python
class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        lo, hi = 0, len(arr) - k
        while lo < hi:
            mid = (lo + hi) // 2
            if x - arr[mid] > arr[mid + k] - x:
                lo = mid + 1
            else:
                hi = mid
        return arr[lo:lo + k]
```

## Why it works

Neighboring windows differ only by `arr[i]` and `arr[i + k]`. If the left value is
farther from `x`, replacing it with the right value improves the window, so no start at or
left of `i` is optimal. Otherwise the current window is no worse, including the required
smaller-value tie, so the optimum remains at or left of `i`. Sorted boundaries make this
decision monotone, and binary search converges to the best start.

**Complexity**

- **Time:** `O(log(n - k + 1) + k)`, including copying the result slice.
- **Space:** `O(1)` auxiliary space.
- **Output:** `O(k)` for the returned slice.
