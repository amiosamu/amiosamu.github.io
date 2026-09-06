---
# Min Cost Climbing Stairs · Easy · 1-D Dynamic Programming
# https://leetcode.com/problems/min-cost-climbing-stairs/
draft: false
pattern: "Min-cost path with two rolling variables"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `cost` where `cost[i]` is the price paid when stepping off stair `i`, and
starting from either index `0` or index `1` for free, return the minimum total cost to
reach the top of the staircase, one floor past the last index, moving one or two steps at a
time.

**Example**

```
Input: cost = [10,15,20]
Output: 15
```

Explanation: Starting at index 1 (free) and stepping directly to the top pays only
`cost[1] = 15`, which beats starting at index 0 and paying `10` plus any further step.

## Intuition

Greedy fails immediately — always taking the cheaper next step walks you into an expensive
corner later. The saving observation is that the cost of *arriving* at a step doesn't depend on
the route at all, only on which of the two possible predecessors you came from, so there are
`n + 1` states instead of exponentially many paths. Treat the top as an imaginary step `n` past
the last tile, and the two free starting positions become base cases rather than special cases.

## Approach

1. State: `dp[i]` is the minimum cost to *arrive at* step `i`, considering only the tiles
   strictly below it. Note the convention — you pay `cost[i]` when you step **off** tile `i`,
   not when you land on it, so `dp[i]` excludes `cost[i]`.
2. Indices run `0 .. n` where `n = len(cost)`; step `n` is the floor above the last tile, i.e.
   the top.
3. Recurrence: `dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])` — jump one tile
   from `i - 1` paying for it, or two tiles from `i - 2` paying for it.
4. Base cases: `dp[0] = dp[1] = 0`. The problem lets you start on either index 0 or index 1 for
   free, which is exactly the statement that arriving at those steps is free.
5. Iteration direction: increasing `i` from `2` to `n` inclusive, so both predecessors are
   already settled.
6. Answer: `dp[n]`, the cost of reaching the top.
7. Only the last two cells are ever read, so keep `prev = dp[i - 2]` and `cur = dp[i - 1]`, both
   starting at `0`, and slide with
   `prev, cur = cur, min(cur + cost[i - 1], prev + cost[i - 2])`.
8. Return `cur`. Careful with the off-by-one: the loop runs to `len(cost)` inclusive, and inside
   it the cost indices are `i - 1` and `i - 2`, never `i`.

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

Any path to step `i` takes its final hop from `i - 1` or `i - 2` and pays that tile's cost on
the way out, so the cheapest path to `i` is the cheaper of (cheapest path to `i - 1`) + `cost[i - 1]`
and (cheapest path to `i - 2`) + `cost[i - 2]` — optimal substructure holds because the prefix of
an optimal path must itself be optimal, or you could splice in a cheaper prefix. Modelling the
top as step `n` means the answer is one more application of the same recurrence rather than a
final `min` over the last two tiles. One pass, two scalars: O(n) time, O(1) space.
