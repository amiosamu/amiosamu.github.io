---
# Letter Combinations of a Phone Number · Medium · Backtracking
# https://leetcode.com/problems/letter-combinations-of-a-phone-number/
draft: false
pattern: "Fixed-depth cartesian product DFS"
time: "O(n * 4^n)"
space: "O(n)"
---

## Description

Given a string containing digits `2` through `9`, return every letter combination represented
by the corresponding phone keypad keys, in any order.

**Example**

```
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

Digit `2` contributes one of `abc` and digit `3` contributes one of `def`, producing nine
pairs.

## Intuition

The answer is a Cartesian product. At depth `i`, choose one letter mapped from `digits[i]`.
Every path has exactly `len(digits)` choices and is valid, so no pruning is needed. Empty input
is handled separately because the required result is `[]`, not a list containing an empty
string.

## Approach

1. Return `[]` immediately for empty `digits`, then define the digit-to-letters mapping.
2. Let `dfs(i)` choose the letter for position `i`; `path` stores one letter for every digit
   before `i`.
3. Append each candidate letter, recurse to `i + 1`, and pop it to restore `path` for the next
   choice.
4. At `i == len(digits)`, join `path` into a new string and append it to `res`.

## Code

```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        pad = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
               "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        res, path = [], []

        def dfs(i: int) -> None:
            if i == len(digits):
                res.append("".join(path))
                return
            for ch in pad[digits[i]]:
                path.append(ch)
                dfs(i + 1)
                path.pop()

        dfs(0)
        return res
```

## Why it works

On entry to `dfs(i)`, `path` contains exactly one valid letter for each of the first `i` digits.
Appending a mapped letter preserves that invariant for `i + 1`, and popping restores it for the
next sibling. Thus every leaf is valid. Conversely, every valid combination determines one
choice at each depth, so it reaches exactly one leaf.

**Complexity**

- **Time:** `O(n * 4^n)` in the worst case because up to `4^n` strings of length `n` are built.
- **Space:** `O(n)` auxiliary recursion and path space, plus `O(n * 4^n)` output space.
