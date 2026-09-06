---
# Min Stack · Medium · Stack
# https://leetcode.com/problems/min-stack/
draft: false
pattern: "Parallel stack of prefix minima"
time: "O(1)"
space: "O(n)"
---

## Description

Design a stack that supports `push`, `pop`, `top`, and `getMin` (retrieving the minimum element currently in the stack), with every operation running in O(1) time.

**Example**

```
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"], [[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
```

Explanation: after pushing -2, 0, -3 the minimum is -3; popping removes -3 so `top()` returns 0, and the minimum of the remaining `[-2,0]` is -2.

## Intuition

Recomputing the minimum after a pop is the expensive part, so instead of one minimum I store the answer for *every* prefix of the stack. `mins[i]` is the minimum of the bottom `i+1` elements. Pushing extends that prefix by one, which is a single `min`; popping shortens it, and the previous prefix minimum is already sitting right there. The two stacks stay the same height, so they pop in lockstep and nothing is ever recomputed.

## Approach

1. Keep `stack` for the values and `mins` for the running minimum, always the same length.
2. `push(val)` — append `val` to `stack`. Append to `mins` either `val` if `mins` is empty, or `min(val, mins[-1])` otherwise: the minimum of everything including the new value.
3. `pop()` — pop both `stack` and `mins`. Popping `mins` restores it to the minimum of the remaining elements, which is why nothing needs recomputing.
4. `top()` — `stack[-1]`.
5. `getMin()` — `mins[-1]`, the minimum over the whole current stack by construction.
6. Keeping the lengths equal is the invariant to protect; never skip a `mins` push on duplicates, or the stacks desynchronize.

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

The invariant is `mins[i] == min(stack[0..i])`, and it is maintained inductively: `min(stack[0..i]) = min(stack[i], min(stack[0..i-1]))`, which is exactly the push rule. Since a pop removes only the top element, the correct minimum for the shorter stack is the one recorded one level down, so it is already stored rather than derived. Every operation is a constant number of list ops, so O(1) time, at the cost of one extra integer per element — O(n) space.
