---
# Add Binary · Easy · Bit Manipulation
# https://leetcode.com/problems/add-binary/
draft: false
pattern: "Digit-by-digit carry from the right"
time: "O(max(n, m))"
space: "O(max(n, m))"
---

## Description

Given two binary strings `a` and `b`, return their sum as a binary string, computed digit
by digit rather than by converting through base-10 integers.

**Example**

```
Input: a = "1010", b = "1011"
Output: "10101"
```

Explanation: 1010 is 10 and 1011 is 11 in decimal; 10 + 11 = 21, which is 10101 in binary.

## Intuition

Binary addition follows the same right-to-left process as decimal addition. At each position,
add both available digits and the incoming carry. The low bit of that total is the result digit,
and the remaining high bit is the next carry.

## Approach

1. Set `i` and `j` to the final indices of `a` and `b`. Keep `carry` and a reversed digit
   list `res`.
2. While either string has a digit left or `carry` is nonzero, add each available digit to
   `carry`. Missing leading digits contribute zero.
3. Append `total & 1`, the low bit of the sum, and update `carry = total >> 1`.
4. Reverse the collected digits and join them. The loop condition preserves a final leading
   `1` when the sum grows by one bit.

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

After each iteration, `res` contains the correct processed suffix of the sum in reverse order,
and `carry` is exactly the value owed to the next position. The total is at most three, so its
low bit and high bit are precisely the output digit and carry. This invariant extends by one
position per iteration and proves the final reversed string is the complete sum.

**Complexity**

- **Time:** `O(max(n, m))`.
- **Space:** `O(max(n, m))` for the returned digits; auxiliary state besides the output is
  `O(1)`.
