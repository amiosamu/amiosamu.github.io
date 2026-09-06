---
# Koko Eating Bananas · Medium · Binary Search
# https://leetcode.com/problems/koko-eating-bananas/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(max(piles)))"
space: "O(1)"
---

## Description

Koko has piles of bananas, given as an array `piles`, and `h` hours before the guards return. Each hour she picks one pile and eats up to `k` bananas from it (finishing that pile even if it has fewer than `k` left). Given `piles` and `h`, return the minimum integer eating speed `k` that lets her finish every pile within `h` hours.

**Example**

```
Input: piles = [3,6,7,11], h = 8
Output: 4
```

Explanation: At speed 4, the piles take `ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8` hours, exactly the limit, and no smaller speed finishes within 8 hours.

## Intuition

There is nothing sorted to search — the array to binary search is the *answer space*, the speeds `1 .. max(piles)`. The insight is that feasibility is monotone: if Koko finishes in time at speed `k`, she also finishes at every speed above `k`, since raising `k` can only reduce `ceil(p / k)` for every pile. So the feasible speeds form a suffix of `[1, max(piles)]` and I want its first element. Checking one speed costs a linear pass, so the whole thing is `O(n log(max(piles)))` instead of trying every speed.

## Approach

1. Write the check first: `hours(k) = sum((p + k - 1) // k for p in piles)`, the ceiling division that encodes "one pile per hour at most, leftovers still cost a full hour".
2. Search space: the speed interval `[l, r]`, **inclusive on both ends**, with `l = 1` (speed 0 eats nothing) and `r = max(piles)` (at that speed every pile takes exactly one hour, so `hours = n <= h` is guaranteed feasible by the constraints).
3. Monotone predicate: `P(k) = hours(k) <= h`. False on a prefix, true on the suffix that starts at the answer.
4. Invariant: every speed `< l` fails `P`, every speed `> r` satisfies `P`.
5. Loop `while l <= r`, `mid = (l + r) // 2`.
6. If `hours(mid) <= h`, `mid` is feasible but maybe not the smallest such speed, so search left: `r = mid - 1`. Otherwise `mid` is too slow: `l = mid + 1`.
7. On exit `l == r + 1`, `r` is the last infeasible speed and `l` is the first feasible one — return `l`.
8. Since `P(max(piles))` is guaranteed true, `l` can never run past `max(piles)`, so no "no answer" case exists.

## Code

```python
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        def hours(k: int) -> int:
            return sum((p + k - 1) // k for p in piles)

        l, r = 1, max(piles)
        while l <= r:
            mid = (l + r) // 2
            if hours(mid) <= h:
                r = mid - 1
            else:
                l = mid + 1
        return l
```

## Why it works

`hours(k)` is non-increasing in `k` because each term `ceil(p / k)` is non-increasing, so `hours(k) <= h` flips from false to true exactly once — that single flip is the boundary the search converges on. The invariant "everything left of `l` is infeasible, everything right of `r` is feasible" is preserved by both branches, so when the interval empties, `l` is the smallest feasible speed by construction. There are `O(log(max(piles)))` iterations and each runs one `O(n)` feasibility pass, with `O(1)` extra space.
