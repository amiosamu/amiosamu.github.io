---
# Walls And Gates · Medium · Graphs
# https://leetcode.com/problems/walls-and-gates/
draft: false
pattern: "Multi-source BFS from all gates"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` grid of rooms where `-1` is a wall, `0` is a gate, and `2147483647` is an
empty room, fill each empty room in place with the distance to its nearest gate, reachable
only by moving up/down/left/right through empty rooms; rooms no gate can reach keep the
sentinel value.

**Example**

```
Input: rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]
Output: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
```

Explanation: the gate at `(0, 2)` reaches `(1, 2)` in 1 step, `(2, 2)` in 2, `(3, 2)` in 3,
and `(3, 3)` in 4 steps, matching the filled values down that column; the walls (`-1`) are
never overwritten.


## Intuition

Nodes are the non-wall cells, edges join cells sharing a side, and every edge costs one step —
so "distance to the nearest gate" is a shortest-hop question, which forces BFS rather than
DFS. The obvious version, one BFS per empty room, is `O((m * n)^2)`.

Reverse the direction of the question: instead of asking each room which gate is closest, let
all the gates search outward at once. Seed a single queue with *every* gate, since they all
sit at distance `0`, and the frontier expands in lockstep — round `d` of the BFS is exactly
the set of rooms whose nearest gate is `d` steps away. One traversal, every room settled.

## Approach

1. `rows, cols = len(rooms), len(rooms[0])`; `INF = 2147483647`.
2. Seed `q = collections.deque()` with every `(r, c)` where `rooms[r][c] == 0`. Their stored
   distance is already correct.
3. While `q`: pop `(r, c)` and consider the four neighbours `(r±1, c)`, `(r, c±1)`.
4. Push a neighbour only if it is in bounds and `rooms[nr][nc] == INF`, and write
   `rooms[nr][nc] = rooms[r][c] + 1` **at push time**.
5. That single `== INF` test is the visited check *and* the wall check: walls hold `-1`, and
   any room already reached now holds a finite distance, so both fail the test. Writing the
   distance on push (not on pop) is what makes a room enter the queue once; deferring it
   would let two frontier cells both enqueue the same room.
6. Nothing to return — `rooms` is filled in place. Rooms in a component with no gate are
   never reached and keep `INF`, which is the required output.

## Code

```python
import collections

class Solution:
    def wallsAndGates(self, rooms: List[List[int]]) -> None:
        rows, cols = len(rooms), len(rooms[0])
        INF = 2147483647

        q = collections.deque(
            (r, c)
            for r in range(rows)
            for c in range(cols)
            if rooms[r][c] == 0
        )

        while q:
            r, c = q.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == INF:
                    rooms[nr][nc] = rooms[r][c] + 1
                    q.append((nr, nc))
```

## Why it works

Seeding every gate at distance `0` is equivalent to adding a virtual super-source with a
zero-cost edge to each gate, and BFS from a single source on an unweighted graph pops nodes in
non-decreasing distance order — so the first time a room is reached, it is reached along a
shortest path from the whole gate set, and the value written then is final. Using `rooms`
itself as the visited marker keeps the space to the queue alone. Every cell is written once
and expanded once with four neighbour checks, giving `O(m * n)` time and a queue that peaks at
`O(m * n)`.
