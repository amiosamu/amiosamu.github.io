---
# Reverse String · Easy · Two Pointers
# https://leetcode.com/problems/reverse-string/
draft: false
pattern: "Two pointers swapping inward"
time: "O(n)"
space: "O(1)"
---

## Description

Given a character array `s`, reverse it in place so the characters appear in the opposite order, without allocating a second array.

**Example**

```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

Explanation: The first and last characters swap (`h`/`o`), the second and second-to-last swap (`e`/`l`), and the middle `l` stays put, producing the reversed array.

## Intuition

Reversing means character `i` and character `n - 1 - i` trade places. The naive move is to build a
new list and copy it back, but that is O(n) extra memory for something that is just n/2 independent
swaps. Nothing about swapping the outer pair changes what the inner pairs should do, so I can walk
one pointer in from each end and swap as they pass each other.

## Approach

1. Set `l = 0` and `r = len(s) - 1`.
2. While `l < r`: swap `s[l]` and `s[r]` with a tuple assignment.
3. Move `l` forward by one and `r` backward by one. `l` only ever increases and `r` only ever
   decreases — after a swap, that pair is finished forever, so there is no reason to revisit either
   side, and moving only one pointer would just re-swap a pair already in place.
4. Stop when `l >= r`. The loop condition is `l < r`, not `l <= r`, because when they land on the
   same index (odd length) the middle character is already where it belongs and swapping it with
   itself is wasted work.
5. Return nothing — the problem wants `s` mutated in place.

## Code

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        l, r = 0, len(s) - 1
        while l < r:
            s[l], s[r] = s[r], s[l]
            l += 1
            r -= 1
```

## Why it works

The invariant is that everything outside `[l, r]` is already final: each iteration puts exactly one
pair in its permanent position and then shrinks the window from both sides. Since the two pointers
approach each other by one step each, they meet after n/2 iterations and every index has been
covered exactly once — O(n) time, and the swap uses only the two index variables, so O(1) space.
