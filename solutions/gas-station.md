---
# Gas Station · Medium · Greedy
# https://leetcode.com/problems/gas-station/
draft: false
pattern: "Reset start after each deficit"
time: "O(n)"
space: "O(1)"
---

## Description

Given two integer arrays `gas` and `cost` describing a circular route of stations, where
`gas[i]` is the fuel available at station `i` and `cost[i]` is the fuel needed to drive from
station `i` to station `i+1`, returns the index of the station to start from (with an
initially empty tank) so a car can complete the entire circuit, or `-1` if no such start
exists.

**Example**

```
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
```

Explanation: starting at station 3, the running tank never goes negative — `4-1=3`,
`3+5-2=6`, `6+1-3=4`, `4+2-4=2`, `2+3-5=0` — completing the loop back to station 3.

## Intuition

Two separate facts do all the work. First, feasibility is global: the trip is possible at all iff
`sum(gas) >= sum(cost)`, since one full loop nets exactly that difference regardless of where you
start. Second, and this is the part that kills the O(n²) "try every start" loop: if starting at `s`
the tank first goes negative arriving at station `i`, then no station between `s` and `i` works
either. So a single failure lets me skip a whole block of candidates, and one left-to-right pass
suffices — the answer is the index right after the last failure.

## Approach

1. If `sum(gas) < sum(cost)`, return `-1`. This check is what makes the rest of the algorithm safe;
   without it the final `start` would be meaningless.
2. Keep `start = 0` (the current candidate) and `tank = 0` (net fuel since `start`).
3. Loop `i` over all stations: `tank += gas[i] - cost[i]`.
4. If `tank < 0`, the run beginning at `start` died on the hop out of station `i`. Every station in
   `[start, i]` is thereby eliminated, so jump the candidate past the whole block:
   `start = i + 1`, and `tank = 0` to begin measuring the new run.
5. Return `start` after the loop — no second pass and no wrap-around simulation is needed.
6. Note the difference `gas[i] - cost[i]` is the *only* thing that matters; the absolute values
   never appear. Constraints guarantee a unique answer when one exists.

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

Write `d[k] = gas[k] - cost[k]`. If a run from `s` first goes negative at `i`, then every partial
sum `d[s..j-1]` for `s < j <= i` is non-negative, so
`d[j..i] = d[s..i] - d[s..j-1] <= d[s..i] < 0` — station `j` fails no later than `i` too, and
skipping the entire block discards only provably dead starts. That leaves at most one surviving
candidate, the index after the final failure, and the global check guarantees a valid start exists;
since the survivor is the only one not eliminated, it must be it. One pass over two arrays with two
scalars: O(n) time, O(1) space.
