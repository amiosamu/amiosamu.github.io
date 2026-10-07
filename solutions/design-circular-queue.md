---
# Design Circular Queue · Medium · Linked List
# https://leetcode.com/problems/design-circular-queue/
draft: false
pattern: "Fixed array with head and count"
time: "O(1)"
space: "O(k)"
---

## Description

Design a fixed-capacity circular queue. It must enqueue, dequeue, inspect both ends, and
report empty or full status without shifting stored values.

**Example**

```
Input:
operations = ["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue",
              "Rear", "isFull", "deQueue", "enQueue", "Rear"]
arguments = [[3], [1], [2], [3], [4], [], [], [], [4], []]
Output: [null, true, true, true, false, 3, true, true, true, 4]
```

The first three values fill the queue. Enqueuing 4 then fails, but succeeds after one
dequeue frees a slot; 4 becomes the rear value.

## Intuition

A fixed array can be reused by wrapping logical positions modulo its capacity. `head`
identifies the front slot, while `count` distinguishes an empty queue from a full one and
determines the next free slot. Dequeue advances the logical window rather than shifting
elements; stale array values remain inaccessible outside that window.

## Approach

1. Allocate a `k`-element buffer and initialize `head = 0` and `count = 0`.
2. To enqueue, reject a full queue; otherwise write at
   `(head + count) % capacity` and increment `count`.
3. To dequeue, reject an empty queue; otherwise advance `head` modulo `capacity` and
   decrement `count`. The old value need not be erased.
4. Read the front at `head` and the rear at `(head + count - 1) % capacity`, returning
   `-1` when empty. Empty and full checks compare `count` with `0` and `capacity`.
5. Leave dequeued values in the buffer: `count` excludes those stale slots, so clearing
   them would not change any observable result.

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

The queue's live values occupy exactly `count` consecutive logical slots beginning at
`head`, interpreted modulo `capacity`. Enqueue writes immediately after that range only
when space exists, so it cannot overwrite a live value. Dequeue excludes the first slot by
advancing `head`. Both operations preserve order and the invariant, which makes the front,
rear, empty, and full formulas exact.

**Complexity**

- **Time:** `O(1)` for every operation.
- **Space:** `O(k)` for a queue of capacity `k`.
