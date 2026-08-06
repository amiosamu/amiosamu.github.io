---
pattern: "Set membership"
time: "O(n)"
space: "O(n)"
date: "2026-08-05"
# Append today's date each time you re-solve this from a blank file.
# Failed the re-solve? Empty the list — the schedule restarts.
reviews: []
---

## Intuition

A duplicate exists exactly when the array has fewer distinct values than elements.
That is a one-liner with a set, but the streaming version is worth writing out
because it can exit early — the moment a repeat shows up, there's nothing left to learn.

## Approach

Walk the array keeping a set of what's been seen. If the current value is already
in the set, return `True` immediately. If the loop finishes, everything was distinct.

Sorting first would also work and drops the extra space to `O(1)` (ignoring the sort's
own stack), but it costs `O(n log n)` time. The set trade is usually the one worth making.

## Complexity

| | |
|---|---|
| Time | `O(n)`, and often much less — it returns on the first repeat |
| Space | `O(n)` for the set |

## Code

```python
class Solution:
    def hasDuplicate(self, nums: list[int]) -> bool:
        seen = set()

        for x in nums:
            if x in seen:
                return True
            seen.add(x)

        return False
```
