---
# Majority Element · Easy · Arrays & Hashing
# https://leetcode.com/problems/majority-element/
draft: false
pattern: "Boyer-Moore voting"
time: "O(n)"
space: "O(1)"
---

## Intuition

Counting with a dict is the obvious `O(n)` answer but costs `O(n)` space, and sorting and
taking `nums[n // 2]` costs `O(n log n)`. The insight that gets both to constant space:
pair off each occurrence of the majority element with one occurrence of something else and
throw both away. Since the majority strictly exceeds `n / 2`, it cannot be fully cancelled,
so whatever survives the pairing is the answer. `count` tracks the size of the surviving
run and `candidate` its value.

## Approach

1. Start with `candidate = None` and `count = 0`.
2. For each `x`: if `count == 0`, adopt `x` as the new `candidate` (everything before it has
   cancelled out and no longer matters).
3. Then vote: `count += 1` if `x == candidate`, else `count -= 1`.
4. Return `candidate` after the pass — no verification loop is needed because the problem
   guarantees a majority element exists.
5. If that guarantee were dropped (the Majority Element II style setup), add a second pass
   counting occurrences of `candidate` and check it exceeds `n // 2`.

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

Every time `count` drops to zero, the prefix just consumed splits into pairs of one
`candidate` and one non-`candidate`, so it contained at most half of any single value's
occurrences — discarding it cannot destroy a majority in the whole array, since a value
appearing more than half the time in the total must still appear more than half the time
in the remainder. By induction the final survivor is the majority element, if one exists.
One pass with two scalars: `O(n)` time, `O(1)` space.
