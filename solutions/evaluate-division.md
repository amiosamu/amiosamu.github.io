---
# Evaluate Division · Medium · Graphs
# https://leetcode.com/problems/evaluate-division/
draft: false
pattern: "BFS on a weighted ratio graph"
time: "O(V + E + q * (V + E))"
space: "O(V + E)"
---

## Description

Given equations such as `a / b = value`, evaluate ratio queries by combining known
equations. Return `-1.0` when either variable is unknown or no chain connects them.

**Example**

```
Input:
equations = [["a", "b"], ["b", "c"]]
values = [2.0, 3.0]
queries = [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]]
Output: [6.0, 0.5, -1.0, 1.0, -1.0]
```

The known equations give `a / c = (a / b)(b / c) = 6.0`. Unknown variables cannot be
evaluated.

## Intuition

Treat every variable as a graph node. Equation `a / b = value` creates an edge from `a`
to `b` with that weight and a reciprocal edge from `b` to `a`. Multiplying edge weights
along a path cancels intermediate variables and produces the endpoint ratio.

For each query, BFS carries the product from the source to every reached node. The input
is consistent, so the first path to the destination has the required value.

## Approach

1. Build reciprocal weighted adjacency lists for every equation.
2. For a query, reject either variable if it is absent. Otherwise start BFS from `src`
   with product `1.0` and mark it visited.
3. Pop `(node, product)` pairs. Return `product` at `dst`; this makes a known
   `src / src` equal `1.0`, while an unknown self-query was already rejected.
4. For each unvisited neighbor, enqueue `product * weight` and mark it immediately to
   avoid reciprocal cycles.
5. Return `-1.0` if BFS exhausts the connected component, and run this helper per query.

## Code

```python
import collections

class Solution:
    def calcEquation(
        self,
        equations: List[List[str]],
        values: List[float],
        queries: List[List[str]],
    ) -> List[float]:
        adj = collections.defaultdict(list)
        for (a, b), val in zip(equations, values):
            adj[a].append((b, val))
            adj[b].append((a, 1 / val))

        def bfs(src: str, dst: str) -> float:
            if src not in adj or dst not in adj:
                return -1.0

            queue = collections.deque([(src, 1.0)])
            visited = {src}
            while queue:
                node, product = queue.popleft()
                if node == dst:
                    return product
                for nei, weight in adj[node]:
                    if nei not in visited:
                        visited.add(nei)
                        queue.append((nei, product * weight))
            return -1.0

        return [bfs(a, b) for a, b in queries]
```

## Why it works

The BFS invariant is that `product` at node `v` equals `src / v`. It starts true at the
source because `src / src = 1`. Traversing an edge weighted `v / next` changes the product
to `(src / v)(v / next) = src / next`, preserving the invariant. Thus reaching `dst`
returns the requested ratio. If BFS cannot reach it, no equation chain relates the two
variables, so `-1.0` is correct.

**Complexity**

- **Time:** `O(V + E)` to build the graph and `O(V + E)` per query, for
  `O(V + E + q(V + E))` total.
- **Space:** `O(V + E)` for the graph and one BFS queue and visited set.
- **Output:** `O(q)` for the returned query results.
