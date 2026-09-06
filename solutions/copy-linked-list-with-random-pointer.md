---
# Copy List With Random Pointer · Medium · Linked List
# https://leetcode.com/problems/copy-list-with-random-pointer/
draft: false
pattern: "Hash map original node to clone"
time: "O(n)"
space: "O(n)"
---

## Description

Given the head of a linked list where each node additionally has a `random` pointer that can point to any node in the list or to null, build and return a deep copy of the list — a completely new set of nodes with the same values and the same relative `next`/`random` structure.

**Example**

```
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]  (each pair is [val, index the node's random pointer targets])
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

Explanation: The copy has the same values in the same order and the same random targets (e.g. the copied node with val 13 still points its random pointer at the copied node with val 7 at index 0), but every node object is newly allocated.

## Intuition

The hard part is not copying values, it is that a `random` pointer can point forward to a node
that does not exist yet when you reach it. One pass cannot resolve those references, so split
the job: first create every clone with no links at all, then make a second pass where every
target already exists and each pointer becomes a dictionary lookup. The map from original node
to its clone is the whole solution — it turns "which copy corresponds to this node?" into O(1).

## Approach

1. Build `clone = {None: None}`. Seeding the `None` key is the trick that removes every null
   check later: a `next` or `random` of `None` maps straight to `None`.
2. **Pass one.** Walk `cur = head` to the end and set `clone[cur] = Node(cur.val)`. Do not touch
   `next` or `random` here — the point is that after this pass every node in the list has a
   counterpart.
3. **Pass two.** Walk `cur = head` again and wire both pointers by lookup:
   `clone[cur].next = clone[cur.next]` and `clone[cur].random = clone[cur.random]`.
   Both are safe now because pass one covered every reachable node, and `random` can only point
   at a node in this list or at `None`.
4. Return `clone[head]`. With the `None` sentinel in the map this also returns `None` for an
   empty list, so no special case is needed.
5. Key the dictionary on the node objects themselves, not on `val` — values are not unique, and
   `Node` hashes by identity by default, which is exactly what I want here.

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

Separating allocation from linking is what makes the forward references legal: by the time any
pointer is assigned, the entire node set exists, so `clone[x]` is defined for every `x` the
original list can name. The copy is structurally identical because each edge of the original
is mapped through the same bijection between originals and clones, so the two graphs are
isomorphic. Two linear passes and one entry per node give O(n) time and O(n) space — the map is
the price of avoiding the O(1)-space interleave-and-split variant.
