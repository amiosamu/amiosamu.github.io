---
# Dota2 Senate · Medium · Greedy
# https://leetcode.com/problems/dota2-senate/
draft: false
pattern: "Round-robin queues of indices"
time: "O(n)"
space: "O(n)"
---

## Intuition

The only decision a senator makes is *whom* to ban, and the answer is always "the opponent who is
about to act soonest". Banning anyone else leaves that soonest opponent alive to take their turn
and ban one of mine, so it can never be better. Once the target rule is fixed the whole game is
deterministic, and simulating it is just a round robin: keep the two parties as queues of turn
indices, repeatedly pop the front of each, and the smaller index acts first — it bans the other and
re-queues itself for the next round at index `+ n`.

## Approach

1. `n = len(senate)`. Build two deques of the *positions* of each party's senators:
   `radiant` from indices where `senate[i] == 'R'`, `dire` from the `'D'` indices. Both come out
   already sorted by turn order.
2. While both queues are non-empty, pop `r = radiant.popleft()` and `d = dire.popleft()`. These are
   the next senator of each party to get a turn.
3. Whichever index is smaller acts first and bans the other. If `r < d`, the Radiant senator
   survives: `radiant.append(r + n)`, and `d` is simply dropped — never re-queued.
4. Otherwise the Dire senator survives: `dire.append(d + n)`.
5. Adding `n` is what keeps the queue sorted: a senator who has acted in round `k` next acts in
   round `k+1`, and offsetting by the round length preserves relative order against everyone who
   has not acted yet this round.
6. The loop ends when one queue empties. Return `"Radiant" if radiant else "Dire"`.

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

Exchange argument on the ban target: fix a winning strategy in which some senator bans an opponent
`y` while a different opponent `x` acts strictly earlier than `y` would. Swap the ban to `x`. The
party's position is no worse — `y` still exists but acts later than `x` would have, so every ban
`y` can make is one `x` could have made at least as soon, and one fewer opposing turn happens
before ours. Iterating the swap turns any winning strategy into "always ban the earliest opponent",
so the deterministic simulation reaches the true winner. Each loop iteration permanently removes
one senator, so there are at most `n` iterations of O(1) work: O(n) time and O(n) queue space.
