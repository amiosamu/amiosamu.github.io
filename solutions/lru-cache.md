---
# LRU Cache · Medium · Linked List
# https://leetcode.com/problems/lru-cache/
draft: false
pattern: "Hash map plus doubly linked list"
time: "O(1)"
space: "O(capacity)"
---

## Description

Design a fixed-capacity cache with `get` and `put` operations in `O(1)` average time. Accessing or
updating a key makes it most recently used; inserting beyond capacity evicts the least recently
used key.

**Example**

```
Input: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output: [null, null, null, 1, null, -1, null, -1, 3, 4]
```

With capacity 2, inserting key 3 evicts key 2. Inserting key 4 then evicts key 1.

## Intuition

A dictionary provides constant-time lookup but does not maintain recency. A doubly linked list can
maintain recency and remove a known node in constant time. Combining them satisfies both needs.

Sentinel nodes make `left.next` the least recently used node and `right.prev` the most recently
used node without special cases for empty ends.

## Approach

1. Store each key's `Node` in `cache`; link all nodes between `left` and `right` sentinels.
2. `_remove` reconnects a node's two neighbors. `_insert` places a node before `right`, the MRU end.
3. On a `get` hit, move the node to the MRU end and return its value; return `-1` on a miss.
4. On `put`, unlink an existing key if necessary, create its updated node, and place it at MRU.
5. If capacity is exceeded, remove `left.next` and delete its key from `cache`.

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

The invariant is that the linked list contains exactly the dictionary's nodes in increasing order
of recency. It holds after initialization. A successful access or update removes its node from the
current position and inserts it at the MRU end, preserving both membership and order. Therefore,
when eviction is required, `left.next` is the least recently used key. Removing it from both data
structures restores the invariant and the capacity bound.

**Complexity**

- **Time:** `O(1)` average time for both `get` and `put`.
- **Space:** `O(capacity)` for the dictionary and linked-list nodes.
