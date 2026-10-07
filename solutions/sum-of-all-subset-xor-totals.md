---
# Sum of All Subsets XOR Total · Easy · Backtracking
# https://leetcode.com/problems/sum-of-all-subset-xor-totals
draft: false
pattern: "Include/exclude subset recursion"
time: "O(2^n)"
space: "O(n)"
---

## Description

The XOR total of an array is the XOR of its elements, with the empty array contributing `0`.
Given `nums`, return the sum of the XOR totals of all subsets.

**Example**

```
Input: nums = [1,3]
Output: 6
```

The four subsets have XOR totals `0`, `1`, `3`, and `1 ^ 3 = 2`, which sum to `6`.

## Intuition

Each element creates two choices: include it or exclude it. A recursion path therefore identifies
one subset. Only that path's running XOR matters, so there is no need to allocate the subset
itself or undo mutations while backtracking.

## Approach

1. Define `dfs(i, cur)` as the sum for all subsets formed from indices `i` onward, given
   that selected earlier elements XOR to `cur`.
2. At index `i`, recurse once with `nums[i]` included and once with it excluded.
3. When `i == len(nums)`, return `cur` because the path now represents one complete subset.
4. Add the two branch results and start with `dfs(0, 0)`.
5. Count equal values at different indices separately; they represent different subset choices.

## Code

```python
class Solution:
    def subsetXORSum(self, nums: List[int]) -> int:
        def dfs(i: int, cur: int) -> int:
            if i == len(nums):
                return cur
            return dfs(i + 1, cur ^ nums[i]) + dfs(i + 1, cur)

        return dfs(0, 0)
```

## Why it works

Induct on `i`. At `i == n`, the only remaining choice is the completed subset, and `cur` is its
XOR. For `i < n`, every subset of the remaining indices either contains index `i` or does not;
the two recursive calls cover these disjoint cases. Adding their results therefore counts every
subset exactly once and adds its correct XOR total.

**Complexity**

- **Time:** `O(2^n)` because the recursion has one leaf per subset.
- **Space:** `O(n)` for the recursion stack; no subset list is stored.
