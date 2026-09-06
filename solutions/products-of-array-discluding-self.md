---
# Product of Array Except Self · Medium · Arrays & Hashing
# https://leetcode.com/problems/product-of-array-except-self/
draft: false
pattern: "Prefix and suffix product passes"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return an array `answer` where `answer[i]` is the product
of every element of `nums` except `nums[i]`, computed without using division and in
`O(n)` time.

**Example**

```
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
```

Explanation: `answer[0] = 2*3*4 = 24`, `answer[1] = 1*3*4 = 12`, `answer[2] = 1*2*4 = 8`,
and `answer[3] = 1*2*3 = 6`.

## Intuition

Division is banned, and that ban is the entire problem — otherwise it is one total
product divided by each element (and even that breaks on zeros).

Without division, the answer at `i` is `(everything left of i) * (everything right
of i)`. Both of those are prefix products, one running forward and one running
backward, and each can be carried in a single scalar as I sweep. So: one pass
left-to-right writing the running prefix into `result[i]` *before* folding in
`nums[i]`, then one pass right-to-left multiplying in the running suffix the same
way. The off-by-one discipline — write, then update — is what excludes the element
itself.

## Approach

1. Create `result = [1] * n`. It doubles as the workspace, so no extra arrays.
2. Left pass: keep `prefix = 1`. For `i` from `0` to `n - 1`, set
   `result[i] = prefix`, then `prefix *= nums[i]`. After this, `result[i]` holds
   the product of everything strictly left of `i`, and `result[0] == 1`.
3. Right pass: keep `suffix = 1`. For `i` from `n - 1` down to `0`, do
   `result[i] *= suffix`, then `suffix *= nums[i]`.
4. Order matters in both passes: assign first, update the accumulator second. Do
   it the other way and `nums[i]` leaks into its own answer.
5. Return `result`. Zeros need no special case — a single zero at index `j` leaves
   only `result[j]` non-zero automatically, and two zeros make everything zero.

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

After the first pass `result[i] = nums[0] * ... * nums[i-1]`; the second pass
multiplies in `nums[i+1] * ... * nums[n-1]`, and the two ranges are disjoint and
together cover every index except `i` — which is the definition of the answer, and
it never divides. Two linear passes give `O(n)` time, and the only state beyond
the returned array is the two accumulators, so auxiliary space is `O(1)`.
