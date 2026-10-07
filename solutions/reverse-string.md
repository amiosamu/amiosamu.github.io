---
# Reverse String · Easy · Two Pointers
# https://leetcode.com/problems/reverse-string/
draft: false
pattern: "Two pointers swapping inward"
time: "O(n)"
space: "O(1)"
---

## Description

Given a character array `s`, reverse its elements in place without allocating another array.

**Example**

```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

Explanation: Swapping mirrored pairs produces `["o","l","l","e","h"]`; the middle element
does not move.

## Intuition

In a reversal, indices `i` and `n - 1 - i` exchange values. These mirrored pairs are independent,
so pointers can start at both ends, swap one pair, and move inward. Once the pointers meet or cross,
every required pair has been handled.

## Approach

1. Initialize `l = 0` and `r = len(s) - 1`.
2. While `l < r`, swap `s[l]` with `s[r]`, then increment `l` and decrement `r`.
3. Stop when the pointers meet or cross. An odd-length array's center already occupies its
   reversed position.
4. Return nothing; the caller observes the mutation to `s`.

## Code

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        l, r = 0, len(s) - 1
        while l < r:
            s[l], s[r] = s[r], s[l]
            l += 1
            r -= 1
```

## Why it works

Before each iteration, every position outside `[l, r]` contains its final reversed value. Swapping
the values at `l` and `r` places both mirrored elements correctly, and moving inward preserves the
invariant. At termination no unresolved pair remains, so the whole array is reversed.

**Complexity**

- **Time:** `O(n)` for `floor(n / 2)` swaps.
- **Space:** `O(1)` auxiliary space.
