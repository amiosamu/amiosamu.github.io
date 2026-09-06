---
# Minimum Size Subarray Sum · Medium · Sliding Window
# https://leetcode.com/problems/minimum-size-subarray-sum/
draft: false
pattern: "Shrink window while sum qualifies"
time: "O(n)"
space: "O(1)"
---

## Intuition

All values are positive, which is the whole game: extending a window can only raise its sum and shrinking it can only lower the sum. So for each right end `r` there is a single tipping point `l` — the furthest left edge whose window still reaches `target` — and `l` never has to move backwards as `r` advances. That turns the O(n²) "try every start" search into one pass where both pointers only go forward.

## Approach

1. Keep `l = 0`, a running `total = 0`, and `best = len(nums) + 1` as a sentinel meaning "no window found".
2. Walk `r` over `range(len(nums))` and add `nums[r]` to `total`.
3. While `total >= target`, the window `nums[l..r]` qualifies: record `best = min(best, r - l + 1)`, then subtract `nums[l]` from `total` and advance `l`.
4. Shrinking *before* moving on is what makes the recorded length minimal for this `r` — the loop stops the moment the window would drop below `target`.
5. After the loop, return `best` if it is at most `len(nums)`, otherwise `0` — the sentinel survives exactly when no subarray ever reached `target`.

## Code

```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        l = 0
        total = 0
        best = len(nums) + 1
        for r in range(len(nums)):
            total += nums[r]
            while total >= target:
                best = min(best, r - l + 1)
                total -= nums[l]
                l += 1
        return best if best <= len(nums) else 0
```

## Why it works

For the optimal subarray `nums[i..j]`, consider the iteration `r = j`: the inner loop advances `l` past every start whose window still hits `target`, so it necessarily passes through `l = i` and records length `j - i + 1`. Positivity is what licenses never rewinding `l` — once `nums[l..r]` falls short, no window with that same left edge and a smaller right edge can hit `target` either. Each index is added once and removed at most once, so the two pointers together do O(n) work with only scalars kept, O(1) space.
