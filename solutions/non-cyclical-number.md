---
# Happy Number · Easy · Math & Geometry
# https://leetcode.com/problems/happy-number/
draft: false
pattern: "Floyd's cycle detection (slow/fast pointers)"
time: "O(log n)"
space: "O(1)"
---

## Description

Given a positive integer `n`, determine whether it is a happy number: repeatedly replace
it with the sum of the squares of its decimal digits. It is happy if the process reaches `1`;
otherwise, the sequence eventually repeats in a cycle.

**Example**

```
Input: n = 19
Output: true
```

Explanation: `19 -> 82 -> 68 -> 100 -> 1`, so `19` is happy.

## Intuition

The digit-square transform is deterministic. It quickly maps any input into a bounded range, so
its sequence must eventually enter a cycle. The cycle is the self-loop at `1` for a happy number
or a cycle excluding `1` otherwise. Floyd's slow and fast pointers distinguish these outcomes
without storing every previous value.

## Approach

1. Define `next_num(x)` as the sum of the squared decimal digits of `x`.
2. Initialize `slow = n` and `fast = next_num(n)`.
3. While `fast != 1` and the pointers differ, advance `slow` once and `fast` twice.
4. Return whether `fast == 1`; otherwise the pointers met in a non-happy cycle.

## Code

```python
class Solution:
    def isHappy(self, n: int) -> bool:
        def next_num(x: int) -> int:
            total = 0
            while x:
                x, digit = divmod(x, 10)
                total += digit * digit
            return total

        slow, fast = n, next_num(n)
        while fast != 1 and slow != fast:
            slow = next_num(slow)
            fast = next_num(next_num(fast))
        return fast == 1
```

## Why it works

Repeated application of `next_num` forms a path in a finite functional graph. If that path reaches
`1`, the fast pointer eventually reaches `1`. Otherwise it enters a cycle; once both pointers are
inside, the fast pointer gains one cycle position per iteration and must meet the slow pointer.
Therefore, the loop exits with `fast == 1` exactly for happy numbers.

**Complexity**

- **Time:** `O(log n)` to process the initial digits, followed by a bounded number of transforms.
- **Space:** `O(1)` auxiliary space.
