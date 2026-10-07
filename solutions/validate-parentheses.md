---
# Valid Parentheses · Easy · Stack
# https://leetcode.com/problems/valid-parentheses/
draft: false
pattern: "Stack of unmatched openers"
time: "O(n)"
space: "O(n)"
---

## Description

Given a string containing only `()[]{}`, determine whether every opener has a matching closer of
the same type and all pairs close in the correct nesting order.

**Example**

```
Input: s = "()[]{}"
Output: true
```

Each opening bracket is closed by the matching type in valid nesting order.

## Intuition

Nested brackets close in reverse order: each closer must match the most recent unmatched opener.
A stack represents exactly that order. A closer fails immediately when the stack is empty or its
top has a different type.

## Approach

1. Map each closing bracket to the opening bracket it requires.
2. Push every opening bracket onto `stack`.
3. For a closer, reject if the stack is empty or its popped top does not match.
4. After scanning all characters, return whether the stack is empty.

## Code

```python
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for c in s:
            if c in pairs:
                if not stack or stack.pop() != pairs[c]:
                    return False
            else:
                stack.append(c)
        return len(stack) == 0
```

## Why it works

After every processed prefix, the stack contains exactly its unmatched opening brackets in their
nesting order. Pushing an opener preserves this invariant. A valid closer must match the top, so a
missing or different top proves invalidity; popping a match preserves the invariant. At the end,
the string is fully matched exactly when no opener remains.

**Complexity**

- **Time:** `O(n)` because each character is pushed or popped at most once.
- **Space:** `O(n)` for a prefix containing only opening brackets.
