---
# Alien Dictionary · Hard · Advanced Graphs
# https://leetcode.com/problems/alien-dictionary/
draft: false
pattern: "Kahn topological sort on letters"
time: "O(C + V + E)"
space: "O(V + E)"
---

## Description

Given alien-language `words` sorted by an unknown alphabet, return any character ordering
consistent with the list. Return `""` if no valid ordering exists.

**Example**

```
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
```

Explanation: Adjacent comparisons give `t < f`, `w < e`, `r < t`, and `e < r`, which
are all satisfied by `"wertf"`.

## Intuition

For adjacent words, only their first differing characters determine their relative order.
That pair creates a directed precedence edge. Characters after the mismatch add no valid
constraint.

A valid alphabet is a topological ordering of this graph. A cycle makes the constraints
inconsistent. A longer word before its exact prefix, such as `"abc"` before `"ab"`, is
also invalid and must be detected separately because it creates no edge.

## Approach

1. Create an adjacency set and an indegree count for every character appearing in
   `words`, including characters with no ordering edges.
2. Compare each adjacent word pair. Reject a longer word followed by its exact prefix;
   otherwise add one edge for the first mismatch and stop comparing that pair.
3. Use sets for neighbors so a repeated constraint increments indegree only once.
4. Run Kahn's algorithm: enqueue all zero-indegree characters, emit them, and decrement
   their neighbors' indegrees.
5. Return the emitted characters if all were processed. Otherwise, a cycle remains, so
   return `""`. Any ordering among simultaneous zero-indegree characters is valid.

## Code

```python
import collections

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        adj = {c: set() for w in words for c in w}
        indegree = {c: 0 for c in adj}

        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            min_len = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1.startswith(w2):
                return ""
            for j in range(min_len):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:
                        adj[w1[j]].add(w2[j])
                        indegree[w2[j]] += 1
                    break

        queue = collections.deque(c for c in indegree if indegree[c] == 0)
        res = []
        while queue:
            c = queue.popleft()
            res.append(c)
            for nei in adj[c]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)

        return "".join(res) if len(res) == len(adj) else ""
```

## Why it works

The first mismatch of each adjacent pair is a necessary ordering constraint, while later
characters do not affect that pair's lexical order. After excluding invalid prefixes, any
alphabet satisfying all these edges orders every adjacent pair correctly and therefore
the entire list. Kahn's algorithm emits a character only after all its predecessors, so a
complete result satisfies every constraint. If it cannot emit every character, the
remaining directed graph contains a cycle and no alphabet can satisfy it.

**Complexity**

- **Time:** `O(C + V + E)`, where `C` is the input size and `V`, `E` are graph sizes.
- **Space:** `O(V + E)` for the graph, indegrees, queue, and result.
