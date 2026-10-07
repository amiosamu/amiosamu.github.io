---
# Min Cost to Connect All Points · Medium · Advanced Graphs
# https://leetcode.com/problems/min-cost-to-connect-all-points/
draft: false
pattern: "Prim MST on a dense graph"
time: "O(V^2) with V = n points"
space: "O(V)"
---

## Description

Given `n` points, connect every point with minimum total cost, where an edge costs the Manhattan
distance between its endpoints. Return the weight of the resulting minimum spanning tree.

**Example**

```
Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20
```

The minimum spanning tree for these points has total Manhattan edge cost 20.

## Intuition

The points form an implicit complete graph. Prim's algorithm grows a minimum spanning tree by
repeatedly choosing the cheapest edge from the current tree to an outside point.

For each outside point, store only its cheapest known connection to the tree. Since the graph is
dense, linear scans for the next point yield `O(n^2)` time without materializing edges or using a
heap.

## Approach

1. Set every `dist[v]` to infinity except `dist[0] = 0`; initially no point is in the MST.
2. Repeat `n` times: select the outside point `u` with minimum `dist[u]` by a linear scan.
3. Add `u` to the tree and add `dist[u]` to `total`; the first point contributes zero.
4. For every outside point `v`, minimize `dist[v]` with the Manhattan edge from `u`.
5. Return `total`. Completeness of the graph guarantees every point can be selected.

## Code

```python
class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        dist = [float('inf')] * n
        dist[0] = 0
        in_mst = [False] * n
        total = 0

        for _ in range(n):
            u = -1
            for v in range(n):
                if not in_mst[v] and (u == -1 or dist[v] < dist[u]):
                    u = v

            in_mst[u] = True
            total += dist[u]
            xu, yu = points[u]

            for v in range(n):
                if not in_mst[v]:
                    d = abs(points[v][0] - xu) + abs(points[v][1] - yu)
                    if d < dist[v]:
                        dist[v] = d

        return total
```

## Why it works

Before each selection, `dist[v]` is the cheapest edge from the current tree to every outside point
`v`. Relaxing edges from the newly added point preserves this invariant. Therefore the selected
`dist[u]` is the cheapest edge crossing the cut between the tree and the remaining points. By the
cut property, that edge belongs to some MST extending the choices already made. Induction over all
points proves that the accumulated edges form an MST, so `total` is minimum.

**Complexity**

- **Time:** `O(V^2)` from two linear scans in each of `V` rounds.
- **Space:** `O(V)` for `dist` and `in_mst`.
