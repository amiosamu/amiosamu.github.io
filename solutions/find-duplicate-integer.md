---
# Find The Duplicate Number · Medium · Linked List
# https://leetcode.com/problems/find-the-duplicate-number/
draft: false
pattern: "Floyd's cycle detection on indices"
time: "O(n)"
space: "O(1)"
---

## Description

Given `n + 1` integers in `[1, n]` with exactly one repeated value, return that value
without modifying the array and with constant auxiliary space.

**Example**

```
Input: nums = [1,3,4,2,2]
Output: 2
```

The value 2 appears twice.

## Intuition

Interpret each index as a node whose next pointer is `nums[index]`. Every pointer stays
inside indices `1..n`, so a walk beginning at index 0 must eventually enter a cycle. The
cycle entrance is the repeated value: at least two array positions point to that value,
creating the merge into the cyclic part of the reachable functional graph.

Floyd's algorithm finds a point inside the cycle and then its entrance using only pointer
variables. It never marks or reorders the input array.

## Approach

1. Start `slow` and `fast` at index 0. Move them one and two pointer hops, respectively,
   until they meet inside the cycle. Compare only after moving because both start equal.
2. Start `slow2` at index 0 while leaving `slow` at the meeting point.
3. Move both pointers one hop at a time until they meet. Floyd's distance relation makes
   this meeting point the cycle entrance.
4. Return that index, which is the repeated value. Values in `[1, n]` guarantee every
   pointer dereference stays within the array.

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

The pointer map has a tail from index 0 followed by a cycle, whose entrance is the duplicate
value. Let the tail length be `a`, the meeting point be `b` steps past the entrance, and the
cycle length be `c`. At the meeting, the fast pointer has traveled twice the slow pointer's
`a + b` steps, so `a + b` is a multiple of `c`; equivalently, `a = kc - b`. One pointer
moving `a` steps from 0 and another moving `a` steps from the meeting point therefore reach
the entrance together. That entrance is the repeated value.

**Complexity**

- **Time:** `O(n)` across both pointer phases.
- **Space:** `O(1)` auxiliary space; the input is not mutated.
