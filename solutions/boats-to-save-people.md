---
# Boats to Save People · Medium · Two Pointers
# https://leetcode.com/problems/boats-to-save-people/
draft: false
pattern: "Sort, pair lightest with heaviest"
time: "O(n log n)"
space: "O(n)"
---

## Description

Given people's weights and a boat weight `limit`, return the minimum boats needed. Each boat
carries at most two people, and their combined weight cannot exceed `limit`.

**Example**

```
Input: people = [3,2,2,1], limit = 3
Output: 3
```

Pairing weights 1 and 2 uses one boat. The remaining weights 2 and 3 each require a boat.

## Intuition

After sorting, consider the heaviest remaining person. If the lightest person cannot share that
boat, nobody can, so the heaviest must ride alone. If they can share, pairing those two is safe:
using a heavier partner would leave a no-easier set of people to place.

## Approach

1. Sort `people` in place, then point `l` at the lightest and `r` at the heaviest person.
2. While `l <= r`, allocate one boat to `people[r]`.
3. If two distinct people remain and `people[l] + people[r] <= limit`, also board the lightest
   person and advance `l`.
4. Decrement `r`, increment the boat count, and return the count after all people board.

The sort mutates `people`. The problem guarantees every individual weight fits in one boat.

## Code

```python
class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        people.sort()
        l, r = 0, len(people) - 1
        boats = 0
        while l <= r:
            if l < r and people[l] + people[r] <= limit:
                l += 1
            r -= 1
            boats += 1
        return boats
```

## Why it works

If the lightest person does not fit with the heaviest, no remaining person fits, so every valid
solution sends the heaviest alone. Otherwise, take an optimal solution. If the heaviest is paired
with `x` and the lightest with `y`, swap partners: the greedy pair fits, and `x + y` fits because
`y` is no heavier than the heaviest person. The same swap works if either person was alone, without
adding a boat. Thus some optimum contains each greedy choice, and induction proves all choices
optimal.

**Complexity**

- **Time:** `O(n log n)` for sorting, followed by an `O(n)` scan.
- **Space:** `O(n)` auxiliary space in the worst case for Python's in-place sort.
