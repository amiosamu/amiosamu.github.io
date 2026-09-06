---
# Decode String · Medium · Stack
# https://leetcode.com/problems/decode-string/
draft: false
pattern: "Stack of pending prefix and count"
time: "O(m)"
space: "O(m)"
---

## Intuition

The encoding nests, so this is a parsing problem: `3[a2[c]]` needs the inner `2[c]` resolved before the outer repeat can be applied. Recursion would work, but the same thing falls out of one pass if I keep only two live registers — `cur`, the string being built at the current depth, and `num`, the multiplier being read — and push the pair onto a stack whenever a `[` opens a deeper level. A `]` then pops the parent's half-built string and its count, and stitches `parent + cur * k`. Digits can be multi-character, so the count is accumulated with `num * 10 + digit` rather than read as a single char.

## Approach

1. Keep `stack` (pairs of a parent string and its repeat count), `cur = ""`, and `num = 0`.
2. Scan `s` one character `c` at a time.
3. If `c.isdigit()`, do `num = num * 10 + int(c)` — this handles counts like `10`.
4. If `c == "["`, push `(cur, num)` and reset both `cur = ""` and `num = 0`. The push saves the parent's progress so the child can build on a clean buffer.
5. If `c == "]"`, pop `(prev, k)` and set `cur = prev + cur * k`. The finished child block is repeated and appended to whatever the parent had built before the bracket.
6. Otherwise `c` is a letter: append it with `cur += c`.
7. Return `cur`. The input is guaranteed well-formed, so the stack is empty at the end and `cur` holds the whole decoded string.

## Code

```python
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        cur = ""
        num = 0

        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == "[":
                stack.append((cur, num))
                cur, num = "", 0
            elif c == "]":
                prev, k = stack.pop()
                cur = prev + cur * k
            else:
                cur += c

        return cur
```

## Why it works

The invariant is that `cur` always holds the fully decoded text of the current bracket level so far, and the stack holds the same fact for every enclosing level, frozen at the moment its `[` was read. So when a `]` arrives, `cur` is already completely decoded — every nested block inside it was collapsed by an earlier `]` — which is why a single multiply-and-append finishes the level correctly. Each character is handled once and the string building totals the length of the decoded output, so with `m` as that output length the run is O(m) time and O(m) space, the stack depth being bounded by the nesting depth.
