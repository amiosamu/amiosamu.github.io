---
# Hand of Straights · Medium · Greedy
# https://leetcode.com/problems/hand-of-straights/
draft: false
pattern: "Smallest card forces its group"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given an array `hand` of card values and an integer `groupSize`, determines whether the cards
can be rearranged so that every card belongs to some group of `groupSize` consecutive
integers.

**Example**

```
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
```

Explanation: the cards split into three groups of consecutive integers: `[1,2,3]`, `[2,3,4]`,
and `[6,7,8]`.

## Intuition

There is no real choice in this problem, which is what makes the greedy airtight. The smallest card
still in hand cannot be the second or later member of any straight — that would require a smaller
card, and none exists. So it must be the *start* of a group, and its group is then completely
determined: `card, card+1, ..., card+groupSize-1`. Repeat on whatever is left. The only work is
doing it in bulk: if the smallest card has multiplicity `need`, all `need` copies start groups
simultaneously, so I subtract `need` from each of the `groupSize` consecutive counts at once.

## Approach

1. Fail fast: if `len(hand) % groupSize != 0` the cards cannot be partitioned at all, return `False`.
2. Build `count = collections.Counter(hand)`.
3. Iterate over `sorted(count)` — the distinct values in increasing order. `sorted` snapshots the
   keys into a list, so mutating `count` inside the loop is safe.
4. For each `card`, read `need = count[card]`. If `need == 0` this value was fully consumed by an
   earlier group, so skip it.
5. Otherwise open `need` groups starting here. For `x` in `range(card, card + groupSize)`:
   if `count[x] < need`, there are not enough copies of `x` to finish those groups — return `False`.
   Else `count[x] -= need`.
6. `Counter` returns 0 for a missing key without inserting it, so a gap in the run (say `card+2`
   absent) is caught by the same `count[x] < need` check.
7. Survive the loop and return `True`.

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

The exchange argument degenerates to a forcing argument: in *any* valid partition, the smallest
remaining card `m` lies in some group, and since every group is `groupSize` consecutive values with
`m` having nothing below it left, that group must be exactly `[m, m+groupSize)`. So the greedy is
not one choice among several — it is the only choice, and by induction on the remaining multiset
the whole partition is unique whenever it exists. Failing when some `count[x] < need` is therefore
a genuine proof of impossibility, not a heuristic. Sorting the distinct values costs O(n log n); the
inner loop removes `need * groupSize` cards per iteration and so does O(n) total work across the
run, and the `Counter` is the O(n) space.
