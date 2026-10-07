---
# Find Critical and Pseudo Critical Edges in Minimum Spanning Tree · Hard · Advanced Graphs
# https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/
draft: false
pattern: "Kruskal rerun per edge, excluded and forced"
time: "O(E^2 * alpha(V))"
space: "O(V + E)"
---

## Description

Given a connected weighted graph, classify its edges by original index. A critical edge
appears in every minimum spanning tree (MST); a pseudo-critical edge appears in at least
one MST but is not critical. Return `[critical, pseudo]`.

**Example**

```
Input: n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
Output: [[0,1],[2,3,4,5]]
```

The MST weight is 7. Edges 0 and 1 are unavoidable, while each of edges 2 through 5 can
participate in an MST of the same weight.

## Intuition

Use Kruskal's algorithm as a classification test. Excluding an edge computes the best tree
that avoids it; a larger weight or disconnection proves the edge critical. If the edge is
not critical, forcing it first and still obtaining the baseline weight proves that some MST
contains it.

Sorting loses the input order, so attach each edge's original index. Fresh union-find state
is required for every test, and union by rank with path compression keeps each run within
the standard inverse-Ackermann bound.

## Approach

1. Copy each edge as `[u, v, weight, original_index]` and sort by weight.
2. In `mst(skip, force)`, allocate `parent` and `rank` with exactly `n` entries because
   valid vertex IDs are `0..n - 1`. Also track total weight and accepted-edge count.
3. If `force` is set, union that edge first and include its weight. Then run Kruskal in
   sorted order, omitting `skip`; revisiting the forced edge cannot join its endpoints.
4. Return the weight only after accepting `n - 1` edges; otherwise return infinity to
   represent disconnection.
5. Compare every exclusion with the baseline first. Only non-critical edges are then
   forced and classified as pseudo-critical when their result equals the baseline.

## Code

```python
class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        indexed = [e + [i] for i, e in enumerate(edges)]
        indexed.sort(key=lambda e: e[2])

        def mst(skip=-1, force=-1):
            parent = list(range(n))
            rank = [0] * n
            weight = 0
            count = 0

            def find(x):
                while parent[x] != x:
                    parent[x] = parent[parent[x]]
                    x = parent[x]
                return x

            def union(a, b):
                ra, rb = find(a), find(b)
                if ra == rb:
                    return False
                if rank[ra] < rank[rb]:
                    ra, rb = rb, ra
                parent[rb] = ra
                if rank[ra] == rank[rb]:
                    rank[ra] += 1
                return True

            if force != -1:
                u, v, w, _ = indexed[force]
                if union(u, v):
                    weight += w
                    count += 1
            for i, (u, v, w, _) in enumerate(indexed):
                if i == skip:
                    continue
                if union(u, v):
                    weight += w
                    count += 1
            return weight if count == n - 1 else float("inf")

        base = mst()
        critical, pseudo = [], []

        for i in range(len(indexed)):
            orig = indexed[i][3]
            if mst(skip=i) > base:
                critical.append(orig)
            elif mst(force=i) == base:
                pseudo.append(orig)

        return [critical, pseudo]
```

## Why it works

Kruskal returns the minimum tree weight available under the supplied restriction. If
excluding edge `i` raises that weight or disconnects the graph, no baseline MST can omit
`i`, so it is critical. Otherwise, forcing `i` creates a one-edge forest. Kruskal's cut
property completes that forest with the least possible additional weight, so equality with
the baseline constructs an MST containing `i` and proves it pseudo-critical. The `elif`
keeps critical edges out of the second category.

**Complexity**

- **Time:** `O(E log E + E^2 alpha(V))`, dominated by `O(E)` Kruskal runs with ranked,
  path-compressed union-find.
- **Space:** `O(V + E)` for indexed edges and per-run union-find arrays.
- **Output:** `O(E)` for the two classification lists.
