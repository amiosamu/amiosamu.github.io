---
# Redundant Connection · Medium · Graphs
# https://leetcode.com/problems/redundant-connection/
draft: false
pattern: "Union-Find on edges in order"
time: "O(n * α(n))"
space: "O(n)"
---

## Description

Given a tree of `n` nodes labeled `1` to `n` that gained one extra edge, described as a
list of `n` undirected `edges`, return the extra edge that, if removed, restores a valid
tree; if more than one edge could be removed, return the one that appears last in the input.

**Example**

```
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
```

Explanation: edges `[1,2]` and `[1,3]` already connect all three nodes into a tree, so the
later edge `[2,3]` closes a cycle and is the redundant one.


## Intuition

The graph is a tree on `n` nodes with one extra undirected edge added, so it has `n` nodes
and `n` edges and therefore exactly one cycle. I have to return the edge on that cycle
that appears last in the input.

Add the edges one at a time and track connectivity with union-find. An edge whose two
endpoints are already connected adds no new reachability — both ends already had a path
between them, so this edge closes a cycle. With `n` nodes and `n` edges there is exactly
one such edge, and because I scan in input order I hit it at the moment the cycle closes,
which is precisely its last edge. No traversal or explicit cycle-finding needed.

## Approach

1. Nodes are labelled `1..n`, so size the arrays `n + 1` and ignore index 0:
   `parent = list(range(n + 1))`, `rank = [1] * (n + 1)`, with `n = len(edges)`.
2. `find(x)` climbs to the root with path halving (`parent[x] = parent[parent[x]]`) so the
   trees stay shallow.
3. Walk `edges` in the given order. For each `[u, v]` compute `ru, rv = find(u), find(v)`.
4. If `ru == rv`, `u` and `v` are already connected by earlier edges, so this edge is the
   redundant one — return `[u, v]` immediately, in the input's own orientation.
5. Otherwise merge by size: swap so `ru` is the larger root, set `parent[rv] = ru`, and
   `rank[ru] += rank[rv]`.
6. Returning on the *first* failing union is not in tension with wanting the *last* edge
   of the cycle: there is only one failing union in the entire scan, because the cycle's
   other edges each genuinely merged two distinct components when they were processed.
7. The trailing `return []` is unreachable for valid input; the problem guarantees an
   answer exists.

## Code

```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        parent = list(range(n + 1))
        rank = [1] * (n + 1)

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for u, v in edges:
            ru, rv = find(u), find(v)
            if ru == rv:
                return [u, v]
            if rank[ru] < rank[rv]:
                ru, rv = rv, ru
            parent[rv] = ru
            rank[ru] += rank[rv]

        return []
```

## Why it works

Union-find maintains the invariant that `u` and `v` share a root iff they are connected
using only the edges seen so far, so `find(u) == find(v)` on arrival means this edge plus
the existing path between them forms a cycle. Since the input is a tree plus one edge, the
graph has exactly one cycle, hence exactly one edge that fails to merge — and that edge is
the last of the cycle's edges in input order, which is what the problem asks for. Each of
the `n` edges triggers a constant number of near-`O(1)` `find`s, so the scan is
`O(n * α(n))` with `O(n)` space for the two arrays.
