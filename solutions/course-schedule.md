---
# Course Schedule · Medium · Graphs
# https://leetcode.com/problems/course-schedule/
draft: false
pattern: "Three-state DFS cycle detection"
time: "O(V + E)"
space: "O(V + E)"
---

## Description

Given `numCourses` courses and prerequisite pairs `[course, prerequisite]`, determine
whether every course can be completed. A valid schedule exists only if the directed
prerequisite graph has no cycle.

**Example**

```
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
```

Course 0 can be taken before course 1, so both courses can be completed.

## Intuition

A course is impossible to finish only when following prerequisites returns to a course on
the same dependency path. Merely reaching a previously visited course does not prove a
cycle because separate paths may share prerequisites.

Use three DFS states: unvisited, active on the current recursion path, and completely
checked. Reaching an active course finds a cycle; reaching a checked course reuses an
already proven result.

## Approach

1. Build `adj`, where `adj[course]` contains the prerequisites that course depends on.
2. Store `0` for unvisited, `1` for active, and `2` for fully checked in `state`.
3. In `dfs(node)`, reject state `1`, accept state `2`, and otherwise mark the node active
   before recursively checking every prerequisite.
4. Mark the node checked only after all of its prerequisites succeed. This transition
   removes it from the current path while preserving the result for later DFS branches.
5. Start DFS from every course because the graph may be disconnected. A self-prerequisite
   is detected immediately as an edge back to an active course.

## Code

```python
import collections

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = collections.defaultdict(list)
        for course, pre in prerequisites:
            adj[course].append(pre)

        state = [0] * numCourses  # 0 = unvisited, 1 = on current path, 2 = done

        def dfs(node: int) -> bool:
            if state[node] == 1:
                return False
            if state[node] == 2:
                return True

            state[node] = 1
            for pre in adj[node]:
                if not dfs(pre):
                    return False
            state[node] = 2
            return True

        return all(dfs(c) for c in range(numCourses))
```

## Why it works

While `dfs(node)` is running, state `1` marks exactly the courses on its recursion path.
An edge to state `1` therefore closes a directed cycle. Conversely, traversing any directed
cycle revisits an active course before its call can finish, so DFS detects every cycle. A
node enters state `2` only after all reachable prerequisites are cycle-free, making that
result safe to reuse. Thus every DFS succeeds exactly when all courses can be completed.

**Complexity**

- **Time:** `O(V + E)`, because each course and prerequisite edge is processed once.
- **Space:** `O(V + E)` for the adjacency list, states, and recursion stack.
