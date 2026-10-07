---
# Minimum Window Substring · Hard · Sliding Window
# https://leetcode.com/problems/minimum-window-substring/
draft: false
pattern: "Expand then shrink on a need counter"
time: "O(n + m)"
space: "O(m)"
---

## Description

Given strings `s` and `t`, return the shortest substring of `s` containing every character of
`t` with at least the required multiplicity. Return `""` if no such substring exists.

**Example**

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
```

Explanation: `"BANC"` contains `A`, `B`, and `C`, and no shorter substring covers all three.

## Intuition

Expanding a window cannot make a valid window invalid, and shrinking cannot make an invalid one
valid. This supports a sliding window: advance the right edge until all requirements are met, then
advance the left edge while recording shorter valid windows.

`need[c]` tracks how many more copies of `c` are required; negative values represent surplus
copies. A single `missing` count avoids comparing complete frequency maps after every update.

## Approach

1. Return `""` immediately when `t` is longer than `s`. Build `need = Counter(t)` and set
   `missing = len(t)`, counting repeated requirements separately.
2. Expand with `r`. For a relevant character, reduce `missing` only if a copy was still needed,
   then decrement its `need` value.
3. While `missing == 0`, record a shorter window and remove `s[l]`. If removal makes a count
   positive, increment `missing`, then advance `l`.
4. Return the recorded slice, or `""` if the sentinel best length remains.

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

For each character in `t`, `need[c]` equals its required count minus its current window count.
Thus `missing`, the sum of all positive deficits, is zero exactly when the window covers `t`.
The update rules preserve this invariant for both additions and removals, including surplus copies.

For any right endpoint, the inner loop visits every valid left endpoint until the next removal
breaks validity. In particular, when the right endpoint of an optimal window is processed, that
window is recorded before its left edge can pass. Therefore, the shortest recorded window is
globally optimal.

**Complexity**

- **Time:** `O(len(s) + len(t))`; each character enters and leaves the window at most once.
- **Space:** `O(len(t))` auxiliary space for the requirement counter. The returned substring uses
  `O(k)` space in Python, where `k` is its length.
