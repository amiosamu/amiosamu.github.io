---
# Valid Parenthesis String · Medium · Greedy
# https://leetcode.com/problems/valid-parenthesis-string/
draft: false
pattern: "Track range of open-count possibilities"
time: "O(n)"
space: "O(1)"
---

## Intuition

Trying every interpretation of each `*` is exponential in the number of wildcards. Instead of
tracking one exact open-paren count, track the whole range of counts reachable by some choice of
interpretation for the `*`s seen so far — `lo` and `hi`. `(` shifts the range up by one, `)`
shifts it down by one, and `*` can be either or empty, so it widens the range by one on each end.
A negative `lo` just means some `*` must be read as not-`)` to stay non-negative, which is always
possible as long as `hi` hasn't gone negative too — so `lo` gets clamped to 0 rather than failing.

## Approach

1. Initialize `lo = hi = 0` — the min and max number of unmatched `(` consistent with some
   choice of interpretation for every `*` processed so far.
2. For each character `c` in `s`:
   - if `c == '('`: `lo += 1`, `hi += 1`.
   - if `c == ')'`: `lo -= 1`, `hi -= 1`.
   - otherwise (`c == '*'`): `lo -= 1`, `hi += 1` — spanning the three interpretations
     `)`, empty, `(`.
3. If `hi < 0` at this point, return `False` immediately: even reading every `*` as `(` can't
   keep the open count non-negative up to here, so the string is unsalvageable.
4. Clamp `lo = max(lo, 0)` — a negative low end is not a real constraint violation, since `hi`
   is still `>= 0` there's always a way to reinterpret enough `*`s to land on 0 instead.
5. After the loop, return `lo == 0` — the string is valid only if zero unmatched `(` is one of
   the counts still reachable at the very end.

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

`[lo, hi]` is always exactly the set of open-paren counts reachable by some assignment of the
`*`s seen so far, and it stays a contiguous interval because `(` and `)` shift every reachable
value by the same amount while `*` fans each reachable value out to three consecutive ones —
never skipping a value in between. Clamping `lo` to 0 is sound because whenever `lo` would go
negative, `hi` is still `>= 0`, so 0 itself is reachable and can be carried forward in place of
the negative value. `hi < 0` is unrecoverable because it means even the most generous reading of
every `*` overshoots `)`. Requiring `lo == 0` at the end is exactly the definition of a fully
matched string. Single linear pass with two scalars gives O(n) time and O(1) space.
