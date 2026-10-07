---
# Dota2 Senate · Medium · Greedy
# https://leetcode.com/problems/dota2-senate/
draft: false
pattern: "Round-robin queues of indices"
time: "O(n)"
space: "O(n)"
---

## Description

Given senators from the Radiant (`R`) and Dire (`D`) parties in turn order, determine which
party wins after senators repeatedly ban opponents from future turns.

**Example**

```
Input: senate = "RD"
Output: "Radiant"
```

The Radiant senator acts first and bans the only Dire senator.

## Intuition

It is always optimal to ban the opponent whose turn comes next; allowing that opponent to
act cannot improve the current party's position. Keep each party's active turn indices in
a queue. The smaller front index acts first, bans the other front senator, and gets a new
turn after one full cycle by adding `n` to its index.

## Approach

1. Put the original indices of `R` and `D` senators into separate ordered deques.
2. While both parties remain, remove the next index from each queue.
3. The smaller index acts first and survives; append that index plus `n` to its party's
   queue. Omitting the other index permanently removes the banned senator.
4. When one queue becomes empty, return the name of the remaining party.

## Code

```python
import collections

class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        n = len(senate)
        radiant = collections.deque(i for i, c in enumerate(senate) if c == 'R')
        dire = collections.deque(i for i, c in enumerate(senate) if c == 'D')

        while radiant and dire:
            r, d = radiant.popleft(), dire.popleft()
            if r < d:
                radiant.append(r + n)
            else:
                dire.append(d + n)

        return "Radiant" if radiant else "Dire"
```

## Why it works

Suppose a senator bans a later opponent while an earlier opponent remains. Exchanging that
ban to the earlier opponent removes an opposing action sooner and leaves only the later
threat, so the acting party cannot be worse off. Repeating the exchange yields the strategy
of always banning the next opponent. The queue fronts are exactly the next opposing turns,
and adding `n` preserves later round order. Thus the simulation is optimal until one party
has no active senator.

**Complexity**

- **Time:** `O(n)` because each iteration permanently removes one senator.
- **Space:** `O(n)` for the two queues.
