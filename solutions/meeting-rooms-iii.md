---
# Meeting Rooms III · Hard · Intervals
# https://leetcode.com/problems/meeting-rooms-iii
draft: false
pattern: "Two heaps: free rooms and busy rooms"
time: "O(m log m + m log n)"
space: "O(n + m)"
---

## Intuition

The allocation rule names two "minimums" I have to answer fast, so each gets its own heap: the
lowest-numbered *free* room, and the earliest-finishing *busy* room. Processing meetings in start
order is what makes the delay rule work — a delayed meeting waits for the next room to free up, and
because the tie-break for delayed meetings is the original start time, start order is exactly the
order in which they get served. A delayed meeting keeps its duration, so it simply occupies the room
from that room's current end time for `end - start` more units.

## Approach

1. Sort `meetings` by start time; all starts are distinct, so the order is unambiguous.
2. Keep `count = [0] * n`, a min-heap `available` seeded with `range(n)` (heapified), and a min-heap
   `used` of `(endTime, room)` pairs for rooms currently booked.
3. For each `start, end`, first release: while `used` is non-empty and `used[0][0] <= start`, pop it
   and push its room back into `available`. Use `<=` — a room that frees exactly at `start` is
   usable now.
4. If `available` is non-empty, pop the smallest room number, push `(end, room)` onto `used`.
5. Otherwise the meeting is delayed. Pop `(endTime, room)` from `used` — the tuple ordering picks the
   earliest-freeing room and breaks ties by the lowest room number, which is exactly the rule — and
   push `(endTime + (end - start), room)` back. The delayed meeting runs for its full original
   duration starting at `endTime`.
6. Either way, increment `count[room]`.
7. Return `count.index(max(count))`; `index` returns the first position of the maximum, which is the
   required lowest room number on a tie.

## Code

```python
import heapq

class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        meetings.sort()

        count = [0] * n
        available = list(range(n))
        heapq.heapify(available)
        used = []  # (endTime, room)

        for start, end in meetings:
            while used and used[0][0] <= start:
                _, room = heapq.heappop(used)
                heapq.heappush(available, room)

            if available:
                room = heapq.heappop(available)
                heapq.heappush(used, (end, room))
            else:
                endTime, room = heapq.heappop(used)
                heapq.heappush(used, (endTime + (end - start), room))

            count[room] += 1

        return count.index(max(count))
```

## Why it works

Processing in start order means that when I reach a meeting, every meeting that could possibly have
claimed a room before it has already been placed, so the state of the two heaps is the true room
state at time `start` — that is the invariant the whole solution rests on. The release loop is
correct because `used` is ordered by end time, so once its minimum exceeds `start` no other room has
freed either; and when nothing is free, popping the minimum of `(endTime, room)` reproduces the
tie-break the problem specifies without any extra bookkeeping. Each of the `m` meetings does O(1)
heap pushes and pops plus one amortised release, and every room is released at most once per
meeting, giving O(m log m) for the sort and O(m log n) for the heap traffic, with O(n + m) space for
the heaps and the sort.
