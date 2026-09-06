---
# Letter Combinations of a Phone Number · Medium · Backtracking
# https://leetcode.com/problems/letter-combinations-of-a-phone-number/
draft: false
pattern: "Fixed-depth cartesian product DFS"
time: "O(n * 4^n)"
space: "O(n)"
---

## Intuition

This is a cartesian product, not a search: digit `i` contributes exactly one letter to the output, chosen from that digit's 3 or 4 keypad letters, independently of every other digit. So the recursion tree has fixed depth `len(digits)`, branching 3 or 4 at each level, and every leaf is a valid answer — nothing is ever rejected. The only real decisions are the keypad table and the empty-input case, which must return `[]` rather than `[""]`.

## Approach

1. Guard `if not digits: return []` up front. Without it the recursion immediately hits its base case and returns `[""]`, which the problem counts as wrong.
2. Build `pad`, a dict from digit character to its letters: `2`→`"abc"` … `7`→`"pqrs"`, `8`→`"tuv"`, `9`→`"wxyz"`. Only 7 and 9 have four letters.
3. The decision at depth `i` is which letter of `pad[digits[i]]` to take; the loop over that string enumerates the siblings.
4. `path` holds the letters chosen so far, one per digit consumed; `res` collects finished strings.
5. Base case: `i == len(digits)` — every digit has contributed, so append `"".join(path)` and return.
6. `"".join(path)` is the copy step: `path` is a single list mutated by the whole traversal, and joining snapshots it into a fresh immutable string, so later mutations can't corrupt what's already in `res`.
7. Body: `path.append(ch)`, `dfs(i + 1)`, `path.pop()` — undo before the next letter so `path` always has exactly `i` entries on entry to depth `i`.
8. No pruning and no duplicate rule: the keypad letter sets are disjoint, digits are consumed in fixed order, so no two leaves can collide and no branch can dead-end.

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

Position `i` of every output comes from `pad[digits[i]]` and from nowhere else, so the set of valid answers is exactly the cartesian product of those letter sets — and a depth-first walk that fixes one factor per level enumerates a cartesian product exactly once per tuple. The `path.pop()` restores the invariant "`path` holds one letter per digit already fixed", which is what lets the sibling iterations share one buffer. There are at most 4^n leaves, each joined in O(n), giving O(n * 4^n) time and O(n) auxiliary space for `path` and the stack.
