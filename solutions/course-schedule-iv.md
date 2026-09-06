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

Nodes are courses, and `[pre, course]` is a directed edge `pre -> course`. "Is `u` a
prerequisite of `v`" is not an edge lookup — prerequisites are transitive, so the real
question is whether `v` is *reachable* from `u` in that DAG.

Answering each query with its own traversal is wasteful when queries repeat sources, and
`numCourses <= 100` is small enough that I can just precompute the entire transitive
closure: run one BFS from every course and record everything it can reach. That is `V`
traversals up front, after which every query is a set membership test. BFS or DFS is
irrelevant here since I want the reachable *set*, not distances; BFS just keeps it
iterative.

## Approach

1. Build `adj = [[] for _ in range(numCourses)]` with `adj[pre].append(course)` for each
   `[pre, course]` in `prerequisites`.
2. Allocate `reach = [set() for _ in range(numCourses)]`, where `reach[u]` will hold every
   course that has `u` somewhere in its prerequisite chain.
3. For each `src` in `range(numCourses)`, BFS from `src` with `seen = reach[src]` used
   directly as the visited set — the set I am filling *is* the visited set, so there is no
   second structure to keep in sync.
4. Note `src` is deliberately **not** put into `seen`. A course is not its own
   prerequisite, and since the input is a DAG nothing can walk back into `src` and add it
   by accident.
5. Inside the BFS, pop `node` and for each `nxt` in `adj[node]` that is not in `seen`, add
   it to `seen` and enqueue it in the same breath. Marking on enqueue rather than on pop
   keeps each course in the queue at most once per source.
6. Answer the queries with `[v in reach[u] for u, v in queries]`.

## Code

```python
import collections

class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
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

`u` is a prerequisite of `v` exactly when there is a directed path `u -> ... -> v`, since
the relation is the transitive closure of the direct-prerequisite edges — and BFS from `u`
enumerates precisely the nodes on such paths, no more and no fewer. Filling `reach[src]`
in place as the visited set is safe because a node is added the first time it is
discovered and never removed, so each source's BFS costs `O(V + E)`. That is
`O(V * (V + E))` for the whole closure plus `O(1)` per query, and the closure itself is
`O(V^2)` sets in the worst case.
