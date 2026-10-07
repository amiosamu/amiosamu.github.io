---
# Minimum Height Trees · Medium · Graphs
# https://leetcode.com/problems/minimum-height-trees
draft: false
pattern: "Peel leaves inward to the tree centers"
time: "O(V + E)"
space: "O(V + E)"
---

## Description

Given a tree of `n` nodes labeled `0` to `n - 1` connected by `n - 1` undirected edges,
return every node that gives the minimum tree height when chosen as the root. The height is
the greatest number of edges from the root to another node. Return the roots in any order.

**Example**

```
Input: n = 4, edges = [[1,0],[1,2],[1,3]]
Output: [1]
```

Explanation: Rooting at `1` gives height `1`; rooting at any leaf gives height `2`.

## Intuition

A minimum-height root is a midpoint of a tree diameter. Moving away from a diameter midpoint
toward one endpoint necessarily increases the distance to the other endpoint, so no off-center
node can improve the height.

Every endpoint of a longest path is a leaf. Removing all leaves shortens each surviving
diameter by one edge at both ends without changing its midpoint. Repeating this simultaneous
trimming therefore exposes the one or two diameter midpoints directly.

## Approach

1. Return `[0]` when `n == 1`; the only node has degree zero rather than one.
2. Build undirected adjacency sets and collect every degree-one node in `leaves`.
3. While more than two nodes remain, remove the entire current leaf layer. Removing a leaf
   mutates both its set and its neighbor's set.
4. Add each neighbor whose degree becomes one to `next_leaves`, then begin the next layer.
5. Return the final one or two leaves, which are the tree's center node or center edge.

## Code

```python
class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        if n == 1:
            return [0]

        adj = [set() for _ in range(n)]
        for u, v in edges:
            adj[u].add(v)
            adj[v].add(u)

        leaves = [i for i in range(n) if len(adj[i]) == 1]
        remaining = n

        while remaining > 2:
            remaining -= len(leaves)
            next_leaves = []
            for leaf in leaves:
                nei = adj[leaf].pop()
                adj[nei].remove(leaf)
                if len(adj[nei]) == 1:
                    next_leaves.append(nei)
            leaves = next_leaves

        return leaves
```

## Why it works

Let a diameter have endpoints `a` and `b`. For any root `r`, its height is at least
`max(dist(r, a), dist(r, b))`, which is minimized at the midpoint or two adjacent midpoints of
the `a`-to-`b` path. Those midpoint nodes also minimize the maximum distance to every other
node: a farther node would create a path longer than the diameter. They are exactly the
minimum-height roots.

Diameter endpoints are leaves. One simultaneous trimming round removes both endpoints and
shortens the diameter by two while preserving its midpoint. The same argument applies to the
remaining tree, so repeated trimming cannot discard a diameter midpoint before all non-centers.
When at most two nodes remain, they are precisely those midpoints and therefore all valid roots.

**Complexity**

- **Time:** `O(V + E)` because each node and edge is removed at most once.
- **Space:** `O(V + E)` auxiliary space for adjacency sets and leaf lists; the returned list
  contains at most two nodes.
