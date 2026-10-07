---
# Evaluate Reverse Polish Notation · Medium · Stack
# https://leetcode.com/problems/evaluate-reverse-polish-notation/
draft: false
pattern: "Operand stack for postfix eval"
time: "O(n)"
space: "O(n)"
---

## Description

Given tokens for a valid Reverse Polish notation expression, evaluate it and return the
integer result. Division truncates toward zero.

**Example**

```
Input: tokens = ["2","1","+","3","*"]
Output: 9
```

The first operator produces `2 + 1 = 3`, and the final operator produces `3 * 3 = 9`.

## Intuition

In postfix notation, an operator follows both operand expressions. Their completed values
are therefore the top two stack entries. Replacing those values with the operation result
collapses one expression subtree at a time.

The first popped value is the right operand, which matters for subtraction and division.
For exact truncation toward zero, divide the absolute values and then restore the sign;
Python's `//` alone would incorrectly round a negative quotient downward.

## Approach

1. Keep a stack of completed operand values.
2. Push integer tokens directly.
3. For an operator, pop `b` and then `a`, compute `a operator b`, and push the result.
   For division, apply the sign of `a * b` to `abs(a) // abs(b)`.
4. Return the only value remaining after all tokens are consumed.

## Code

```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for t in tokens:
            if t == "+":
                b, a = stack.pop(), stack.pop()
                stack.append(a + b)
            elif t == "-":
                b, a = stack.pop(), stack.pop()
                stack.append(a - b)
            elif t == "*":
                b, a = stack.pop(), stack.pop()
                stack.append(a * b)
            elif t == "/":
                b, a = stack.pop(), stack.pop()
                quotient = abs(a) // abs(b)
                stack.append(quotient if a * b >= 0 else -quotient)
            else:
                stack.append(int(t))
        return stack[0]
```

## Why it works

After every token, the stack contains the values of all completed subexpressions that have
not yet been consumed, in their original order. A number creates one such expression. An
operator consumes exactly the last two in left-right order and pushes their combined value,
preserving the invariant. The division branch changes only the sign after integer magnitude
division, so it truncates exactly toward zero. A valid expression leaves one value, which
is therefore the result.

**Complexity**

- **Time:** `O(n)` for `n` tokens.
- **Space:** `O(n)` for the operand stack.
