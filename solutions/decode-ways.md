---
# Decode Ways · Medium · 1-D Dynamic Programming
# https://leetcode.com/problems/decode-ways/
draft: false
pattern: "Suffix count DP, take one or two digits"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string of digits that was produced by encoding letters `'A'..'Z'` as `1..26` and
concatenating them with no delimiter, count how many distinct letter sequences could have
produced it. A leading zero in any one- or two-digit group makes that grouping invalid.

**Example**

```
Input: s = "12"
Output: 2
```

Explanation: `"12"` can be split as `"1", "2"` (decoding to `"AB"`) or as `"12"` (decoding to
`"L"`), so there are 2 valid decodings.

## Intuition

A decoding is a sequence of cuts, and the branching is only ever two-way: the next letter eats
one digit or two. Enumerating cut sequences is exponential, but once you have consumed a prefix
the only thing that matters is *where the cut landed* — the letters already emitted never
constrain what follows. So there are `n + 1` states, and the count for a suffix is the count
after taking one digit plus the count after taking two, when each is legal. `'0'` is the whole
difficulty: it can never start a letter, so it must be swallowed as the second digit of a `10`
or `20` or the string is undecodable from there.

## Approach

1. State: `dp[i]` is the number of ways to decode the suffix `s[i:]`, considering only that
   suffix.
2. Base case: `dp[n] = 1` — the empty suffix has exactly one decoding, the empty one. That `1`,
   not `0`, is what makes the sums come out right.
3. Recurrence, for `i` from `n - 1` down to `0`:
   - if `s[i] == "0"`, then `dp[i] = 0` — no letter starts with a zero digit, so this suffix is
     dead;
   - otherwise `dp[i] = dp[i + 1]`, plus `dp[i + 2]` when a two-digit letter fits, which means
     `i + 1 < n` **and** the pair `s[i:i+2]` is in `10..26`.
4. Test the two-digit case without building an int: `s[i] == "1"` (any second digit works), or
   `s[i] == "2" and s[i + 1] <= "6"`.
5. Iteration direction: **right to left**, so `dp[i + 1]` and `dp[i + 2]` are always final when
   read.
6. Answer: `dp[0]`.
7. Rolling form: keep `after1 = dp[i + 1]` and `after2 = dp[i + 2]`, seeded `1, 0`. The `0` seed
   is never actually consumed — at `i = n - 1` the guard `i + 1 < n` is false — so any value
   would do. Slide with `after1, after2 = cur, after1` at the end of each iteration and return
   `after1`.

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

Every decoding of `s[i:]` begins with exactly one letter, and that letter is either one digit or
two — the two branches are disjoint (they differ in the length of the first letter) and
exhaustive, so summing their counts counts each decoding once. Both branches recurse on a
strictly shorter suffix, so the right-to-left order makes each `dp[i + 1]` and `dp[i + 2]` final
before it is read. The zero rule and the `<= 26` rule are exactly the legality conditions on that
first letter, so no illegal decoding is ever counted. One pass with two integers of state: O(n)
time, O(1) space.
