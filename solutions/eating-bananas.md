---
# Koko Eating Bananas · Medium · Binary Search
# https://leetcode.com/problems/koko-eating-bananas/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(max(piles)))"
space: "O(1)"
---

## Description

Koko chooses one pile per hour and eats up to `k` bananas from it. Given `piles` and `h`
hours, return the smallest integer speed `k` that finishes all piles in time.

**Example**

```
Input: piles = [3,6,7,11], h = 8
Output: 4
```

At speed 4, the piles require `1 + 2 + 2 + 3 = 8` hours. Every smaller speed takes
more than 8 hours.

## Intuition

Search the possible speeds rather than the unsorted piles. A pile of size `p` needs
`ceil(p / k)` hours at speed `k`. Increasing `k` never increases this value, so speeds
that finish in time form a monotone suffix from the minimum valid speed onward.

## Approach

1. Compute the hours for speed `k` with
   `sum((p + k - 1) // k for p in piles)`.
2. Binary-search the inclusive speed range from `1` to `max(piles)`. The upper bound takes
   one hour per pile and is feasible because the constraints guarantee `h >= len(piles)`.
3. If `mid` is feasible, continue left with `r = mid - 1`; otherwise continue right with
   `l = mid + 1`.
4. Maintain that speeds below `l` are known infeasible and speeds above `r` are known
   feasible. When the range is empty, return `l`; `piles` is never mutated.

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

For each pile, `ceil(p / k)` is non-increasing as `k` grows, so total required hours are
also non-increasing. The feasibility predicate therefore changes from false to true at
one boundary. Each binary-search branch preserves the invariant that all discarded lower
speeds are infeasible and all discarded upper speeds are feasible. At termination, `l`
is exactly the first feasible speed and hence the minimum answer.

**Complexity**

- **Time:** `O(n log M)`, where `M = max(piles)`.
- **Space:** `O(1)` auxiliary space.
