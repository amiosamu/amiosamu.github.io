---
# Valid Anagram · Easy · Arrays & Hashing
# https://leetcode.com/problems/valid-anagram/
draft: false
pattern: "Character frequency map"
time: "O(n)"
space: "O(1)"
---

## Description

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` — meaning `t`
can be formed by rearranging every letter of `s` exactly once, so both strings hold the
same letters with the same counts — and `false` otherwise.

**Example**

```
Input: s = "anagram", t = "nagaram"
Output: true
```

Explanation: Both strings consist of the letters `a` (x3), `n`, `g`, `r`, `m` (x1 each),
just in a different order, so `t` is an anagram of `s`.

## Intuition

Two words are anagrams iff they have identical letter multisets, so the whole problem is
comparing two histograms — `Counter(s) == Counter(t)` in one line. Sorting both strings
also works but pays `O(n log n)` for information counting gets in `O(n)`. The version
below counts up on `s` and down on `t`, deleting keys that hit zero, so "everything
cancelled" is just an empty dict at the end.

## Approach

1. If `len(s) != len(t)`, return `False` immediately — different lengths can never cancel.
2. Build `count`, a dict from character to occurrences in `s`, via `count.get(c, 0) + 1`.
3. Walk `t`. If `c` is not a key in `count`, `t` has a letter `s` doesn't (or has one too
   many of it), so return `False`.
4. Otherwise decrement `count[c]`, and `del count[c]` when it reaches zero — that keeps the
   dict holding only letters still owed.
5. After the loop return `len(count) == 0`. Given the length guard from step 1 this is
   always true at that point, but keeping it makes the intent explicit and keeps the
   function correct if the guard is ever dropped.

## Code

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        count = {}
        for c in s:
            count[c] = count.get(c, 0) + 1

        for c in t:
            if c not in count:
                return False
            count[c] -= 1
            if count[c] == 0:
                del count[c]

        return len(count) == 0
```

## Why it works

Anagram is an equality of multisets, and `count` is exactly the multiset of `s`; deleting
one occurrence per character of `t` either succeeds for all of them (multisets equal) or
hits a character with no remaining budget (they differ). The length check rules out the
case where `t` is a strict sub-multiset of `s`, which would otherwise leave leftovers
undetected in a single downward pass. Both passes are linear in `n = len(s)`, and the dict
holds at most 26 lowercase keys, so space is `O(1)`.
