---
# Majority Element II · Medium · Arrays & Hashing
# https://leetcode.com/problems/majority-element-ii
draft: false
pattern: "Boyer-Moore with two candidates"
time: "O(n)"
space: "O(1)"
---

## Intuition

At most two values can appear more than `n/3` times, since three such values would already need more than `n` slots. That caps the number of candidates I have to carry, which is what makes O(1) space possible without a counting map. Boyer-Moore generalises: keep two candidates with counters, and whenever a third distinct value shows up while both counters are non-zero, cancel one occurrence of each of the three. Cancelling three distinct values at a time can never wipe out a value with frequency above `n/3`, so any real answer survives to the end as a candidate — though the survivors are not guaranteed to be answers, hence the verification pass.

## Approach

1. Keep `cand1, cand2 = None, None` and `count1 = count2 = 0`.
2. For each `n` in `nums`, test the branches strictly in this order, since a later branch would otherwise steal a value that already has a slot:
3. If `n == cand1`, `count1 += 1`. Else if `n == cand2`, `count2 += 1`.
4. Else if `count1 == 0`, adopt: `cand1, count1 = n, 1`. Else if `count2 == 0`, adopt into slot two the same way.
5. Otherwise `n` differs from both live candidates, so cancel: `count1 -= 1` and `count2 -= 1`.
6. The order in steps 3-4 also guarantees `cand1 != cand2`, so the result can never contain a duplicate.
7. Verify at the end — the counters are a survival mechanism, not a frequency. Return the candidates whose real `nums.count(c)` exceeds `len(nums) // 3`. `None` survives when fewer than two distinct values were ever adopted, and its count is `0`, so it filters itself out.

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

Think of the cancel branch as deleting one copy each of three pairwise-distinct values from the multiset. A value `v` occurring more than `n/3` times can be removed by at most the number of cancellations, which is under `n/3`, so its copies cannot all be consumed — some occurrence of `v` must still be held by a counter at the end, meaning `v` is one of the two candidates. The converse fails (a candidate can be spurious), which is exactly why the explicit `nums.count` check is required rather than optional. The main loop is one pass and the verification is two more, so O(n) time with four scalars of state, O(1) space.
