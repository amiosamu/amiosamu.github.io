---
# Maximum Frequency Stack · Hard · Stack
# https://leetcode.com/problems/maximum-frequency-stack/
draft: false
pattern: "Stack per frequency level"
time: "O(1)"
space: "O(n)"
---

## Intuition

A heap keyed by (frequency, push order) works but costs a log factor. The sharper observation: when a value is pushed for the `c`-th time, record it on a stack dedicated to frequency level `c`. Popping is then "take the top of the highest non-empty level", and the tie-break comes for free — the level's stack is in push order, so the most recent value at that frequency is on top. Because a pop reduces a value's count by exactly one, the maximum frequency only ever drops by one at a time, so `maxCnt` can be maintained with a decrement rather than recomputed.

## Approach

1. State: `cnt`, the current frequency of each value; `groups`, a map from a frequency level to the stack of values that have reached it; and `maxCnt`, the highest level currently occupied.
2. `push(val)`: bump `c = cnt[val] + 1` and store it back into `cnt`.
3. Update `maxCnt = max(maxCnt, c)`, then append `val` to `groups[c]` (creating the list on first use with `setdefault`).
4. Note that `val` stays recorded on every level `1..c` at once — its copy on level `c - 1` is what makes it eligible again after one pop.
5. `pop()`: take `val = groups[maxCnt].pop()`, the most recently pushed value at the top frequency.
6. Decrement `cnt[val]` so the value's own bookkeeping matches its remaining copies.
7. If `groups[maxCnt]` is now empty, do `maxCnt -= 1`. It never needs to fall further, since one pop removes one occurrence.
8. Return `val`.

## Code

```python
class FreqStack:
    def __init__(self):
        self.cnt = {}
        self.groups = {}
        self.maxCnt = 0

    def push(self, val: int) -> None:
        c = self.cnt.get(val, 0) + 1
        self.cnt[val] = c
        self.maxCnt = max(self.maxCnt, c)
        self.groups.setdefault(c, []).append(val)

    def pop(self) -> int:
        val = self.groups[self.maxCnt].pop()
        self.cnt[val] -= 1
        if not self.groups[self.maxCnt]:
            self.maxCnt -= 1
        return val
```

## Why it works

The invariant is that `groups[c]` holds, in push order, exactly the values whose current count is at least `c`, one entry each. So the top of `groups[maxCnt]` is a most-frequent element, and among equally frequent ones it is the one pushed last — precisely the required tie-break. Popping it removes only its level-`maxCnt` entry, leaving its entries on lower levels intact, which correctly demotes it by one rather than deleting it. Every operation is a constant number of dictionary and list operations, so both are O(1) amortised, and the total storage is one entry per push, O(n).
