---
# Car Pooling · Medium · Heap / Priority Queue
# https://leetcode.com/problems/car-pooling/
draft: false
pattern: "Sweep pickups, min-heap of drop-offs"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

Sorting the trips by pickup location gets the events in the order the car meets them, but that alone is not enough: the passengers who leave between two pickups are not in pickup order, they are in *drop-off* order. So I sort once by `start` to drive the sweep, and keep the riders currently on board in a **min-heap keyed by `end`** — at each new pickup the only thing I need is the earliest drop-off, and I keep popping while it is at or before the current location. The occupancy only ever peaks at a pickup, so checking capacity there is sufficient.

## Approach

1. Sort `trips` by `start`: `trips.sort(key=lambda t: t[1])`. The problem's tuples are `[numPassengers, start, end]`, so the pickup is index 1.
2. Keep `onboard`, a min-heap of `(end, numPassengers)`, and a running total `passengers`.
3. For each `numPassengers, start, end` in sorted order: first drop off everyone who is already done — `while onboard and onboard[0][0] <= start`, pop and subtract that group's count from `passengers`. The `<=` matters: a passenger leaving exactly at this location frees their seat before the new ones board.
4. Then add `numPassengers` to `passengers` and push `(end, numPassengers)` onto the heap.
5. If `passengers > capacity` at any point after boarding, return `False` immediately.
6. Heap ties on `end` fall through to the passenger count, which is irrelevant — every entry with `end <= start` gets popped regardless of order.
7. If the loop finishes, return `True`.

## Code

```python
import heapq

class Solution:
    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:
        trips.sort(key=lambda t: t[1])

        onboard = []  # (drop-off location, passengers in that group)
        passengers = 0

        for numPassengers, start, end in trips:
            while onboard and onboard[0][0] <= start:
                passengers -= heapq.heappop(onboard)[1]

            passengers += numPassengers
            if passengers > capacity:
                return False
            heapq.heappush(onboard, (end, numPassengers))

        return True
```

## Why it works

Occupancy is a step function that only increases at pickups, so if capacity is ever exceeded it is exceeded at some pickup, and checking there catches every violation. Processing pickups left to right and draining the heap of drop-offs that are behind us keeps `passengers` equal to the true occupancy just after each boarding — the heap gives the earliest pending drop-off in O(1), which is the only one worth testing against `start`. Each trip is pushed and popped once, so the sweep is O(n) heap operations at O(log n) each, dominated by the initial sort: O(n log n) time, O(n) space.
