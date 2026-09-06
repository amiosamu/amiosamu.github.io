---
# Happy Number · Easy · Math & Geometry
# https://leetcode.com/problems/happy-number/
draft: false
pattern: "Floyd's cycle detection (slow/fast pointers)"
time: "O(log n)"
space: "O(1)"
---

## Intuition

The brute force keeps a hash set of every value seen while repeatedly replacing `n` with the
sum of the squares of its digits, and declares the number unhappy once a value repeats - correct,
but it costs O(the whole trajectory) of memory. The transform is a function on a bounded state
space (a k-digit number maps to at most `81k`, which shrinks anything with more than 3 digits),
so every starting number either reaches 1 or falls into one fixed cycle - which means the cycle
can be detected with a slow/fast pointer instead of remembering every value ever seen.

## Approach

1. Write a helper `next_num(x)` that returns the sum of the squares of the digits of `x` (e.g.
   `sum(int(d) ** 2 for d in str(x))`).
2. Initialize `slow = n` and `fast = next_num(n)` - fast starts one application ahead of slow.
3. Loop while `fast != 1` and `slow != fast`: each iteration, advance `slow` by one application
   of `next_num`, and advance `fast` by two applications of `next_num`.
4. If the trajectory reaches 1, `fast` lands on 1 and the loop exits there.
5. If `n` is unhappy, the sequence enters the one known fixed cycle, and because fast gains on
   slow by one step every iteration, they're guaranteed to collide somewhere inside that cycle.
6. Return `fast == 1`.

## Code

```python
class Solution:
    def isHappy(self, n: int) -> bool:
        def next_num(x: int) -> int:
            return sum(int(d) ** 2 for d in str(x))

        slow, fast = n, next_num(n)
        while fast != 1 and slow != fast:
            slow = next_num(slow)
            fast = next_num(next_num(fast))
        return fast == 1
```

## Why it works

This is Floyd's cycle detection applied to the functional graph of `next_num`: every trajectory
either terminates at the self-loop on 1 or enters a finite cycle, and a pointer moving twice as
fast as another on a cyclic sequence is guaranteed to meet it inside that cycle. Since the two
pointers are just two independent runs of the same O(1)-space transform, no history needs to be
stored, and both pointers converge within `O(log n)` applications because the digit-square sum
shrinks any large number down to a small bounded range almost immediately.
