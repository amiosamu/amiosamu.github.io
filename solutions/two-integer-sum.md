---
pattern: "Hash map complement lookup"
time: "O(n)"
space: "O(n)"
date: "2026-08-05"
# Append today's date each time you re-solve this from a blank file.
# Failed the re-solve? Empty the list — the schedule restarts.
reviews: []
---

## Intuition

The brute force is to try every pair, but that re-asks the same question `n` times:
"have I already seen the number that completes this one?" A hash map answers that
in constant time, so one pass is enough.

The key reframe is that I don't search for *a pair* — I search for `target - x`
while walking the array, and every element I've already passed is a candidate.

## Approach

1. Keep a dict mapping value → index of everything seen so far.
2. For each `x`, compute `complement = target - x`.
3. If the complement is already in the dict, the answer is that stored index and the current one.
4. Otherwise record `x` and move on.

Checking before inserting is what makes duplicates safe — with `nums = [3, 3]`
and `target = 6`, the second `3` finds the first one instead of matching itself.

## Complexity

| | |
|---|---|
| Time | `O(n)` — one pass, `O(1)` dict operations |
| Space | `O(n)` — the dict holds up to every element |

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
