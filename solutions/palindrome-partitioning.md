---
# Palindrome Partitioning · Medium · Backtracking
# https://leetcode.com/problems/palindrome-partitioning/
draft: false
pattern: "Prefix-cut DFS with palindrome check"
time: "O(n * 2^n)"
space: "O(n)"
---

## Description

Given a string `s`, return every partition of `s` in which each substring is a palindrome.

**Example**

```
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
```

Explanation: Both `["a", "a", "b"]` and `["aa", "b"]` contain only palindromes.

## Intuition

At each position, choose the endpoint of the next substring. A non-palindromic choice cannot belong
to any valid partition, so reject it before recursing. The path list contains the selected pieces
and is reused across branches; completed paths must be copied before later backtracking mutates it.

## Approach

1. Use `is_pal(lo, hi)` to test a candidate substring in place with two pointers.
2. Keep `path` as palindromic pieces that concatenate to `s[:start]`.
3. At each `start`, try every endpoint and skip candidates that are not palindromes.
4. Append a valid piece, recurse after it, then pop it to restore `path` for the next choice.
5. When `start == len(s)`, append `path[:]`; the copy prevents later mutations from changing
   stored answers.

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

At entry to `dfs(start)`, `path` consists only of palindromes and concatenates to `s[:start]`.
Appending a tested palindrome preserves this invariant, and popping restores it after recursion.
The base case therefore records only valid full partitions. Every partition has a unique first cut
and the loop tries every possible cut, so induction on `start` shows every valid partition is
reached exactly once.

**Complexity**

- **Time:** `O(n * 2^n)` for palindrome checks and copying all candidate partitions.
- **Space:** `O(n)` auxiliary space for the path and recursion stack, plus `O(n * 2^n)` output
  space in the worst case.
