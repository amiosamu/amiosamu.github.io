---
# Valid Palindrome · Easy · Two Pointers
# https://leetcode.com/problems/valid-palindrome/
draft: false
pattern: "Two pointers from both ends"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, return whether it is a palindrome after converting all uppercase letters to lowercase and removing every character that is not a letter or digit.

**Example**

```
Input: s = "A man, a plan, a canal: Panama"
Output: true
```

Explanation: Stripping punctuation and spaces and lowercasing gives "amanaplanacanalpanama", which reads the same forwards and backwards.

## Intuition

The easy version is to filter the string down to lowercase alphanumerics, then compare it to its
reverse — correct, but it allocates a second copy of the input. The check itself is only ever
"first surviving character equals last surviving character", so I can do the filtering lazily: walk
a pointer in from each end and have each one skip over junk until it lands on something alphanumeric.
Case folding is just `.lower()` at comparison time.

## Approach

1. `l = 0`, `r = len(s) - 1`.
2. While `l < r`:
   - advance `l` while `l < r` and `s[l]` is not alphanumeric (`str.isalnum`);
   - retreat `r` while `l < r` and `s[r]` is not alphanumeric.
3. Compare `s[l].lower()` to `s[r].lower()`. If they differ, return `False` immediately — a
   palindrome has no freedom here, this pair is forced.
4. Otherwise move `l` forward and `r` backward and repeat. `l` only moves right and `r` only moves
   left: once a pair matches, both characters are consumed, and moving just one of them would
   compare a character against one it can never be paired with.
5. Return `True` if the loop finishes. Guard the inner skip loops with `l < r` so a string of pure
   punctuation (or `" "`) collapses the pointers instead of running off the end.

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

In the filtered string, position `l` and position `r` are mirror images, so their characters must be
equal for a palindrome; the skip loops guarantee that `l` and `r` always sit on the next unmatched
alphanumeric from each side, which is exactly that mirrored pair. If every such pair matches until
the pointers cross, the filtered string reads the same both ways by definition. Each index is
visited by at most one pointer, so the whole thing is a single O(n) pass with only two integers of
state.
