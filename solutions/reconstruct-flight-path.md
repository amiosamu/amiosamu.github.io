---
# Reconstruct Itinerary · Hard · Advanced Graphs
# https://leetcode.com/problems/reconstruct-itinerary/
draft: false
pattern: "Hierholzer Eulerian path"
time: "O(E log E)"
space: "O(E)"
---

## Description

Given airline tickets `[from, to]`, return an itinerary that starts at `"JFK"` and uses every
ticket exactly once. If several itineraries are valid, return the lexicographically smallest
airport sequence.

**Example**

```
Input: tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
Output: ["JFK","MUC","LHR","SFO","SJC"]
```

Explanation: The displayed chain is the only itinerary that starts at `"JFK"` and uses all four
tickets.

## Intuition

Tickets are directed edges, so the required itinerary is an Eulerian trail. Taking the smallest
edge and immediately committing it to the final route can fail when that edge enters a dead end.
Hierholzer's algorithm avoids that commitment: it consumes edges while walking, but adds airports
to the route only when no outgoing edge remains. Those postorder additions produce the trail in
reverse and automatically splice cycles into the main walk.

## Approach

1. Iterate over `sorted(tickets, reverse=True)` and append each destination to `adj[src]`.
   Sorting creates a new list and does not mutate `tickets`; reverse order lets `pop()` choose
   the smallest available destination in constant time.
2. Initialize `stack = ["JFK"]` and an empty reverse-postorder list `route`.
3. While the stack's top has an unused outgoing edge, pop the smallest destination and push it.
   Each such operation consumes one ticket, including duplicate tickets as separate edges.
4. When the top has no outgoing edge, pop that airport into `route`. Continue until the stack
   is empty, then return `route[::-1]`.

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

Every ticket is removed from one adjacency list exactly once. When an airport is appended to
`route`, it has no unused outgoing edge, so that vertex closes the current trail suffix.
Reversing postorder places each suffix after the edge that entered it, which is precisely
Hierholzer's cycle-splicing construction. The existence guarantee ensures the resulting trail
starts at `"JFK"` and contains all `E` edges, hence `E + 1` airports.

For lexicographic minimality, suppose another valid itinerary first differs by taking a smaller
destination from some airport `u`. The sorted traversal explores that edge before the edge used by
the returned route. If its exploration closes a detour back into the current trail, Hierholzer
splices that detour at `u` before any larger outgoing edge. The only earlier-explored edge placed
later by postorder belongs to the unique open suffix that ends the Eulerian trail; taking that
suffix while unused edges still leave `u` would strand them and cannot form a valid itinerary.
Thus a smaller destination cannot occur at the first differing position, proving minimality.

**Complexity**

- **Time:** `O(E log E)` for sorting; the Hierholzer traversal is `O(E)`.
- **Space:** `O(E)` for adjacency lists, the stack, and the route.
