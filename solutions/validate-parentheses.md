---
# Valid Parentheses · Easy · Stack
# https://leetcode.com/problems/valid-parentheses/
draft: false
pattern: "Stack of unmatched openers"
time: "O(n)"
space: "O(n)"
---

## Intuition

Brackets nest, so a closing bracket must match the *most recently opened* bracket that is still unmatched — nothing else can be its partner without crossing. "Most recent unmatched" is a stack. Push openers, and on a closer check the top: if it is not its mate, the string is dead immediately.

## Approach

1. Build `pairs = {')': '(', ']': '[', '}': '{'}` mapping each closer to the opener it requires.
2. Keep `stack` of openers seen but not yet closed.
3. Scan `s` character by character:
4. If `c` is a closer (`c in pairs`): if `stack` is empty there is nothing to close, return `False`; otherwise pop and if the popped opener is not `pairs[c]`, the brackets cross, return `False`.
5. Otherwise `c` is an opener — push it.
6. After the scan, return `len(stack) == 0`. A non-empty stack means openers were never closed, which is just as invalid as a mismatch.

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

The invariant is that `stack` holds, bottom to top, the currently open brackets in nesting order, so the top is always the only one a closer is allowed to match. Rejecting on mismatch handles crossing (`([)]`), rejecting on an empty stack handles a closer with no opener, and the final emptiness check handles openers with no closer — the three ways a bracket string can fail. Each character is pushed and popped at most once, so O(n) time and O(n) stack in the worst case (`"((((("`).
