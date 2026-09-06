---
# Add Two Numbers · Medium · Linked List
# https://leetcode.com/problems/add-two-numbers/
draft: false
pattern: "Digit-by-digit addition with carry"
time: "O(n + m)"
space: "O(1)"
---

## Intuition

The digits are stored least-significant-first, which is exactly the order grade-school addition
wants — so no reversal and no conversion to `int` is needed. Walk both lists in lockstep adding
the two digits plus the carry, and the only real bookkeeping is that the lists can end at
different times and the carry can outlive both of them. Treat a missing digit as a zero and the
whole thing collapses to one loop.

## Approach

1. `dummy = ListNode()` and `tail = dummy`. The dummy is there so appending the first digit is
   the same two lines as appending the fifth — otherwise every step needs an "is the result
   empty yet?" branch. `carry = 0`.
2. Loop while `l1 or l2 or carry`. The `carry` term in the condition is what handles
   `[9,9] + [1]` → `[0,0,1]`: both lists are exhausted but a digit is still owed.
3. Inside, start `total = carry`. If `l1` is non-`None`, add `l1.val` and advance `l1`; same for
   `l2` independently. Advancing inside each guard is what lets the lists be different lengths.
4. Split with `carry, digit = divmod(total, 10)`. `total` is at most `9 + 9 + 1 = 19`, so the
   carry is always 0 or 1.
5. Append: `tail.next = ListNode(digit)`, then `tail = tail.next`.
6. Return `dummy.next`, not `dummy` — `dummy` holds a placeholder zero that is not part of the
   number.

## Code

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        carry = 0
        while l1 or l2 or carry:
            total = carry
            if l1:
                total += l1.val
                l1 = l1.next
            if l2:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy.next
```

## Why it works

At the top of each iteration the invariant is that every position below the current one is
final and `carry` holds exactly the overflow owed to this position, which is what the
positional definition of addition requires. Missing digits contribute zero, which is correct
because a shorter number is the same number padded with leading zeros in this reversed layout.
The loop runs `max(n, m)` or `max(n, m) + 1` times doing constant work, so O(n + m) time and
O(1) auxiliary space beyond the result list.
