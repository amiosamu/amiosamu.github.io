---
# Bitwise AND of Numbers Range · Medium · Bit Manipulation
# https://leetcode.com/problems/bitwise-and-of-numbers-range
draft: false
pattern: "Common binary prefix of left and right"
time: "O(log right)"
space: "O(1)"
---

## Intuition

Looping from `left` to `right` is hopeless when the range spans billions. The observation that
collapses it: a bit survives the AND only if it is 1 in every number in `[left, right]`. If bit
`i` ever flips inside the range, some number in the range has it as 0 and it dies. Bit `i` flips
somewhere in the range exactly when `left` and `right` disagree at or below position `i` — so the
answer is the common binary prefix of `left` and `right`, with every lower bit zeroed out.

## Approach

1. Keep a counter `shift = 0`.
2. While `left < right`: do `left >>= 1`, `right >>= 1`, `shift += 1`. Shifting both by one drops
   the bit position where they might still differ.
3. The loop exits when `left == right`, at which point that shared value *is* the common prefix.
4. Return `left << shift` to move the prefix back to its original position, which fills the low
   `shift` bits with zeros — the bits that flipped.
5. Trace `left = 5, right = 7`: `5 < 7` gives `2, 3` with `shift = 1`; `2 < 3` gives `1, 1` with
   `shift = 2`; equal, so return `1 << 2 = 4`. Check: `5 & 6 & 7 = 4`.
6. Edge cases fall out for free: `left == right` skips the loop and returns `left`; `left = 0`
   forces the loop to run until `right` is also 0, returning 0.

## Code

```python
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left < right:
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
```

## Why it works

If `left` and `right` share a prefix down to position `p`, every number between them shares it
too — a number with a different prefix would sort outside `[left, right]` — so those bits are 1
in all of them and survive the AND. Below `p`, `left` and `right` differ, which means the range
contains a multiple of `2^p`; at that number every bit under `p` is 0, so all of them are killed.
The loop shifts off at most 32 positions, giving O(log right) time and O(1) space.
