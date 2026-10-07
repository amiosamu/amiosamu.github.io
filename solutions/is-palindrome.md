---
# Valid Palindrome · Easy · Two Pointers
# https://leetcode.com/problems/valid-palindrome/
draft: false
pattern: "Two pointers from both ends"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, return whether it is a palindrome after ignoring non-alphanumeric
characters and differences in letter case.

**Example**

```
Input: s = "A man, a plan, a canal: Panama"
Output: true
```

Ignoring punctuation, spaces, and case produces `"amanaplanacanalpanama"`, which reads the
same in both directions.

## Intuition

After filtering, a palindrome must have equal characters at mirrored positions. Building that
filtered string is unnecessary: two pointers can find the next alphanumeric character from each
end and compare the pair directly. Lowercasing only the compared characters handles case without
allocating another string.

## Approach

1. Initialize `l` at the beginning of `s` and `r` at the end.
2. While `l < r`, advance `l` past non-alphanumeric characters and move `r` backward past them.
3. Compare `s[l].lower()` with `s[r].lower()`; return `False` if the pair differs.
4. Move both pointers inward after a matching pair. Each pointer only moves in one direction.
5. Return `True` when the pointers meet or cross. Empty and punctuation-only strings therefore
   count as palindromes, as required.

## Code

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l += 1
            r -= 1
        return True
```

## Why it works

After each pair is consumed, all previously examined mirrored characters match. The skip loops
place `l` and `r` on the next unmatched characters of the filtered string, so a mismatch proves
that string is not a palindrome. If no mismatch occurs before the pointers cross, every mirrored
pair matches; therefore the filtered string is a palindrome.

**Complexity**

- **Time:** `O(n)`, because each pointer crosses each input position at most once.
- **Space:** `O(1)` auxiliary space.
