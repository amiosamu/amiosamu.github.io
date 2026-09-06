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
signal takes `w` time to travel from `u` to `v`, and a source node `k`, return the minimum
time for a signal sent from `k` to reach every node, or `-1` if some node is unreachable.

**Example**

```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
```

Explanation: From node 2, nodes 1 and 3 receive the signal at time 1, and node 3 then
relays it to node 4, which arrives at time 2 — the last node to receive it, so 2 is the
answer.

## Intuition

The signal floods every outgoing edge at once, so a node lights up at the *earliest*
arrival time over all paths into it, and the network is done when the last node lights
up. That makes the answer `max(shortest_dist[v])` over all `v`, with `-1` if any node
is unreachable.

BFS would be wrong here because the edges carry travel times: a two-hop route can beat
a one-hop one, so hop count and arrival time are different orderings. Weights are
positive, so Dijkstra applies — process nodes in increasing arrival time and the first
time a node comes off the heap that time is final.

## Approach

1. Build `adj[u] = [(v, w), ...]` from `times` with a `collections.defaultdict(list)`.
2. `dist` is a dict of finalized nodes only — a node is in it iff it has been popped.
3. Seed the heap with `(0, k)`.
4. Pop `(d, node)`. If `node` is already in `dist`, this is a stale duplicate entry —
   `continue`. Otherwise set `dist[node] = d`; this is the first and therefore smallest
   entry for that node.
5. Push `(d + w, nei)` for every outgoing edge to a node not yet finalized.
6. When the heap drains, return `max(dist.values())` if `len(dist) == n`, else `-1`.
   Using "is it in `dist`" as the visited set is what makes the `-1` check a simple
   count comparison.

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

Because every `w >= 1`, extending a path never shortens it, so the smallest value in
the heap cannot be beaten by any route that still has an unprocessed edge to traverse —
that is the invariant that lets me finalize a node on its first pop. Taking the maximum
over all finalized distances is right because the signal travels down all edges
simultaneously, so the network finishes when its slowest node receives. Each edge is
pushed at most once, so the heap holds `O(E)` entries and the work is `O(E log V)`.
