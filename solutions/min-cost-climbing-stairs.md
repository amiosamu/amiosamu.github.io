---
# Min Cost Climbing Stairs · Easy · 1-D Dynamic Programming
# https://leetcode.com/problems/min-cost-climbing-stairs/
draft: false
pattern: "Min-cost path with two rolling variables"
time: "O(n)"
space: "O(1)"
---

## Description

Given stair costs, return the minimum cost to reach the top, one position beyond the final stair.
Start at index `0` or `1`, move one or two steps at a time, and pay a stair's cost when leaving it.

**Example**

```
Input: cost = [10,15,20]
Output: 15
```

Starting at index `1` and moving to the top pays only `cost[1] == 15`.

## Intuition

The cheapest way to arrive at position `i` must come from `i - 1` or `i - 2`. Those are the only
predecessors, so the optimal arrival cost has a two-term recurrence.

Treat the top as position `n`. Only the previous two dynamic-programming values are needed, so the
state can be compressed into two variables.

## Approach

1. Define `dp[i]` as the minimum cost to arrive at position `i`, excluding any cost at `i`.
2. Use `dp[0] = dp[1] = 0` because either stair may be the starting position.
3. For `i` from `2` through `n`, choose between leaving `i - 1` and leaving `i - 2`.
4. Store `dp[i - 2]` in `prev` and `dp[i - 1]` in `cur`, then update both simultaneously.
5. Return `cur`, which equals `dp[n]`, the minimum cost to reach the top.

## Code

```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        prev, cur = 0, 0

        for i in range(2, len(cost) + 1):
            prev, cur = cur, min(cur + cost[i - 1], prev + cost[i - 2])

        return cur
```

## Why it works

Assume `prev` and `cur` equal the optimal arrival costs for positions `i - 2` and `i - 1`. Every
path to `i` makes its final move from exactly one of those positions and pays that predecessor's
cost. Replacing either path prefix with a cheaper one could only improve the full path, so the
minimum of the two recurrence terms is exactly `dp[i]`. The base costs are zero, and induction
therefore proves that the final `cur` is the optimal cost for position `n`.

**Complexity**

- **Time:** `O(n)` for one pass over the stairs.
- **Space:** `O(1)` auxiliary space.
