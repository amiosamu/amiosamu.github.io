---
# Reverse Nodes In K Group · Hard · Linked List
# https://leetcode.com/problems/reverse-nodes-in-k-group/
draft: false
pattern: "Reverse fixed blocks, relink boundaries"
time: "O(n)"
space: "O(1)"
---

## Intuition

Reversing a block of `k` nodes is the standard three-pointer loop; everything hard here is at
the seams. Two facts make it manageable: you must *check* that a full group of `k` exists before
touching it, and after reversing a group the node that was its head becomes its tail — which is
precisely the anchor for the next group. So keep one pointer `groupPrev` on the node just before
the current group, walk `k` links ahead to find `kth`, reverse into the already-known successor,
and the boundary rewiring is two assignments.

## Approach

1. `dummy = ListNode(0, head)` and `groupPrev = dummy`. The dummy gives the first group a
   predecessor to hang from, so the "attach the reversed group" step is identical for group one
   and group seven.
2. In an outer `while True`: set `kth = groupPrev` and advance it `k` times with
   `for _ in range(k): kth = kth.next; if not kth: return dummy.next`. Returning from inside the
   count is the whole leftover-tail rule — a partial group is left untouched, and everything
   before it has already been reversed and linked.
3. `groupNext = kth.next` — the first node beyond this group, captured before any rewiring
   destroys it.
4. Reverse the group by seeding `prev = groupNext` instead of `None`: with `cur = groupPrev.next`,
   loop `while cur is not groupNext` doing `nxt = cur.next`, `cur.next = prev`, `prev = cur`,
   `cur = nxt`. Seeding with `groupNext` means the group's old head gets its correct forward
   link for free — no separate reattachment of the tail.
5. Relink the front boundary in this order: `tmp = groupPrev.next` (the old head, now the
   group's tail), then `groupPrev.next = kth` (the old kth is now the group's head), then
   `groupPrev = tmp` to anchor the next iteration.
   Saving `tmp` first is mandatory — after `groupPrev.next = kth` the old head is unreachable.
6. Use `is not` for the loop-exit comparison, node identity, not `==` on values.

## Code

```python
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        groupPrev = dummy

        while True:
            kth = groupPrev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            groupNext = kth.next

            prev, cur = groupNext, groupPrev.next
            while cur is not groupNext:
                nxt = cur.next
                cur.next = prev
                prev = cur
                cur = nxt

            tmp = groupPrev.next
            groupPrev.next = kth
            groupPrev = tmp
```

## Why it works

The counting loop guarantees the invariant that a group is only reversed once `k` nodes are
known to exist, so a shorter final run falls out of the function with the list already correct
in front of it. Seeding `prev = groupNext` makes the reversal produce a segment whose tail
already points at the untouched remainder, so the only edge left to fix is the one entering the
group, which `groupPrev.next = kth` supplies — and `groupPrev = tmp` re-establishes the same
precondition for the next block. Every node is visited once by the counting walk and once by
the reversal walk with a fixed set of pointers, so O(n) time and O(1) space.
