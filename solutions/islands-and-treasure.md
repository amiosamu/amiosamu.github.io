---
# Walls And Gates · Medium · Graphs
# https://leetcode.com/problems/walls-and-gates/
draft: false
pattern: "Multi-source BFS from all gates"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` grid where `-1` is a wall, `0` is a gate, and `2147483647` is an empty
room, replace each empty room in place with its distance to the nearest gate. Movement is
allowed only between horizontally or vertically adjacent rooms.

**Example**

```
Input: rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]
Output: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
```

Each finite value is the shortest distance to either gate. Walls remain `-1`, and unreachable
rooms would remain `2147483647`.

## Intuition

Every valid move has unit cost, so breadth-first search discovers shortest distances. Starting
one search from every gate at once makes the queue frontier represent distance from the entire
set of gates. The first visit to a room therefore comes from its nearest gate.

## Approach

1. Record the dimensions and enqueue every gate. All queued cells initially have distance zero.
2. Remove cells from the queue in FIFO order and inspect their four neighbors.
3. Ignore out-of-bounds cells, walls, gates, and rooms already assigned a finite distance.
4. For each untouched empty room, write the current distance plus one and enqueue it immediately.
5. Continue until the queue is empty. Unreachable rooms are never mutated and retain `INF`.

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

Initially the queue contains exactly the cells at distance zero from a gate. Suppose every cell
removed before a room has its correct shortest distance. BFS reaches the room from a predecessor
with the smallest possible distance, so assigning predecessor distance plus one is optimal. The
assignment also marks the room visited, preventing any later, no-shorter path from changing it.
By induction over queue order, every written distance is correct. Rooms never reached have no path
to a gate and correctly keep the sentinel value.

**Complexity**

- **Time:** `O(m * n)`, because each cell is enqueued at most once.
- **Space:** `O(m * n)` in the worst case for the BFS queue.
