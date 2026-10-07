---
# Clone Graph · Medium · Graphs
# https://leetcode.com/problems/clone-graph/
draft: false
pattern: "DFS with old-to-new node map"
time: "O(V + E)"
space: "O(V)"
---

## Description

Given a reference `node` in a connected undirected graph, where each `Node` stores a value
and a list of neighbor references, return a deep copy of the entire graph reachable from
`node`.

**Example**

```
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
```

Explanation: `adjList[i]` lists the neighbors of node `i + 1`, e.g. node 1 is connected to
2 and 4; the cloned graph has the same four nodes and connections, but every node is a newly
allocated copy rather than the original object.

## Intuition

The clone must preserve shared neighbors and cycles, not just node values. Map each original
node to its one clone. Register a clone before traversing its neighbors so a cycle that returns
to the node finds the existing object instead of recursing forever.

## Approach

1. Keep `old_to_new`, mapping each original `Node` object to its allocated clone.
2. In `dfs(cur)`, return the mapped clone immediately if `cur` was already visited.
3. Otherwise create and register `copy` before recursively cloning each neighbor into
   `copy.neighbors`.
4. Return `dfs(node)`, or `None` for an empty graph. The input graph is not mutated.

## Code

```python
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        old_to_new = {}

        def dfs(cur):
            if cur in old_to_new:
                return old_to_new[cur]

            copy = Node(cur.val)
            old_to_new[cur] = copy
            for nei in cur.neighbors:
                copy.neighbors.append(dfs(nei))
            return copy

        return dfs(node) if node else None
```

## Why it works

Whenever `dfs(cur)` returns, the mapped clone has the same value as `cur` and a corresponding
clone for every explored neighbor. Registration before recursion guarantees one clone per
original even across cycles. By induction over DFS completion, every reachable edge is copied
to the matching cloned endpoints, so the returned graph is a deep structural copy.

**Complexity**

- **Time:** `O(V + E)` because each node and adjacency entry is processed once.
- **Space:** `O(V)` auxiliary space for the map and recursion stack, plus `O(V + E)` output.
