---
# Longest Substring Without Repeating Characters · Medium · Sliding Window
# https://leetcode.com/problems/longest-substring-without-repeating-characters/
draft: false
pattern: "Grow right, shrink left on duplicate"
time: "O(n)"
space: "O(n)"
---

## Description

Given a string `s`, return the length of its longest substring with no repeated characters.

**Example**

```
Input: s = "abcabcbb"
Output: 3
```

The substring `"abc"` has no repeated characters and has the maximum length, 3.

## Intuition

Maintain a window whose characters are all distinct. When the next character is already in the
window, move the left boundary past its earlier occurrence before extending the window.

Both boundaries move only forward. A set is enough to test membership and to represent exactly
the characters in the current window.

## Approach

1. Initialize the left boundary `l`, the answer `res`, and `charSet` for the current window.
2. Advance `r` through `s`. While `s[r]` is already present, remove `s[l]` and increment `l`.
3. Add `s[r]`; the window `s[l:r + 1]` is now distinct and as long as possible for this `r`.
4. Update `res` with `r - l + 1`. An empty string leaves `res` at `0`.

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

Before each answer update, `charSet` contains exactly the characters in `s[l:r + 1]`, with no
duplicates. This is initially true, and the removal loop restores it before the new character is
added. The loop stops at the smallest valid `l`, so the resulting window is the longest valid
window ending at `r`. Every optimal substring has some right endpoint, so taking the maximum over
all endpoints returns its length.

**Complexity**

- **Time:** `O(n)`, because each character enters and leaves the window at most once.
- **Space:** `O(n)` in the worst case for the set of distinct window characters.
