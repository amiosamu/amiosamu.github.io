---
# Valid Palindrome II · Easy · Two Pointers
# https://leetcode.com/problems/valid-palindrome-ii/
draft: false
pattern: "Two pointers with one allowed skip"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, return whether deleting at most one character can make it a palindrome.

**Example**

```
Input: s = "abca"
Output: true
```

Deleting either `b` or `c` leaves a palindrome.

## Intuition

Matching outer characters can remain in any valid answer, so move inward until the first mismatch.
At that point, deleting any interior character would leave the mismatched pair unchanged. The only
possible repairs are deleting the left character or the right character, followed by a strict
palindrome check.

## Approach

1. Define `is_pal(i, j)` to check `s[i:j + 1]` without allowing deletions.
2. Move outer pointers inward while their characters match.
3. At the first mismatch, test both legal deletions with `is_pal(l + 1, r)` and
   `is_pal(l, r - 1)`.
4. Return `True` if no mismatch occurs because deleting zero characters is allowed.

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

Before the first mismatch, all discarded outer pairs match and need no deletion. At the mismatch,
any resulting palindrome must remove `s[l]` or `s[r]`; removing another character leaves those two
unequal characters paired. The algorithm tests both exhaustive possibilities with an exact
palindrome check, so it accepts if and only if at most one deletion can succeed.

**Complexity**

- **Time:** `O(n)` because the main scan and each of two checks are linear.
- **Space:** `O(1)` auxiliary space.
