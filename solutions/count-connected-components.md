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

Start with `n` singleton components. An edge between different components merges them and
reduces the count by one; an edge within one component changes nothing. Union-find tracks these
sets efficiently using path compression and union by size.

## Approach

1. Initialize `parent[x] = x`, `size[x] = 1`, and `count = n`.
2. Let `find(x)` follow parent links to a root while path-halving the traversed links.
3. Let `union(a, b)` return `False` if both nodes already share a root. Otherwise attach the
   smaller tree below the larger root, update its size, and return `True`.
4. Process every edge and decrement `count` after each successful union. Isolated nodes remain
   counted as singleton components.

## Code

```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        size = [1] * n

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a: int, b: int) -> bool:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False
            if size[ra] < size[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            size[ra] += size[rb]
            return True

        count = n
        for u, v in edges:
            if union(u, v):
                count -= 1
        return count
```

## Why it works

After each processed edge, two nodes have the same root exactly when the processed edges connect
them. This is initially true for singleton sets. A successful union combines precisely the two
components joined by its edge, while a failed union leaves an already-connected component
unchanged. Each successful merge reduces the number of components by one, so the final `count`
is exact.

**Complexity**

- **Time:** `O(V + E * α(V))` with union by size and path compression.
- **Space:** `O(V)` for the parent and size arrays.
