---
# Remove Nth Node From End of List · Medium · Linked List
# https://leetcode.com/problems/remove-nth-node-from-end-of-list/
draft: false
pattern: "Two pointers n apart with dummy"
time: "O(n)"
space: "O(1)"
---

## Intuition

"nth from the end" is only awkward because a singly linked list has no length and no way back.
Fix the gap instead of the position: put two pointers exactly `n` links apart and slide them
together. When the leading one falls off the end, the trailing one is sitting `n` nodes from the
end — one pass, no length count. Deleting requires the node *before* the target, so the trailing
pointer starts at a dummy rather than at `head`.

## Approach

1. `dummy = ListNode(0, head)` and `slow = dummy`. The dummy is there purely so that removing
   the head itself needs no special case: it gives the head a predecessor to rewire.
2. `fast = head`, then advance it `n` times with `for _ in range(n): fast = fast.next`. The
   constraints guarantee `1 <= n <= len`, so this cannot run past the end.
3. Now `fast` is `n` nodes ahead of `slow.next`. Walk both while `fast` is non-`None`:
   `slow = slow.next`, `fast = fast.next`.
4. When `fast` becomes `None`, the invariant "`fast` is `n` nodes past `slow`" places `slow.next`
   exactly at the node to delete.
5. Unlink with `slow.next = slow.next.next`.
6. Return `dummy.next`, not `head` — if the head was the node removed, `head` is now dangling
   while `dummy.next` is the correct new head.

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

After the priming loop the offset between `slow` and `fast` is fixed at `n + 1` links (`slow`
sits one behind `head`), and the shared advance preserves it. So the moment `fast` is one past
the last node, `slow` is `n + 1` from that same point, i.e. `slow.next` is the nth from the end.
Both loops together traverse the list once, so O(n) time with three pointers of extra state,
O(1) space.
