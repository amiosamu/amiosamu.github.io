---
# Build a Matrix With Conditions · Hard · Advanced Graphs
# https://leetcode.com/problems/build-a-matrix-with-conditions
draft: false
pattern: "Two independent topological sorts"
time: "O(V^2 + E) with V = k"
space: "O(V + E)"
---

## Description

Given an integer `k` and two lists of ordering constraints, `rowConditions` (`[a, b]` means
`a` must appear in a row strictly above `b`) and `colConditions` (`[a, b]` means `a` must
appear in a column strictly left of `b`), build a `k x k` matrix containing each of the
numbers `1` to `k` exactly once so that every constraint holds, filling unused cells with
`0`. Return an empty matrix if no such arrangement exists.

**Example**

```
Input: k = 3, rowConditions = [[1,2],[3,2]], colConditions = [[2,1]]
Output: [[0,0,1],[0,3,0],[2,0,0]]
```

Explanation: A row order of `1, 3, 2` satisfies both row constraints (1 above 2, 3 above 2)
and a column order of `2, 3, 1` satisfies the column constraint (2 left of 1); placing each
number at its row and column position gives this matrix.

## Intuition

The rows and the columns never interact. `rowConditions` only constrains which row each
number sits in, `colConditions` only which column — so the k x k placement problem
factors into two completely separate one-dimensional ordering problems.

Once seen that way it is two topological sorts: a row order and a column order, each a
linear arrangement of `1..k`. Number `v` goes at `(position of v in the row order,
position of v in the column order)`. Every cell is distinct because the two orders are
permutations, so no two numbers can collide. If either sort has a cycle, no arrangement
exists and the answer is the empty list.

## Approach

1. Write one `topo(conditions)` helper used twice — that reuse is the whole point of
   the decomposition.
2. Inside it: build `adj` as a list of lists indexed `0..k` and `indegree` as a list of
   the same size; for each `[a, b]` add `a -> b` and bump `indegree[b]`.
3. Kahn's: enqueue every `v` in `1..k` with `indegree[v] == 0`, pop, append to `order`,
   decrement neighbours, enqueue on zero.
4. Return `order` if `len(order) == k`, else `[]` to signal a cycle.
5. Run it on both condition lists. If either comes back empty, return `[]`.
6. Invert both orders into `row_of` and `col_of` (value -> index), allocate a `k x k`
   grid of zeros, and write `matrix[row_of[v]][col_of[v]] = v` for `v` in `1..k`.
   The zeros left behind are exactly the required blanks.

## Code

```python
import collections

class Solution:
    def buildMatrix(self, k: int, rowConditions: List[List[int]], colConditions: List[List[int]]) -> List[List[int]]:
        def topo(conditions: List[List[int]]) -> List[int]:
            adj = [[] for _ in range(k + 1)]
            indegree = [0] * (k + 1)
            for a, b in conditions:
                adj[a].append(b)
                indegree[b] += 1

            queue = collections.deque(v for v in range(1, k + 1) if indegree[v] == 0)
            order = []
            while queue:
                v = queue.popleft()
                order.append(v)
                for nxt in adj[v]:
                    indegree[nxt] -= 1
                    if indegree[nxt] == 0:
                        queue.append(nxt)

            return order if len(order) == k else []

        rows = topo(rowConditions)
        cols = topo(colConditions)
        if not rows or not cols:
            return []

        row_of = {v: i for i, v in enumerate(rows)}
        col_of = {v: i for i, v in enumerate(cols)}

        matrix = [[0] * k for _ in range(k)]
        for v in range(1, k + 1):
            matrix[row_of[v]][col_of[v]] = v
        return matrix
```

## Why it works

A row condition `[a, b]` is satisfied iff `a` appears before `b` in the row order, which
is precisely what a topological sort of the row graph guarantees, and the same holds
independently for columns — so placing `v` at the intersection of its two ranks
satisfies every condition simultaneously. Duplicate edges are harmless because Kahn's
decrements once per edge occurrence and the indegree counted them the same way. Both
sorts are `O(k + E)`; allocating and filling the `k x k` grid dominates at `O(k^2)`.
