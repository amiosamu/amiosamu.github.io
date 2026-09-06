---
# Longest Substring Without Repeating Characters · Medium · Sliding Window
# https://leetcode.com/problems/longest-substring-without-repeating-characters/
draft: false
pattern: "Grow right, shrink left on duplicate"
time: "O(n)"
space: "O(n)"
---

## Intuition

Checking every substring for distinctness is O(n²) or worse. The insight: if `s[l..r]` already contains a duplicate, then no window starting at `l` and ending past `r` can be valid either — so the left edge never needs to move backwards. That makes the answer a single window that only ever grows on the right and shrinks on the left, and the set of characters currently inside it is all the state I need.

## Approach

1. Keep `charSet` (the characters in the current window), a left pointer `l = 0`, and `res = 0`.
2. Walk `r` over `range(len(s))`, treating `s[r]` as the character being added.
3. Before adding, while `s[r]` is already in `charSet`, remove `s[l]` from the set and advance `l`. This drops characters from the front until the earlier copy of `s[r]` itself is gone.
4. Add `s[r]` to `charSet`.
5. Update `res = max(res, r - l + 1)` — the invariant at this point is that `s[l..r]` has no repeats, so its length is a candidate answer.
6. Return `res`. Empty string returns 0 because the loop never runs.

## Code

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        charSet = set()
        l = 0
        res = 0
        for r in range(len(s)):
            while s[r] in charSet:
                charSet.remove(s[l])
                l += 1
            charSet.add(s[r])
            res = max(res, r - l + 1)
        return res
```

## Why it works

The while loop guarantees the invariant "`charSet` is exactly the distinct characters of `s[l..r]`, with no duplicates" holds every time `res` is updated, so every value compared into `res` is a real answer. And for each `r`, `l` is pushed to the smallest index that keeps the window valid, so the longest window ending at `r` is always measured — taking the max over all `r` covers every substring worth considering. Each pointer only moves forward across the whole run, giving O(n) time; the set never holds more than the alphabet size, bounded by O(n).
