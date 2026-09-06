---
# Rotting Oranges · Medium · Graphs
# https://leetcode.com/problems/rotting-oranges/
draft: false
pattern: "Multi-source BFS, count levels"
time: "O(m * n)"
space: "O(m * n)"
---

## Description

Given an `m x n` grid where `0` is an empty cell, `1` is a fresh orange, and `2` is a rotten
orange, return the minimum number of minutes until no fresh orange remains, where every
minute each rotten orange rots its fresh orthogonal neighbors. Return `-1` if some fresh
orange can never rot.

**Example**

```
Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
```

Explanation: the rot spreads outward one ring per minute from the single rotten orange at
`(0, 0)`, and the farthest fresh orange, at `(2, 2)`, is reached on minute 4.


## Intuition

The nodes are the cells holding an orange and the edges join oranges that share a side; empty
cells are simply absent from the graph. Rot spreads to *all* side-neighbours simultaneously
each minute, so one minute of simulation is exactly one BFS level, and the answer is the
number of levels a BFS seeded with every initially-rotten orange needs to swallow the fresh
ones. Distance matters, so it is BFS, not DFS — and multi-source, because rot starts from all
the `2`s at once.

I track a `fresh` counter during the seeding pass rather than rescanning at the end. If the
queue drains while `fresh > 0`, those oranges sit in a component containing no rotten seed and
can never rot — that is the `-1` case.

## Approach

1. One pass over the grid: push every `(r, c)` with `grid[r][c] == 2` into `q`, and
   `fresh += 1` for every `1`.
2. `minutes = 0`. Loop `while q and fresh:` — the `fresh` guard is what stops the count from
   running one minute too long after the last orange rots.
3. Process a whole level per iteration: `for _ in range(len(q))`, snapshotting the level size
   *before* popping so the oranges rotted this minute land in the next level.
4. Pop `(r, c)`; for each in-bounds neighbour with value `1`, set `grid[nr][nc] = 2`,
   `fresh -= 1`, and push it. Rewriting the cell to `2` at push time is the visited mark —
   without it, two rotten neighbours would both enqueue the same fresh orange and it would be
   counted twice in `fresh`.
5. After the inner loop, `minutes += 1`.
6. Return `minutes if fresh == 0 else -1`. A grid with no fresh oranges skips the loop
   entirely and returns `0`, as required.

## Code

```python
import collections

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        q = collections.deque()
        fresh = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1

        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1

        return minutes if fresh == 0 else -1
```

## Why it works

BFS from the whole rotten set expands in lockstep, so the `k`-th level holds exactly the
oranges whose shortest hop distance to any initially-rotten orange is `k` — which is precisely
the minute they rot under the simultaneous-spread rule. Counting levels therefore counts
minutes, and stopping the loop as soon as `fresh` hits zero avoids charging a final minute in
which nothing changed. If `fresh` is still positive when the queue empties, no rotten orange
is connected to those cells, so no amount of time helps and `-1` is right. Each cell is rotted
at most once and expanded at most once: `O(m * n)` time, `O(m * n)` queue.
