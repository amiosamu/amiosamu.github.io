---
# Generate Parentheses · Medium · Stack
# https://leetcode.com/problems/generate-parentheses/
draft: false
pattern: "Backtracking on open/close counts"
time: "O(4^n / sqrt(n))"
space: "O(n)"
---

## Description

Given `n` pairs of parentheses, generate every well-formed parenthesis string of length
`2n`.

**Example**

```
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
```

Explanation: These are the five strings whose prefixes never contain more closing than
opening parentheses.

## Intuition

A valid string uses exactly `n` opening and `n` closing parentheses, and no prefix has more
closing parentheses than opening ones. Backtracking can enforce both conditions while the
string is built, avoiding invalid branches rather than generating and checking them later.

The counters `open_count` and `close_count` describe the shared working buffer `cur`.

## Approach

1. Maintain `cur` as the current character buffer and `res` as the completed strings.
2. Append `"("` only while `open_count < n`, recurse, and then pop it to restore `cur`.
3. Append `")"` only while `close_count < open_count`, recurse, and then restore `cur`.
4. When `cur` has length `2 * n`, join and append it. The guards ensure both counts are
   `n`, including the `n == 0` case.
5. Start with both counts at zero and return `res` after all branches are explored.

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

Every explored prefix satisfies the prefix condition and uses at most `n` openings. A leaf
has length `2n`, so it must contain exactly `n` of each character and is valid. Conversely,
for any valid string, its next character always satisfies the corresponding guard; following
those choices reproduces the string. Distinct choice sequences produce distinct strings, so
every valid result appears exactly once.

**Complexity**

- **Time:** `O(n C_n) = O(4^n / sqrt(n))`, where `C_n` is the `n`th Catalan number.
- **Space:** `O(n)` auxiliary space for the recursion and working buffer.
- **Output:** `O(n C_n)` characters across all returned strings.
