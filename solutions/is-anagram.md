---
# Valid Anagram · Easy · Arrays & Hashing
# https://leetcode.com/problems/valid-anagram/
draft: false
pattern: "Character frequency map"
time: "O(n)"
space: "O(1)"
---

## Description

Given lowercase English strings `s` and `t`, return whether `t` is an anagram of `s`: both
strings must contain the same characters with the same frequencies.

**Example**

```
Input: s = "anagram", t = "nagaram"
Output: true
```

Explanation: Both strings contain three `a` characters and one each of `n`, `g`, `r`, and
`m`.

## Intuition

Anagrams have equal character frequency maps. Count every character in `s`, then consume
one count for each character in `t`. A missing key during consumption means `t` contains a
character too many times.

Deleting zero-count entries keeps the map equal to the unmatched multiset from `s`. A
length check rejects strings that cannot contain the same total number of characters.

## Approach

1. Return `False` immediately when the string lengths differ.
2. Build `count`, mapping each character in `s` to its frequency.
3. For each character in `t`, return `False` if no unmatched copy remains. Otherwise
   decrement its count and delete the key when the count reaches zero.
4. Return whether `count` is empty. The function reads both strings without modifying them.

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

Before processing each character of `t`, `count` represents exactly the occurrences from
`s` not yet matched. If no copy of the next character remains, the two multisets differ.
Otherwise decrementing preserves the invariant. After all characters are processed, an
empty map means every occurrence matched. Equal lengths ensure neither string can have
unmatched characters when the other is exhausted, so this condition is equivalent to being
anagrams.

**Complexity**

- **Time:** `O(n)`, where `n = len(s) = len(t)` after the length check.
- **Space:** `O(1)` because the lowercase English alphabet has 26 characters.
