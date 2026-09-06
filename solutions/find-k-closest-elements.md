---
# Find K Closest Elements · Medium · Sliding Window
# https://leetcode.com/problems/find-k-closest-elements/
draft: false
pattern: "Binary search the window start"
time: "O(log(n - k) + k)"
space: "O(1)"
---

## Intuition

The answer must be `k` *consecutive* elements: `arr` is sorted, so if two elements are in the answer, everything between them is at least as close as the further of the two. That reduces the problem to picking one number — the start index `l` of the window, somewhere in `[0, n - k]`. And the choice is monotone: comparing the element about to fall off the left, `arr[mid]`, against the one that would be gained on the right, `arr[mid + k]`, tells me which half of the candidate starts to discard, so binary search finds `l` directly.

## Approach

1. Search over *window starts*, not values: `lo = 0`, `hi = len(arr) - k`. Every start in that range yields a full `k`-wide window.
2. While `lo < hi`, take `mid = (lo + hi) // 2` and compare the two boundary candidates: `x - arr[mid]` (how far the leftmost element of window `mid` is) against `arr[mid + k] - x` (how far the first element outside it is).
3. If `x - arr[mid] > arr[mid + k] - x`, the left element is strictly worse than the one we'd gain, so sliding right is at least as good: `lo = mid + 1`.
4. Otherwise window `mid` is at least as good as anything to its right: `hi = mid`. Note the tie goes left, which matches the tie-break rule "prefer the smaller element".
5. `mid + k` is always a valid index because `mid < hi <= len(arr) - k`, so no bounds check is needed.
6. When `lo == hi` the start is pinned; return `arr[lo:lo + k]`, which is already sorted ascending.

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

Define the window at start `i` as better-or-equal to the window at `i + 1` when `x - arr[i] <= arr[i + k] - x`; because `arr` is sorted, that predicate is monotone in `i`, so the starts split into a "keep sliding" prefix and a "stop" suffix, and the binary search converges on the first index of the suffix. Comparing only the two endpoints is enough since the `k - 1` shared elements are identical between neighbouring windows, and the `<=` tie-break keeps the smaller element, satisfying the problem's ordering rule. The search does O(log(n - k)) comparisons and the final slice copies `k` elements.
