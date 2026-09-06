---
# Course Schedule II · Medium · Graphs
# https://leetcode.com/problems/course-schedule-ii/
draft: false
pattern: "Kahn topological sort"
time: "O(V + E)"
space: "O(V + E)"
---

## Description

Given `numCourses` courses and a list of prerequisite pairs `[course, pre]` meaning `pre`
must be taken before `course`, return a valid order in which to take all courses, or an
empty array if no valid order exists because the prerequisite graph has a cycle.

**Example**

```
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3]
```

Explanation: course 0 has no prerequisite so it comes first, courses 1 and 2 each only need
0, and course 3 needs both 1 and 2, so `[0,1,2,3]` respects every dependency.


## Intuition

Same graph as Course Schedule — nodes are course ids, `[course, pre]` is a precedence
constraint — but now I have to hand back an actual order, not just a yes/no. An order is
valid iff every course appears after all of its prerequisites, which is exactly a
topological sort of the DAG.

I orient the edges `pre -> course` this time, so `indegree[course]` counts how many
prerequisites a course is still waiting on. A course with indegree 0 is takeable right
now, and taking it can only ever *unblock* other courses. That gives Kahn's algorithm:
repeatedly take anything with indegree 0 and decrement its dependents. If the queue dries
up before all `numCourses` courses are emitted, whatever is left is mutually blocked —
a cycle — and no order exists.

## Approach

1. Build `adj[pre].append(course)` and `indegree[course] += 1` for every
   `[course, pre]` in `prerequisites`. `indegree` is a plain `[0] * numCourses` list.
2. Seed a `collections.deque` with every course whose `indegree` is 0. There is always
   at least one if the graph is acyclic.
3. Pop `node` from the left, append it to `order`. Every prerequisite of `node` has
   already been emitted, so placing it here is safe.
4. For each `nxt` in `adj[node]`, do `indegree[nxt] -= 1` and enqueue `nxt` the moment it
   hits 0. Hitting 0 is the enqueue trigger *and* the visited mark — a node can only
   reach 0 once, so nothing is enqueued twice and no separate `visited` set is needed.
5. When the queue drains, compare `len(order)` to `numCourses`. Short means the leftovers
   all still have positive indegree, i.e. every one of them waits on another leftover —
   a cycle. Return `[]`.
6. Any topological order is accepted, so the arbitrary tie-breaking among indegree-0
   courses does not matter.

## Code

```python
import collections

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        adj = collections.defaultdict(list)
        indegree = [0] * numCourses
        for course, pre in prerequisites:
            adj[pre].append(course)
            indegree[course] += 1

        queue = collections.deque(c for c in range(numCourses) if indegree[c] == 0)
        order = []

        while queue:
            node = queue.popleft()
            order.append(node)
            for nxt in adj[node]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)

        return order if len(order) == numCourses else []
```

## Why it works

The invariant is that a course is emitted only after its indegree reaches 0, and its
indegree reaches 0 only after every one of its prerequisites has been emitted — so the
output satisfies every edge by construction. For the failure case: if the loop stalls,
each remaining course has an unemitted prerequisite, so following prerequisites backwards
inside a finite leftover set must revisit a course, which is a cycle and proves no order
exists. Every node is enqueued and popped at most once and each edge is relaxed exactly
once when its tail is popped, giving `O(V + E)` time and `O(V + E)` space for `adj`,
`indegree`, and the queue.
