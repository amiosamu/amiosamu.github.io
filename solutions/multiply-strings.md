---
# Multiply Strings · Medium · Math & Geometry
# https://leetcode.com/problems/multiply-strings/
draft: false
pattern: "Grade-school multiplication into a position array"
time: "O(n * m)"
space: "O(n + m)"
---

## Description

Given two non-negative integers `num1` and `num2` represented as strings, return their
product, also as a string, without converting the inputs directly to native integers.

**Example**

```
Input: num1 = "123", num2 = "456"
Output: "56088"
```

Explanation: 123 multiplied by 456 equals 56088, computed here digit by digit rather than
via a built-in integer conversion.

## Intuition

Converting both strings to ints and multiplying dodges the point of the problem (and would
overflow in most other languages), so I need the digit-by-digit multiplication algorithm from
grade school. The key observation: multiplying the digit at index `i` of `num1` by the digit at
index `j` of `num2` always lands on positions `i + j` and `i + j + 1` of the result, regardless
of what other digits are involved - so I can accumulate every partial product into a fixed-size
int array and resolve carries as I go, instead of juggling carries between intermediate strings.

## Approach

1. Handle the trivial case up front: if either `num1` or `num2` is `"0"`, return `"0"`.
2. Let `n1, n2` be the lengths of `num1`, `num2`; allocate `result`, an int array of size
   `n1 + n2` filled with zeros - large enough to hold any product of an `n1`-digit by
   `n2`-digit number.
3. Iterate `i` from `n1 - 1` down to `0`, and inside it `j` from `n2 - 1` down to `0` (both
   right to left, least-significant digit first).
4. For each `(i, j)`, compute `mul = int(num1[i]) * int(num2[j])`, and the two positions it
   touches: `p1 = i + j` (higher place) and `p2 = i + j + 1` (lower place).
5. Fold `mul` into whatever is already parked at `p2`: `total = mul + result[p2]`; write
   `result[p2] = total % 10` and add the carry into the higher place with
   `result[p1] += total // 10` (never overwrite `p1` - more products can still land there).
6. After both loops finish, `result` holds every digit of the answer but may have leading
   zeros in its unused top slot(s) - skip over leading zeros, then join the rest into a string.

## Code

```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"

        n1, n2 = len(num1), len(num2)
        result = [0] * (n1 + n2)

        for i in range(n1 - 1, -1, -1):
            for j in range(n2 - 1, -1, -1):
                mul = int(num1[i]) * int(num2[j])
                p1, p2 = i + j, i + j + 1
                total = mul + result[p2]
                result[p2] = total % 10
                result[p1] += total // 10

        start = 0
        while start < len(result) - 1 and result[start] == 0:
            start += 1
        return ''.join(map(str, result[start:]))
```

## Why it works

Because `i` and `j` both count down, the digit-sum `i + j` is non-increasing across the whole
loop, so every carry landing on a position (which happens when that position equals some pair's
`i + j`) is already folded in before that position is ever read and finalized as a units digit
(which happens when it equals a *later* pair's `i + j + 1`) - nothing gets finalized too early.
Every one of the `n1 * n2` digit pairs is visited exactly once, giving `O(n1 * n2)` time and
`O(n1 + n2)` space for the result array.
