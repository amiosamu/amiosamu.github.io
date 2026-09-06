---
# Matchsticks to Square · Medium · Backtracking
# https://leetcode.com/problems/matchsticks-to-square/
draft: false
pattern: "Backtracking sticks into 4 sorted buckets"
time: "O(4^n)"
space: "O(n)"
---

## Description

Given an array `matchsticks` of stick lengths, determine whether all of the sticks can be used exactly once, without cutting any, to form a square.

**Example**

```
Input: matchsticks = [1,1,2,2,2]
Output: true
```

Explanation: The sticks sum to 8, so each side of the square must total 2; grouping them as {2}, {2}, {2}, {1,1} gives four sides of length 2.

## Intuition

A square needs 4 equal sides, so all that matters is splitting the sticks into 4 groups that each sum to `total / 4` — order within a side is irrelevant. Placing the longest sticks first fails fast, since a long stick has fewer buckets it can still fit into. The other thing that matters: if a stick doesn't fit in one empty bucket, it won't fit in any other empty bucket either, so trying more than one empty bucket per stick is pure wasted work.

## Approach

1. Compute `total = sum(matchsticks)`. If `total % 4 != 0`, no square is possible — return `False`.
2. Set `side = total // 4`. Sort `matchsticks` descending; if the longest stick exceeds `side`, return `False` immediately since it can never fit on a side.
3. Keep a length-4 list `sides`, all zeros — the running sum currently assigned to each side of the square.
4. `backtrack(i)`: if `i == len(matchsticks)`, every stick is placed, and since the total is exactly `4 * side`, all four `sides` must equal `side` — return `True`.
5. Otherwise try each side index `j` in `0..3`: if `sides[j] + matchsticks[i] <= side`, tentatively add the stick to that side and recurse on `i + 1`.
6. If the recursive call returns `True`, propagate `True` immediately. Otherwise undo the addition before trying the next `j`.
7. Prune symmetric branches: after handling side `j`, if `sides[j] == 0`, stop trying further sides for this stick — an empty side that can't take it means no other empty side can either.
8. If no side accepts stick `i`, return `False`.
9. Return `backtrack(0)`.

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

Every stick must land on exactly one side, and the recursion tries every side that can still hold the current stick without exceeding `side`, so it explores every distinct way to fill the four sides — if any assignment closes all four to `side`, the search finds it before running out of sticks. The empty-bucket prune doesn't lose solutions: any two empty sides are interchangeable, so skipping the second, third, and fourth empty side for a given stick only removes duplicate branches, never a genuine option. Sorting largest-first plus that cut keeps the branching factor close to 4 per stick in practice, matching the stated O(4^n) worst case with O(n) auxiliary space for the recursion stack and the fixed-size `sides` array.
