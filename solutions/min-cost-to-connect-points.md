---
# Min Cost to Connect All Points · Medium · Advanced Graphs
# https://leetcode.com/problems/min-cost-to-connect-all-points/
draft: false
pattern: "Prim MST on a dense graph"
time: "O(V^2) with V = n points"
space: "O(V)"
---

## Intuition

Connecting all points at minimum total cost with no redundant edges is the definition
of a minimum spanning tree. There is no traversal answer here — BFS or DFS would find
*a* spanning tree, but nothing about the order they visit in makes it the cheapest one.

The distinguishing detail is that the graph is implicit and complete: every pair of
points has an edge, so `E = V^2 / 2`. Kruskal would have to materialize and sort all
`V^2` of them for `O(V^2 log V)`. Prim's grows one tree outward and only ever needs
"the cheapest edge from the tree to each outside point", which fits in a single array
scanned linearly — `O(V^2)` with no heap and no edge list at all.

## Approach

1. `dist[v]` = cheapest known Manhattan distance from the growing tree to point `v`.
   Initialize to infinity, `dist[0] = 0`, and `in_mst = [False] * n`.
2. Repeat `n` times:
   - Linear scan for `u`, the not-yet-included point with the smallest `dist[u]`.
   - Mark `in_mst[u] = True` and add `dist[u]` to `total`. The first iteration adds
     `dist[0] = 0`, which is why seeding the start with 0 costs nothing.
   - For every `v` still outside the tree, compute `d = |x_v - x_u| + |y_v - y_u|` and
     set `dist[v] = d` if it improves — the only new edges are the ones from `u`.
3. Return `total`.
4. No connectivity check is needed: the graph is complete, so a spanning tree always
   exists, and `n == 1` correctly returns 0.

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

Prim's rests on the cut property: for the cut separating the tree from the rest, the
minimum-weight edge crossing it belongs to some MST — so absorbing the cheapest
`dist[u]` is always safe, and the invariant `dist[v] = min over u in tree of d(u, v)`
is maintained by only relaxing against the newly added `u`. Each of the `n` rounds does
two `O(n)` passes — one to select, one to relax — giving `O(V^2)` time and `O(V)` space,
which beats heap-Prim's `O(E log V)` here because `E` is quadratic in `V`.
