---
# Longest Repeating Character Replacement · Medium · Sliding Window
# https://leetcode.com/problems/longest-repeating-character-replacement/
draft: false
pattern: "One window per candidate letter"
time: "O(26 * n)"
space: "O(1)"
---

## Description

Given an uppercase string `s` and an integer `k`, return the maximum length of a substring that
can be made uniform by replacing at most `k` characters.

**Example**

```
Input: s = "ABAB", k = 2
Output: 4
```

Replacing either pair of letters makes the full string uniform using two replacements.

## Intuition

Fix the target character `c`. A window can become all `c` exactly when it contains at most `k`
other characters. This condition supports a sliding window: extend its right edge, then move the
left edge only when too many replacements are required. Repeating for each character present in
the input covers every possible uniform result.

## Approach

1. Build `charSet` from `s`; no absent character can improve a non-empty target window.
2. For each target `c`, reset `l` and `count`, where `count` is the number of `c`s in the window.
3. Extend `r`, incrementing `count` when `s[r] == c`.
4. While `window length - count > k`, remove `s[l]` from the count when needed and advance `l`.
5. Update `res` with every valid window and return it after all targets. Empty input leaves zero.

## Code

```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        res = 0
        charSet = set(s)
        for c in charSet:
            count = l = 0
            for r in range(len(s)):
                if s[r] == c:
                    count += 1
                while (r - l + 1) - count > k:
                    if s[l] == c:
                        count -= 1
                    l += 1
                res = max(res, r - l + 1)
        return res
```

## Why it works

For a fixed target `c`, a window needs exactly its length minus its number of `c` characters in
replacements. After shrinking, `l` is the earliest left boundary that keeps this cost at most `k`,
so the algorithm records the longest valid window ending at each `r`. Any optimal substring has
some final character present in that substring; during that character's pass, its right endpoint
is considered and a window at least as long is recorded. Therefore `res` is globally optimal.

**Complexity**

- **Time:** `O(26 * n)`, which is `O(n)` for the fixed uppercase alphabet.
- **Space:** `O(1)` because the character set contains at most 26 entries.
