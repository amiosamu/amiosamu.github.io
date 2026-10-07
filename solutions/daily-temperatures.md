---
# Daily Temperatures · Medium · Stack
# https://leetcode.com/problems/daily-temperatures/
draft: false
pattern: "Monotonic decreasing stack of indices"
time: "O(n)"
space: "O(n)"
---

## Description

Given daily `temperatures`, return how many days each day must wait for a strictly warmer
temperature. Return `0` for a day with no warmer future day.

**Example**

```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

Day 0 waits one day for 74, while day 2 waits four days for 76. The final two days have
no warmer future temperature.

## Intuition

A left-to-right scan only needs to retain days that have not yet found a warmer
temperature. Store their indices on a monotonic stack. When the current temperature is
warmer than the stack's top, the current day is the first valid answer for that index.

Equal temperatures remain unresolved, so the temperatures at the stored indices are
non-increasing, not strictly decreasing. The stack stores indices because each answer is
an index difference rather than a temperature.

## Approach

1. Initialize `res` with zeros and keep `stack` as indices of unresolved days.
2. For each index `i` and temperature `t`, pop while `t` is strictly warmer than the
   temperature at the top index.
3. For each popped index `j`, set `res[j] = i - j`; no earlier day after `j` was warmer.
4. Push `i`. Equal values stay unresolved, and indices left after the scan keep their
   initial zero. An empty input naturally returns an empty result.

## Code

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                res[j] = i - j
            stack.append(i)
        return res
```

## Why it works

Before processing index `i`, the stack contains unresolved earlier indices in increasing
index order, with non-increasing temperatures. If `temperatures[i]` exceeds the top value,
all intervening days have failed to resolve that top index, so `i` is its first warmer day.
Popping preserves the invariant until the current index can be pushed. Any index remaining
after the scan has no warmer value to its right and correctly keeps answer zero.

**Complexity**

- **Time:** `O(n)` because every index is pushed once and popped at most once.
- **Space:** `O(n)` auxiliary space for the stack.
- **Output:** `O(n)` for the result list.
