---
# Two Sum II Input Array Is Sorted · Medium · Two Pointers
# https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
draft: false
pattern: "Two pointers on a sorted array"
time: "O(n)"
space: "O(1)"
---

## Description

Given a 1-indexed array `numbers` sorted in non-decreasing order and an integer `target`, return the 1-indexed positions of the two numbers that add up to `target`. Exactly one solution exists, and the same element cannot be used twice.

**Example**

```
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
```

Explanation: `numbers[0] + numbers[1] == 2 + 7 == 9`, so the 1-indexed positions 1 and 2 are returned.

## Intuition

A hash map solves this in O(n) time but O(n) space, and the problem explicitly asks for constant
extra space. Sortedness is the gift: `numbers[l] + numbers[r]` at the two ends is a sum I can *steer*
— moving `l` right is the only way to increase it and moving `r` left is the only way to decrease it.
That turns the search over all n² pairs into a single walk that eliminates one index per step.

## Approach

1. `l = 0`, `r = len(numbers) - 1`. These bracket the smallest and largest possible pair sum.
2. Each iteration compute `total = numbers[l] + numbers[r]`.
3. If `total == target`, return `[l + 1, r + 1]` — the answer is 1-indexed, which is the easiest
   thing to get wrong here.
4. If `total < target`, move `l` right. `numbers[r]` is already the largest partner available to
   `l`, so if even that pair falls short, `l` cannot be in any valid pair and is discarded. Moving
   `r` left instead would only shrink the sum further — strictly the wrong direction.
5. If `total > target`, move `r` left, by the mirrored argument: `numbers[l]` is the smallest partner
   available to `r`, so `r` is too big for everyone still in the window.
6. Loop while `l < r`; the problem guarantees exactly one solution, so the trailing `return []` is
   only there to keep the function total.

## Code

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            total = numbers[l] + numbers[r]
            if total == target:
                return [l + 1, r + 1]
            if total < target:
                l += 1
            else:
                r -= 1
        return []
```

## Why it works

The invariant is that the answer pair, if it exists, always has both of its indices inside `[l, r]`.
Each move only discards an index that has been proven impossible: when the sum is too small, `l`
paired with its best remaining partner `r` still misses, so `l` fails against every partner in the
window; symmetrically when the sum is too large. The window shrinks by one every iteration, so the
walk is O(n) with two integers of state.
