---
# Car Fleet · Medium · Stack
# https://leetcode.com/problems/car-fleet/
draft: false
pattern: "Sort by position, stack of arrival times"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

Cars never pass each other, so a faster car that catches a slower one simply inherits its speed — the whole clump then arrives at `target` when the *slowest* car in front of it would have. So instead of simulating collisions, compute each car's solo arrival time `(target - position) / speed` and process cars from the one closest to the target backwards. A car forms a new fleet only if its solo time is strictly greater than the current lead time; if it is less than or equal, it catches up and is absorbed. The number of fleets is then just the number of times a new, larger time appears.

## Approach

1. Zip `position` with `speed` and sort descending, so the car nearest `target` is handled first. Sorting on the tuple works because positions are distinct.
2. Keep `stack`, holding the arrival times of the fleets found so far; `stack[-1]` is the time of the fleet immediately ahead.
3. For each `(p, s)` in that order, compute `time = (target - p) / s`. Use true division — integer division would merge fleets that only *nearly* collide.
4. If the stack is empty, or `time > stack[-1]`, this car cannot reach the fleet ahead before `target`, so push `time` as a new fleet.
5. Otherwise `time <= stack[-1]`: the car catches that fleet on the way and is absorbed, so push nothing. Ties count as caught — arriving at the same moment means they arrive together.
6. Return `len(stack)`.
7. Note that comparing only against `stack[-1]` is enough: the times on the stack are strictly increasing from the target backwards, so the nearest fleet ahead is always the slowest obstacle.

## Code

```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pairs = sorted(zip(position, speed), reverse=True)
        stack = []

        for p, s in pairs:
            time = (target - p) / s
            if not stack or time > stack[-1]:
                stack.append(time)

        return len(stack)
```

## Why it works

A car merges into the fleet ahead exactly when its unobstructed arrival time is no later than that fleet's, and once merged it can never separate again, so its own time stops mattering — this is why an absorbed car is dropped rather than pushed. Because cars are processed right to left, `stack[-1]` always holds the arrival time of the nearest fleet ahead, and the stack stays strictly increasing, so one comparison per car classifies it correctly. The sort dominates at O(n log n) with the single sweep at O(n); the stack and the zipped pairs are O(n) space.
