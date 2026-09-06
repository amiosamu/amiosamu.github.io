---
# Cheapest Flights Within K Stops · Medium · Advanced Graphs
# https://leetcode.com/problems/cheapest-flights-within-k-stops/
draft: false
pattern: "Bellman-Ford, k + 1 rounds"
time: "O(k * E)"
space: "O(V)"
---

## Description

Given `n` cities, a list of `flights` as `[from, to, price]`, a source `src`, a destination
`dst`, and an integer `k`, return the cheapest price to travel from `src` to `dst` using at
most `k` stops (i.e. at most `k + 1` flights), or `-1` if no such route exists.

**Example**

```
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
Output: 700
```

Explanation: With at most 1 stop, the route `0 -> 1 -> 3` costs `100 + 600 = 700`; the
cheaper-looking route `0 -> 1 -> 2 -> 3` costs less but uses 2 stops, which exceeds the
budget `k = 1`, so it is not allowed.

## Intuition

The stop limit breaks Dijkstra. Dijkstra finalizes a node the moment it is popped, but
here a *more expensive* route to a node can still be the right one if it uses fewer
edges — so "cheapest so far" is no longer a safe thing to commit to.

Bellman-Ford fixes this because its rounds are indexed by edge count: after `i` rounds
of relaxing every edge, `prices[v]` is the cheapest route to `v` using at most `i`
edges. "At most `k` stops" means at most `k + 1` flights, so I just run exactly `k + 1`
rounds and read off the answer. The stop budget stops being a constraint and becomes
the loop bound.

## Approach

1. `prices = [inf] * n`, `prices[src] = 0`.
2. Repeat `k + 1` times:
   - Copy `prices` into `temp` at the top of the round.
   - For every `(u, v, w)` in `flights`, relax **from `prices` into `temp`**:
     if `prices[u]` is finite and `prices[u] + w < temp[v]`, set `temp[v] = prices[u] + w`.
   - Assign `prices = temp`.
3. The snapshot is the whole trick. Reading `prices[u]` (last round's values) and
   writing `temp[v]` means each round adds exactly one flight to every route; relaxing
   in place would let one round chain several flights and blow the stop budget.
4. Guard `prices[u] != inf` so `inf + w` never propagates a fake route.
5. Return `prices[dst]`, or `-1` if it is still infinite.

## Code

```python
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        prices = [float('inf')] * n
        prices[src] = 0

        for _ in range(k + 1):
            temp = prices[:]
            for u, v, w in flights:
                if prices[u] != float('inf') and prices[u] + w < temp[v]:
                    temp[v] = prices[u] + w
            prices = temp

        return prices[dst] if prices[dst] != float('inf') else -1
```

## Why it works

Induction on the round counter: if `prices` holds the cheapest cost to each node using
at most `i` edges, then relaxing every edge once out of that snapshot produces the
cheapest cost using at most `i + 1` edges, since any such route is some `i`-edge route
plus one final flight. After `k + 1` rounds `prices[dst]` is exactly the cheapest route
with at most `k + 1` flights, i.e. `k` intermediate stops. Each round scans every edge
once and copies the array, so the total is `O(k * E + k * V) = O(k * E)`.
