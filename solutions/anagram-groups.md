---
# Group Anagrams · Medium · Arrays & Hashing
# https://leetcode.com/problems/group-anagrams/
draft: false
pattern: "Bucket by letter-count key"
time: "O(n * m)"
space: "O(n * m)"
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

Comparing every pair of words is `O(n^2)` anagram checks. The fix is to give each word a
*canonical form* that is identical for anagrams and different otherwise, then bucket by it
in a dict. Sorted letters (`"".join(sorted(word))`) is the one-liner version and costs
`m log m` per word; a 26-slot count vector, frozen into a tuple so it can be a dict key,
is the same idea in `O(m)`.

## Approach

1. Keep `groups`, a dict from canonical key → list of the words with that key.
2. For each `word`, build `count = [0] * 26` and increment `count[ord(c) - ord('a')]` for
   every character.
3. Convert to `key = tuple(count)` — lists are unhashable, tuples are not.
4. Append `word` to `groups[key]`, creating the empty list first if the key is new
   (`collections.defaultdict(list)` removes that check if you prefer).
5. Return `list(groups.values())`; the order of groups and of words within a group is
   unconstrained by the problem.
6. The empty string is fine — it gets the all-zeros key and groups with other empty strings.

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

Two words are anagrams exactly when their letter-count vectors are equal, so the count
tuple is a complete invariant: equal keys imply anagrams and anagrams imply equal keys.
That makes dict buckets and anagram classes the same partition, no cross-checking needed.
Each word costs `O(m)` to count plus `O(26)` to hash a fixed-width tuple, so the total is
`O(n * m)` time, and the dict stores every word once — `O(n * m)` space.
