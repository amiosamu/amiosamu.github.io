---
# Merge Two Sorted Lists · Easy · Linked List
# https://leetcode.com/problems/merge-two-sorted-lists/
draft: false
pattern: "Dummy head two-pointer merge"
time: "O(n + m)"
space: "O(1)"
---

## Description

Given two linked lists sorted in nondecreasing order, splice their existing nodes into one sorted
list and return its head.

**Example**

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

Repeatedly taking the smaller current head produces `[1,1,2,3,4,4]`.

## Intuition

The smallest unmerged value is always at one of the two current heads. Append the smaller head and
advance only that list. When one list ends, the other list is already a sorted remainder.

A dummy node removes the special case for attaching the first result node. Input nodes are relinked
rather than copied, so the original list chains are mutated.

## Approach

1. Create a temporary `dummy` node and set `tail` to it.
2. While both inputs remain, attach the smaller head and advance that input pointer.
3. Advance `tail` after every attachment. The `<=` comparison keeps equal nodes from `list1` first.
4. Attach the entire non-empty remainder when one input ends.
5. Return `dummy.next`, the first reused input node.

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

The result prefix is sorted and contains exactly the nodes removed from the two input prefixes.
Because each remaining input is sorted, its head is its smallest value, so the smaller of the two
heads is the smallest unmerged node overall. Appending it preserves the invariant. When one input
ends, every node in the other chain is at least the result tail and already sorted, making the final
splice valid. Induction proves the returned chain is the complete sorted merge.

**Complexity**

- **Time:** `O(n + m)` because each input node is linked once.
- **Space:** `O(1)` auxiliary space. Existing nodes are relinked, mutating both input chains.
