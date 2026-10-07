---
# Longest Common Prefix · Easy · Arrays & Hashing
# https://leetcode.com/problems/longest-common-prefix/
draft: false
pattern: "Vertical scan across strings"
time: "O(n * m)"
space: "O(1)"
---

## Description

Given a non-empty array of strings `strs`, return the longest prefix shared by every string.
Return the empty string when no leading character is common to all strings.

**Example**

```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

Every word starts with `"fl"`, but their characters at index `2` do not all match.

## Intuition

The result must be a prefix of the first string. Check its characters one column at a time against
the other strings. The first missing or different character ends the common prefix, so no later
positions need to be examined.

## Approach

1. Save `strs[0]` as `first`; every possible answer is one of its prefixes.
2. For each index `i` in `first`, compare `first[i]` with the same position in every later string.
3. If a string ends at `i` or has a different character, return `first[:i]`.
4. Return all of `first` if every column matches. A single string therefore returns itself, while
   a mismatch at index zero returns the empty string.

## Code

```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        first = strs[0]

        for i in range(len(first)):
            c = first[i]
            for j in range(1, len(strs)):
                if i == len(strs[j]) or strs[j][i] != c:
                    return first[:i]

        return first
```

## Why it works

Before checking column `i`, every string shares `first[:i]`. If any string lacks or differs at
column `i`, no common prefix can include that column, so `first[:i]` is maximal. If all columns of
`first` match, `first` itself is common and no longer prefix is possible because the answer must be
a prefix of `first`. Thus the returned string is exactly the longest common prefix.

**Complexity**

- **Time:** `O(n * m)` for `n` strings and first-string length `m` in the worst case.
- **Space:** `O(1)` auxiliary space, plus up to `O(m)` for the returned slice.
