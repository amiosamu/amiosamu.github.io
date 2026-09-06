---
# Binary Search · Easy · Binary Search
# https://leetcode.com/problems/binary-search/
draft: false
pattern: "Classic binary search, inclusive bounds"
time: "O(log n)"
space: "O(1)"
---

## Intuition

The array is sorted, so one comparison against the middle element rules out half of what is left: if `nums[mid] < target` nothing at or left of `mid` can be the target, and symmetrically on the other side. Scanning is O(n); halving the live interval every step is O(log n). This is the template every other problem in this group is a variation of, so it is worth fixing one loop shape and reusing it.

## Approach

1. Search space: the index interval `[l, r]`, **inclusive on both ends**. Initialise `l = 0`, `r = len(nums) - 1`.
2. Loop invariant: if `target` is in `nums` at all, its index lies in `[l, r]`. An empty interval (`l > r`) therefore means the target is absent.
3. Loop `while l <= r` — `l == r` is a live one-element interval and must still be probed.
4. `mid = (l + r) // 2` (Python ints do not overflow, so no need for `l + (r - l) // 2`).
5. Three-way compare: `nums[mid] == target` returns `mid`; `nums[mid] < target` discards `[l, mid]` with `l = mid + 1`; otherwise discards `[mid, r]` with `r = mid - 1`.
6. Each branch strictly shrinks the interval (it always excludes `mid`), so the loop terminates.
7. On exit `l == r + 1`: the interval is empty and `target` is not present, so return `-1`. `l` is where the target *would* be inserted — that fact is the whole of Search Insert Position.

## Code

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return -1
```

## Why it works

The invariant "the target, if present, is in `[l, r]`" holds initially and is preserved by every branch, because sortedness means the half being discarded provably cannot contain the target. Termination is guaranteed since `mid` is always inside `[l, r]` and both updates exclude it, so `r - l` strictly decreases. The interval length halves each iteration, giving `O(log n)` comparisons and `O(1)` extra space.
