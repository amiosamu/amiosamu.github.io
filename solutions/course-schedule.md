---
# Course Schedule · Medium · Graphs
# https://leetcode.com/problems/course-schedule/
draft: false
pattern: "Three-state DFS cycle detection"
time: "O(V + E)"
space: "O(V + E)"
---

## Intuition

The graph is hiding in plain sight: the nodes are the `numCourses` course ids, and each
pair `[course, pre]` is a directed edge `course -> pre` meaning "I must clear `pre`
before `course`". A schedule exists exactly when I can keep walking backwards through
prerequisites and always bottom out — that is, when the graph has no directed cycle.

DFS is the natural fit because a cycle is a *path* property, not a reachability
property: I need to know whether a node reappears on the branch I am currently standing
on, and the recursion stack is that branch. Two visited flags are not enough — "seen
before" alone would flag a diamond (`0 -> 1 -> 3`, `0 -> 2 -> 3`) as a cycle. So each
node gets three states: unvisited, in-current-path, done.

## Approach

1. Build `adj` as a `collections.defaultdict(list)` with `adj[course].append(pre)` for
   every `[course, pre]` in `prerequisites`. Direction is arbitrary as long as it is
   consistent; this one reads as "to take `course`, first do these".
2. Keep `state = [0] * numCourses`: `0` = unvisited, `1` = on the current DFS path,
   `2` = fully explored and known to be cycle-free.
3. `dfs(node)` returns `True` if `node` is schedulable:
   - `state[node] == 1` -> I have re-entered a node still open on this path, so the edge
     I just followed closes a cycle. Return `False`.
   - `state[node] == 2` -> already proven fine on an earlier branch. Return `True`
     immediately; this memo is what keeps the whole run linear.
   - Otherwise set `state[node] = 1`, recurse into every prerequisite, and bail out on
     the first `False`.
4. After all children succeed, set `state[node] = 2` before returning `True`. Demoting
   from `1` to `2` on the way *out* is the whole trick: the node leaves the current path
   at exactly the moment the recursion unwinds past it.
5. The graph may be disconnected and some courses have no prerequisites at all, so run
   `dfs` from every course: `all(dfs(c) for c in range(numCourses))`.

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

A directed graph admits a valid ordering iff it is acyclic, and DFS finds a cycle iff
one exists: any cycle must contain a node that DFS enters first, and the recursion from
that node cannot return before walking the rest of the cycle back into it, at which
point that node is still in state `1`. State `2` is only ever assigned after every
descendant returned `True`, so caching it can never hide a cycle — a node marked done
has no cycle anywhere below it, on this path or any other. Each node flips `0 -> 1 -> 2`
once and each edge is scanned once from its tail, so the run is `O(V + E)` with
`O(V + E)` held in `adj`, `state`, and the recursion stack.
