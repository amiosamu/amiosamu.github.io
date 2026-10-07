---
# Network Delay Time · Medium · Advanced Graphs
# https://leetcode.com/problems/network-delay-time/
draft: false
pattern: "Dijkstra from a single source"
time: "O(E log V)"
space: "O(V + E)"
---

## Description

Given `n` nodes labeled `1` to `n`, a list `times` of directed edges `(u, v, w)` meaning a
signal takes `w` time to travel from `u` to `v`, and a source `k`, return the time at which
every node has received the signal. Return `-1` if any node is unreachable.

**Example**

```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
```

Explanation: Nodes `1` and `3` receive the signal at time `1`; node `4` receives it at time `2`.

## Intuition

The arrival time at a node is the shortest weighted-path distance from `k`. Since all edge
weights are positive, Dijkstra's algorithm can finalize nodes in increasing arrival time. The
network delay is the largest finalized distance, because signals can travel concurrently. A
missing finalized node is unreachable.

## Approach

1. Build an adjacency list of `(neighbor, weight)` pairs for each directed edge.
2. Seed a min-heap with `(0, k)` and keep `dist` for finalized arrival times.
3. Pop the smallest `(d, node)`. Skip it if already finalized; otherwise record `d`.
4. Push `d + w` for each outgoing neighbor not yet finalized. Duplicate tentative entries are
   allowed and later skipped.
5. Return the largest finalized distance if all `n` nodes were reached; otherwise return `-1`.

## Code

```python
import collections
import heapq

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = collections.defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))

        dist = {}
        heap = [(0, k)]

        while heap:
            d, node = heapq.heappop(heap)
            if node in dist:
                continue
            dist[node] = d
            for nei, w in adj[node]:
                if nei not in dist:
                    heapq.heappush(heap, (d + w, nei))

        return max(dist.values()) if len(dist) == n else -1
```

## Why it works

Suppose `(d, node)` is the first heap entry popped for an unfinalized node. Any alternative path
to `node` must leave the finalized region through an edge whose candidate distance is already in
the heap. That candidate is at least `d`, and positive remaining edges cannot reduce it. Therefore,
`d` is the shortest distance and can be finalized. Induction proves every value in `dist` is an
earliest arrival time. The latest of those arrivals is exactly the total network delay.

**Complexity**

- **Time:** `O(E log V)` for heap operations after `O(E)` adjacency construction.
- **Space:** `O(V + E)` auxiliary space for the graph, heap, and finalized distances.
