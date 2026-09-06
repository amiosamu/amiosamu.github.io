---
# Missing Number · Easy · Bit Manipulation
# https://leetcode.com/problems/missing-number/
draft: false
pattern: "XOR indices against values"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums` containing `n` distinct numbers drawn from the range `[0, n]`, return
the one number in that range that is missing from `nums`.

**Example**

```
Input: nums = [3,0,1]
Output: 2
```

Explanation: nums has 3 elements drawn from [0,3]; 0, 1, and 3 are present, so 2 is the
missing value.

## Intuition

The array holds `n` distinct values drawn from `0..n`, so exactly one of those `n + 1` labels is
absent. A set would find it in O(n) extra space. Instead, XOR every index together with every
value: each present number `v` shows up once as a value and once as an index, so it cancels
itself out. Seed the accumulator with `n` — the one index the loop never produces — and the
survivor is the missing number. The Gauss-sum variant works too, but XOR cannot overflow.

## Approach

1. Initialise `res = len(nums)`. This covers the label `n`, which is a legal answer but is never
   a valid index into the array.
2. Iterate with `for i, num in enumerate(nums)` and do `res ^= i ^ num`.
3. Return `res`.
4. Trace `[3, 0, 1]`: `res` starts at 3; `i=0,num=3` gives `3 ^ 0 ^ 3 = 0`; `i=1,num=0` gives
   `0 ^ 1 ^ 0 = 1`; `i=2,num=1` gives `1 ^ 2 ^ 1 = 2`. Answer 2.
5. Trace `[0, 1]`: `res` starts at 2, both rounds XOR a number with itself, so 2 survives.
6. Nothing here depends on the array being sorted, and it never allocates.

## Code

```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        res = len(nums)
        for i, num in enumerate(nums):
            res ^= i ^ num
        return res
```

## Why it works

The multiset being folded is `{0..n-1}` (the indices) plus `{n}` (the seed) plus the `n` values
in `nums` — that is, every label in `0..n` twice, except the missing one which appears only once
via the index/seed side. XOR is commutative and associative with `x ^ x = 0`, so all the paired
labels vanish and only the missing label remains. One pass, one accumulator: O(n) time, O(1)
space.
