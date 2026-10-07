---
# Hand of Straights · Medium · Greedy
# https://leetcode.com/problems/hand-of-straights/
draft: false
pattern: "Smallest card forces its group"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given card values in `hand` and an integer `groupSize`, return whether all cards can be
partitioned into groups of `groupSize` consecutive values.

**Example**

```
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
```

Explanation: The cards form `[1,2,3]`, `[2,3,4]`, and `[6,7,8]`.

## Intuition

The smallest remaining card cannot appear after the start of a group, because that would
require a smaller remaining card. It must start a group containing the next
`groupSize - 1` values.

If the smallest value appears `need` times, all `need` copies must start groups. Their
required consecutive cards can be removed in one batch from a frequency map.

## Approach

1. Reject a hand whose length is not divisible by `groupSize`.
2. Count each value, then sort the distinct keys. Sorting creates a separate key list, so
   changing counts during iteration is safe and does not mutate `hand`.
3. For each value `card`, let `need = count[card]`. Skip it when earlier groups consumed
   every copy.
4. Otherwise subtract `need` from every value in
   `[card, card + groupSize - 1]`. Return `False` if any count is too small.
5. Return `True` after every forced group has been completed. Missing `Counter` keys read
   as zero, so gaps are rejected by the same check.

## Code

```python
import collections

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False

        count = collections.Counter(hand)

        for card in sorted(count):
            need = count[card]
            if need == 0:
                continue
            for x in range(card, card + groupSize):
                if count[x] < need:
                    return False
                count[x] -= need

        return True
```

## Why it works

Let `m` be the smallest remaining value. In any valid partition, a group containing `m`
cannot start below `m`, so it must be exactly `m, m + 1, ..., m + groupSize - 1`.
Therefore every copy of `m` forces one such group. Removing these groups is necessary, not
merely locally optimal. If a required count is unavailable, no valid partition exists;
otherwise induction on the smaller remaining multiset proves that processing all starts
produces a valid partition exactly when one exists.

**Complexity**

- **Time:** `O(n log n)` for counting, sorting distinct values, and consuming all cards.
- **Space:** `O(n)` for the frequency map and sorted key list.
