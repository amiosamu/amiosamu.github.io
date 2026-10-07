---
# Insert Greatest Common Divisors in Linked List · Medium · Math & Geometry
# https://leetcode.com/problems/insert-greatest-common-divisors-in-linked-list/
draft: false
pattern: "Pairwise walk with Euclid's gcd"
time: "O(n log M)"
space: "O(1)"
---

## Description

Given a linked list of positive integers, insert the greatest common divisor of each pair of
adjacent original nodes between them. Return the modified list.

**Example**

```
Input: head = [18,6,10,3]
Output: [18,6,6,2,10,1,3]
```

Explanation: The inserted values are `gcd(18,6) = 6`, `gcd(6,10) = 2`, and
`gcd(10,3) = 1`.

## Intuition

Each original adjacent pair can be processed during one list traversal. Euclid's algorithm
computes its greatest common divisor without changing either node value.

After inserting a node, the cursor must advance two links to the next original node. Moving
only one link would treat an inserted node as part of the next pair and insert extra values.
The operation mutates the list by adding nodes but preserves its original nodes and head.

## Approach

1. Set `cur = head` and continue while `cur.next` exists. A one-node list skips the loop.
2. Copy the adjacent values into `a` and `b`, then run Euclid's updates until `a` is their
   greatest common divisor.
3. Set `cur.next = ListNode(a, cur.next)` to insert the new node while retaining the old
   successor.
4. Advance with `cur = cur.next.next` to reach that original successor, then return the
   unchanged head after all original pairs are processed.

## Code

```python
class Solution:
    def insertGreatestCommonDivisors(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur = head
        while cur.next:
            a, b = cur.val, cur.next.val
            while b:
                a, b = b, a % b
            cur.next = ListNode(a, cur.next)
            cur = cur.next.next
        return head
```

## Why it works

At the start of every iteration, `cur` is an original node and every original pair before it
has exactly one inserted node. The splice inserts the correct gcd between `cur` and its
original successor, and the two-link advance restores the invariant. Thus each of the
`n - 1` original pairs is processed exactly once. Euclid returns the gcd because each update
preserves the set of common divisors and strictly decreases its second positive argument.

**Complexity**

- **Time:** `O(n log M)`, where `M` is the largest node value.
- **Space:** `O(1)` auxiliary space.
- **Output:** `O(n)` new list nodes, specifically one for each original adjacent pair.
