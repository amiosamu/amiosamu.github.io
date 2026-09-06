---
# Rotate Array · Medium · Two Pointers
# https://leetcode.com/problems/rotate-array/
draft: false
pattern: "Reverse whole, then reverse both halves"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums` and an integer `k`, rotate the array to the right by `k` steps in place, without allocating a second array.

**Example**

```
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
```

Explanation: The last three elements (`5,6,7`) move to the front, and the remaining elements (`1,2,3,4`) follow in their original order.

## Intuition

Rotating right by `k` means the last `k` elements come first, in order, followed by the first `n - k`, in order. Reversing the whole array gets both blocks into the right *place* but leaves each one backwards; reversing each block in isolation then fixes the order inside it. So three in-place reversals do what a copy would do, with no extra array. The other thing to notice is that `k` can exceed `n`, and a rotation by `n` is the identity, so only `k % n` matters.

## Approach

1. Let `n = len(nums)` and reduce `k %= n` — without this, `k >= n` would index past the end.
2. Write a helper `reverse(l, r)` that swaps `nums[l]` and `nums[r]` while `l < r`, moving `l` up and `r` down.
3. `reverse(0, n - 1)` — the whole array. Now the block that should end up in front is in front, but reversed, and so is the block behind it.
4. `reverse(0, k - 1)` — un-reverse the first `k` slots, which hold the old tail.
5. `reverse(k, n - 1)` — un-reverse the remaining `n - k` slots, which hold the old head.
6. Mutate in place and return nothing; the signature is `-> None`.
7. `k = 0` needs no guard: `reverse(0, -1)` starts with `l = 0, r = -1`, fails `l < r` immediately, and steps 3 and 5 undo each other.

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

If the array is `A B` with `|B| = k`, the target is `B A`. Reversing the whole thing gives `reverse(B) reverse(A)` — the blocks are already swapped, because reversal maps a suffix to a prefix. Reversing the first `k` positions restores `B`, and reversing the rest restores `A`, yielding `B A` exactly. Each of the three passes touches a disjoint-or-full range once, so the total is under `2n` swaps, O(n) time with only the two loop indices as state, O(1) space.
