---
# Gas Station · Medium · Greedy
# https://leetcode.com/problems/gas-station/
draft: false
pattern: "Reset start after each deficit"
time: "O(n)"
space: "O(1)"
---

## Description

Given gas available at each station and the cost of reaching the next station on a circular
route, return an index from which a car with an empty tank can complete the circuit. Return
`-1` if no such start exists.

**Example**

```
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
```

Explanation: Starting at station `3`, the tank remains nonnegative and returns to `3` with
no fuel left.

## Intuition

Completing one circuit requires total gas to be at least total cost. This global condition
determines whether any solution exists.

For the local choice, suppose a trip starting at `start` first runs out after station `i`.
No station from `start` through `i` can be a valid start, so the next candidate is `i + 1`.
This eliminates a whole range after each failure.

## Approach

1. If `sum(gas) < sum(cost)`, return `-1` because the route consumes more fuel than it
   provides.
2. Track `start`, the current candidate, and `tank`, the net fuel accumulated since that
   candidate.
3. Add `gas[i] - cost[i]` at each station. If `tank` becomes negative, eliminate all
   candidates through `i`, set `start = i + 1`, and reset `tank`.
4. Return the candidate after the scan. The global feasibility check guarantees it can
   complete the wraparound portion.

## Code

```python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1

        start = 0
        tank = 0

        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
                tank = 0

        return start
```

## Why it works

Let `d[i] = gas[i] - cost[i]`. If a trip from `start` first has negative sum at `i`, every
earlier partial sum from `start` is nonnegative. For any `j` between them,
`sum(d[j..i]) = sum(d[start..i]) - sum(d[start..j-1]) < 0`, so `j` also fails. Resetting
therefore removes only impossible starts. Each reset occurs after the cumulative route sum
reaches a new minimum. The final `start` follows the global minimum prefix sum, so every
circular partial sum from it is nonnegative when the total sum is nonnegative. The returned
candidate can therefore complete both the suffix and the wrapped prefix.

**Complexity**

- **Time:** `O(n)` for the total checks and station scan.
- **Space:** `O(1)` auxiliary space.
