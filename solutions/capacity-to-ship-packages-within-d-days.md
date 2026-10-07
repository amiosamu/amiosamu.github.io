---
# Capacity to Ship Packages Within D Days · Medium · Binary Search
# https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
draft: false
pattern: "Binary search on the answer"
time: "O(n log(sum(weights)))"
space: "O(1)"
---

## Description

Ship packages in their given order within `days` days. Return the smallest daily capacity that
can carry every package without exceeding the capacity on any day.

**Example**

```
Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
Output: 15
```

Capacity 15 permits loads `[1,2,3,4,5]`, `[6,7]`, `[8]`, `[9]`, and `[10]`. A smaller capacity
cannot meet the deadline.

## Intuition

For a fixed capacity, filling each day until the next package would overflow uses the fewest days
while preserving order. Feasibility is monotone: if a capacity meets the deadline, every larger
capacity does too. Binary search can therefore find the first feasible capacity between the
heaviest package and the total weight.

## Approach

1. `days_needed(cap)` greedily fills a day's load and starts a new day before a package would
   exceed `cap`.
2. Search inclusive capacities from `max(weights)`, which fits every package, through
   `sum(weights)`, which ships everything in one day.
3. For `mid`, move `r` left when `days_needed(mid) <= days`; otherwise move `l` right.
4. When the interval empties, return `l`, the first feasible capacity. The valid input is
   non-empty, so both initial bounds exist.

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

For a fixed capacity, the greedy first day contains the longest prefix that fits. Any valid
schedule's first day can contain no more packages; removing that prefix and applying the same
argument inductively proves `days_needed` is minimal. Increasing capacity cannot increase this
count, so feasibility changes from false to true once. Binary search maintains that capacities
below `l` are infeasible and capacities above `r` are feasible, making `l` the minimum feasible
capacity when the interval closes.

**Complexity**

- **Time:** `O(n log S)`, where `S = sum(weights) - max(weights) + 1` is the searched range.
- **Space:** `O(1)`.
