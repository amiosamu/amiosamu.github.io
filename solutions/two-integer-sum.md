---
# Two Sum · Easy · Arrays & Hashing
# https://leetcode.com/problems/two-sum/
draft: false
pattern: "Hash map complement lookup"
time: "O(n)"
space: "O(n)"
---

## Intuition

The brute force is to try every pair, but that re-asks the same question `n` times:
"have I already seen the number that completes this one?" A hash map answers that
in constant time, so one pass is enough.

The key reframe is that I don't search for *a pair* — I search for `target - x`
while walking the array, and every element I've already passed is a candidate.

## Approach

1. Keep a dict `seen` mapping value → index of everything passed so far.
2. For each `i, x` from `enumerate(nums)`, compute `complement = target - x`.
3. If the complement is already in `seen`, the answer is `[seen[complement], i]`.
4. Otherwise record `seen[x] = i` and move on.
5. Checking before inserting is what makes duplicates safe — with `nums = [3, 3]`
   and `target = 6`, the second `3` finds the first one instead of matching itself.
6. Return `[]` after the loop; the problem guarantees a solution, so this line never fires.

## Code

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen: dict[int, int] = {}

        for i, x in enumerate(nums):
            complement = target - x
            if complement in seen:
                return [seen[complement], i]
            seen[x] = i

        return []
```

## Why it works

Every valid pair has a later index `j`; when the loop reaches `j`, its partner is already
in `seen` by the invariant that `seen` holds all indices `< j`, so no pair can be missed
and the first one found is reported. Insert-after-check guarantees the two indices are
distinct, which is the only correctness trap here. One pass with `O(1)` dict operations
is `O(n)` time, and `seen` can grow to every element, so `O(n)` space.
