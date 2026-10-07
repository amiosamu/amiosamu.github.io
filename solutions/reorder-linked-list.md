---
# Reorder List · Medium · Linked List
# https://leetcode.com/problems/reorder-list/
draft: false
pattern: "Split, reverse, weave halves"
time: "O(n)"
space: "O(1)"
---

## Description

Given a linked list `L0 -> L1 -> ... -> Ln-1`, reorder its existing nodes in place as
`L0 -> Ln-1 -> L1 -> Ln-2 -> ...`. Do not change node values.

**Example**

```
Input: head = [1,2,3,4]
Output: [1,4,2,3]
```

Explanation: Alternating from the front and back gives `1, 4, 2, 3`.

## Intuition

The desired order alternates between the list's front and back. Since a singly linked list cannot
walk backward, split it at the middle and reverse the second half. Both halves can then be traversed
forward and woven together. Cutting before reversal is essential to prevent a cycle.

## Approach

1. Run `slow` one step at a time and `fast` two steps at a time, starting `fast` at `head.next`.
   This leaves `slow` at the final node of a first half that is at least as long as the second.
2. Save `second = slow.next` and set `slow.next = None`, separating the halves.
3. Reverse the second half with `prev`, `second`, and `nxt`; afterward `prev` starts with the
   original tail.
4. Set `first, second = head, prev`. Save both next pointers, link one node from the second half
   after one from the first, and advance to the saved continuations.
5. Stop when `second` is exhausted. For odd lengths, the first half's extra node is already the
   correctly terminated tail. The function mutates links and returns nothing.

## Code

```python
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        second = slow.next
        slow.next = None

        prev = None
        while second:
            nxt = second.next
            second.next = prev
            prev = second
            second = nxt

        first, second = head, prev
        while second:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2
```

## Why it works

The split preserves `L0, L1, ...` in the first half, while reversal orders the second half as
`Ln-1, Ln-2, ...`. Each weave iteration appends the next node from each of these sequences, so
the constructed prefix has exactly the required alternating order. The first half has equal size
or one extra node, so the second half is exhausted first and every node appears once. Since the
halves were cut before weaving, the final list also terminates without a cycle.

**Complexity**

- **Time:** `O(n)` across the split, reversal, and weave passes.
- **Space:** `O(1)` auxiliary space.
