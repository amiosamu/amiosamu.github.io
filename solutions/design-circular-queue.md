---
# Design Circular Queue · Medium · Linked List
# https://leetcode.com/problems/design-circular-queue/
draft: false
pattern: "Fixed array with head and count"
time: "O(1)"
space: "O(k)"
---

## Description

Design a fixed-capacity circular queue supporting `enQueue(value)` and `deQueue()` (add/remove, both returning whether they succeeded), `Front()`/`Rear()` (peek the first/last element, or -1 if empty), and `isEmpty()`/`isFull()`, all in O(1), by reusing a fixed-size buffer and wrapping indices instead of shifting elements.

**Example**

```
Input: ["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"], [[3], [1], [2], [3], [4], [], [], [], [4], []]
Output: [null, true, true, true, false, 3, true, true, true, 4]
```

Explanation: With capacity 3, the first three enQueues (1, 2, 3) succeed and fill the queue, so enQueue(4) fails (false); Rear() reports 3 and isFull() is true; deQueue() frees a slot so enQueue(4) then succeeds, making Rear() report 4.

## Intuition

A queue on a plain list makes `deQueue` O(k) because everything shifts left. Since the capacity
is fixed, nothing needs to move: keep the buffer still and move the *window* instead, wrapping
indices with `% capacity`. The classic head/tail pair has the ambiguity that head == tail means
both empty and full, so I store `head` and `count` instead — the tail is derived, and emptiness
and fullness are just `count == 0` and `count == capacity`.

## Approach

1. `__init__(k)`: `self.q = [0] * k`, `self.capacity = k`, `self.head = 0`, `self.count = 0`.
   The buffer is allocated once and never resized.
2. `enQueue(value)`: return `False` if `self.count == self.capacity`. Otherwise the free slot is
   `(self.head + self.count) % self.capacity` — write `value` there, `self.count += 1`, return
   `True`. Note that the write index is computed from head plus length, so no separate tail
   variable can drift out of sync.
3. `deQueue()`: return `False` if `self.count == 0`. Otherwise
   `self.head = (self.head + 1) % self.capacity` and `self.count -= 1`, return `True`. The stale
   value is left in the array on purpose; it is unreachable because it is outside the window.
4. `Front()`: `-1` if empty, else `self.q[self.head]`.
5. `Rear()`: `-1` if empty, else `self.q[(self.head + self.count - 1) % self.capacity]` — the
   last written slot, one before the free one.
6. `isEmpty()` / `isFull()` are direct reads of `count`.
7. Every method that can fail checks `count` first; that check, not the modulo, is what keeps
   the window from overlapping itself.

## Code

```python
class MyCircularQueue:
    def __init__(self, k: int):
        self.q = [0] * k
        self.capacity = k
        self.head = 0
        self.count = 0

    def enQueue(self, value: int) -> bool:
        if self.count == self.capacity:
            return False
        self.q[(self.head + self.count) % self.capacity] = value
        self.count += 1
        return True

    def deQueue(self) -> bool:
        if self.count == 0:
            return False
        self.head = (self.head + 1) % self.capacity
        self.count -= 1
        return True

    def Front(self) -> int:
        return -1 if self.count == 0 else self.q[self.head]

    def Rear(self) -> int:
        return -1 if self.count == 0 else self.q[(self.head + self.count - 1) % self.capacity]

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull(self) -> bool:
        return self.count == self.capacity
```

## Why it works

The invariant is that the live elements occupy exactly the `count` slots starting at `head`,
read modulo `capacity`, oldest first. `enQueue` only writes the slot one past that run and only
when `count < capacity`, so it can never overwrite a live element; `deQueue` only shrinks the
run from the front. Storing the length rather than a tail index removes the empty/full collision
entirely, and since every operation is a couple of arithmetic ops on fixed state, all of them
are O(1) with O(k) space for the buffer.
