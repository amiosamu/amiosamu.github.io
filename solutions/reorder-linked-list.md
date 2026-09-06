---
# Reorder List · Medium · Linked List
# https://leetcode.com/problems/reorder-list/
draft: false
pattern: "Split, reverse, weave halves"
time: "O(n)"
space: "O(1)"
---

## Description

Given the head of a linked list with nodes L0, L1, ..., Ln-1, reorder it in place, without changing any node's value, into the order L0, Ln-1, L1, Ln-2, L2, Ln-3, ...

**Example**

```
Input: head = [1,2,3,4]
Output: [1,4,2,3]
```

Explanation: With L0=1, L1=2, L2=3, L3=4, the target order L0, L3, L1, L2 is 1, 4, 2, 3.

## Intuition

The target order `L0 → Ln → L1 → Ln-1 → …` alternates between walking forward from the front
and backward from the back. A singly linked list cannot walk backward, so the fix is to make
the back half walk forward instead: cut the list in the middle, reverse the second half, and
then zip the two halves together one node at a time. Copying node pointers into an array would
also work but costs O(n) memory, and the whole point is doing it in place.

## Approach

1. **Find the split.** `slow = head`, `fast = head.next`; while `fast and fast.next`, advance
   `slow = slow.next` and `fast = fast.next.next`. Seeding `fast` one ahead makes `slow` land on
   the last node of the first half for both even and odd lengths, so the first half is never
   shorter than the second.
2. **Cut.** `second = slow.next`, then `slow.next = None`. Forgetting the cut leaves a cycle
   after the weave and the judge hangs.
3. **Reverse the second half** with the standard three-pointer loop: `prev = None`; while
   `second`: `nxt = second.next`, `second.next = prev`, `prev = second`, `second = nxt`. After
   it, `prev` is the head of the reversed tail.
4. **Weave.** Set `first, second = head, prev`. While `second` is non-`None`, do the four
   assignments in this order:
   - `n1, n2 = first.next, second.next` (save both continuations first),
   - `first.next = second`,
   - `second.next = n1`,
   - `first, second = n1, n2`.
5. Loop on `second`, not on `first`: with odd length the first half is one node longer, and that
   extra node is the correct final tail whose `next` is already `None`.
6. Single-node input is safe — `fast` starts as `None`, `second` becomes `None`, and the weave
   loop never runs.

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

After the cut, the first half holds `L0…Lm` in order and the reversed second half holds
`Ln, Ln-1, …` in order, so alternately taking one node from each produces exactly
`L0, Ln, L1, Ln-1, …`. Because the first half is chosen to be the same length or one longer,
the second half runs out first, and its last node's `next` — set from `n1`, which is `None` at
that point — terminates the list correctly. Each of the three phases is a single linear scan
with only a fixed set of pointers, so O(n) time and O(1) space.
