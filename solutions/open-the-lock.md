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
step up or down with wraparound, return the minimum turns needed to reach `target` without
entering a state in `deadends`. Return `-1` if the target is unreachable.

**Example**

```
Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
```

Explanation: The shortest legal sequence from `"0000"` to `"0202"` takes six turns.

## Intuition

Treat each four-digit combination as a graph node. Turning one of four wheels in either direction
creates its eight neighbors, while deadends are removed nodes. Every edge costs one turn, so BFS
finds a shortest legal route. Marking states when enqueued prevents duplicate queue entries.

## Approach

1. Convert `deadends` to a set. Return `-1` if the starting state is dead.
2. Initialize a queue with `("0000", 0)` and mark `"0000"` visited.
3. Pop a state and return its turn count if it is `target`.
4. Generate both wrapped turns for each wheel. Enqueue unseen, non-dead neighbors with one more
   turn, marking them immediately.
5. Return `-1` if the queue empties. A target of `"0000"` returns zero on the first pop.

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

BFS processes states in nondecreasing distance from `"0000"`. Every generated edge represents
one legal wheel turn, and dead states are never enqueued, so the queue contains exactly reachable
legal states. Consequently, the first pop of `target` has the fewest possible turns. If no such
pop occurs, every reachable legal state has been exhausted and the target is impossible.

**Complexity**

- **Time:** `O(10^4 * 4 + d)` for all lock states and `d` deadends; each state has eight
  constant-width neighbor constructions.
- **Space:** `O(10^4 + d)` auxiliary space for the queue, visited set, and deadend set.
