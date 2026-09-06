---
# Palindrome Partitioning · Medium · Backtracking
# https://leetcode.com/problems/palindrome-partitioning/
draft: false
pattern: "Prefix-cut DFS with palindrome check"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given a string `s`, split it into substrings such that every substring is a palindrome, and return all possible ways to partition it.

**Example**

```
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
```

Explanation: Both partitions use only palindromic substrings ("a", "a", "b" and "aa", "b"), covering the two ways to cut "aab" so every piece reads the same forwards and backwards.

## Intuition

A partition of `s` is just a set of cut positions, so there are 2^(n-1) candidates and the brute force is to test each one. The insight that makes backtracking better than generate-and-filter is that palindromicity is checkable *prefix by prefix*: if `s[start:end+1]` isn't a palindrome, no partition that starts with that piece can ever be valid, so the whole subtree dies immediately instead of being built and rejected at the end. That turns the check into a prune, and it is why this runs comfortably for n = 16.

## Approach

1. The decision at each node is where to cut next: choose an `end >= start` and take `s[start:end + 1]` as the next piece.
2. `path` holds the pieces chosen so far, which always concatenate to exactly `s[:start]`; `res` collects finished partitions.
3. Base case: `start == len(s)` — the whole string is consumed, so append `path[:]` and return. This is the only place an answer is recorded, and reaching it means every piece in `path` already passed the palindrome test.
4. Pruning rule: `if not is_pal(start, end): continue`. Skipping the piece prunes the entire subtree rooted at that cut, since any partition through it would contain a non-palindrome.
5. Write `is_pal(lo, hi)` as an index-based two-pointer walk on `s` — comparing in place avoids allocating a substring just to test it, and the slice is built only for pieces that pass.
6. Body: `path.append(s[start:end + 1])`, `dfs(end + 1)`, `path.pop()` — undo before trying a longer piece at the same node.
7. Append `path[:]`, a copy: `path` is one list mutated for the whole traversal, so a stored reference would leave every recorded partition aliased to the same eventually-empty list.
8. No duplicate rule is needed — no start index trick, no used set. Different cut sets are different answers by definition, so distinct branches cannot collide even when `s` is all one letter.

## Code

```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res, path = [], []

        def is_pal(lo: int, hi: int) -> bool:
            while lo < hi:
                if s[lo] != s[hi]:
                    return False
                lo += 1
                hi -= 1
            return True

        def dfs(start: int) -> None:
            if start == len(s):
                res.append(path[:])
                return
            for end in range(start, len(s)):
                if not is_pal(start, end):
                    continue
                path.append(s[start:end + 1])
                dfs(end + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

The invariant is that `path` concatenates to `s[:start]` and every piece in it is a palindrome; the base case therefore fires exactly when `path` is a full valid partition. Completeness holds because each node tries every possible length for the next piece, and uniqueness holds because a partition is determined by its cut positions and each branch fixes a different first cut. There are at most 2^(n-1) partitions, each costing O(n) to copy, and the palindrome tests are O(n) per node over a tree of the same order — hence O(n * 2^n) time and O(n) auxiliary space for `path` and the stack.
