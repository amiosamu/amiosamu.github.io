---
# Number of Connected Components In An Undirected Graph · Medium · Graphs
# https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
draft: false
pattern: "Union-Find counting merges"
time: "O(V + E * α(V))"
space: "O(V)"
---

## Description

Given `n` nodes labeled `0` to `n - 1` and a list of undirected `edges`, return the number
of connected components in the graph.

**Example**

```
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
```

Explanation: nodes 0, 1, 2 are joined into one component by the first two edges, and nodes
3, 4 form a second component, giving 2 components in total.


## Intuition

The graph is handed over as `n` nodes and an undirected edge list. A DFS flood fill works
— count how many times the outer loop has to start a fresh traversal — but the
incremental view is sharper and generalises to the rest of the union-find problems:
start with `n` isolated components, then feed in the edges one at a time.

Each edge does exactly one of two things: it joins two nodes that are currently in
different components, dropping the count by one, or it connects two nodes already in the
same component, in which case it is a redundant edge inside a cycle and changes nothing.
So the answer is `n` minus the number of edges that actually merged something, and
union-find is the structure that answers "same component?" and "merge them" in near-`O(1)`.

## Approach

1. `parent = list(range(n))` — every node starts as its own root — and `rank = [1] * n`
   holding component sizes for union by size.
2. `find(x)` walks parents up to the root, and does path halving on the way
   (`parent[x] = parent[parent[x]]`), which flattens the tree without a second pass or
   recursion.
3. `union(a, b)` finds both roots. If they are equal, return `False` — nothing merged.
   Otherwise attach the smaller component under the larger (swap so `ra` is the bigger),
   set `parent[rb] = ra`, add the sizes, and return `True`.
4. Union by size matters: without it a chain of unions can build an `n`-deep tree and
   `find` degrades to `O(n)`.
5. Start `count = n` and decrement it for every edge whose `union` returns `True`.
6. Return `count`. Nodes that appear in no edge are already counted as their own singleton
   components, which is what the problem wants.

## Code

```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        rank = [1] * n

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a: int, b: int) -> bool:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False
            if rank[ra] < rank[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            rank[ra] += rank[rb]
            return True

        count = n
        for u, v in edges:
            if union(u, v):
                count -= 1
        return count
```

## Why it works

The invariant is that after processing any prefix of `edges`, two nodes share a root iff
they are connected using only those edges — `union` merges exactly the two sets its
endpoints belong to, and `find` never crosses between sets. Since each successful merge
reduces the component count by exactly one and a failed union means both endpoints were
already connected, `n - merges` is the component count of the full graph. Union by size
plus path halving keeps every `find` at amortised inverse-Ackermann, so processing all
edges is `O(V + E * α(V))` with `O(V)` space.
