---
# Merge Intervals · Medium · Intervals
# https://leetcode.com/problems/merge-intervals/
draft: false
pattern: "Sort by start, sweep and merge"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given a list of intervals, merge all overlapping intervals and return the resulting disjoint
intervals.

**Example**

```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```

The first two intervals overlap and merge into `[1,6]`; the remaining intervals stay separate.

## Intuition

Sorting by start time makes every interval that can extend the current merged group appear before
any interval separated from it by a gap. The next interval therefore needs comparison only with the
last output interval.

An overlap extends the current end to the larger end; a gap starts a new output interval.

## Approach

1. Sort `intervals` in place by start time and copy the first interval into `res`.
2. For each remaining interval, compare `start` with `res[-1][1]`.
3. If they overlap or touch, set the current end to `max(lastEnd, end)`.
4. Otherwise append a new `[start, end]` interval.
5. Return `res`. New inner lists prevent merged ends from changing the input intervals themselves.

## Code

```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda interval: interval[0])
        res = [list(intervals[0])]

        for start, end in intervals[1:]:
            lastEnd = res[-1][1]
            if start <= lastEnd:
                res[-1][1] = max(lastEnd, end)
            else:
                res.append([start, end])

        return res
```

## Why it works

After each iteration, `res` contains the exact merged union of the processed intervals in disjoint
start order. Only its last interval can overlap the next input because all earlier output intervals
end before that last group starts. If the next start is within the last group, taking the larger end
preserves their union. Otherwise there is a gap, so appending is necessary. This maintains the
invariant by induction and proves the final output is exactly the merged union.

**Complexity**

- **Time:** `O(n log n)` for sorting and `O(n)` for merging.
- **Space:** `O(n)` for the returned intervals and Python sort workspace. The outer input order is
  mutated by sorting, but its interval objects are not modified.
