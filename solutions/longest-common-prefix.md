---
# Longest Common Prefix · Easy · Arrays & Hashing
# https://leetcode.com/problems/longest-common-prefix/
draft: false
pattern: "Vertical scan across strings"
time: "O(n * m)"
space: "O(1)"
---

## Description

Given an array of strings `strs`, return the longest string that is a prefix of every
string in the array. If the strings share no common leading characters, return the empty
string.

**Example**

```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

Explanation: `"fl"` is a prefix of all three words, but the next character differs
(`"o"` vs `"i"`), so `"fl"` is the longest common prefix.

## Intuition

The common prefix can never be longer than `strs[0]`, so instead of comparing strings to
each other I compare them column by column: take character `i` of the first word and check
that every other word has the same character there. The first column that disagrees — or
where some word runs out — ends the prefix, and I can return immediately. That's why this
beats "prefix of the first word, then shrink it against each string in turn": it stops at
the first mismatched column instead of rescanning.

## Approach

1. Call the first word `first`; the answer is always a prefix of it.
2. For each column index `i` in `range(len(first))`, let `c = first[i]`.
3. For every other word `s` in `strs[1:]`, fail the column if `i == len(s)` (that word is
   shorter and has no character here) or `s[i] != c`.
4. On failure return `first[:i]` — the columns `0 .. i-1` all matched, so that's the answer.
5. If every column survives, the whole of `first` is a common prefix; return `first`.
6. `strs` is guaranteed non-empty, so `strs[0]` is safe. A single word returns itself, and
   a first mismatch at `i = 0` returns `""`, which is the right "no common prefix" answer.

## Code

```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        first = strs[0]

        for i in range(len(first)):
            c = first[i]
            for s in strs[1:]:
                if i == len(s) or s[i] != c:
                    return first[:i]

        return first
```

## Why it works

A string is a common prefix iff every one of its columns matches in every word, so the
answer's length is precisely the index of the first column that fails — which is what the
outer loop finds and what `first[:i]` returns. Scanning `first` bounds the search by the
first word's length, and the `i == len(s)` check handles the case where a *shorter* word,
not a differing character, is the limit. Worst case every word is scanned to depth `m`
(the shortest length), giving `O(n * m)` for `n` strings, with only the returned slice
allocated.
