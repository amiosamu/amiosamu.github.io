---
# Longest Turbulent Subarray · Medium · Greedy
# https://leetcode.com/problems/longest-turbulent-subarray/
draft: false
pattern: "Two run lengths, up and down"
time: "O(n)"
space: "O(1)"
---

## Intuition

Turbulence is a purely local property: a window is turbulent iff every adjacent comparison flips
sign from the one before it. So a turbulent run ending at index `i` is determined entirely by the
comparison `arr[i]` vs `arr[i-1]` and whether that comparison is the opposite of the previous one.
That means I only need two numbers as I scan — the length of the best turbulent run ending at `i`
whose last step went *up*, and the one whose last step went *down*. Each extends the *other* one by
1, which is what encodes the alternation.

## Approach

1. Keep `up` = length of the longest turbulent run ending at the current index with
   `arr[i] > arr[i-1]`, and `down` = same with `arr[i] < arr[i-1]`. Both start at 1, and `best`
   starts at 1 (a single element is turbulent by definition).
2. Loop `i` from 1 to `len(arr) - 1`.
3. If `arr[i] > arr[i-1]`: the previous step must have been a descent, so `up, down = down + 1, 1`.
   Write it as a tuple assignment so `down + 1` reads the *old* `down`; `down` resets to 1 because
   no run ending here goes down.
4. If `arr[i] < arr[i-1]`: mirror it — `down, up = up + 1, 1`.
5. If they are equal: turbulence is broken at this boundary, so `up = down = 1`.
6. `best = max(best, up, down)` each iteration.
7. Return `best`. A single-element array never enters the loop and returns 1, which is correct.

## Code

```python
class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        best = 1
        up = down = 1

        for i in range(1, len(arr)):
            if arr[i] > arr[i - 1]:
                up, down = down + 1, 1
            elif arr[i] < arr[i - 1]:
                down, up = up + 1, 1
            else:
                up = down = 1
            best = max(best, up, down)

        return best
```

## Why it works

There is no exchange argument here because there is nothing to choose — this is a two-state DP
collapsed into two scalars. The invariant is that after processing index `i`, `up` and `down` are the exact lengths of the
longest turbulent runs ending at `i` in each of the two possible last-step directions. It holds by
induction: a run ending at `i` with an upward last step must have had a downward step at `i-1`, and
the longest such is `down + 1` by the hypothesis, with 1 (just the pair `arr[i-1], arr[i]`) already
covered because `down` is never below 1. Equal neighbours kill both states, since no turbulent run
can straddle a flat boundary. Every turbulent subarray has a last index and a last direction, so
maximising over both states at every index in one O(n) pass with O(1) scalars finds the longest.
