---
# First Missing Positive · Hard · Arrays & Hashing
# https://leetcode.com/problems/first-missing-positive/
draft: false
pattern: "Cyclic sort, value to its own index"
time: "O(n)"
space: "O(1)"
---

## Intuition

With `n` numbers, the answer is somewhere in `1..n + 1` — if all of `1..n` are present the answer is `n + 1`, otherwise it is the smallest one missing. So values outside `1..n` are irrelevant, and everything I need is a membership table for `n` slots. The constraint is O(1) extra space, so the array has to *be* that table: put value `v` at index `v - 1`. After that placement pass, the first index whose entry isn't `i + 1` names the answer directly.

## Approach

1. Let `n = len(nums)`.
2. First pass: for each `i`, run a `while` loop that keeps swapping `nums[i]` to where it belongs.
3. The loop condition is `1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]`. The range test throws away zeros, negatives, and anything too large; the second test stops when the destination already holds this value, which is what prevents an infinite swap loop on duplicates.
4. Inside, capture `j = nums[i] - 1` *before* swapping, then `nums[i], nums[j] = nums[j], nums[i]`. Computing `j` first matters — writing `nums[i]` first would corrupt the index.
5. Second pass: scan `i` over `range(n)` and return `i + 1` at the first index where `nums[i] != i + 1`.
6. If the scan finishes, `1..n` are all present, so return `n + 1`.

## Code

```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)

        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]

        for i in range(n):
            if nums[i] != i + 1:
                return i + 1

        return n + 1
```

## Why it works

Each swap places a value in `1..n` at its final index `v - 1`, and a value is never moved off a correct index afterwards, so every swap permanently increases the count of correctly-placed values — bounding the total number of swaps by `n` and making the doubly-nested loop O(n) overall, not O(n²). Once the pass ends, index `i` holds `i + 1` if and only if `i + 1` appears in the input, so the first mismatch is precisely the smallest missing positive. Only the loop indices and one temporary are stored, so the space is O(1), at the cost of mutating the input.
