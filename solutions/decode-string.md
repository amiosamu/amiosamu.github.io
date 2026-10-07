---
# Decode String · Medium · Stack
# https://leetcode.com/problems/decode-string/
draft: false
pattern: "Stack of pending prefix and count"
time: "O(n + m * d)"
space: "O(n + m)"
---

## Description

Given an encoded string containing letters and groups of the form `k[encoded_string]`,
return its decoded value. Repeat counts may have multiple digits, and groups may be nested.

**Example**

```
Input: s = "3[a]2[bc]"
Output: "aaabcbc"
```

The groups expand to `"aaa"` and `"bcbc"`, which concatenate to `"aaabcbc"`.

## Intuition

Nested groups must be completed from the inside out. `cur` stores the decoded text at the
current nesting level, while the stack saves each enclosing prefix and repeat count.

An opening bracket starts a new level. A closing bracket finishes that level by repeating
the current chunks and appending the repeated group to its saved parent. Counts are
accumulated digit by digit, so values such as `12` are handled correctly.

## Approach

1. Track current-level text chunks in `cur`, the pending number in `num`, and enclosing
   `(parent_chunks, repeat)` pairs in `stack`.
2. Accumulate each digit with `num = num * 10 + int(c)`.
3. On `[`, save `(cur, num)` and reset both values for the nested group.
4. On `]`, join the completed level, repeat it `k` times, append it to `prev`, and continue
   building that parent. Append ordinary letters as chunks without repeatedly copying text.
5. Join `cur` after the well-formed input closes every saved level.

## Code

```python
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        cur = []
        num = 0

        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == "[":
                stack.append((cur, num))
                cur, num = [], 0
            elif c == "]":
                prev, k = stack.pop()
                prev.append("".join(cur) * k)
                cur = prev
            else:
                cur.append(c)

        return "".join(cur)
```

## Why it works

After each input character, joining `cur` yields the decoded prefix of the current level,
and each stack entry preserves its parent prefix and repeat count. When `]` is read, every
nested group in `cur` is already decoded. Repeating that text and appending it to the saved
parent therefore produces exactly the decoded parent prefix and preserves the invariant.
At depth zero, joining `cur` gives the complete answer.

**Complexity**

- **Time:** `O(n + m * d)` in the worst case, where `n` is encoded length, `m` is decoded
  length, and `d` is nesting depth; immutable strings may be recopied at each level.
- **Space:** `O(n + m)` for stack state and intermediate decoded chunks.
- **Output:** `O(m)` for the decoded string.
