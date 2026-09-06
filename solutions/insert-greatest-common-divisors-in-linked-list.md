---
# Insert Greatest Common Divisors in Linked List · Medium · Math & Geometry
# https://leetcode.com/problems/insert-greatest-common-divisors-in-linked-list/
draft: false
pattern: "Pairwise walk with Euclid's gcd"
time: "O(n log M)"
space: "O(1)"
---

## Description

Given the `head` of a linked list of positive integers, insert a new node holding the greatest
common divisor between each pair of adjacent original nodes, then return the (possibly
unchanged-head) modified list.

**Example**

```
Input: head = [18,6,10,3]
Output: [18,6,6,2,10,1,3]
```

Explanation: `gcd(18,6) = 6` is inserted between the first pair, `gcd(6,10) = 2` between the
second, and `gcd(10,3) = 1` between the third, giving `[18,6,6,2,10,1,3]`.

## Intuition

There is no algorithmic insight to find here — the whole problem is doing a pairwise walk without
corrupting the list. The one thing that bites is advancing the cursor: after splicing a node
between `cur` and `cur.next`, the next pair to process is the inserted node's successor and the
one after it, so the cursor has to jump *two* links, not one. Jump one and I re-examine the node I
just created and loop forever inserting `gcd(g, g) == g`.

## Approach

1. Set `cur = head`. The list is guaranteed to have at least one node, so no null check up front.
2. While `cur.next` is not `None` (stop at the last node, which has no partner):
   - Copy `a, b = cur.val, cur.next.val` into locals so Euclid does not clobber the list.
   - Run `while b: a, b = b, a % b`; `a` is now `gcd`. Node values are `>= 1`, so `a` ends `>= 1`
     and I never insert a 0.
   - Splice with `cur.next = ListNode(a, cur.next)` — the two-argument constructor keeps the old
     tail attached in one statement, no temporary needed.
   - Advance `cur = cur.next.next`, i.e. over the node just inserted and onto the original
     successor.
3. Return `head`. The head never moves because insertions always happen after an existing node.
4. Trace `[18,6,10,3]`: `gcd(18,6)=6` between them, `gcd(6,10)=2`, `gcd(10,3)=1`, giving
   `[18,6,6,2,10,1,3]`. A single-node list enters no iterations and comes back unchanged.

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

The loop invariant is that everything strictly before `cur` is finished and `cur` is always an
original node, which the double advance guarantees — so each original adjacent pair is visited
exactly once and gets exactly one node between it. Euclid terminates because `a % b < b` strictly
decreases the second argument, and it takes `O(log M)` steps for values up to `M = 1000` here.
That is `O(n log M)` time, and the only extra memory is the `n - 1` output nodes plus two integers.
