---
# Graph Valid Tree · Medium · Graphs
# https://leetcode.com/problems/graph-valid-tree/
draft: false
pattern: "Edge count plus connectivity BFS"
time: "O(V + E)"
space: "O(V + E)"
---

## Description

Given `n` nodes labeled `0` to `n - 1` and a list of undirected `edges`, determine whether
they form a valid tree, meaning the graph is fully connected and contains no cycle.

**Example**

```
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true
```

All five nodes are connected by four edges, with no edge left to create a cycle.


## Intuition

An undirected tree with `n` vertices has exactly `n - 1` edges and is connected. After checking
the edge count, it is enough to test connectivity: a connected graph with that many edges cannot
contain a cycle. BFS performs the reachability check without recursion.

## Approach

1. Reject unless `len(edges) == n - 1`.
2. Build an undirected adjacency list by adding both directions of every edge.
3. Start BFS from node `0`, marking it visited when it is enqueued.
4. Enqueue each unseen neighbor and mark it immediately to prevent duplicate queue entries.
5. Return whether BFS visited all `n` nodes; the single-node case follows the same logic.

## Code

```python
import collections

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False

        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        visited = {0}
        queue = collections.deque([0])

        while queue:
            node = queue.popleft()
            for nei in adj[node]:
                if nei not in visited:
                    visited.add(nei)
                    queue.append(nei)

        return len(visited) == n
```

## Why it works

BFS maintains that `visited` is exactly the discovered component containing node `0`, so it
contains every vertex precisely when the graph is connected. A connected graph starts with one
vertex and needs at least one edge to attach each of the other `n - 1` vertices. If a connected
graph with exactly `n - 1` edges had a cycle, removing one cycle edge would leave it connected
with too few edges, a contradiction. Thus the edge count and BFS condition are necessary and
sufficient for a tree.

**Complexity**

- **Time:** `O(V + E)` for adjacency construction and BFS.
- **Space:** `O(V + E)` for the adjacency list, visited set, and queue.
