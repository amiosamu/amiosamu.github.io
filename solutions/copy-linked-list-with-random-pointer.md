---
# Copy List With Random Pointer · Medium · Linked List
# https://leetcode.com/problems/copy-list-with-random-pointer/
draft: false
pattern: "Hash map original node to clone"
time: "O(n)"
space: "O(n)"
---

## Description

Given a linked list whose nodes have both `next` and `random` pointers, return a deep copy.
Every copied pointer must refer to a copied node, never an original node.

**Example**

```
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

Each pair is `[value, random-target index]`. The output has the same links, but all nodes are
newly allocated.

## Intuition

A `random` pointer may point forward, so its clone might not exist during a one-pass copy.
Allocate all clone nodes first, then connect their pointers in a second pass. A map from each
original object to its clone resolves both `next` and `random` targets in constant time.

## Approach

1. Initialize `clone = {None: None}` so null pointers need no special case.
2. In the first pass, create one `Node(cur.val)` for each original and map the original object
   to it. Values cannot be used as keys because they need not be unique.
3. In the second pass, assign the cloned node's `next` and `random` through map lookups. Every
   possible target now has an entry.
4. Return `clone[head]`, which also returns `None` for an empty list. The original list is not
   mutated.

## Code

```python
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        clone = {None: None}
        cur = head
        while cur:
            clone[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            clone[cur].next = clone[cur.next]
            clone[cur].random = clone[cur.random]
            cur = cur.next
        return clone[head]
```

## Why it works

After the first pass, `clone` is a one-to-one mapping from original nodes to new nodes with the
same values. During the second pass, each original edge `cur -> target` becomes exactly the edge
`clone[cur] -> clone[target]`. Thus both pointer relations are preserved under the mapping, and
because all mapped objects are new, the result is a deep copy.

**Complexity**

- **Time:** `O(n)` for two list traversals.
- **Space:** `O(n)` auxiliary map space and `O(n)` output space.
