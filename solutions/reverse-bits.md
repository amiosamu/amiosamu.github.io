---
# Reverse Bits · Easy · Bit Manipulation
# https://leetcode.com/problems/reverse-bits/
draft: false
pattern: "Pop low bit, push into result"
time: "O(1)"
space: "O(1)"
---

## Intuition

Bit `i` of the input has to land at position `31 - i`. Rather than computing that index, note
that a queue reverses itself if you pop from one end and push to the other: repeatedly take
`n`'s lowest bit and shift it into the *low* end of `res` while shifting `res` left. After
exactly 32 rounds the first bit taken has been pushed left 31 times and sits at the top, which
is the reversal.

## Approach

1. Start `res = 0`.
2. Repeat exactly 32 times — a `for _ in range(32)` loop, not `while n`. Python ints have no
   fixed width, so `while n` would stop early on any input with leading zeros and under-shift
   the result.
3. Each round: `res = (res << 1) | (n & 1)` to append the current low bit of `n` to `res`,
   then `n >>= 1` to discard it.
4. Return `res`. No masking is needed on the way out because `res` accumulates exactly 32 bits
   and stays non-negative.
5. Trace `n = 1`: the first round pushes the 1 into `res`, and the remaining 31 rounds push
   zeros while shifting it left, so `res = 2^31 = 2147483648`.
6. Trace `n = 0`: all 32 rounds shift in zeros, result 0.

## Code

```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
```

## Why it works

The bit read on round `i` is input bit `i`, and it then gets left-shifted once per remaining
round — `31 - i` times — so it ends at position `31 - i`, which is the definition of a 32-bit
reversal. Fixing the loop count at 32 rather than draining `n` is what keeps the leading zeros
significant. Thirty-two constant-work rounds and two integer variables give O(1) time and space.
