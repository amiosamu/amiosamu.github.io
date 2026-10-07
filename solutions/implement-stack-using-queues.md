---
# Implement Stack Using Queues · Easy · Stack
# https://leetcode.com/problems/implement-stack-using-queues/
draft: false
pattern: "Single queue rotated on push"
time: "O(n) push, O(1) pop/top"
space: "O(n)"
---

## Description

Implement a LIFO stack with `push`, `pop`, `top`, and `empty` using only queue operations.

**Example**

```
Input: ["MyStack", "push", "push", "top", "pop", "empty"], [[], [1], [2], [], [], []]
Output: [null, null, null, 2, 2, false]
```

Explanation: `2` was pushed most recently, so both `top()` and `pop()` return it. The stack
then still contains `1`.

## Intuition

A queue exposes its oldest value, while a stack exposes its newest. Keep one queue in reverse
insertion order so its front is always the stack top.

After appending a new value, rotate every older value from front to back. This moves the new
value to the front while preserving the previous stack order behind it.

## Approach

1. Store the stack in one deque `q`, with its logical top at the deque's front.
2. For `push(x)`, append `x`, then rotate the other `len(q) - 1` values from front to
   back. A push into an empty queue rotates zero times.
3. For `pop`, remove the front value; for `top`, read it without removal.
4. Return whether the deque is empty. The API guarantees `pop` and `top` are called only
   when a value exists.

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

Assume `q` stores values from newest to oldest. Appending `x` puts it after all older values;
rotating exactly those older values moves each behind `x` without changing their relative
order. The invariant therefore holds after every push. Under that invariant, the deque's
front is exactly the most recently pushed remaining value, so `pop` and `top` implement LIFO
behavior.

**Complexity**

- **Time:** `O(n)` for `push`; `O(1)` for `pop`, `top`, and `empty`.
- **Space:** `O(n)` for the queue.
