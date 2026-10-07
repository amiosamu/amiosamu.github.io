---
# Linked List Cycle · Easy · Linked List
# https://leetcode.com/problems/linked-list-cycle/
draft: false
pattern: "Floyd's fast and slow pointers"
time: "O(n)"
space: "O(1)"
---

## Description

Given the head of a linked list, return whether repeatedly following `next` eventually revisits
a node instead of reaching `None`.

**Example**

```
Input: head = [3,2,0,-4], with the last node's next pointing back to the node holding 2
Output: true
```

The last node points back to the node containing `2`, so traversal enters a cycle.

## Intuition

Use a slow pointer that advances one node and a fast pointer that advances two. In an acyclic
list, the fast pointer reaches the end. In a cycle, both pointers eventually enter the loop, where
the fast pointer gains one position per iteration and must meet the slow pointer.

## Approach

1. Initialize `slow` and `fast` to `head`.
2. While `fast` and `fast.next` exist, move `slow` once and `fast` twice.
3. Compare node identity after moving; equal values in different nodes do not indicate a cycle.
4. Return `True` when the pointers meet.
5. Return `False` if the fast pointer reaches the end. Empty and one-node acyclic lists take this
   path without dereferencing a missing node.

## Code

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
```

## Why it works

If the list is acyclic, following `next` must reach `None`, so the loop ends and returns `False`.
If the list has a cycle, the fast pointer enters it no later than the slow pointer. Once both are
inside, their positions modulo the cycle length differ by one less on every iteration because fast
moves one extra step. That difference must become zero, so the pointers meet and the algorithm
returns `True`.

**Complexity**

- **Time:** `O(n)` before reaching the end or detecting a cycle.
- **Space:** `O(1)` auxiliary space.
