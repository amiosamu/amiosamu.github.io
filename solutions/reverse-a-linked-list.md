---
# Reverse Linked List · Easy · Linked List
# https://leetcode.com/problems/reverse-linked-list/
draft: false
pattern: "Three-pointer in-place reversal"
time: "O(n)"
space: "O(1)"
---

## Description

Given the head of a singly linked list, reverse the list in place and return the head of the reversed list. Every node keeps its value; only the direction of the `next` pointers changes, and no extra list or recursion is used.

**Example**

```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

Explanation: Each node's `next` pointer is flipped to point at its predecessor, so the list comes out in exactly the reverse order it went in.

## Intuition

Reversing a list is just flipping every `next` pointer to point at the node I came from. The
only thing that can go wrong is losing the rest of the list the instant I overwrite
`curr.next`, so I save it first. Nothing else is needed — no extra list, no recursion — because
each node's new successor is exactly the node I visited immediately before it.

## Approach

1. `prev = None` — this is the head of the already-reversed prefix. `curr = head` walks the
   untouched suffix.
2. While `curr` is not `None`, do these four assignments **in this order**:
   - `nxt = curr.next` (save the suffix before it is destroyed),
   - `curr.next = prev` (flip the pointer),
   - `prev = curr` (the reversed prefix grows by one),
   - `curr = nxt` (advance).
3. Swapping steps 1 and 2 is the classic bug: once `curr.next = prev` runs, the rest of the
   list is unreachable.
4. When the loop ends `curr` is `None` and `prev` is the old tail, which is the new head — return
   `prev`, not `curr` and not `head`.
5. Empty list falls out for free: the loop body never runs and `prev` is `None`.

## Code

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
```

## Why it works

The invariant is that at the top of every iteration `prev` is the head of the fully reversed
list of all nodes before `curr`, and `curr` is the head of the untouched remainder. One
iteration moves exactly one node across that boundary and restores the invariant, so when
`curr` runs off the end every node has been moved and `prev` heads the whole reversed list.
Each node is visited once with a constant amount of pointer work, giving O(n) time and O(1)
extra space.
