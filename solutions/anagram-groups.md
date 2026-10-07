---
# Group Anagrams · Medium · Arrays & Hashing
# https://leetcode.com/problems/group-anagrams/
draft: false
pattern: "Bucket by letter-count key"
time: "O(n * m)"
space: "O(n)"
---

## Description

Given an array of strings `strs`, group the strings that are anagrams of each other into
sublists, and return the list of groups. Both the order of the groups and the order of
strings within a group are unconstrained.

**Example**

```
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

Explanation: `"eat"`, `"tea"`, and `"ate"` share the letters `{a,e,t}`; `"tan"` and
`"nat"` share `{a,n,t}`; `"bat"` matches no other word, so it forms its own group.

## Intuition

Anagrams contain each lowercase letter the same number of times. A 26-entry frequency vector is
therefore a canonical key: anagrams have equal keys, while non-anagrams differ in at least one
position. Bucketing words by this key avoids pairwise comparisons and sorting each word.

## Approach

1. Create `groups`, mapping frequency tuples to lists of words.
2. For each `word`, count its lowercase letters in a 26-entry list.
3. Convert the list to a hashable tuple and append the original word to that bucket.
4. Return all buckets. An empty string naturally receives the all-zero key.

## Code

```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}

        for word in strs:
            count = [0] * 26
            for c in word:
                count[ord(c) - ord('a')] += 1

            key = tuple(count)
            if key not in groups:
                groups[key] = []
            groups[key].append(word)

        return list(groups.values())
```

## Why it works

Two words enter the same bucket exactly when all 26 letter counts match. Equal counts are both
necessary and sufficient for lowercase words to be anagrams, so every bucket contains one
complete anagram class and no words from another class.

**Complexity**

- **Time:** `O(C)`, where `C` is the total number of characters across all words.
- **Space:** `O(n)` auxiliary key and dictionary space because each key has fixed size, plus
  `O(n)` references in the returned groups. The input strings themselves are not copied.
