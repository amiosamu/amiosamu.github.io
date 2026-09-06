---
# Daily Temperatures · Medium · Stack
# https://leetcode.com/problems/daily-temperatures/
draft: false
pattern: "Monotonic decreasing stack of indices"
time: "O(n)"
space: "O(n)"
---

## Description

Given a list `temperatures` of daily temperatures, return an array where each element is the number of days you would have to wait after that day to reach a strictly warmer temperature, or 0 if there is no future day that is warmer.

**Example**

```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

Explanation: day 0 (73) waits 1 day for 74; day 2 (75) has to wait until index 6 (76), which is 4 days later; the last two days never see a warmer temperature, so they get 0.

## Intuition

Brute force asks, for each day, "scan right until something warmer" — O(n²), and it re-scans the same cold stretch over and over. The insight is that a day is only *waiting* as long as every day since has been colder, so the set of unresolved days at any moment has strictly decreasing temperatures. Keep that set on a stack: when today is warmer than the top, today is by definition the first warmer day for it, because every day in between was colder still. Each day gets answered exactly once, when it is popped.

## Approach

1. Allocate `res = [0] * len(temperatures)`. Zero is already the correct answer for a day that never warms up, so I never write it explicitly.
2. Keep `stack` holding **indices** of days still waiting for a warmer day. The temperatures at those indices are strictly decreasing from bottom to top.
3. Iterate `for i, t in enumerate(temperatures)`.
4. While `stack` is non-empty and `temperatures[stack[-1]] < t`: pop `j`. **Popping day `j` means today is the first day warmer than day `j`** — every day between `j` and `i` was on the stack under `i` at some point and was colder, so none of them qualified. Record `res[j] = i - j`.
5. Use strict `<` so equal temperatures do not resolve anything: the problem wants a strictly warmer day, so an equal day must stay on the stack.
6. After the while loop, push `i`. It is now the smallest unresolved temperature, so the decreasing invariant holds.
7. Anything left on the stack at the end never found a warmer day and keeps its `0`. Return `res`.

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

The invariant is that the stack holds exactly the days not yet answered, and their temperatures decrease from bottom to top — which is forced, since a day is only unanswered while nothing warmer has appeared after it. So when day `i` beats the top, it beats it for the first time, and popping in order also correctly answers everything below that `i` beats. Indices rather than values are stored because the answer is a distance, and `i - j` needs the position. Every index is pushed once and popped at most once, so the total work is O(n) despite the nested loop, with an O(n) stack.
