---
# Car Fleet · Medium · Stack
# https://leetcode.com/problems/car-fleet/
draft: false
pattern: "Sort by position, stack of arrival times"
time: "O(n log n)"
space: "O(n)"
---

## Description

Cars at distinct positions drive toward the same `target` on a single-lane road. A faster car
cannot pass a slower car; if it catches one, both travel as a fleet at the slower speed. Given
the arrays `position` and `speed`, return the number of fleets that reach the target.

**Example**

```
Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
Output: 3
```

The cars at positions 10 and 8 form one fleet, those at 5 and 3 form another, and the car at
0 remains alone. Therefore, three fleets arrive.

## Intuition

Process cars from nearest to farthest from the target. For a car at `p` with speed `s`, its
unobstructed arrival time is `(target - p) / s`. If that time is no greater than the arrival
time of the fleet ahead, the car catches that fleet by the target. Otherwise, it can never
catch the fleet ahead and starts a new fleet.

## Approach

1. Sort `(position, speed)` pairs by decreasing position; this creates a new list and does not
   mutate either input array.
2. Keep `stack`, whose entries are fleet arrival times in the order those fleets are found.
3. For each pair `(p, s)`, compute `arrival = (target - p) / s`. Append it only when the stack
   is empty or it is greater than `stack[-1]`.
4. Return the number of stored arrival times. Equality means the car meets the fleet exactly at
   the target, so it does not create another fleet.

## Code

```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pairs = sorted(zip(position, speed), reverse=True)
        stack = []

        for p, s in pairs:
            arrival = (target - p) / s
            if not stack or arrival > stack[-1]:
                stack.append(arrival)

        return len(stack)
```

## Why it works

After each car is processed, `stack` contains exactly the arrival times of the fleets formed by
that car and all cars ahead of it. A car with `arrival <= stack[-1]` reaches the nearest fleet
ahead no later than that fleet reaches the target, so it merges and the invariant is unchanged.
A larger arrival time cannot catch that fleet, so appending it records exactly one new fleet.
Induction over the cars therefore proves that the final stack size is the answer.

**Complexity**

- **Time:** `O(n log n)` for sorting, followed by an `O(n)` scan.
- **Space:** `O(n)` for the sorted pairs and fleet arrival times.
