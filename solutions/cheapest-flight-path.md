---
# Cheapest Flights Within K Stops · Medium · Advanced Graphs
# https://leetcode.com/problems/cheapest-flights-within-k-stops/
draft: false
pattern: "Bellman-Ford, k + 1 rounds"
time: "O((k + 1) * (E + V))"
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

The constraint is on the number of edges, not only the price. Bellman-Ford naturally handles
that constraint: after round `i`, the stored cost for each city may use at most `i` flights.
Each round must read from the previous snapshot; updating in place could chain several flights
within one round and exceed the stop limit.

## Approach

1. Initialize `prices[src] = 0` and every other city to infinity.
2. Repeat `k + 1` times, once for each flight allowed. Copy `prices` to `next_prices` so
   routes found in the current round cannot be extended until the next round.
3. For every flight `(u, v, price)`, relax `next_prices[v]` from the old `prices[u]` when
   `u` is reachable, then replace `prices` with the completed snapshot.
4. Return the destination cost, or `-1` if it remains infinite. This also handles `src == dst`,
   whose zero cost survives every round.

## Code

```python
class Solution:
    def findCheapestPrice(
        self, n: int, flights: List[List[int]], src: int, dst: int, k: int
    ) -> int:
        prices = [float('inf')] * n
        prices[src] = 0

        for _ in range(k + 1):
            next_prices = prices[:]
            for u, v, w in flights:
                if prices[u] != float('inf'):
                    next_prices[v] = min(next_prices[v], prices[u] + w)
            prices = next_prices

        return prices[dst] if prices[dst] != float('inf') else -1
```

## Why it works

Initially, `prices` is correct for routes using zero flights. Assume it is correct for at most
`i` flights. A route using at most `i + 1` flights either already uses at most `i`, retained by
the copy, or ends with some edge `(u, v)` after a route of at most `i` flights to `u`, considered
by relaxation. Thus the next snapshot is correct by induction. After `k + 1` rounds, the
destination value is exactly the cheapest permitted route.

**Complexity**

- **Time:** `O((k + 1) * (E + V))`; every round scans `E` flights and copies `V` costs.
- **Space:** `O(V)` for the current and next cost arrays.
