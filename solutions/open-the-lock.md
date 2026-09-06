---
# Open The Lock · Medium · Graphs
# https://leetcode.com/problems/open-the-lock/
draft: false
pattern: "BFS over four-digit lock states"
time: "O(10^4 * 4 + d)"
space: "O(10^4 + d)"
---

## Description

Given a 4-wheel combination lock starting at `"0000"`, where each wheel can be turned one
step up or down (wrapping between `9` and `0`), a list of `deadends` states that lock the
wheel permanently if reached, and a `target` combination, return the minimum number of turns
needed to reach `target` without ever passing through a deadend, or `-1` if it's impossible.

**Example**

```
Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
```

Explanation: the shortest sequence of single-wheel turns from `"0000"` to `"0202"` that
avoids every listed deadend takes 6 moves.


## Intuition

The graph is not given — I have to see it. A node is one of the `10^4` four-character states
the wheels can show, and two states are joined by an edge when they differ in a single wheel
by a single notch, with `0` and `9` adjacent. That is 8 neighbours per state. Deadends are
nodes deleted from the graph.

Every move costs one turn, so "minimum turns" is a shortest-hop count on an unweighted graph,
which means BFS from `"0000"` — no heap, no DP. Marking a state visited on *enqueue* matters
more here than in a grid: with 8 neighbours in a dense state space, marking on dequeue would
let a state be queued many times before it is first popped, and the queue would blow up.

## Approach

1. `dead = set(deadends)` for `O(1)` membership. If `"0000" in dead`, the lock is stuck before
   the first turn — return `-1`.
2. `q = collections.deque([("0000", 0)])` carrying `(state, turns)`, and
   `visited = {"0000"}`.
3. Pop `(state, turns)`. If `state == target`, return `turns` — checking at pop is fine
   because BFS pops in non-decreasing `turns` order, and it also handles `target == "0000"`
   returning `0`.
4. Generate neighbours: for each wheel `i` in `range(4)` and each `delta` in `(1, -1)`,
   compute `d = (int(state[i]) + delta) % 10` and splice
   `nxt = state[:i] + str(d) + state[i + 1:]`. The `% 10` is what wraps `9 -> 0` and
   `0 -> 9`.
5. Push `nxt` with `turns + 1` only when it is not in `visited` and not in `dead`, adding it
   to `visited` at that moment.
6. If the queue drains without hitting `target`, the target is unreachable — return `-1`.

## Code

```python
import collections

class Solution:
    def openLock(self, deadends: List[str], target: str) -> int:
        dead = set(deadends)
        if "0000" in dead:
            return -1

        q = collections.deque([("0000", 0)])
        visited = {"0000"}

        while q:
            state, turns = q.popleft()
            if state == target:
                return turns

            for i in range(4):
                for delta in (1, -1):
                    d = (int(state[i]) + delta) % 10
                    nxt = state[:i] + str(d) + state[i + 1:]
                    if nxt not in visited and nxt not in dead:
                        visited.add(nxt)
                        q.append((nxt, turns + 1))

        return -1
```

## Why it works

All edges have weight `1`, so BFS's level-by-level expansion pops states in non-decreasing
distance from `"0000"`, and the first time `target` comes off the queue its `turns` is the
minimum number of moves — no later path can be shorter. Excluding deadends at push time is
the same as deleting those nodes from the graph, so no path through them is ever considered,
and the search still explores every legal route around them. The state space is bounded at
`10^4`, each state is enqueued once and expanded into 8 neighbours each built in `O(4)`,
which caps the whole search at `O(10^4 * 4)` plus `O(d)` to hash the `d` deadends.
