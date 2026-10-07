---
# Non Overlapping Intervals · Medium · Intervals
# https://leetcode.com/problems/non-overlapping-intervals/
draft: false
pattern: "Greedy activity selection by earliest end"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given a list of intervals, return the minimum number to remove so that the remaining intervals
do not overlap. Intervals that only touch at an endpoint do not overlap.

**Example**

```
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
```

Explanation: Removing `[1, 3]` leaves three intervals that only touch at endpoints.

## Intuition

Minimizing removals is equivalent to maximizing the number kept. Among available intervals, the
one ending earliest leaves the most room for every later choice. Sort by end time, keep each
compatible interval, and count every conflicting interval as a removal.

## Approach

1. Sort `intervals` in place by end time and keep the first interval.
2. Track its end in `prev_end` and initialize `removed = 0`.
3. For each later interval, count a removal when `start < prev_end`; the earlier-ending interval
   remains the better choice.
4. Otherwise keep the interval and update `prev_end = end`. Equality is allowed because touching
   endpoints do not overlap.
5. Return `removed`.

## Code

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda interval: interval[1])

        removed = 0
        prev_end = intervals[0][1]

        for start, end in intervals[1:]:
            if start < prev_end:
                removed += 1
            else:
                prev_end = end

        return removed
```

## Why it works

Take an optimal compatible set and compare its first interval with the globally earliest-ending
interval chosen greedily. Replacing the optimal set's first interval with the greedy interval
cannot invalidate any later interval, because the replacement ends no later. Thus an optimal set
exists with the greedy first choice. Applying the same exchange argument after that endpoint proves
all greedy choices retain the maximum possible number, so the number removed is minimal.

**Complexity**

- **Time:** `O(n log n)` for sorting, followed by an `O(n)` scan.
- **Space:** `O(n)` auxiliary space in the worst case for Python's in-place sort. The input order
  is mutated.
