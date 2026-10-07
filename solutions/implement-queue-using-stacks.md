---
# Implement Queue using Stacks · Easy · Stack
# https://leetcode.com/problems/implement-queue-using-stacks
draft: false
pattern: "Two stacks, amortized transfer"
time: "O(1) amortized per op"
space: "O(n)"
---

## Description

Implement a FIFO queue with `push`, `pop`, `peek`, and `empty` using only stack operations.

**Example**

```
Input: ["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []]
Output: [null, null, null, 1, 1, false]
```

Explanation: `1` was pushed first, so both `peek()` and `pop()` return it. The queue then
still contains `2`.

## Intuition

Use `inp` for newly pushed values and `out` for values ready to leave. Moving all values
from `inp` to `out` reverses their order, placing the oldest value on top of `out`.

Transfer only when `out` is empty. Existing values in `out` are older than every value in
`inp` and must be removed first. Delaying transfers also gives constant amortized cost.

## Approach

1. Append every pushed value to `inp`.
2. In `_shift`, move all values from `inp` to `out` only when `out` is empty.
3. For `pop` and `peek`, call `_shift` and use the top of `out`, which is the queue front.
4. Report empty only when both stacks are empty. The problem guarantees `pop` and `peek`
   are called only on a nonempty queue.

## Code

```python
class MyQueue:

    def __init__(self):
        self.inp = []
        self.out = []

    def push(self, x: int) -> None:
        self.inp.append(x)

    def pop(self) -> int:
        self._shift()
        return self.out.pop()

    def peek(self) -> int:
        self._shift()
        return self.out[-1]

    def empty(self) -> bool:
        return not self.inp and not self.out

    def _shift(self) -> None:
        if not self.out:
            while self.inp:
                self.out.append(self.inp.pop())
```

## Why it works

From front to back, the logical queue is `out` read from top to bottom followed by `inp`
read from bottom to top. `push` extends the latter sequence. When `out` is empty, moving
all of `inp` reverses that sequence and restores its oldest value to the top, preserving
FIFO order. Thus `pop` and `peek` always use the true queue front.

**Complexity**

- **Time:** `O(1)` amortized per operation; one transfer can take `O(n)`.
- **Space:** `O(n)` for the two stacks.
