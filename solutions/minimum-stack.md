---
# Min Stack · Medium · Stack
# https://leetcode.com/problems/min-stack/
draft: false
pattern: "Parallel stack of prefix minima"
time: "O(1)"
space: "O(n)"
---

## Description

Design a stack supporting `push`, `pop`, `top`, and `getMin`, where `getMin` returns the
smallest current element. Every operation must run in constant time.

**Example**

```
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"], [[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
```

Explanation: After pushing `-2`, `0`, and `-3`, the minimum is `-3`. Popping it exposes `0`
as the top and restores `-2` as the minimum.

## Intuition

Store the minimum for every stack prefix rather than recomputing it after a pop. If `mins[i]`
is the minimum through `stack[i]`, pushing one value requires one comparison. Popping both lists
then exposes the minimum of the preceding prefix immediately. Duplicate minima must be stored too,
so the lists always remain aligned.

## Approach

1. Maintain `stack` for values and an equal-length `mins` list of prefix minima.
2. On `push(val)`, append `val` and append `min(val, mins[-1])`, using `val` when empty.
3. On `pop()`, remove the final item from both lists.
4. Return `stack[-1]` from `top()` and `mins[-1]` from `getMin()`.

## Code

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.mins = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        self.mins.append(val if not self.mins else min(val, self.mins[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.mins.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.mins[-1]
```

## Why it works

The invariant is `mins[i] == min(stack[0:i + 1])`. It holds for the first value. If it holds
before a push, the new prefix minimum is exactly `min(val, mins[-1])`, so the invariant extends
by one position. A pop removes the same position from both lists, leaving the invariant unchanged
for every remaining prefix. Therefore, `mins[-1]` always returns the current minimum.

**Complexity**

- **Time:** `O(1)` for each operation.
- **Space:** `O(n)` auxiliary space after `n` pushes.
