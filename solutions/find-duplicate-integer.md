---
# Find The Duplicate Number · Medium · Linked List
# https://leetcode.com/problems/find-the-duplicate-number/
draft: false
pattern: "Floyd's cycle detection on indices"
time: "O(n)"
space: "O(1)"
---

## Intuition

Sorting mutates the array and a seen-set costs O(n) memory, and the problem forbids both. The
unlock is to stop seeing an array and start seeing a linked list: read `nums[i]` as "the node
after `i`". There are `n + 1` slots but values only span `1..n`, so nothing ever points at index
0 — start there and you are guaranteed to walk into a cycle, and the node where two different
predecessors merge is a value that appears twice. So this is Linked List Cycle II with
`nums[i]` playing the role of `next`.

## Approach

1. **Phase one — find a meeting point.** `slow = fast = 0`. In a `while True` loop advance
   `slow = nums[slow]` (one hop) and `fast = nums[nums[fast]]` (two hops), then break when
   `slow == fast`. No bounds checks are needed: every value is a valid index, so the walk never
   falls off and never terminates.
2. Test after moving, not before — both start at 0 and would match immediately.
3. **Phase two — find the cycle entrance.** Reset a second walker `slow2 = 0` and advance
   `slow` and `slow2` one hop each until `slow == slow2`.
4. Return that index. It is both the entry node of the cycle and the repeated value, since the
   entry is exactly the index that two different slots point to.
5. Index 0 is never the answer and never inside the cycle, which is what makes 0 a legal
   starting point outside the loop — the algorithm needs a tail before the cycle to work.
6. The array is read-only throughout; nothing is written back, so the "do not modify" constraint
   holds.

## Code

```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break

        slow2 = 0
        while slow != slow2:
            slow = nums[slow]
            slow2 = nums[slow2]
        return slow
```

## Why it works

The map `i -> nums[i]` on `n + 1` slots with values in `1..n` is not injective, so at least two
indices share a target and the functional graph must contain a cycle whose entrance has
in-degree two — that entrance is the duplicated value. For phase two: if the tail before the
cycle has length `a` and the meeting point sits `b` steps into a cycle of length `c`, the fast
pointer travelled twice as far, giving `a + b + kc = 2(a + b)`, hence `a = kc - b` — so a walker
from index 0 and one from the meeting point, each moving one step, cover a distance that is a
whole number of laps apart and collide exactly at the entrance. Both phases are O(n) steps with
three integer variables, so O(n) time and O(1) space.
