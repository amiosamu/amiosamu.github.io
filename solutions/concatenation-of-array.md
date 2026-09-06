---
# Concatenation of Array · Easy · Arrays & Hashing
# https://leetcode.com/problems/concatenation-of-array/
draft: false
pattern: "Doubled array by index offset"
time: "O(n)"
space: "O(1)"
---

## Intuition

`ans[i] = nums[i % n]` is just a fancy way of saying "the array twice", so in Python
the whole problem is `return nums + nums`. The version worth being able to write is the
index one: value `nums[i]` lands in exactly two slots, `i` and `i + n`, so a single pass
fills a pre-sized array of length `2n` with no modulo and no appends.

## Approach

1. Let `n = len(nums)` and allocate `ans = [0] * (2 * n)` up front — the output size is known.
2. Loop over `nums` with `enumerate`, giving index `i` and value `x`.
3. Write `x` to `ans[i]` (the first copy) and to `ans[i + n]` (the second copy).
4. Return `ans`.
5. No edge cases to guard: `n >= 1` per the constraints, and the loop degenerates cleanly
   for a single element.

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

For `i < n` the spec wants `nums[i % n] = nums[i]`, and for `n <= i < 2n` it wants
`nums[i % n] = nums[i - n]` — those are exactly the two slots each `x` is written to, so
every position of `ans` is filled once and correctly. One pass over `n` elements doing
constant work gives `O(n)`, and the only allocation is the required output, so auxiliary
space is `O(1)`.
