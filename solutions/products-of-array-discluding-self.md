---
# Product of Array Except Self · Medium · Arrays & Hashing
# https://leetcode.com/problems/product-of-array-except-self/
draft: false
pattern: "Prefix and suffix product passes"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return an array where index `i` contains the product of every
input element except `nums[i]`. Do not use division, and run in linear time.

**Example**

```
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
```

Explanation: Excluding each position in turn gives products `24`, `12`, `8`, and `6`.

## Intuition

The product excluding `nums[i]` factors into the product strictly to its left and the product
strictly to its right. A forward pass can store every left product in the output. A backward
pass then multiplies each slot by a running right product. Updating each accumulator after using
it ensures `nums[i]` never enters its own result, including when the input contains zeros.

## Approach

1. Allocate `result = [1] * n` and initialize `prefix = 1`.
2. Scan left to right. Store `prefix` at `result[i]`, then multiply `prefix` by `nums[i]`.
   Each slot now holds the product strictly to its left.
3. Scan right to left with `suffix = 1`. Multiply `result[i]` by `suffix`, then include
   `nums[i]` in `suffix` for the next position.
4. Return `result`. The input is not mutated, and zeros require no special handling.

## Code

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        result = [1] * n

        prefix = 1
        for i in range(n):
            result[i] = prefix
            prefix *= nums[i]

        suffix = 1
        for i in range(n - 1, -1, -1):
            result[i] *= suffix
            suffix *= nums[i]

        return result
```

## Why it works

After the forward pass, `result[i]` equals the product over indices less than `i`. During the
backward pass, `suffix` equals the product over indices greater than `i` before slot `i` is
updated. Their product therefore includes every input position exactly once except `i`. This
argument uses multiplication only, so it remains valid for zero and negative values.

**Complexity**

- **Time:** `O(n)` for two linear passes.
- **Space:** `O(1)` auxiliary space, excluding the required `O(n)` output array.
