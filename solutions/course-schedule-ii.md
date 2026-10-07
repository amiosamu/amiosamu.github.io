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

Orient each prerequisite as `pre -> course`. A course is available when its indegree, the
number of unmet prerequisites, is zero. Kahn's algorithm repeatedly emits available courses
and removes their outgoing edges. If courses remain after the queue empties, a cycle prevents
any valid ordering.

## Approach

1. Build `adj[pre]` with each dependent course and increment `indegree[course]` for every pair.
2. Initialize a queue with all zero-indegree courses and an empty `order`.
3. Pop a course, append it to `order`, and decrement every dependent's indegree. Enqueue a
   dependent exactly when its indegree reaches zero.
4. Return `order` if it contains every course; otherwise return `[]`. Courses with no edges are
   initially queued, and any ordering among simultaneously available courses is valid.

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

Every emitted course has indegree zero, meaning all its prerequisites were emitted earlier;
therefore `order` always satisfies every processed dependency. If all courses are emitted, it
is a valid topological order. If the queue empties early, each remaining course depends on
another remaining course. Following those dependencies in a finite set eventually repeats a
course, proving a cycle and the impossibility of any order.

**Complexity**

- **Time:** `O(V + E)` because each course and prerequisite edge is processed once.
- **Space:** `O(V + E)` for the graph, indegrees, queue, and returned order.
