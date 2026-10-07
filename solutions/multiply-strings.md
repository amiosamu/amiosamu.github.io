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

Explanation: `123 * 456 = 56088`.

## Intuition

An `n1`-digit number times an `n2`-digit number has at most `n1 + n2` digits. The product of
digits at indices `i` and `j` contributes to result positions `i + j` and `i + j + 1`: the first
receives the carry and the second receives the ones digit. Processing from right to left lets a
fixed-size digit array accumulate the same partial products as grade-school multiplication.

## Approach

1. Return `"0"` if either input is zero. Otherwise allocate `n1 + n2` result positions.
2. Visit both strings from right to left. For each digit pair, compute its product and positions
   `p1 = i + j` and `p2 = i + j + 1`.
3. Add the product to `result[p2]`, store its ones digit at `p2`, and add its carry to `p1`.
4. Skip unused leading zeros and join the remaining digits. The input strings are unchanged.

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
        return "".join(map(str, result[start:]))
```

## Why it works

Each digit pair contributes its product at the decimal place determined by `i + j`. Splitting
`total` between `p2` and `p1` preserves that contribution exactly: `total % 10` stays at the
lower place and `total // 10` moves one place left. Because both loops run right to left, all
contributions and carries into a lower position are present before that position is finalized.
Therefore, after all pairs are processed, `result` is the exact product, apart from harmless
leading zeros.

**Complexity**

- **Time:** `O(n1 * n2)` for all digit pairs, plus `O(n1 + n2)` to build the string.
- **Space:** `O(n1 + n2)` for the result digits and returned string; auxiliary space excluding
  the output is also `O(n1 + n2)`.
