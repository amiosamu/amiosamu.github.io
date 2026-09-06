---
# Meeting Rooms · Easy · Intervals
# https://leetcode.com/problems/meeting-rooms/
draft: false
pattern: "Sort by start, check adjacent pairs"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

A conflict is a pair of meetings that overlap, but I do not have to test all pairs. Sort by start
time and any overlap must show up between *neighbours*: if meeting `i` overlaps some later meeting
`j`, then every meeting between them also starts before `intervals[i]` ends, so in particular
`i` and `i+1` already conflict. One sort plus one adjacent-pair scan settles it.

## Approach

1. Sort `intervals` in place — plain `intervals.sort()` orders by start, then end, which is all I
   need.
2. Scan `i` from 1 to `len(intervals) - 1` and compare each meeting with its predecessor.
3. If `intervals[i][0] < intervals[i - 1][1]` the new meeting begins before the previous one has
   ended, so return `False` immediately.
4. Use strict `<`: a meeting starting exactly when the previous ends, like `[1,5]` then `[5,10]`, is
   attendable and must not be rejected.
5. If the loop finishes, no adjacent pair conflicts, so return `True`. An empty or single-meeting
   list never enters the loop and correctly returns `True`.

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

In start order, `intervals[i][0]` is non-decreasing, so if any pair `(i, j)` with `i < j` overlaps
then `intervals[j][0] < intervals[i][1]` and every index `k` between them satisfies
`intervals[i][0] <= intervals[k][0] <= intervals[j][0] < intervals[i][1]` — meaning the conflict is
still visible one step at a time, and in particular at the adjacent pair `(i, i+1)`. Checking
neighbours therefore loses nothing, which reduces the quadratic pairwise test to a linear scan
behind an O(n log n) sort; the O(n) space is the sort's working buffer.
