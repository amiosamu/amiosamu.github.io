---
# Longest Repeating Character Replacement · Medium · Sliding Window
# https://leetcode.com/problems/longest-repeating-character-replacement/
draft: false
pattern: "One window per candidate letter"
time: "O(26 * n)"
space: "O(1)"
---

## Intuition

The final string is all one character, so fix that character `c` up front and the problem collapses: the best window for `c` is the longest window containing at most `k` characters that aren't `c`. That condition is monotone — cutting the window can only reduce the number of non-`c` characters — so a single grow/shrink pass finds the best window for one `c`. There are only 26 candidates, so just run it 26 times and take the max, which avoids the trickier "max frequency in the window" bookkeeping of the single-pass version.

## Approach

1. `res = 0`, and `charSet = set(s)` — the only characters worth being the final one are those already in `s`.
2. For each candidate `c` in `charSet`, reset `count = l = 0`. `count` is the number of `c`s inside the window `s[l..r]`, and `l` restarts because the windows for different candidates are unrelated.
3. Walk `r` over `range(len(s))`; if `s[r] == c`, increment `count`.
4. The number of characters that would need replacing is `(r - l + 1) - count`. While that exceeds `k`, shrink from the left: if `s[l] == c` decrement `count`, then advance `l`.
5. After shrinking, the window is legal, so update `res = max(res, r - l + 1)`.
6. Return `res` after all candidates. Note the shrink is a `while`, not an `if`, though with one character added per step it fires at most once.

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

Any valid answer is a substring that becomes all `c` for exactly one character `c`, and that substring costs `length - count(c)` replacements; the loop for that particular `c` considers, for every right end `r`, the leftmost `l` keeping the cost within `k`, which is the longest legal window ending at `r`. So the optimal substring is examined during the pass for its own `c` and cannot be missed. Each pass moves `l` and `r` forward only, so it is O(n), and there are at most 26 passes — O(26 * n) time with O(1) extra space for the 26-element set.
