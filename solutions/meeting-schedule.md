---
# Meeting Rooms · Easy · Intervals
# https://leetcode.com/problems/meeting-rooms/
draft: false
pattern: "Sort by start, check adjacent pairs"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given meeting intervals, determine whether one person can attend all of them without overlap.

**Example**

```
Input: intervals = [[0,30],[5,10],[15,20]]
Output: false
```

The interval `[0,30]` overlaps both later meetings, so one person cannot attend all three.

## Intuition

After sorting by start time, an overlap must appear between adjacent intervals. If one interval
overlaps any later interval, the immediately following interval starts no later and therefore also
starts before the first interval ends.

Back-to-back meetings do not overlap, so the comparison must be strict.

## Approach

1. Sort `intervals` in place by start time, then end time.
2. Compare each interval's start with the previous interval's end.
3. Return `False` if `current_start < previous_end`; equality permits immediate reuse.
4. Return `True` if no adjacent overlap is found, including for zero or one meeting.

## Code

```python
class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        intervals.sort()

        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i - 1][1]:
                return False

        return True
```

## Why it works

Assume some sorted intervals `i < j` overlap. Since starts are nondecreasing, interval `i + 1`
starts no later than interval `j`, so it also starts before interval `i` ends. Thus an adjacent
overlap exists whenever any overlap exists. Conversely, every adjacent overlap is clearly a real
conflict. The scan therefore returns `True` exactly when all meetings are attendable.

**Complexity**

- **Time:** `O(n log n)` for sorting and `O(n)` for the scan.
- **Space:** `O(n)` worst case for Python's sort workspace; `intervals` is reordered in place.
