---
# Linked List Cycle · Easy · Linked List
# https://leetcode.com/problems/linked-list-cycle/
draft: false
pattern: "Floyd's fast and slow pointers"
time: "O(n)"
space: "O(1)"
---

## Intuition

The obvious solution is a set of visited nodes, which costs O(n) memory. The trick that kills
it: put two runners on the track, one moving one node per step and one moving two. If the list
ends, the fast runner falls off. If it loops, the fast runner keeps lapping the track and closes
the gap on the slow one by exactly one node per step, so a collision is guaranteed — no
bookkeeping required.

## Approach

1. Start `slow = fast = head`.
2. Loop while `fast` and `fast.next` are both non-`None`. Both checks are needed: `fast.next.next`
   dereferences two links, so a single guard would blow up on an even-length acyclic list.
3. Inside the loop advance `slow = slow.next` and `fast = fast.next.next`, then test
   `slow is fast` and return `True` on a match.
4. Test *after* moving, not before — testing first would fire immediately since both start at
   `head`.
5. Compare with `is` (identity), not `==` on values; two distinct nodes can hold the same value.
6. Falling out of the loop means `fast` reached the end, so there is no cycle — return `False`.
   An empty list returns `False` on the first guard.

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

Once both pointers are inside the cycle, the distance from `fast` to `slow` measured forward
around the loop shrinks by exactly one each step (fast gains two, slow gains one), so it must
hit zero — it can never jump over. That bounds the meeting at O(n) steps: at most n steps to get
`slow` into the cycle, then at most one cycle length more. Two pointers is all the memory used,
hence O(1) space.
