---
# Sort Colors · Medium · Arrays & Hashing
# https://leetcode.com/problems/sort-colors/
draft: false
pattern: "Dutch national flag three pointers"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `nums` containing only `0`, `1`, and `2`, sort it in place in one pass, without
using a library sort.

**Example**

```
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

Explanation: The two `0`s come first, followed by the two `1`s and two `2`s.

## Intuition

The Dutch national flag algorithm maintains settled `0`s on the left, settled `2`s on the
right, settled `1`s between the left boundary and the scanner, and an unexamined middle range.

After moving a `0` left, the scanner receives a known `1` from the settled middle region and
can advance. After moving a `2` right, it receives an unexamined value and must inspect the same
position again.

## Approach

1. Maintain `low`, scanner `i`, and `high` so `nums[:low]` is all `0`, `nums[low:i]` is all
   `1`, and `nums[high + 1:]` is all `2`.
2. On `0`, swap with `low` and advance both `low` and `i`.
3. On `2`, swap with `high` and decrement only `high`, leaving `i` to examine the incoming
   value. On `1`, advance only `i`.
4. Stop when `i > high`; the unexamined region is then empty and the method returns nothing.

## Code

```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low, i, high = 0, 0, len(nums) - 1

        while i <= high:
            if nums[i] == 0:
                nums[low], nums[i] = nums[i], nums[low]
                low += 1
                i += 1
            elif nums[i] == 2:
                nums[high], nums[i] = nums[i], nums[high]
                high -= 1
            else:
                i += 1
```

## Why it works

Initially all settled regions are empty. Each branch places the examined value in its correct
region: `0` extends the left region, `2` extends the right region, and `1` extends the middle
region. The swaps preserve the other settled regions, so the invariant holds by induction.
Every iteration shrinks `[i, high]`; when it is empty, the three settled regions cover the array
in sorted order.

**Complexity**

- **Time:** `O(n)` because the unexamined region shrinks once per iteration.
- **Space:** `O(1)` auxiliary space; `nums` is modified in place.
