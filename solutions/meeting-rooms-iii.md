---
# Meeting Rooms III · Hard · Intervals
# https://leetcode.com/problems/meeting-rooms-iii
draft: false
pattern: "Two heaps: free rooms and busy rooms"
time: "O(m log m + m log n)"
space: "O(n + m)"
---

## Description

Given `n` numbered rooms and meeting intervals, assign meetings by start time. Use the
lowest-numbered free room; if none is free, delay the meeting until the earliest room becomes
available while preserving its duration. Break room ties by number and return the most-used room.

**Example**

```
Input: n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]
Output: 0
```

Both rooms host two meetings, so the required lowest-numbered room is `0`.

## Intuition

Two heaps represent the two required minimums: the smallest available room number and the busy room
with the earliest end time. Busy-heap entries are `(endTime, room)`, so tuple ordering also applies
the room-number tie-break.

Processing meetings by original start time preserves their priority when delays occur. A delayed
meeting starts at the selected room's end time and retains duration `end - start`.

## Approach

1. Sort `meetings` in place by start time. Initialize all room numbers in `available`.
2. Before each meeting, move every room ending by `start` from `used` to `available`.
3. If a room is available, choose its smallest number and schedule the original end time.
4. Otherwise, choose the smallest `(endTime, room)` and schedule through `endTime + end - start`.
5. Increment that room's count and finally return the first index with the maximum count.

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

Before assigning each meeting, the heaps describe all earlier assignments: `available` contains
exactly the free rooms, and `used` contains each busy room keyed by its next end time. Releasing all
entries ending by `start` preserves this invariant. If `available` is non-empty, its minimum is the
required room. Otherwise, the minimum busy tuple is exactly the earliest room with the correct tie
break, so delaying there is forced. Induction over start order proves every assignment and count are
correct; the first maximum count supplies the final tie-break.

**Complexity**

- **Time:** `O(m log m + m log n)` for sorting and heap operations.
- **Space:** `O(n + m)` worst case, including heaps and Python sort workspace; `meetings` is
  reordered.
