---
# Remove Element · Easy · Arrays & Hashing
# https://leetcode.com/problems/remove-element/
draft: false
pattern: "Slow write pointer, fast read"
time: "O(n)"
space: "O(1)"
---

## Intuition

Deleting in place sounds like shifting everything left after each removal, which is
`O(n^2)`. The observation that kills it: the grader only checks the first `k` slots, so I
never have to *delete* anything — I just re-write the keepers to the front in order. One
read pointer scans, one write pointer `k` marks where the next keeper goes, and because
`k` never overtakes the read index, the write always lands on a cell that has already been
read.

## Approach

1. Initialize `k = 0`, the number of keepers placed so far and the index of the next slot
   to write.
2. Scan the array with a read loop over `x` in `nums`.
3. If `x == val`, skip it — `k` doesn't move, so the next keeper will overwrite this slot.
4. If `x != val`, write `nums[k] = x` and increment `k`.
5. Return `k`. The elements beyond index `k` are junk and the problem explicitly ignores them.
6. Invariant to state out loud: after processing index `i`, `nums[0:k]` holds exactly the
   non-`val` elements of `nums[0:i+1]` in their original order, and `k <= i + 1`, which is
   what makes overwriting safe.

## Code

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0

        for x in nums:
            if x != val:
                nums[k] = x
                k += 1

        return k
```

## Why it works

The invariant above holds trivially at the start and is preserved by both branches: the
skip branch changes neither side, and the write branch appends the current keeper to
`nums[0:k]` while `k` grows by one — never faster than the read index, so no unread value
is ever clobbered. At the end `i = n - 1`, so `nums[0:k]` is every non-`val` element in
order, which is exactly what the problem asks for. One pass, no extra structure: `O(n)`
time and `O(1)` space.
