---
# Add Two Numbers · Medium · Linked List
# https://leetcode.com/problems/add-two-numbers/
draft: false
pattern: "Digit-by-digit addition with carry"
time: "O(n + m)"
space: "O(1)"
---

## Description

Given two non-empty linked lists representing non-negative integers in reverse digit order,
return their sum in the same format. Each node contains one digit, with the least significant
digit at the head.

**Example**

```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
```

`l1` encodes 342 and `l2` encodes 465. Their sum is 807, represented as `[7,0,8]`.

## Intuition

The lists already present digits in the order needed for grade-school addition. Add corresponding
nodes and the carry, append the resulting digit, and move forward. A missing node contributes
zero, while the loop keeps running if a final carry remains.

## Approach

1. Create a dummy result head, keep `tail` at its final node, and initialize `carry = 0`.
2. While either input node exists or a carry remains, add the available node values to the
   carry and advance those input pointers.
3. Use `divmod(total, 10)` to obtain the carry and current result digit, then append that digit
   after `tail`.
4. Return `dummy.next`. Unequal lengths need no special case because absent digits contribute
   zero; a carry in the condition creates a final node when necessary.

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

Before each iteration, the result list contains the correct lower-order digits, and `carry`
contains exactly the overflow into the current position. Adding the current input digits and
splitting by ten preserves that invariant. Once both lists and the carry are exhausted, every
digit of the sum has been appended.

**Complexity**

- **Time:** `O(n + m)`.
- **Space:** `O(1)` auxiliary space and `O(max(n, m))` space for the returned list.
