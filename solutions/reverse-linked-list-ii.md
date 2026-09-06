---
# Reverse Linked List II · Medium · Linked List
# https://leetcode.com/problems/reverse-linked-list-ii/
draft: false
pattern: "Head insertion behind a fixed pivot"
time: "O(n)"
space: "O(1)"
---

## Intuition

The sublist reversal itself is easy; the stitching around it is what breaks. Instead of
reversing the segment separately and then reattaching three loose ends, keep `prev` — the node
just before position `left` — pinned and repeatedly yank the node *after* `cur` out of the chain
and re-insert it directly behind `prev`. Each such splice pushes one more node to the front of
the segment, so after `right - left` splices the segment is reversed and it never became
detached, which means there is nothing to reattach.

## Approach

1. `dummy = ListNode(0, head)`; the dummy exists because `left` can be 1, and then the node
   being moved has no predecessor — the dummy manufactures one so the loop body needs no
   special case.
2. Walk `prev = dummy` forward `left - 1` times. `prev` now sits immediately before position
   `left` and stays there for the entire rest of the routine.
3. `cur = prev.next`. This is the node currently at position `left`; it will end up as the *last*
   node of the reversed segment and it also stays put as a variable — it just drifts backwards
   through the list.
4. Repeat `right - left` times, in exactly this order:
   - `nxt = cur.next` — the node to move,
   - `cur.next = nxt.next` — unhook it, closing the gap,
   - `nxt.next = prev.next` — point it at the current front of the segment,
   - `prev.next = nxt` — make it the new front.
   Assigning `nxt.next` before `prev.next` matters: reversing those two lines makes `nxt` point
   at itself and the list turns into a self-loop.
5. Do not re-read `cur` inside the loop; it is deliberately never advanced.
6. Return `dummy.next`, not `head` — when `left == 1` the original head is no longer first.

## Code

```python
class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next

        cur = prev.next
        for _ in range(right - left):
            nxt = cur.next
            cur.next = nxt.next
            nxt.next = prev.next
            prev.next = nxt
        return dummy.next
```

## Why it works

The invariant after `i` splices is that positions `left..left+i` of the list hold the original
nodes `left..left+i` in reverse order, with `cur` still the tail of that run and `prev.next`
its head; moving the node right after `cur` to the front extends the run by one while
preserving it. After `right - left` iterations the run covers the whole requested range, and
because `prev.next` and `cur.next` were rewritten in place, the prefix and suffix were never
disconnected. One walk of at most `right` links plus `right - left` constant-time splices gives
O(n) time and O(1) space.
