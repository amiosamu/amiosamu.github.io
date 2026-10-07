---
# Reverse Linked List II · Medium · Linked List
# https://leetcode.com/problems/reverse-linked-list-ii/
draft: false
pattern: "Head insertion behind a fixed pivot"
time: "O(n)"
space: "O(1)"
---

## Description

Given a linked list and 1-indexed positions `left <= right`, reverse the nodes in that inclusive
range and return the head. Nodes outside the range must retain their order.

**Example**

```
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]
```

Explanation: Reversing the values at positions `2..4` changes `[2,3,4]` to `[4,3,2]`.

## Intuition

Keep `prev` fixed immediately before the range and `cur` fixed at its original first node. Move
each node after `cur` to the front of the range. Every head insertion grows the reversed prefix,
while `cur` becomes the range's tail. The segment remains connected to both surrounding portions
throughout the operation.

## Approach

1. Create a dummy node and advance `prev` `left - 1` links, leaving it immediately before the
   range. Set `cur = prev.next`.
2. Repeat `right - left` times. Save `nxt = cur.next`, unlink it with
   `cur.next = nxt.next`, and insert it after `prev` with the remaining two assignments.
3. Keep both `prev` and `cur` fixed. The former marks the insertion point; the latter becomes
   the reversed range's tail and remains connected to the untouched suffix.
4. Return `dummy.next`, which handles `left == 1`. The original list links are mutated in place;
   when `left == right`, no splice is performed.

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

After `i` splices, `prev.next` heads the reverse of the first `i + 1` original range nodes, and
`cur` is its tail. The next original range node is `cur.next`; moving it after `prev` extends the
reversed sequence by one and leaves `cur.next` pointing to the unprocessed remainder. After
`right - left` splices, that sequence covers the entire requested range, while its prefix and
suffix links remain intact.

**Complexity**

- **Time:** `O(n)` in the worst case.
- **Space:** `O(1)` auxiliary space.
