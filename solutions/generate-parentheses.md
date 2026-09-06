---
# Generate Parentheses · Medium · Stack
# https://leetcode.com/problems/generate-parentheses/
draft: false
pattern: "Backtracking on open/close counts"
time: "O(4^n / sqrt(n))"
space: "O(n)"
---

## Intuition

Generating all `2^(2n)` strings and validating each is wasteful — most die on the very first bad character. Instead I build the string left to right and only ever append a character that keeps the prefix valid, so every leaf of the recursion is a real answer and nothing is ever thrown away. The whole validity check collapses into two counters: I may open while `open_count < n`, and I may close while `close_count < open_count` (closing more than I have opened is what makes a prefix unrecoverable).

## Approach

1. Keep `res` for finished strings and `cur`, a list of characters used as the working buffer.
2. Define `backtrack(open_count, close_count)` where the counts are how many `(` and `)` are already in `cur`.
3. Base case: when `len(cur) == 2 * n`, both counts must be `n`, so join `cur` into a string, append to `res`, and return.
4. Branch one — if `open_count < n`, append `"("`, recurse with `open_count + 1`, then pop to undo.
5. Branch two — if `close_count < open_count`, append `")"`, recurse with `close_count + 1`, then pop to undo.
6. The pop after each recursive call is what makes `cur` shared and correct; without it the buffer leaks characters into sibling branches.
7. Call `backtrack(0, 0)` and return `res`.

## Code

```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        cur = []

        def backtrack(open_count: int, close_count: int) -> None:
            if len(cur) == 2 * n:
                res.append("".join(cur))
                return
            if open_count < n:
                cur.append("(")
                backtrack(open_count + 1, close_count)
                cur.pop()
            if close_count < open_count:
                cur.append(")")
                backtrack(open_count, close_count + 1)
                cur.pop()

        backtrack(0, 0)
        return res
```

## Why it works

A string of `n` pairs is balanced exactly when no prefix has more `)` than `(` and the totals are equal, and the two guards enforce precisely those conditions at every step, so the recursion reaches every valid string and no invalid one. The choices at each node are distinct characters, so no string is generated twice. The number of leaves is the nth Catalan number, ~4^n/(n^(3/2)), and each costs O(n) to emit, giving O(4^n / sqrt(n)) time with O(n) recursion depth and buffer excluding the output.
