---
# Meeting Rooms II · Medium · Intervals
# https://leetcode.com/problems/meeting-rooms-ii/
draft: false
pattern: "Sweep line over start and end events"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given meeting intervals, return the minimum number of rooms needed so that overlapping meetings
never share a room.

**Example**

```
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
```

At most two meetings overlap at any time, so two rooms are necessary and sufficient.

## Intuition

The required room count is the maximum number of simultaneous meetings. A start event increases the
active count, while an end event decreases it.

Sort starts and ends independently and merge those event streams with two pointers. When times are
equal, process the end first so the room can be reused immediately.

## Approach

1. Build sorted arrays `starts` and `ends`; this does not reorder or mutate `intervals`.
2. Track event indices `s` and `e`, active meetings in `count`, and the peak in `res`.
3. If the next start is strictly before the next end, increment `count` and advance `s`.
4. Otherwise, decrement `count` and advance `e`, processing ends first on equal times.
5. Update `res` after each event and stop after all starts; later ends cannot raise the peak.

## Code

```python
class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        starts = sorted(interval[0] for interval in intervals)
        ends = sorted(interval[1] for interval in intervals)

        res = count = 0
        s = e = 0

        while s < len(starts):
            if starts[s] < ends[e]:
                s += 1
                count += 1
            else:
                e += 1
                count -= 1
            res = max(res, count)

        return res
```

## Why it works

After each processed event, `count` equals the number of active meetings: starts add one and ends
remove one, with an end correctly preceding a start at the same time. The pointers process events
chronologically, so `res` is the maximum active count. At that instant, `res` rooms are necessary.
They are also sufficient because each new meeting can use any room not occupied by the currently
active meetings. Therefore the peak is the minimum room count.

**Complexity**

- **Time:** `O(n log n)` for sorting, followed by an `O(n)` sweep.
- **Space:** `O(n)` for the two sorted event arrays.
