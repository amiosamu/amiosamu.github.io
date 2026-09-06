---
# Evaluate Reverse Polish Notation · Medium · Stack
# https://leetcode.com/problems/evaluate-reverse-polish-notation/
draft: false
pattern: "Operand stack for postfix eval"
time: "O(n)"
space: "O(n)"
---

## Intuition

Postfix notation is designed so that an operator's arguments are always the two most recently completed results — that is what removes the need for parentheses. So a stack of pending operands is all the state required: numbers get pushed, an operator pops two, combines them, and pushes the single result back. The only trap is order and rounding: the *first* pop is the right operand, and division truncates toward zero, not toward negative infinity like Python's `//`.

## Approach

1. Keep `stack` of integer operands.
2. For each token `t` in `tokens`:
3. If `t` is one of `+ - * /`, pop twice as `b, a = stack.pop(), stack.pop()` — `b` is the right operand because it was pushed last — compute, and push the result.
4. For `/`, push `int(a / b)`. `int()` on a float truncates toward zero, which matches the problem's rule; `a // b` would floor and give `-3` instead of `-2` for `-7 / 3`. Values stay inside 32-bit range so the float division is exact.
5. Otherwise `t` is an integer literal, possibly with a leading `-`; push `int(t)`.
6. The expression is guaranteed valid, so at the end exactly one value remains — return `stack[0]`.

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
                stack.append(int(a / b))
            else:
                stack.append(int(t))
        return stack[0]
```

## Why it works

The invariant is that `stack` holds the values of all fully-evaluated subexpressions so far, in left-to-right order. A valid RPN expression guarantees that when an operator appears, its two operand subtrees are exactly the top two entries, so popping them and pushing the result is the same as collapsing that node of the expression tree. Each token is handled with O(1) work, giving O(n) time and a stack of at most n operands.
