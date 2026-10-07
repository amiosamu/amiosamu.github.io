---
# Two Sum II Input Array Is Sorted · Medium · Two Pointers
# https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
draft: false
pattern: "Two pointers on a sorted array"
time: "O(n)"
space: "O(1)"
---

## Description

Given a sorted array `numbers` and `target`, return the 1-indexed positions of two distinct
elements whose sum is `target`. Exactly one solution exists.

**Example**

```
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
```

The values at zero-based indices `0` and `1` sum to `9`, so the answer is `[1, 2]`.

## Intuition

Sortedness makes each pointer move decisive. If the endpoint sum is too small, the left value is
too small even with its largest available partner. If the sum is too large, the right value is too
large even with its smallest available partner.

## Approach

1. Initialize `l` and `r` at the first and last indices.
2. Compute `numbers[l] + numbers[r]` on each iteration.
3. Return `[l + 1, r + 1]` when it equals `target` to convert to 1-based positions.
4. Move `l` right when the sum is too small; move `r` left when it is too large.
5. Keep the defensive `[]` return although the problem guarantees a solution.

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

Maintain the invariant that the unique solution remains inside `[l, r]`. When the sum is too
small, `numbers[l]` also falls short with every smaller partner, so `l` cannot belong to the
solution. When the sum is too large, `numbers[r]` also exceeds the target with every larger left
value, so `r` cannot belong to it. Each update preserves the invariant, and the shrinking window
must eventually expose the guaranteed pair.

**Complexity**

- **Time:** `O(n)` because one pointer moves on every iteration.
- **Space:** `O(1)` auxiliary space.
