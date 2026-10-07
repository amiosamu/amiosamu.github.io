---
# Candy · Hard · Greedy
# https://leetcode.com/problems/candy/
draft: false
pattern: "Two-pass greedy from both directions"
time: "O(n)"
space: "O(n)"
---

## Description

Given an array `ratings` where `ratings[i]` is the rating of the `i`-th child standing in a line,
distribute candies to the children so that each gets at least one and any child with a strictly
higher rating than an adjacent child receives strictly more candy than that neighbor. Return the
minimum total number of candies needed.

**Example**

```
Input: ratings = [1,0,2]
Output: 5
```

Explanation: One valid distribution is `candies = [2,1,2]`: the middle child has the lowest rating
and gets the floor of 1, while both neighbors rate higher and must exceed it, giving a total of
`2 + 1 + 2 = 5`.

## Intuition

Each child has one requirement from the left neighbor and one from the right. A left-to-right
pass computes the minimum candies needed for increasing runs from the left. A right-to-left pass
adds the symmetric requirement. Taking the larger requirement at every index satisfies both
directions without discarding work from the first pass.

## Approach

1. Initialize every entry of `candies` to one, satisfying the minimum allocation.
2. Scan left to right. When `ratings[i] > ratings[i - 1]`, set
   `candies[i] = candies[i - 1] + 1`.
3. Scan right to left. When `ratings[i] > ratings[i + 1]`, require at least one more candy
   than the right neighbor, using `max` to preserve the left-pass requirement.
4. Return the total. Equal ratings impose no ordering constraint.

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

The first pass gives each child the minimum amount required by the increasing run ending there
from the left. The second computes the corresponding lower bound from the right and keeps the
maximum. Any valid allocation must meet both lower bounds at each index, while the resulting
array meets every adjacent constraint. Therefore no valid allocation can use fewer candies at
any index, and its total is minimal.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(n)` for the candy counts.
