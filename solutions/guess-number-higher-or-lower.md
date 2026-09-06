---
# Guess Number Higher Or Lower · Easy · Binary Search
# https://leetcode.com/problems/guess-number-higher-or-lower/
draft: false
pattern: "Binary search over an oracle API"
time: "O(log n)"
space: "O(1)"
---

## Intuition

There is no array here, but there is the same structure: the hidden `pick` sits somewhere in `[1, n]` and `guess(num)` tells me which side of `num` it is on. That is exactly the three-way comparison of a normal binary search with `guess` standing in for `nums[mid] - target`, so the same loop applies unchanged. The only thing worth getting right is the sign convention: `guess` returns `-1` when my guess is *too high*, which is the opposite of what the name suggests.

## Approach

1. Search space: the integer interval `[l, r]`, **inclusive on both ends**, initialised to `l = 1`, `r = n`.
2. Loop invariant: `pick` is always inside `[l, r]`. It holds at the start by the problem's guarantee.
3. Monotone predicate: `guess(num) < 0` (num is too high) is false on the prefix `[1, pick]` and true on the suffix `(pick, n]` — the sign of `guess` is monotone in `num`, which is what makes halving legal.
4. Loop `while l <= r`, `mid = (l + r) // 2`, and call `guess(mid)` once into `res`.
5. `res == 0` means `mid` is the pick — return it.
6. `res < 0` means `mid` is too high, so the pick lies strictly left: `r = mid - 1`. Otherwise the pick lies strictly right: `l = mid + 1`.
7. Both branches exclude `mid`, so the interval strictly shrinks and the loop terminates.
8. Because `pick` is guaranteed to be in `[1, n]`, the invariant means the interval can never empty without a hit — the loop always returns from inside, and the trailing `return -1` only exists to satisfy the signature.

## Code

```python
class Solution:
    def guessNumber(self, n: int) -> int:
        l, r = 1, n
        while l <= r:
            mid = (l + r) // 2
            res = guess(mid)
            if res == 0:
                return mid
            if res < 0:
                r = mid - 1
            else:
                l = mid + 1
        return -1
```

## Why it works

The invariant "`pick ∈ [l, r]`" is preserved by both updates: `guess` is an exact comparison, so when it says `mid` is too high, every value `>= mid` is also too high and can be dropped. Since the interval always contains the answer and always shrinks by at least one element while excluding `mid`, the loop must land on `pick` before the interval empties. Each call halves the range of `n` candidates, so it costs `O(log n)` guesses and `O(1)` space.
