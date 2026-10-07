---
# Car Pooling · Medium · Heap / Priority Queue
# https://leetcode.com/problems/car-pooling/
draft: false
pattern: "Sweep pickups, min-heap of drop-offs"
time: "O(n log n)"
space: "O(n)"
---

## Description

Each trip `[passengers, start, end]` picks up a group at `start` and drops it off at `end`.
Given the car's `capacity`, return whether every trip can be completed without exceeding it.

**Example**

```
Input: trips = [[2,1,5],[3,3,7]], capacity = 4
Output: false
```

Both groups are in the car between locations 3 and 5, requiring five seats when only four are
available.

## Intuition

Sweep pickups from left to right. Before each pickup, remove every group whose drop-off is at
or before that location. A min-heap ordered by drop-off exposes those groups in the required
order. Occupancy can increase only at a pickup, so capacity only needs to be checked there.

## Approach

1. Sort `trips` in place by pickup location. This mutates the input order.
2. Maintain `onboard`, a min-heap of `(end, count)`, and `passengers`, the current occupancy.
3. At each `start`, pop all entries with `end <= start` and subtract their counts. Drop-offs at
   the pickup location happen first and free their seats.
4. Add the new group, reject immediately if capacity is exceeded, and otherwise push its
   drop-off entry. If every pickup succeeds, return `True`.

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

Before each group boards, the heap contains exactly the groups whose trips have started but not
ended, and `passengers` is their total size. Removing every `end <= start` preserves this
invariant; adding the new group then gives the exact occupancy after the pickup. Since occupancy
only rises at pickups, every violation is detected and returning `True` means none exists.

**Complexity**

- **Time:** `O(n log n)` for sorting and at most one heap push and pop per trip.
- **Space:** `O(n)` for the heap. The input list is sorted in place.
