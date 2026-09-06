---
# Add Binary · Easy · Bit Manipulation
# https://leetcode.com/problems/add-binary/
draft: false
pattern: "Digit-by-digit carry from the right"
time: "O(max(n, m))"
space: "O(max(n, m))"
---

## Intuition

`int(a, 2) + int(b, 2)` and `bin(...)` would pass in Python because ints are arbitrary
precision, but that dodges the exercise and does not translate to a language with fixed-width
integers. The real solve is grade-school addition in base 2: walk both strings from the right,
add the two digits plus the carry, and note that the running total is always in `0..3` — so the
output digit is `total & 1` and the new carry is `total >> 1`.

## Approach

1. Set `i = len(a) - 1`, `j = len(b) - 1`, `carry = 0`, and `res = []` to collect digits
   reversed.
2. Loop while `i >= 0 or j >= 0 or carry` — the `carry` clause is what emits the final leading
   1 when the sum is one digit wider than both inputs.
3. Inside the loop, start `total = carry`; if `i >= 0` add `int(a[i])` and decrement `i`;
   if `j >= 0` add `int(b[j])` and decrement `j`. This is how unequal lengths are handled
   without padding either string.
4. Append `str(total & 1)` to `res` and set `carry = total >> 1`.
5. Return `"".join(reversed(res))`.
6. Trace `a = "1010"`, `b = "1011"`: digits emitted right to left are `1, 0, 1, 0`, then the
   loop runs once more on `carry = 1` and emits `1`, so reversed the result is `"10101"`.

## Code

```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        res = []
        carry = 0
        i, j = len(a) - 1, len(b) - 1
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += int(a[i])
                i -= 1
            if j >= 0:
                total += int(b[j])
                j -= 1
            res.append(str(total & 1))
            carry = total >> 1
        return "".join(reversed(res))
```

## Why it works

The invariant is that after processing position `k`, `res` holds the correct low `k + 1` bits of
`a + b` and `carry` holds the value that overflows into position `k + 1`. Since `total` is at most
`1 + 1 + 1 = 3`, `total & 1` is the digit and `total >> 1` is the carry — exactly the definition of
base-2 addition. The loop runs `max(n, m) + 1` times at most, and the only storage is the answer
string.
