---
# Majority Element II · Medium · Arrays & Hashing
# https://leetcode.com/problems/majority-element-ii
draft: false
pattern: "Boyer-Moore with two candidates"
time: "O(n)"
space: "O(1)"
---

## Description

Given an integer array `nums`, return every distinct value that appears more than `floor(n / 3)`
times. The answer contains at most two values and may be returned in any order.

**Example**

```
Input: nums = [3,2,3]
Output: [3]
```

Here `floor(n / 3) == 1`; only `3`, which occurs twice, exceeds that threshold.

## Intuition

At most two values can exceed `n / 3`; three such values would require more than `n` positions.
Generalized Boyer-Moore voting therefore tracks two candidates.

When a different value appears while both counters are positive, cancel one occurrence from each
candidate against it. True majorities survive this cancellation, but other values can also survive,
so a second pass must verify the candidates' actual frequencies.

## Approach

1. Initialize two candidate slots and their counters to empty and zero.
2. For each value, increment its matching candidate's counter before considering empty slots.
3. If it matches neither candidate, fill a zero-count slot or decrement both live counters.
4. Count each surviving candidate in `nums` and return only those above `len(nums) // 3`.

## Code

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> List[int]:
        cand1, cand2 = None, None
        count1 = count2 = 0

        for n in nums:
            if n == cand1:
                count1 += 1
            elif n == cand2:
                count2 += 1
            elif count1 == 0:
                cand1, count1 = n, 1
            elif count2 == 0:
                cand2, count2 = n, 1
            else:
                count1 -= 1
                count2 -= 1

        return [c for c in (cand1, cand2) if nums.count(c) > len(nums) // 3]
```

## Why it works

Each cancellation removes three pairwise-distinct values from consideration. If `k` cancellations
occur, then `3k <= n`, while a value occurring more than `n / 3` times has more than `k`
occurrences. It cannot be completely canceled, so every valid answer remains as one of the two
candidates. The verification pass removes surviving candidates that did not actually exceed the
threshold, making the returned set both complete and sound.

**Complexity**

- **Time:** `O(n)`; verification checks at most two candidates.
- **Space:** `O(1)` auxiliary space, excluding the result of at most two values.
