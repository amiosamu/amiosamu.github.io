---
# Remove Nth Node From End of List · Medium · Linked List
# https://leetcode.com/problems/remove-nth-node-from-end-of-list/
draft: false
pattern: "Two pointers n apart with dummy"
time: "O(n)"
space: "O(1)"
---

## Description

Given a linked-list head and integer `n`, remove the `n`th node from the end and return the new
head.

**Example**

```
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

Explanation: The second node from the end contains `4`, so unlinking it leaves `[1,2,3,5]`.

## Intuition

A singly linked list cannot move backward from the tail. Instead, keep a fixed gap between two
pointers: advance `fast` by `n` nodes, then move `fast` and `slow` together. Starting `slow` at a
dummy node makes it stop immediately before the target, including when the target is the head.

## Approach

1. Create `dummy = ListNode(0, head)`, set `slow = dummy`, and set `fast = head`.
2. Advance `fast` exactly `n` times. Valid input guarantees these advances are defined.
3. Move both pointers until `fast` is `None`. At that point `slow.next` is the target node.
4. Bypass the target with `slow.next = slow.next.next` and return `dummy.next`. This mutates one
   link in the original list; the dummy handles removal of the original head.

## Code

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        slow = dummy
        fast = head
        for _ in range(n):
            fast = fast.next
        while fast:
            slow = slow.next
            fast = fast.next
        slow.next = slow.next.next
        return dummy.next
```

## Why it works

After priming, `fast` is `n` nodes ahead of `slow.next`. Advancing both pointers preserves this
relationship. When `fast` reaches the position after the tail, exactly `n` nodes remain from
`slow.next` through the tail, so `slow.next` is the `n`th node from the end. Bypassing it preserves
the order and links of every other node.

**Complexity**

- **Time:** `O(L)` for a list of length `L`.
- **Space:** `O(1)` auxiliary space.
