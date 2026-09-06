---
# Plus One · Easy · Math & Geometry
# https://leetcode.com/problems/plus-one/
draft: false
pattern: "In-place digit carry from the right"
time: "O(n)"
space: "O(1)"
---

## Intuition

Adding one only ever cascades a carry through a trailing run of 9's - every digit before that
run is untouched, so there's no need to convert the array to a number and back. Walking from
the least significant digit and stopping the instant a digit that isn't 9 absorbs the carry
handles every case except the all-9s one, which needs one extra leading digit.

## Approach

1. Let `n = len(digits)`.
2. Iterate `i` from `n - 1` down to `0`.
3. If `digits[i] < 9`, increment it in place and return `digits` immediately - the carry stops
   here, nothing further needs to change.
4. Otherwise `digits[i]` is 9: it rolls over, so set `digits[i] = 0` and let the loop continue
   (the carry moves one position further left).
5. If the loop finishes without returning, every digit was 9 (e.g. `[9,9,9]`) and `digits` is
   now all zeros - the carry propagated past the most significant digit, so return
   `[1] + digits` to represent the extra leading digit.

## Code

```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        n = len(digits)
        for i in range(n - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits
```

## Why it works

Every add-one either lands on a digit below 9, which just increments and stops the carry, or
rolls a 9 over to 0 and keeps carrying left - exactly how carrying works in decimal addition.
The only way to exhaust the whole array is if every digit was already 9, which is precisely the
one case that needs an extra leading digit, handled by the final return. Each digit is visited
at most once, so it's `O(n)` time and `O(1)` auxiliary space outside the necessary output.
