---
# Boats to Save People · Medium · Two Pointers
# https://leetcode.com/problems/boats-to-save-people/
draft: false
pattern: "Sort, pair lightest with heaviest"
time: "O(n log n)"
space: "O(n)"
---

## Intuition

Each boat carries at most two people, so the question is only how many pairs I can form. The heaviest remaining person has to board *some* boat now, and the only choice is who rides with them — and the cheapest passenger to spend on that seat is the lightest remaining person, because if even they don't fit, nobody does, and if someone heavier would have fit, the lightest would have too. So sorting and walking a pointer in from each end settles every boat in one comparison, and no counting of subsets is needed.

## Approach

1. Sort `people` ascending.
2. Set `l, r = 0, len(people) - 1` and `boats = 0`.
3. Loop while `l <= r` — the `<=` matters, since the last boat may carry a single person sitting at `l == r`.
4. Each iteration launches exactly one boat, so `boats += 1` and `r -= 1` unconditionally: the heaviest remaining person always boards.
5. If `people[l] + people[r] <= limit`, the lightest person rides along too, so also `l += 1`.
6. Return `boats`. No guard is needed for someone heavier than `limit` — the problem guarantees every weight is at most `limit`, so a solo boat always works.

## Code

```python
class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        people.sort()
        l, r = 0, len(people) - 1
        boats = 0
        while l <= r:
            if people[l] + people[r] <= limit:
                l += 1
            r -= 1
            boats += 1
        return boats
```

## Why it works

The greedy choice is safe by an exchange argument: take any optimal assignment. If the heaviest person `r` rides alone there but the lightest `l` fits with them, moving `l` into that boat frees `l`'s old boat, so the solution stays optimal. If `l` doesn't fit with `r`, then no one fits with `r` and `r` must ride alone in every solution. Either way, the greedy step matches some optimum, and by induction the whole run does. The sort is O(n log n) and dominates the single O(n) sweep; the extra space is the sort's scratch, O(n).
