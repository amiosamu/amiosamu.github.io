---
# Capacity to Ship Packages Within D Days · Medium · Binary Search
# https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(sum(weights)))"
space: "O(1)"
---

## Intuition

Same shape as Koko: the thing being searched is the answer space, the capacities `[max(weights), sum(weights)]`, and the predicate "can I ship in `days` days with this capacity" is monotone — a bigger boat never needs more days. The second half of the insight is that for a *fixed* capacity the optimal packing is forced: order must be preserved, so greedily loading each package onto the current day until it would overflow is provably the minimum number of days. That makes the feasibility check a single linear pass.

## Approach

1. Write `days_needed(cap)`: start `d = 1`, `load = 0`; for each weight `w`, if `load + w > cap` open a new day (`d += 1`, `load = 0`), then `load += w`. Return `d`.
2. Search space: the capacity interval `[l, r]`, **inclusive on both ends**, with `l = max(weights)` (any smaller boat can never carry the heaviest package, so those capacities are not merely infeasible but ill-defined) and `r = sum(weights)` (ships everything in one day, feasible for any `days >= 1`).
3. Monotone predicate: `P(cap) = days_needed(cap) <= days`. False on a prefix of the interval, true on the suffix beginning at the answer.
4. Invariant: every capacity `< l` fails `P`, every capacity `> r` satisfies `P`.
5. Loop `while l <= r`, `mid = (l + r) // 2`.
6. If `days_needed(mid) <= days`, `mid` works but a smaller boat might too: `r = mid - 1`. Otherwise `l = mid + 1`.
7. On exit `l == r + 1`: `r` is the largest capacity that misses the deadline and `l` is the smallest that meets it — return `l`.
8. Because `l` starts at `max(weights)`, `days_needed` never loops forever on a package that cannot fit, and `P(sum(weights))` is always true, so `l` stays inside the interval.

## Code

```python
class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        def days_needed(cap: int) -> int:
            d, load = 1, 0
            for w in weights:
                if load + w > cap:
                    d += 1
                    load = 0
                load += w
            return d

        l, r = max(weights), sum(weights)
        while l <= r:
            mid = (l + r) // 2
            if days_needed(mid) <= days:
                r = mid - 1
            else:
                l = mid + 1
        return l
```

## Why it works

The greedy split is optimal by an exchange argument: after `i` packages, the greedy day-count is minimal and its current `load` is maximal among all minimal-day packings, so it can never be beaten by deferring a package to the next day. Given that, `days_needed` is non-increasing in `cap`, the predicate flips exactly once, and the loop invariant "left of `l` infeasible, right of `r` feasible" makes `l` the smallest feasible capacity when the interval empties. The search does `O(log(sum(weights)))` iterations of an `O(n)` check with `O(1)` extra space.
