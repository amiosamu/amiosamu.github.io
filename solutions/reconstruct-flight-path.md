---
# Reconstruct Itinerary · Hard · Advanced Graphs
# https://leetcode.com/problems/reconstruct-itinerary/
draft: false
pattern: "Hierholzer Eulerian path"
time: "O(E log E)"
space: "O(E)"
---

## Intuition

Every ticket must be used exactly once, so this is an Eulerian path over the tickets —
edges, not nodes, are what gets visited. That kills plain DFS-with-backtracking as the
mental model: a greedy walk taking the smallest airport each time can strand itself at
a dead end with tickets left over, and it is not obvious which choice to undo.

Hierholzer's algorithm sidesteps the backtracking entirely. Walk greedily until stuck,
and when stuck, the airport you are stranded at must be the *end* of the itinerary, so
retire it onto an output list and keep walking from the previous airport. The list
comes out backwards, and reversing it splices every side loop into exactly the right
place.

## Approach

1. Sort `tickets` in **reverse** and append each `dst` to `adj[src]`. Reverse order puts
   the lexicographically smallest destination last, so `list.pop()` hands it back in
   `O(1)` — the greedy choice with no heap.
2. `stack = ["JFK"]`, `route = []`.
3. While the stack is non-empty:
   - Inner loop: while `adj[stack[-1]]` still has tickets, `pop()` one and push that
     destination onto the stack, consuming the ticket permanently.
   - When the top airport has no tickets left, it is a dead end: `route.append(stack.pop())`.
4. Return `route[::-1]`.
5. Use a `defaultdict(list)` so `adj[stack[-1]]` on a leaf airport with no outgoing
   tickets returns an empty list instead of raising.

## Code

```python
import collections

class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        adj = collections.defaultdict(list)
        for src, dst in sorted(tickets, reverse=True):
            adj[src].append(dst)

        route = []
        stack = ["JFK"]

        while stack:
            while adj[stack[-1]]:
                stack.append(adj[stack[-1]].pop())
            route.append(stack.pop())

        return route[::-1]
```

## Why it works

The problem guarantees a valid itinerary exists, so at most one airport has
`outdegree = indegree + 1` and the walk from JFK can only get stuck at the true
terminal. Anything popped onto `route` therefore has all of its tickets already
consumed, and reversing puts each stranded suffix after the detours that were
discovered later — which is exactly Hierholzer's splice. Greedy-smallest is safe
because Hierholzer always uses every edge regardless of order, so choosing the smallest
available destination at each step yields the lexicographically smallest of the valid
itineraries. Sorting is `O(E log E)` and each ticket is pushed and popped once, so the
walk is `O(E)`.
