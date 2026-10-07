---
# Matchsticks to Square · Medium · Backtracking
# https://leetcode.com/problems/matchsticks-to-square/
draft: false
pattern: "Backtracking sticks into 4 sorted buckets"
time: "O(4^n)"
space: "O(n)"
---

## Description

Given stick lengths in `matchsticks`, determine whether every stick can be used exactly once,
without cutting, to form a square.

**Example**

```
Input: matchsticks = [1,1,2,2,2]
Output: true
```

The total is 8, so each side must total 2. The groups are `{2}`, `{2}`, `{2}`, and `{1,1}`.

## Intuition

The task is to partition the sticks into four groups with equal sums. Backtracking assigns each
stick to a side while rejecting any assignment that exceeds the target side length.

Sorting descending tries the most restrictive sticks first. Empty sides are symmetric, so after
one failed attempt on an empty side, trying another empty side would repeat the same search.

## Approach

1. Reject totals not divisible by four; otherwise set `side = total // 4`.
2. Sort `matchsticks` descending in place and reject a longest stick greater than `side`.
3. In `backtrack(i)`, try adding stick `i` to each side that would not exceed `side`.
4. Recurse after each tentative addition and undo it on failure. Stop after a failed empty side.
5. Return `True` after all sticks are placed; their fixed total forces every side to equal `side`.

## Code

```python
class Solution:
    def makesquare(self, matchsticks: List[int]) -> bool:
        total = sum(matchsticks)
        if total % 4 != 0:
            return False
        side = total // 4

        matchsticks.sort(reverse=True)
        if matchsticks[0] > side:
            return False

        sides = [0] * 4

        def backtrack(i: int) -> bool:
            if i == len(matchsticks):
                return True
            for j in range(4):
                if sides[j] + matchsticks[i] <= side:
                    sides[j] += matchsticks[i]
                    if backtrack(i + 1):
                        return True
                    sides[j] -= matchsticks[i]
                if sides[j] == 0:
                    break
            return False

        return backtrack(0)
```

## Why it works

At recursion depth `i`, the first `i` sticks have each been assigned to exactly one side, and no
side exceeds `side`. Every feasible assignment for stick `i` is explored. If an attempted side was
empty, assigning the stick to any other empty side differs only by renaming sides, so the symmetry
prune cannot remove a distinct solution. By induction, the search reaches every feasible partition.
When all sticks are placed, the four bounded side sums total `4 * side`, so all are equal.

**Complexity**

- **Time:** `O(4^n)` in the worst case, plus `O(n log n)` sorting.
- **Space:** `O(n)` for recursion and Python's sort workspace; `matchsticks` is reordered in place.
