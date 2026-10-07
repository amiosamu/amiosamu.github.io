---
# Reverse Linked List · Easy · Linked List
# https://leetcode.com/problems/reverse-linked-list/
draft: false
pattern: "Three-pointer in-place reversal"
time: "O(n)"
space: "O(1)"
---

## Description

Given the head of a singly linked list, reverse its links in place and return the new head. Node
values remain unchanged.

**Example**

```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

Explanation: Reversing every `next` pointer changes the traversal order to `[5,4,3,2,1]`.

## Intuition

Each node's new successor is its predecessor in the original list. Before changing `curr.next`,
save the original successor; otherwise the untouched suffix becomes unreachable. Two pointers can
then represent the reversed prefix and untouched suffix throughout the scan.

## Approach

1. Initialize `prev = None` for the reversed prefix and `curr = head` for the untouched suffix.
2. While `curr` exists, save `nxt = curr.next`, point `curr.next` to `prev`, and then advance
   `prev` and `curr` to `curr` and `nxt`.
3. Return `prev`, which is the original tail and new head. For an empty list, the loop is skipped
   and `None` is returned.
4. The operation mutates every original `next` pointer and allocates no list nodes.

## Code

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
```

## Why it works

At every iteration, `prev` heads the reversed form of all nodes already processed, while `curr`
heads the untouched remainder. Saving `nxt` preserves access to that remainder, and redirecting
`curr.next` moves exactly one node to the reversed prefix. When `curr` becomes `None`, no untouched
nodes remain, so `prev` heads the complete reversed list.

**Complexity**

- **Time:** `O(n)` because each node is processed once.
- **Space:** `O(1)` auxiliary space.
