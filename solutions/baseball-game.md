---
# Baseball Game · Easy · Stack
# https://leetcode.com/problems/baseball-game/
draft: false
pattern: "Stack of still-valid scores"
time: "O(n)"
space: "O(n)"
---

## Description

Given scoring `operations`, return the sum of the final record. An integer adds a score, `"+"`
adds the previous two scores, `"D"` doubles the previous score, and `"C"` cancels it.

**Example**

```
Input: ops = ["5","2","C","D","+"]
Output: 30
```

The record changes to `[5]`, `[5,2]`, `[5]`, `[5,10]`, and `[5,10,15]`, whose sum is 30.

## Intuition

Every symbolic operation uses or removes the most recent valid scores. A stack stores exactly
that record: its top entries are the previous scores, and cancellation is a pop.

## Approach

1. Initialize `stack` with no valid scores.
2. For each operation, append the sum of the top two for `"+"`, append twice the top for
   `"D"`, or pop the top for `"C"`.
3. Otherwise parse and append the integer, including a possible negative value.
4. Return the sum of the remaining scores. The input guarantees each symbolic operation has
   enough preceding valid scores.

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

After each operation, `stack` contains exactly the valid record in chronological order. Each
branch performs the operation's specified change using the correct most recent entries, so the
invariant is preserved. Therefore summing the stack after the final operation gives the required
score.

**Complexity**

- **Time:** `O(n)` for processing and summing at most `n` scores.
- **Space:** `O(n)` for the stack.
