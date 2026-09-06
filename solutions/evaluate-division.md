---
# Evaluate Division · Medium · Graphs
# https://leetcode.com/problems/evaluate-division/
draft: false
pattern: "BFS on a weighted ratio graph"
time: "O(V + E + q * (V + E))"
space: "O(V + E)"
---

## Description

Given a list of equations `a / b = val` as pairs of variable names with corresponding
`values`, and a list of `queries` each asking for `a / b`, evaluate each query by chaining
the known ratios through shared variables, returning `-1.0` for any query involving an
unknown variable or an unreachable pair.

**Example**

```
Input: equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
Output: [6.0,0.5,-1.0,1.0,-1.0]
```

Explanation: `a / b = 2.0` and `b / c = 3.0` chain to `a / c = 2.0 * 3.0 = 6.0`, while `"e"`
and `"x"` never appear in the equations, so those queries return `-1.0`.


## Intuition

Each equation `a / b = k` is a weighted edge in disguise: nodes are the variable *names*,
and the edge `a -> b` carries weight `k`, with the reverse edge `b -> a` carrying `1 / k`.
The point of storing both directions is that ratios are invertible, so the graph is
effectively undirected with reciprocal weights.

Once it is a graph, a query `c / d` is a path from `c` to `d`, and the answer is the
*product* of the weights along it — the intermediate variables cancel telescopically
(`a/b * b/c = a/c`). So each query is one traversal carrying a running product. BFS keeps
it iterative and, since the input is consistent, any path gives the same product, so I can
return the first time I touch the target. Unknown variables and disconnected pairs both
mean "no path", which is `-1.0`.

## Approach

1. Build `adj = collections.defaultdict(list)`. For each `(a, b)` in `equations` with its
   `val` in `values`, append `(b, val)` to `adj[a]` and `(a, 1 / val)` to `adj[b]`.
   `zip(equations, values)` pairs them up.
2. `bfs(src, dst)`:
   - If `src` or `dst` is missing from `adj`, the variable never appeared in any equation
     and nothing can be derived. Return `-1.0`. This check also correctly rejects
     `x / x` for an unseen `x`.
   - Seed `queue = deque([(src, 1.0)])` and `visited = {src}`. The `1.0` is the identity
     for the running product.
3. Pop `(node, product)`. If `node == dst`, `product` is the value of `src / dst` — return
   it. Checking on dequeue handles `src == dst` for a known variable, giving `1.0` for
   free.
4. For each `(nei, weight)` in `adj[node]` with `nei` not yet visited: add `nei` to
   `visited` and enqueue `(nei, product * weight)`. Marking on enqueue rather than on pop
   keeps each variable in the queue once, which matters because otherwise the reciprocal
   back-edges would immediately bounce the traversal back where it came from.
5. If the queue drains, `src` and `dst` are in different components — return `-1.0`.
6. Map the queries: `[bfs(a, b) for a, b in queries]`.

## Code

```python
import collections

class Solution:
    def calcEquation(self, equations: List[List[str]], values: List[float], queries: List[List[str]]) -> List[float]:
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

Multiplying the weights along a path `v0 -> v1 -> ... -> vk` gives
`(v0/v1)(v1/v2)...(v(k-1)/vk) = v0/vk`, so any path from `src` to `dst` evaluates the
query — and since the problem guarantees no contradictory equations, every path yields the
same number, which is why returning on first contact is safe. If no path exists, no chain
of substitutions can relate the two variables, so `-1.0` is genuinely undetermined rather
than merely unfound. Building the graph is `O(E)`, and each of the `q` queries is one BFS
over at most `V` nodes and `E` edges, giving `O(q * (V + E))` on top of `O(V + E)` space.
