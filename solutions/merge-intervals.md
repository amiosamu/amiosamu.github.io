---
# Merge Intervals · Medium · Intervals
# https://leetcode.com/problems/merge-intervals/
draft: false
pattern: "Sort by start, sweep and merge"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

Comparing every pair is O(n^2) and also awkward, because merging two intervals can create a new one
that overlaps a third. Sorting by start time kills both problems: once the intervals are in start
order, anything that overlaps the group I am currently building must overlap it *now*, at the front
of the remaining list. So I only ever need to compare the next interval against the last one in the
output, and merging becomes a single pass that extends a running end.

## Approach

1. Sort `intervals` by start time.
2. Seed `res` with a copy of `intervals[0]` (copy it so the input list is not mutated). The problem
   guarantees at least one interval, so this is safe.
3. For each remaining `start, end`, compare `start` against `lastEnd = res[-1][1]`.
4. If `start <= lastEnd` the two touch or overlap, so extend in place:
   `res[-1][1] = max(lastEnd, end)`. The `max` is essential — the new interval may be fully
   contained, as `[2,3]` is inside `[1,10]`, and blindly assigning `end` would shrink the group.
5. Otherwise there is a real gap, so close the current group and start a new one by appending
   `[start, end]`.
6. Return `res`.

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

After sorting, the invariant is that `res` holds disjoint merged intervals and `res[-1]` is the only
one that can still grow, since every later interval has a start at least as large as `res[-1][0]`
and every earlier group ended before `res[-1]` began. That makes the single comparison against
`res[-1][1]` sufficient to decide merge-or-append, and `max` keeps the group's end at the true
maximum over its members. The sort dominates at O(n log n); the sweep is O(n), and the O(n) space is
the sort's working buffer, not the output.
