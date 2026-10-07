---
# Remove Duplicates From Sorted Array · Easy · Two Pointers
# https://leetcode.com/problems/remove-duplicates-from-sorted-array/
draft: false
pattern: "Slow write pointer, fast read pointer"
time: "O(n)"
space: "O(1)"
---

## Description

Given a sorted integer array `nums`, remove duplicates in place and return the number `k` of
distinct values. The first `k` positions must contain those values in their original order.

**Example**

```
Input: nums = [1,1,2]
Output: 2
```

Explanation: The required prefix becomes `[1,2]`, so the returned length is `2`.

## Intuition

Sorted order makes equal values contiguous. A read pointer can scan each run while a write pointer
marks the end of the distinct prefix. Comparing with the last written value identifies whether the
current value starts a new run, and the trailing writer cannot overwrite unread input.

## Approach

1. Initialize `k = 1`; the nonempty-array constraint makes `nums[0]` the first kept value.
2. Scan from index `1`. Compare `nums[i]` with `nums[k - 1]`, the last distinct value written.
3. When they differ, copy `nums[i]` to `nums[k]` and increment `k`. Otherwise skip the duplicate.
4. Return `k`. The algorithm mutates the first `k` positions; values beyond that prefix are
   unspecified and need not be cleared.

## Code

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
```

## Why it works

Before each read, `nums[:k]` contains exactly the distinct values already seen, in order. Because
the input is sorted, the current value is a duplicate precisely when it equals the final value in
that prefix. Skipping preserves the invariant; copying a different value extends the prefix with
the next distinct value. At termination, the prefix therefore contains every distinct input value
exactly once.

**Complexity**

- **Time:** `O(n)` for one scan.
- **Space:** `O(1)` auxiliary space.
