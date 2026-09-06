---
# Candy · Hard · Greedy
# https://leetcode.com/problems/candy/
draft: false
pattern: "Two-pass greedy from both directions"
time: "O(n)"
space: "O(n)"
---

## Intuition

The only constraint linking two children is local: whichever of a pair has the higher rating
must get strictly more candy than its neighbor. That constraint decomposes into two independent
one-directional rules — "more than the left neighbor if I rate higher" and "more than the right
neighbor if I rate higher" — and each can be enforced with a single linear scan that only looks
one way. Doing both scans and keeping the larger requirement at each child satisfies both rules
at once without ever re-checking a global condition.

## Approach

1. `n = len(ratings)`. Start `candies = [1] * n` — every child gets at least one candy.
2. Left-to-right pass, `i` from 1 to `n - 1`: if `ratings[i] > ratings[i - 1]`, set
   `candies[i] = candies[i - 1] + 1`. This alone guarantees every ascending edge (reading
   left to right) is satisfied.
3. Right-to-left pass, `i` from `n - 2` down to `0`: if `ratings[i] > ratings[i + 1]`, set
   `candies[i] = max(candies[i], candies[i + 1] + 1)`. Use `max` rather than overwrite, since
   the left pass may have already forced `candies[i]` higher than `candies[i + 1] + 1` requires;
   taking the larger value keeps both directional constraints on child `i` satisfied.
4. Return `sum(candies)`.

## Code

```python
class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        candies = [1] * n

        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1

        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)

        return sum(candies)
```

## Why it works

Each child's final count only needs to satisfy two comparisons, one against each neighbor. The
left pass guarantees `candies[i] > candies[i - 1]` whenever `ratings[i] > ratings[i - 1]`; the
right pass guarantees `candies[i] > candies[i + 1]` whenever `ratings[i] > ratings[i + 1]`;
taking the max at each index preserves whichever pass already set the larger value without
undoing the other's guarantee. It's minimal because every child starts at the floor of 1 and
gains a candy only when a strictly greater neighbor forces it, so nothing is over-allocated.
Two linear passes and a linear-size array give O(n) time and O(n) space.
