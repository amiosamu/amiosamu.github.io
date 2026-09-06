---
# Baseball Game · Easy · Stack
# https://leetcode.com/problems/baseball-game/
draft: false
pattern: "Stack of still-valid scores"
time: "O(n)"
space: "O(n)"
---

## Description

Given a list of strings `operations` describing a round of a scoring game — an integer (a new score), `"+"` (sum of the previous two scores), `"D"` (double the previous score), or `"C"` (cancel/remove the previous score) — replay the operations and return the sum of all scores that remain on the record.

**Example**

```
Input: ops = ["5","2","C","D","+"]
Output: 30
```

Explanation: the record becomes `[5]`, then `[5,2]`, then `"C"` removes 2 leaving `[5]`, then `"D"` doubles 5 to append 10 giving `[5,10]`, then `"+"` adds the last two (`5+10=15`) giving `[5,10,15]`; the sum is `5+10+15 == 30`.

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
