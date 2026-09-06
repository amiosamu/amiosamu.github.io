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

Explanation: the 4 edges connect all 5 nodes into a single component with none left over to
close a cycle, so the graph is a valid tree.


## Intuition

The graph is given directly — `n` nodes `0..n-1` and an undirected edge list — and a tree
is just "connected and acyclic". The cheap observation is that I do not have to test both
properties independently: any connected graph on `n` nodes has at least `n - 1` edges,
and any acyclic one has at most `n - 1`. So once I check `len(edges) == n - 1`, connected
and acyclic become the *same* condition, and I only have to verify one of them.

Connectivity is the easier one to verify, so: reject on edge count, then BFS from node 0
and check that it reaches all `n` nodes. BFS over DFS here is purely about avoiding a
recursion stack — I want reachability, not path structure, so the traversal order is
irrelevant.

## Approach

1. If `len(edges) != n - 1`, return `False` immediately. Too many edges means a cycle;
   too few means it cannot be connected. This check is also what saves the BFS from
   needing any parent-tracking to distinguish "cycle" from "the edge I just came in on".
2. Build an adjacency list `adj = [[] for _ in range(n)]` and push both directions for
   every `[u, v]` — the edges are undirected.
3. Start BFS at node `0` with `visited = {0}` and `queue = deque([0])`.
4. Pop `node`, and for each `nei` not in `visited`, add it to `visited` **and** enqueue it
   in the same step. Marking on enqueue, not on dequeue, is what stops a node with several
   already-queued neighbours from being pushed multiple times — mark on pop and a node
   with degree `d` can sit in the queue `d` times.
5. When the queue drains, return `len(visited) == n`.
6. `n == 1` with `edges == []` falls through correctly: `0 == n - 1`, and the BFS visits
   the single node.

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

A graph on `n` nodes with exactly `n - 1` edges is a tree iff it is connected: if it were
connected with a cycle it would need at least `n` edges, and if it were acyclic but
disconnected with `k` components it would have exactly `n - k < n - 1` edges. So the edge
count plus a single reachability sweep is a complete test, and no explicit cycle check is
needed. BFS touches every node once and every adjacency entry once, so it is `O(V + E)`
time with `O(V + E)` for the adjacency list, visited set, and queue.
