---
# LRU Cache · Medium · Linked List
# https://leetcode.com/problems/lru-cache/
draft: false
pattern: "Hash map plus doubly linked list"
time: "O(1)"
space: "O(capacity)"
---

## Intuition

Two requirements pull in different directions: O(1) lookup by key, and O(1) "which key was used
longest ago?". A dict gives the first and knows nothing about order; an ordered list gives the
second but searching it is O(n). Combine them — the dict maps key to a *node*, and the nodes
live in a doubly linked list ordered by recency. Because the dict hands you the node directly,
unlinking it is O(1), and that is the only reason the list must be doubly linked: you need
`node.prev` without walking.

## Approach

1. `Node` holds `key`, `val`, `prev`, `next`. It stores the key as well as the value because
   eviction starts from a node and has to delete the matching dict entry.
2. `__init__`: `self.cap`, `self.cache = {}`, and two sentinels `self.left` and `self.right`
   wired as `left <-> right`. `left.next` is always the least recently used node and
   `right.prev` the most recently used. The sentinels are the dummy heads of this problem — with
   them, insert and remove never touch a `None` pointer, so there is no first-node or last-node
   special case anywhere.
3. `_remove(node)`: `node.prev.next = node.next`, then `node.next.prev = node.prev`.
4. `_insert(node)` puts it at the MRU end, in this order:
   `prev, nxt = self.right.prev, self.right`; `prev.next = node`; `node.prev = prev`;
   `node.next = nxt`; `nxt.prev = node`. Set the node's own two pointers before overwriting
   `nxt.prev`, or the old neighbour is lost.
5. `get(key)`: miss returns `-1`. On a hit, `_remove` then `_insert` the node to move it to the
   MRU end, and return `node.val`. A read counts as a use — forgetting this is the classic bug.
6. `put(key, value)`: if the key exists, `_remove` its old node (a fresh node is then built, so
   the value update and the reordering are the same code path). Create the node, store it in
   `self.cache`, `_insert` it.
7. Then evict while over capacity: `lru = self.left.next`, `_remove(lru)`,
   `del self.cache[lru.key]`. Check `len(self.cache) > self.cap` *after* inserting, so the new
   key is never the one evicted.

## Code

```python
class Node:
    def __init__(self, key: int, val: int):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.left = Node(0, 0)
        self.right = Node(0, 0)
        self.left.next = self.right
        self.right.prev = self.left

    def _remove(self, node: Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node: Node) -> None:
        prev, nxt = self.right.prev, self.right
        prev.next = node
        node.prev = prev
        node.next = nxt
        nxt.prev = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._insert(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.left.next
            self._remove(lru)
            del self.cache[lru.key]
```

## Why it works

The invariant is that the list between the sentinels holds exactly the nodes in `self.cache`,
sorted by last access with the oldest adjacent to `left`. Every operation that constitutes a
"use" — a hit in `get`, any `put` — removes the node and re-inserts it at the `right` end, so
the ordering stays exact, which makes `left.next` provably the least recently used node at
eviction time. All four steps (dict lookup, unlink, splice, dict delete) are constant time with
no scanning, so every public method is O(1), and the structure holds at most `capacity` nodes
plus two sentinels, O(capacity) space.
