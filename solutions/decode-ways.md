---
# Decode Ways · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/decode-ways/
draft: false
pattern: "Suffix count DP, take one or two digits"
time: "O(n)"
space: "O(1)"
---

## Description

Letters `'A'` through `'Z'` are encoded as `1` through `26`. Given a digit string `s`,
return the number of valid decodings. A group cannot begin with `0`.

**Example**

```
Input: s = "12"
Output: 2
```

`"12"` can be decoded as `"AB"` or `"L"`.

## Intuition

At any index, the next letter consumes either one valid digit or two digits in `10..26`.
Only the current index matters; the letters decoded before it do not affect the remaining
choices. This gives a suffix dynamic program.

A suffix beginning with `0` has no valid transition, so inputs such as `"06"` cannot treat
zero as a letter. Otherwise, the count includes the one-digit choice and, when legal, the
two-digit choice. Only the next two suffix counts are needed.

## Approach

1. Define `dp[i]` as the number of ways to decode `s[i:]`, with `dp[n] = 1` for the empty
   suffix.
2. Iterate right to left. At each usable transition, `after1` represents `dp[i + 1]` and
   `after2` represents `dp[i + 2]`.
3. Set `cur = 0` for a leading zero. Otherwise start with `after1` for the one-digit
   decoding.
4. Add `after2` when the next two digits form `10..26`, tested directly from the two
   characters.
5. Shift the rolling values with `after1, after2 = cur, after1`, then return `after1`.

## Code

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        n = len(s)
        after1, after2 = 1, 0

        for i in range(n - 1, -1, -1):
            if s[i] == "0":
                cur = 0
            else:
                cur = after1
                if i + 1 < n and (s[i] == "1" or (s[i] == "2" and s[i + 1] <= "6")):
                    cur += after2
            after1, after2 = cur, after1

        return after1
```

## Why it works

By induction from the empty suffix, assume the stored counts for positions after `i` are
correct. Every decoding of `s[i:]` starts with exactly one valid one-digit or two-digit
letter. These cases are disjoint and exhaustive, so their suffix counts sum to `dp[i]`.
The code excludes precisely the leading-zero and out-of-range cases. Therefore the rolling
value returned for position zero counts every valid decoding exactly once.

**Complexity**

- **Time:** `O(n)` for one right-to-left pass.
- **Space:** `O(1)` auxiliary space.
