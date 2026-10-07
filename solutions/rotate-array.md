---
# Rotate Array · Medium · Two Pointers
# https://leetcode.com/problems/rotate-array/
draft: false
pattern: "Reverse whole, then reverse both halves"
time: "O(n)"
space: "O(1)"
---

## Description

Given a nonempty integer array `nums` and nonnegative integer `k`, rotate `nums` right by `k`
positions in place.

**Example**

```
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
```

Explanation: The suffix `[5,6,7]` moves before `[1,2,3,4]`, with both blocks retaining order.

## Intuition

Write the array as `A B`, where `B` is the final `k` elements. The target is `B A`. Reversing
the whole array swaps the blocks but reverses each one, producing `reverse(B) reverse(A)`.
Reversing those two ranges separately restores their internal order. Reducing `k` modulo `n`
handles rotations longer than the array.

## Approach

1. Set `n = len(nums)` and reduce `k %= n`.
2. Define `reverse(l, r)` to swap endpoints and move inward until the range is reversed.
3. Reverse the full array, then reverse indices `0..k-1` and `k..n-1` separately.
4. Return nothing; all swaps mutate `nums`. When `k == 0`, the first and third reversals cancel
   and the empty middle reversal does nothing.

## Code

```python
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k %= n

        def reverse(l: int, r: int) -> None:
            while l < r:
                nums[l], nums[r] = nums[r], nums[l]
                l += 1
                r -= 1

        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)
```

## Why it works

Let the original array be `A B`, where `|B| = k`. Reversing all elements gives
`reverse(B) reverse(A)`. The second reversal transforms the first block back to `B`, and the third
transforms the remaining block back to `A`. The final array is therefore `B A`, exactly a right
rotation by `k`; modulo reduction makes this equivalent to the requested number of rotations.

**Complexity**

- **Time:** `O(n)` across the three reversals.
- **Space:** `O(1)` auxiliary space.
