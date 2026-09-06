---
# Minimum Height Trees · Medium · Graphs
# https://leetcode.com/problems/minimum-height-trees
draft: false
pattern: "Peel leaves inward to the centroids"
time: "O(V + E)"
space: "O(V + E)"
---

## Description

Given a tree of `n` nodes labeled `0` to `n - 1` connected by `n - 1` undirected edges,
return the label(s) of the node(s) that, when used as the root, produce a minimum height
tree — the height being the number of edges on the longest downward path from that root.
There can be at most two such roots, and they may be returned in any order.

**Example**

```
Input: n = 4, edges = [[1,0],[1,2],[1,3]]
Output: [1]
```

Explanation: Rooting the tree at node 1 gives every other node as a direct child, for a
height of 1 — rooting at any leaf (0, 2, or 3) instead gives a strictly taller tree, so 1
is the only minimum height tree root.

## Intuition

The graph is an undirected tree: `n` nodes, `n - 1` edges, connected. Rooting it at every
node and measuring the height is `O(n^2)` and hopeless at `n = 2 * 10^4`.

The insight is that a leaf is never a good root — the deepest node from a leaf is at least
as far as it is from that leaf's neighbour, so the neighbour is always at least as good.
So strip every leaf at once, and repeat on the smaller tree. Each round removes the worst
candidates and shrinks the tree from the outside in; what survives at the centre is the
answer. A tree has at most two such centroids (one when the longest path has odd node
count, two when it has even), so I peel until 1 or 2 nodes remain and return them. This is
topological-sort shape — a queue of degree-1 nodes — just on an undirected tree, where
degree 1 plays the role of indegree 0.

## Approach

1. Special-case `n == 1`: return `[0]`. A single node has degree 0, so it is never
   collected as a leaf and the peeling loop would return an empty list.
2. Build `adj = [set() for _ in range(n)]` and add both directions for each edge. Sets,
   not lists, because I need `O(1)` removal of a specific neighbour.
3. `leaves = [i for i in range(n) if len(adj[i]) == 1]`, and `remaining = n` tracks how
   many nodes are still in the tree.
4. While `remaining > 2`: subtract `len(leaves)` from `remaining`, then for each `leaf`
   take its single neighbour `nei = adj[leaf].pop()`, do `adj[nei].remove(leaf)`, and if
   `nei` now has degree 1 it becomes a leaf of the next round — collect it in
   `next_leaves`. Then `leaves = next_leaves`.
5. Peel a whole *layer* per iteration, not one node at a time. Removing leaves one by one
   would let a node become a leaf mid-round and get stripped in the same round, which
   collapses the tree past its centre.
6. When the loop exits, `leaves` holds exactly the 1 or 2 surviving nodes — return it.
   A node's degree strictly decreases and therefore passes through 1 exactly once, so each
   survivor was appended exactly once.

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

The height of a rooted tree is the distance to the far end of a longest path, so the best
roots are the middle of a diameter — and peeling a layer of leaves shortens every path by
exactly one at each end, which keeps the diameter's midpoint fixed while shrinking
everything around it. After `k` rounds the survivors are the nodes at distance `>= k` from
every leaf, so the process converges on the 1 or 2 centre nodes of the diameter, and a
tree can have no more than two because a third would create a cycle or a longer path.
Every node is removed at most once and every edge is deleted at most once, so the whole
peel is `O(V + E)` with `O(V + E)` for the adjacency sets.
