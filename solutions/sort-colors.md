---
# Sort Colors · Medium · Arrays & Hashing
# https://leetcode.com/problems/sort-colors/
draft: false
pattern: "Dutch national flag three pointers"
time: "O(n)"
space: "O(1)"
---

## Intuition

Counting 0s, 1s and 2s and rewriting the array works and is easy, but it reads the
array twice. The one-pass trick is to notice there are only three colors, so the
array can be maintained as three growing regions: settled 0s on the left, settled
2s on the right, and 1s in the middle. Two boundary pointers plus a scanner are
enough to keep that shape.

The subtle part is asymmetry: after swapping a 0 forward I know what I received
(it came from the already-scanned 1-region, so it is a 1), but after swapping a 2
backward I received something from the unscanned tail and must re-examine it.

## Approach

1. Keep three indices: `low` (first position not yet known to hold a 0), `i` (the
   scanner), `high` (last position not yet known to hold a 2).
2. Invariant: `nums[:low]` is all 0s, `nums[low:i]` is all 1s, `nums[high+1:]` is
   all 2s, and `nums[i:high+1]` is unexamined.
3. Loop while `i <= high`.
4. If `nums[i] == 0`, swap it with `nums[low]`, then advance both `low` and `i` —
   the value swapped in came from the 1-region so it needs no re-check.
5. If `nums[i] == 2`, swap it with `nums[high]` and decrement `high` only. Do
   **not** advance `i`: the value just pulled in is unexamined.
6. If `nums[i] == 1`, just advance `i`.
7. Stop when `i` passes `high`; the array is sorted in place, nothing to return.

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

The three-region invariant holds after every branch: a 0 goes to the front of the
middle region and pushes the 0-boundary right, a 2 goes to the back and pulls the
2-boundary left, a 1 is already where it belongs. The unexamined window
`[i, high]` shrinks by one on every iteration — either `i` rises or `high` falls —
so the loop makes exactly `O(n)` steps and terminates, and the only storage is
three indices.
