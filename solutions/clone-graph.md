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

Here the graph is explicit — `Node` objects with a `neighbors` list, undirected and connected
— so the traversal is the easy part; the hard part is that the copy has to reproduce *shared
structure*. The naive "recurse into every neighbour and build a new node" fails twice on a
cycle: it never terminates, and even on a DAG-shaped diamond it would produce two separate
copies of the node reachable by two paths.

One dictionary fixes both. `old_to_new` maps each original node to its single clone, and it
doubles as the visited set — a node is cloned on first sight and looked up on every sight
after. The critical ordering is that I insert the clone into the map *before* recursing into
its neighbours, so when the recursion cycles back the clone already exists and the lookup
terminates it.

## Approach

1. Handle the empty graph: `if not node: return None`.
2. Create `old_to_new = {}` mapping original `Node` to its copy.
3. Define `dfs(cur)`:
   - if `cur in old_to_new`, return `old_to_new[cur]` — this is both the memo hit and the
     cycle base case;
   - otherwise build `copy = Node(cur.val)` and store `old_to_new[cur] = copy`
     **immediately**, before touching `cur.neighbors`;
   - for each `nei` in `cur.neighbors`, append `dfs(nei)` to `copy.neighbors`;
   - return `copy`.
4. Return `dfs(node)`.
5. Recursion is safe here — the constraints cap the graph at 100 nodes, so the stack depth is
   at most 100.

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

The map holds the invariant "every original node reached so far has exactly one clone, and it
is registered before its edges are explored" — registering first is what makes a cycle bottom
out on a lookup instead of recursing forever, and the one-clone-per-node rule is what keeps
two paths to the same node from splitting it in the copy. Each original node runs the body of
`dfs` once and walks its adjacency list once, so every edge is traversed exactly once in each
direction: `O(V + E)` time, `O(V)` for the map plus recursion stack, on top of the copied
graph itself.
