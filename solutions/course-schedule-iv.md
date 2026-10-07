---
# Course Schedule IV · Medium · Graphs
# https://leetcode.com/problems/course-schedule-iv/
draft: false
pattern: "Transitive closure by BFS per source"
time: "O(V * (V + E) + q)"
space: "O(V^2 + E)"
---

## Description

Given `numCourses` courses, a list of direct prerequisite pairs `[pre, course]`, and a list
of `queries` `[u, v]`, return a boolean array answering, for each query, whether `u` is a
prerequisite of `v`, directly or transitively.

**Example**

```
Input: numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]
Output: [false,true]
```

Explanation: course 1 must be taken before course 0, so query `[0,1]` ("is 0 a prerequisite
of 1?") is false, while query `[1,0]` ("is 1 a prerequisite of 0?") is true.

## Intuition

`u` is a prerequisite of `v` exactly when the directed graph contains a path from `u` to `v`.
Precompute that reachability relation by running BFS from every course. This avoids repeating a
traversal for queries with the same source and turns each query into a set lookup.

## Approach

1. Build adjacency lists for directed edges `pre -> course`.
2. Create `reach[src]`, the set of courses reachable from each possible source.
3. For each `src`, run BFS. Add a neighbor to `reach[src]` when it is enqueued so it is visited
   at most once. The prerequisite graph is acyclic, so `src` cannot be rediscovered.
4. Answer each `[u, v]` with `v in reach[u]`. Inputs are only read, and a course is not treated
   as its own prerequisite.

## Code

```python
import collections

class Solution:
    def checkIfPrerequisite(
        self,
        numCourses: int,
        prerequisites: List[List[int]],
        queries: List[List[int]],
    ) -> List[bool]:
        adj = [[] for _ in range(numCourses)]
        for pre, course in prerequisites:
            adj[pre].append(course)

        reach = [set() for _ in range(numCourses)]
        for src in range(numCourses):
            seen = reach[src]
            queue = collections.deque([src])
            while queue:
                node = queue.popleft()
                for nxt in adj[node]:
                    if nxt not in seen:
                        seen.add(nxt)
                        queue.append(nxt)

        return [v in reach[u] for u, v in queries]
```

## Why it works

For a fixed source, BFS adds exactly nodes reached by directed paths: direct neighbors establish
the base case, and exploring an already reachable node extends those paths by one edge. Every
directed path is eventually followed, so no reachable course is omitted. Thus `reach[src]` is
the source's transitive prerequisite relation, and each membership lookup answers its query
exactly.

**Complexity**

- **Time:** `O(V * (V + E) + q)` for `V` traversals and `q` query lookups.
- **Space:** `O(V^2 + E)` for adjacency, reachability sets, and the BFS queue.
