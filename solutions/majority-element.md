---
# Majority Element · Easy · Arrays & Hashing
# https://leetcode.com/problems/majority-element/
draft: false
pattern: "Boyer-Moore voting"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return the value that appears more than `floor(n / 2)` times.
The input is guaranteed to contain such a value.

**Example**

```
Input: nums = [3,2,3]
Output: 3
```

The value `3` appears twice, which is more than `floor(3 / 2) == 1`.

## Intuition

Cancel pairs of different values. Because the majority occupies more than half of the array, it
cannot be completely canceled by all non-majority values.

Boyer-Moore voting performs this cancellation with a `candidate` and a `count`. A zero count means
the processed prefix has canceled completely, so the current value can become the next candidate.

## Approach

1. Initialize `candidate = None` and `count = 0`.
2. When `count` is zero, adopt the current value as `candidate`.
3. Increment `count` for a matching value; otherwise decrement it to cancel a pair.
4. Return the final candidate. The existence guarantee makes a verification pass unnecessary.

## Code

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate = None
        count = 0

        for x in nums:
            if count == 0:
                candidate = x
            count += 1 if x == candidate else -1

        return candidate
```

## Why it works

Whenever `count` returns to zero, the processed block can be partitioned into pairs of distinct
values. Removing such pairs preserves the identity of any majority in the remaining multiset:
each pair removes at most one occurrence of the majority and exactly one other value. Repeating
this cancellation leaves the guaranteed majority as the final candidate.

**Complexity**

- **Time:** `O(n)` for one pass through `nums`.
- **Space:** `O(1)` auxiliary space.
