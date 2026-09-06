---
# Valid Palindrome II · Easy · Two Pointers
# https://leetcode.com/problems/valid-palindrome-ii/
draft: false
pattern: "Two pointers with one allowed skip"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, return whether it can be made into a palindrome by deleting at most one character.

**Example**

```
Input: s = "abca"
Output: true
```

Explanation: Deleting the `b` gives "aca", or deleting the `c` gives "aba" — either way one deletion is enough to make the remaining string a palindrome.

## Intuition

Trying every deletion is O(n) candidate strings times O(n) to check each, so O(n²). The insight: as
long as the outer pair matches, deleting anything there can only hurt, so the plain palindrome walk
is forced until the *first* mismatch. At that first mismatch `s[l] != s[r]`, the one deletion I am
allowed has to be spent on `s[l]` or `s[r]` — deleting any character strictly inside the window
leaves that same bad pair on the outside. So there are only two branches to test, and each is a
plain O(n) palindrome check.

## Approach

1. Write a helper `is_pal(i, j)` that checks whether `s[i..j]` is a palindrome with the ordinary
   inward walk (`while i < j`, compare, `i += 1`, `j -= 1`).
2. In the main loop set `l = 0`, `r = len(s) - 1` and walk inward while `s[l] == s[r]`. `l` only
   moves right and `r` only moves left, because a matched outer pair is settled and can never be
   improved by deleting one of its characters.
3. On the first mismatch, return `is_pal(l + 1, r) or is_pal(l, r - 1)` — branch one deletes
   `s[l]`, branch two deletes `s[r]`.
4. Do **not** recurse or allow a second skip: the helper is the strict check, so the budget of one
   deletion is spent by construction.
5. If the loop finishes without a mismatch, the string is already a palindrome — return `True`
   (deleting zero characters is allowed).

## Code

```python
class Solution:
    def validPalindrome(self, s: str) -> bool:
        def is_pal(i: int, j: int) -> bool:
            while i < j:
                if s[i] != s[j]:
                    return False
                i += 1
                j -= 1
            return True

        l, r = 0, len(s) - 1
        while l < r:
            if s[l] != s[r]:
                return is_pal(l + 1, r) or is_pal(l, r - 1)
            l += 1
            r -= 1
        return True
```

## Why it works

Any valid solution must still match every pair the pointers passed before the mismatch, since those
characters are untouched by a deletion further inside; so the algorithm loses nothing by walking
greedily to the first mismatch. At that point the deleted character must be `s[l]` or `s[r]` — every
other choice leaves `s[l]` facing `s[r]` again — and both branches are tested. The outer walk and
the two helper calls are each at most one pass over the string, so O(n) time and O(1) space.
