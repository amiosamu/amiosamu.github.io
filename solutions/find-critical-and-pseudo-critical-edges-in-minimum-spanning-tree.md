---
# Find Critical and Pseudo Critical Edges in Minimum Spanning Tree · Hard · Advanced Graphs
# https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/
draft: false
pattern: "Kruskal rerun per edge, excluded and forced"
time: "O(E^2 * a(V))"
space: "O(V + E)"
---

## Intuition

Both labels are definitions about the MST *weight*, so I never need to enumerate spanning trees — I just need to rerun Kruskal twice per edge and compare against the baseline weight. An edge is critical if deleting it makes the best achievable weight worse (or disconnects the graph): no MST can avoid it. Otherwise it is pseudo-critical if forcing it in still achieves the baseline weight: some MST uses it. Everything else appears in no MST at all. The one bookkeeping trap is that Kruskal needs the edges sorted by weight while the answer wants original indices, so each edge carries its original position along with it.

## Approach

1. Build `indexed = [e + [i] for i, e in enumerate(edges)]` so each entry is `[u, v, w, originalIndex]`, then sort by weight `e[2]`. The copy avoids mutating the input.
2. Write `find(par, x)` as iterative union-find with path halving (`par[x] = par[par[x]]`), and do the union inline as `par[find(u)] = find(v)`.
3. Write `mst(skip, force)` returning the total weight of a spanning tree built by Kruskal, with defaults `-1` meaning "no edge skipped / forced".
4. Inside `mst`: fresh `par = list(range(n))`, `weight = 0`, `count = 0` (edges taken). If `force != -1`, union its endpoints and charge its weight *before* the loop, so the forced edge is in the tree regardless of order.
5. Then sweep the sorted edges by position `i`, skipping `i == skip`, and union whenever the roots differ, adding `w` and incrementing `count`. The forced edge, if revisited, is a no-op since its endpoints already share a root.
6. Return `weight if count == n - 1 else float("inf")` — the infinity is what makes a bridge come out critical when removing it disconnects the graph.
7. Compute `base = mst()`, then for each sorted position `i` with original index `orig`: if `mst(skip=i) > base` append `orig` to `critical`; elif `mst(force=i) == base` append it to `pseudo`.
8. Return `[critical, pseudo]`. The `elif` is load-bearing: a critical edge also satisfies the forced test, so it must be classified first.

## Code

```python
class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        indexed = [e + [i] for i, e in enumerate(edges)]
        indexed.sort(key=lambda e: e[2])

        def find(par, x):
            while par[x] != x:
                par[x] = par[par[x]]
                x = par[x]
            return x

        def mst(skip=-1, force=-1):
            par = list(range(n))
            weight = 0
            count = 0
            if force != -1:
                u, v, w, _ = indexed[force]
                par[find(par, u)] = find(par, v)
                weight += w
                count += 1
            for i, (u, v, w, _) in enumerate(indexed):
                if i == skip:
                    continue
                ru, rv = find(par, u), find(par, v)
                if ru != rv:
                    par[ru] = rv
                    weight += w
                    count += 1
            return weight if count == n - 1 else float("inf")

        base = mst()
        critical, pseudo = [], []

        for i in range(len(indexed)):
            orig = indexed[i][3]
            if mst(skip=i) > base:
                critical.append(orig)
            elif mst(force=i) == base:
                pseudo.append(orig)

        return [critical, pseudo]
```

## Why it works

Kruskal returns the true minimum weight for whatever edge set it is given, so `mst(skip=i)` is the best weight achievable *without* edge `i` and `mst(force=i)` the best achievable *with* it. If the former exceeds `base`, every minimum spanning tree must contain `i`, which is the definition of critical; if the latter equals `base`, the tree Kruskal built is itself an MST containing `i`, so `i` is in at least one MST. Forcing works because the greedy exchange property is unaffected by starting from a partial forest — Kruskal completes any forest to a minimum-weight spanning tree containing it. Sorting is O(E log E) and each of the `2E + 1` Kruskal runs is O(E a(V)), giving O(E² a(V)) time with O(V + E) space for the parents and the indexed edge list.
