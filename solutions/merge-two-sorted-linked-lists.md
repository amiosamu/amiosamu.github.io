---
# Merge Two Sorted Lists · Easy · Linked List
# https://leetcode.com/problems/merge-two-sorted-lists/
draft: false
pattern: "Dummy head two-pointer merge"
time: "O(n + m)"
space: "O(1)"
---

## Description

Given the heads of two linked lists that are each already sorted in non-decreasing order, merge them into a single sorted list by splicing together the existing nodes — no new nodes are allocated — and return the head of the merged list.

**Example**

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

Explanation: Repeatedly taking the smaller of the two current heads (1, then 1, then 2, then 3, then 4, then 4) yields the merged sequence [1,1,2,3,4,4].

## Intuition

Both lists are already sorted, so the smallest node overall is always at the head of one of
them. Repeatedly take that head and splice it onto the output — no comparison beyond the two
front nodes is ever needed. There is no reason to allocate new nodes: I am relinking the
existing ones, so the whole thing runs in constant extra space.

## Approach

1. Create `dummy = ListNode()` and `tail = dummy`. The dummy exists so that appending the very
   first node is the same code as appending the tenth — without it I would need a branch for
   "is the result still empty?" on every step.
2. While both `list1` and `list2` are non-empty: compare `list1.val <= list2.val`.
   - If `list1` wins: `tail.next = list1`, then `list1 = list1.next`.
   - Otherwise: `tail.next = list2`, then `list2 = list2.next`.
   - Either way, finish with `tail = tail.next`.
3. Use `<=`, not `<`, so equal values keep `list1`'s node first — the merge stays stable, which
   matters if you reuse this routine inside merge sort.
4. When the loop ends at most one list still has nodes, and they are all larger than everything
   emitted so far, so append the whole remaining chain at once: `tail.next = list1 if list1 else list2`.
5. Return `dummy.next`, never `dummy` — and never `head`, which does not exist here.

## Code

```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2
        return dummy.next
```

## Why it works

The invariant is that everything hanging off `dummy` is sorted and every value in it is `<=`
both `list1.val` and `list2.val`. Because each input is sorted, `min(list1.val, list2.val)` is
the smallest value not yet emitted, so appending it preserves the invariant; the final splice
is safe for the same reason. Every node is examined and linked exactly once, so the cost is
O(n + m) time and O(1) auxiliary space.
