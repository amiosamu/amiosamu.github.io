---
# Baseball Game · Easy · Stack
# https://leetcode.com/problems/baseball-game/
draft: false
pattern: "Stack of still-valid scores"
time: "O(n)"
space: "O(n)"
---

## Intuition

Every operation only ever refers to the *most recent* valid scores: `"+"` reads the last two, `"D"` reads the last one, `"C"` deletes the last one. That is exactly a stack's access pattern, so I keep a stack of the scores that are currently valid and the whole problem becomes one linear pass. The answer is the sum of whatever survives.

## Approach

1. Keep `stack`, a list of the scores that are currently on the record, in order.
2. Walk `operations` left to right. For each token `op`:
3. `"+"` — push `stack[-1] + stack[-2]` as a new score. The problem guarantees at least two valid scores exist, so no bounds check is needed.
4. `"D"` — push `2 * stack[-1]`.
5. `"C"` — `stack.pop()`, which removes the previous score permanently. It never comes back, so nothing else needs to be tracked.
6. Otherwise the token is an integer string (possibly negative) — push `int(op)`.
7. Return `sum(stack)`.

## Code

```python
class Solution:
    def calPoints(self, operations: List[str]) -> int:
        stack = []
        for op in operations:
            if op == "+":
                stack.append(stack[-1] + stack[-2])
            elif op == "D":
                stack.append(2 * stack[-1])
            elif op == "C":
                stack.pop()
            else:
                stack.append(int(op))
        return sum(stack)
```

## Why it works

The invariant is that `stack` always holds exactly the valid scores in the order they were recorded, so `stack[-1]` and `stack[-2]` are always the "previous" and "second previous" the problem means. `"C"` is the only destructive op, and popping is the correct semantics because a cancelled score is never referenced again. One pass with O(1) work per token gives O(n) time, and the stack holds at most n scores.
