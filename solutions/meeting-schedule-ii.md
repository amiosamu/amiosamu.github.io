---
# Meeting Rooms II · Medium · Intervals
# https://leetcode.com/problems/meeting-rooms-ii/
draft: false
pattern: "Sweep line over start and end events"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

The answer is just the maximum number of meetings that are simultaneously in progress at any instant
— rooms are interchangeable, so nothing about *which* room matters. That turns the problem into a
sweep along the timeline: a start event adds one to the occupancy, an end event subtracts one, and I
want the peak. Since starts and ends are independent, I can sort the two lists separately and merge
them with two pointers rather than building explicit event tuples.

## Approach

1. Build `starts = sorted(i[0] for i in intervals)` and `ends = sorted(i[1] for i in intervals)`.
   Decoupling the pairs is legal because occupancy only cares about how many meetings have begun
   minus how many have finished.
2. Keep `s` and `e` as pointers into the two lists, `count` for the current occupancy, and `res` for
   the running maximum.
3. Loop while `s < len(starts)` — once every meeting has started, occupancy can only fall, so the
   remaining end events cannot improve `res`.
4. If `starts[s] < ends[e]`, the next event chronologically is a meeting beginning: advance `s`,
   `count += 1`.
5. Otherwise the next event is a meeting finishing: advance `e`, `count -= 1`.
6. The comparison must be strict `<`, so that when a start and an end coincide the end is processed
   first and the freed room is reused — back-to-back meetings share a room.
7. After each event set `res = max(res, count)` and return `res` at the end. An empty input never
   enters the loop and returns 0.

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

At any moment the number of rooms needed is exactly the number of active meetings, so the minimum
over the whole schedule is the peak of that curve — that many rooms are clearly necessary, and they
are also sufficient, because whenever a meeting starts while fewer than `res` are active there is a
free room by the pigeonhole principle. The two-pointer merge visits the events in true chronological
order and `count` is the occupancy after each one, so `res` is the peak. Sorting the two arrays is
O(n log n) and dominates the linear sweep; the arrays themselves are the O(n) space.
