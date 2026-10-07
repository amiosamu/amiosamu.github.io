---
# Concatenation of Array · Easy · Arrays & Hashing
# https://leetcode.com/problems/concatenation-of-array/
draft: false
pattern: "Doubled array by index offset"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums` of length `n`, build and return an array `ans` of length
`2n` where `ans[i] == nums[i]` and `ans[i + n] == nums[i]` for every `0 <= i < n` — in
other words, `nums` concatenated with itself.

**Example**

```
Input: nums = [1,2,1]
Output: [1,2,1,1,2,1]
```

Explanation: The output is `nums` followed by `nums` again, so `ans` has length 6 and
`ans[1] == ans[4] == 2`.

## Intuition

Each value `nums[i]` appears at indices `i` and `i + n` in the result. Since the output size is
known, preallocate it and fill both positions in one pass. The input array is only read.

## Approach

1. Store `n = len(nums)` and allocate `ans` with `2 * n` positions.
2. For each index `i` and value `x`, assign `ans[i] = x` and `ans[i + n] = x`.
3. Return `ans`. A single-element input follows the same two writes without special handling.

## Code

```python
class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [0] * (2 * n)

        for i, x in enumerate(nums):
            ans[i] = x
            ans[i + n] = x

        return ans
```

## Why it works

After iteration `i`, both output positions corresponding to `nums[i]` contain that value.
Indices `0` through `n - 1` are filled by the first assignment and indices `n` through
`2n - 1` by the second. Therefore every output index is filled exactly once with the required
value.

**Complexity**

- **Time:** `O(n)`.
- **Space:** `O(1)` auxiliary space and `O(n)` output space.
