---
# Implement Stack Using Queues · Easy · Stack
# https://leetcode.com/problems/implement-stack-using-queues/
draft: false
pattern: "Single queue rotated on push"
time: "O(n) push, O(1) pop/top"
space: "O(n)"
---

## Description

Implement a last-in-first-out (LIFO) stack — supporting `push`, `pop`, `top`, and `empty` — using only the standard operations of a queue as the underlying storage.

**Example**

```
Input: ["MyStack", "push", "push", "top", "pop", "empty"], [[], [1], [2], [], [], []]
Output: [null, null, null, 2, 2, false]
```

Explanation: after pushing 1 then 2, `top()` and `pop()` both return 2 because it was pushed most recently; after the pop only 1 remains, so `empty()` is `false`.

## Intuition

A queue hands back the oldest element and a stack wants the newest, so somewhere I have to pay to reverse the order. The trick is to pay it once, on `push`: after appending `x` to the back, rotate the queue by moving every *other* element from front to back, which drags `x` around to the front. The queue is then permanently in stack order, so `pop` and `top` are just the queue's own front operations and no second queue is needed.

## Approach

1. Hold one `collections.deque` called `q`, maintained so that its front is always the most recently pushed element.
2. `push(x)` — `q.append(x)` puts `x` at the back, temporarily breaking the invariant. Then repeat `q.append(q.popleft())` exactly `len(q) - 1` times: every element that was in front of `x` gets cycled behind it, leaving `x` at the front and the rest in their old relative order.
3. Capture `len(q) - 1` *after* the append, so a push onto an empty queue rotates zero times.
4. `pop()` — `q.popleft()`, the front, which is the newest element.
5. `top()` — `q[0]`, same element without removing it.
6. `empty()` — `len(q) == 0`.
7. The problem guarantees `pop`/`top` are only called on a non-empty stack, so no guards are needed.

## Code

```python
import collections

class MyStack:

    def __init__(self):
        self.q = collections.deque()

    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return len(self.q) == 0
```

## Why it works

The invariant is that `q` always stores the elements in reverse insertion order, newest at the front. `push` restores it in one rotation: the `k` older elements each move from front to back exactly once, which is precisely the cyclic shift that places the new element first while preserving the relative order of the rest. Given the invariant, the queue's front *is* the stack's top, so `pop` and `top` are O(1); the rotation makes `push` O(n) and the deque holds n elements.
