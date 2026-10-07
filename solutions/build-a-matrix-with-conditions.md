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

Row and column constraints are independent ordering problems. Topologically sort values `1..k`
once for row positions and once for column positions. Value `v` then belongs at the intersection
of its positions in those two orders. A cycle in either graph makes the matrix impossible.

## Approach

1. In `topo`, build adjacency lists and indegrees for a condition graph on `1..k`.
2. Run Kahn's algorithm: repeatedly remove an indegree-zero value and reduce its neighbors'
   indegrees. Return an empty list unless all `k` values are ordered.
3. Topologically sort `rowConditions` and `colConditions`; return `[]` if either has a cycle.
4. Map each value to its index in both orders, allocate a zero-filled `k x k` matrix, and place
   each value at `(row_of[v], col_of[v])`.

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

Kahn's algorithm outputs every edge's source before its destination, or detects a cycle when not
all vertices can be removed. Thus `row_of[a] < row_of[b]` for every row condition, with the same
property for columns. Each value receives one row and one column, and two values cannot occupy
the same cell because their row and column orders are both permutations. Therefore every
placement and condition is valid.

**Complexity**

- **Time:** `O(k^2 + E)`, where `E` is the total number of conditions; matrix allocation
  dominates the two `O(k + E)` topological sorts.
- **Space:** `O(k + E)` auxiliary graph space and `O(k^2)` output space.
