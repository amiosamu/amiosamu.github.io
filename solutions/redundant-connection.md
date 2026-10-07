---
# Redundant Connection · Medium · Graphs
# https://leetcode.com/problems/redundant-connection/
draft: false
pattern: "Union-Find on edges in order"
time: "O(n * α(n))"
space: "O(n)"
---

## Description

An undirected tree on nodes `1` through `n` has gained one edge. Return an edge whose removal
restores a tree; if several choices work, return the one appearing last in `edges`.

**Example**

```
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
```

Explanation: Earlier edges already connect `2` and `3`, so `[2,3]` closes the cycle.


## Intuition

A tree plus one undirected edge has exactly one cycle. Process edges in input order while a
union-find structure tracks connectivity formed by earlier edges. An edge is redundant exactly
when its endpoints already share a component: the earlier path between them plus the new edge
forms the cycle.

## Approach

1. Allocate `parent` and `rank` for labels `1..n`; here `rank` stores component size.
2. Implement `find` with path halving so repeated root lookups remain nearly constant time.
3. Scan `edges` in order. If `find(u) == find(v)`, return `[u, v]` because earlier edges
   already provide a path between its endpoints.
4. Otherwise attach the smaller component below the larger one and update its size. The input
   edge list is read only.
5. Keep the final `return []` only to satisfy the function contract; valid input always finds
   one redundant edge.

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

After each successful union, two nodes have the same root exactly when processed edges connect
them. Therefore a failed union identifies an edge whose endpoints already have a path, so removing
that edge preserves connectivity and eliminates the cycle. All earlier edges on the unique cycle
performed successful unions; consequently, the failed edge is the cycle edge latest in input
order, exactly the required tie-breaking choice.

**Complexity**

- **Time:** `O(n * α(n))` with path compression and union by size.
- **Space:** `O(n)` for the union-find arrays.
