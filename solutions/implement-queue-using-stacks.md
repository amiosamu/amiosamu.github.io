---
# Implement Queue using Stacks · Easy · Stack
# https://leetcode.com/problems/implement-queue-using-stacks
draft: false
pattern: "Two stacks, amortized transfer"
time: "O(1) amortized per op"
space: "O(n)"
---

## Description

Implement a first-in-first-out (FIFO) queue — supporting `push`, `pop`, `peek`, and `empty` — using only the standard operations of a stack as the underlying storage.

**Example**

```
Input: ["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []]
Output: [null, null, null, 1, 1, false]
```

Explanation: after pushing 1 then 2, `peek()` and `pop()` both return 1 because it was pushed first (FIFO order); after the pop only 2 remains, so `empty()` is `false`.

## Intuition

Pouring one stack into another reverses it, and reversing "newest first" gives "oldest first" — which is exactly queue order. So I keep two stacks: `inp` for arrivals and `out` for departures. The important part is *when* to pour: only when `out` runs dry, never on every read. That way each element is moved across exactly once in its lifetime, which makes the cost O(1) amortized instead of O(n) per call.

## Approach

1. Keep two lists: `inp` (push side, newest on top) and `out` (pop side, oldest on top).
2. `push(x)` — append to `inp`. Nothing else; never touch `out` here.
3. Helper `_shift()` — if `out` is empty, pop every element off `inp` and push it onto `out`, which reverses the block into queue order. If `out` is *not* empty, do nothing: its contents are all older than anything in `inp`, so they must be served first.
4. `pop()` — call `_shift()`, then `out.pop()`.
5. `peek()` — call `_shift()`, then return `out[-1]`.
6. `empty()` — true only when both stacks are empty.
7. The guarded refill in step 3 is the whole solution; refilling unconditionally would interleave old and new elements and break FIFO order.

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

The invariant is that the queue's contents, front to back, are `out` read top-to-bottom followed by `inp` read bottom-to-top; every element in `out` arrived before every element in `inp`. Refilling only when `out` is empty preserves that, because a full transfer of a contiguous block of arrivals keeps their relative order after reversal. Each element is pushed to `inp`, popped from `inp`, pushed to `out`, and popped from `out` exactly once — four O(1) steps over its life — so m operations cost O(m) total, i.e. O(1) amortized.
