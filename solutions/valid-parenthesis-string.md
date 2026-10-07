---
# Valid Parenthesis String · Medium · Greedy
# https://leetcode.com/problems/valid-parenthesis-string/
draft: false
pattern: "Track range of open-count possibilities"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s` containing only `'('`, `')'`, and `'*'`, where each `'*'` may be treated as
`'('`, as `')'`, or as an empty string, determine whether there is some way to interpret every
`'*'` that makes `s` a valid (fully matched) parenthesis string.

**Example**

```
Input: s = "(*)"
Output: true
```

Interpreting `'*'` as empty leaves the valid string `"()"`.

## Intuition

Track the minimum and maximum possible numbers of unmatched opening parentheses after each prefix.
An opening parenthesis increases both bounds, a closing one decreases both, and `'*'` widens the
range. Negative counts are invalid prefixes, so clamp the lower bound to zero and fail if even the
upper bound becomes negative.

## Approach

1. Initialize `lo = hi = 0` as the range of reachable unmatched-open counts.
2. Update both bounds by `+1` for `'('`, by `-1` for `')'`, and update them by `-1` and `+1`
   respectively for `'*'`.
3. Return `False` if `hi < 0`; every interpretation has closed more parentheses than it opened.
4. Clamp `lo` to zero because negative open counts are unusable but zero remains reachable.
5. After all characters, return whether `lo == 0`.

## Code

```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        lo = hi = 0

        for c in s:
            if c == '(':
                lo += 1
                hi += 1
            elif c == ')':
                lo -= 1
                hi -= 1
            else:
                lo -= 1
                hi += 1

            if hi < 0:
                return False
            lo = max(lo, 0)

        return lo == 0
```

## Why it works

After each prefix, the invariant is that every feasible unmatched-open count lies in `[lo, hi]`
and every integer in that interval is reachable. Each character shifts or widens this contiguous
set exactly as the updates specify. Clamping removes only invalid negative prefix counts. If `hi`
is negative, no interpretation can repair the prefix; otherwise the invariant continues. At the
end, a valid interpretation exists exactly when zero is reachable, which is equivalent to `lo == 0`.

**Complexity**

- **Time:** `O(n)` for one pass through the string.
- **Space:** `O(1)` auxiliary space.
