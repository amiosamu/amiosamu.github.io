---
# Minimum Window Substring · Hard · Sliding Window
# https://leetcode.com/problems/minimum-window-substring/
draft: false
pattern: "Expand then shrink on a need counter"
time: "O(n + m)"
space: "O(m)"
---

## Description

Given strings `s` and `t`, return the smallest substring of `s` that contains every character of `t` (including repeated characters, with at least the same multiplicity). If no such substring exists, return `""`.

**Example**

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
```

Explanation: `"BANC"` contains one `'A'`, one `'B'`, and one `'C'`, and no shorter substring of `s` covers all three characters of `t`.

## Intuition

Validity here is monotone: if `s[l..r]` covers `t`, so does any window containing it. So for each right end `r` there is exactly one smallest valid left edge, and it never moves backwards as `r` grows — expand until the window is valid, then shrink from the left as far as it stays valid, and record. The bookkeeping trick is to not compare two whole count maps every step: keep one counter `missing` of how many *slots* are still unfilled, using the sign of `need[ch]` to distinguish a genuinely needed character from a surplus copy.

## Approach

1. If `len(t) > len(s)` return `""`.
2. `need = collections.Counter(t)` holds, per character, how many more copies the window still needs; a negative value means surplus. `missing = len(t)` counts unfilled slots, counting duplicates.
3. Track the best window as `best_len = len(s) + 1` (sentinel for "none found") and `best_l = 0`, with `l = 0`.
4. For each `r, ch` in `enumerate(s)`: if `ch` is a key of `need`, decrement `missing` only when `need[ch] > 0` (this copy fills a real slot rather than adding surplus), then decrement `need[ch]`.
5. While `missing == 0` the window is valid: if `r - l + 1 < best_len` record `best_len` and `best_l`; then evict `s[l]` — if it is a key of `need`, increment `need[s[l]]` and, if that pushes it back above 0, increment `missing` (we just broke validity) — and advance `l`.
6. Return `""` if `best_len > len(s)`, else `s[best_l:best_l + best_len]`.

## Code

```python
import collections

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if len(t) > len(s):
            return ""
        need = collections.Counter(t)
        missing = len(t)
        best_len, best_l = len(s) + 1, 0
        l = 0
        for r, ch in enumerate(s):
            if ch in need:
                if need[ch] > 0:
                    missing -= 1
                need[ch] -= 1
            while missing == 0:
                if r - l + 1 < best_len:
                    best_len, best_l = r - l + 1, l
                left = s[l]
                if left in need:
                    need[left] += 1
                    if need[left] > 0:
                        missing += 1
                l += 1
        return "" if best_len > len(s) else s[best_l:best_l + best_len]
```

## Why it works

The invariant is that `need[c]` equals `count_t(c) - count_window(c)` for every character of `t`, and `missing` is the sum of the positive parts of those values — so `missing == 0` is exactly "the window contains every character of `t` with multiplicity". Guarding the counter updates on `need[ch] > 0` is what keeps surplus copies from wrongly decrementing `missing`, and it is symmetric on eviction, so validity is tracked exactly. For the optimal window `s[i..j]`, the iteration `r = j` shrinks `l` up to and including `i` (it cannot pass `i`, since dropping `s[i]` from the optimal window would break validity), so its length is recorded. Each character enters and leaves once, giving O(n + m) time, and `need` holds one entry per distinct character of `t`, O(m) space.
