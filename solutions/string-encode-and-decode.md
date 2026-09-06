---
# Encode and Decode Strings · Medium · Arrays & Hashing
# https://leetcode.com/problems/encode-and-decode-strings/
draft: false
pattern: "Length-prefix framing"
time: "O(m)"
space: "O(1)"
---

## Description

Design an algorithm to encode a list of strings into a single string, and decode that
string back into the original list. A string in the list may contain any character,
including whatever delimiter the encoding itself uses, so the scheme must not rely on a
character being forbidden in the input.

**Example**

```
Input: strs = ["neet","code","love","you"]
Output: ["neet","code","love","you"]
```

Explanation: `encode(strs)` produces `"4#neet4#code4#love3#you"`, and decoding that
string recovers the original four strings in the same order.

## Intuition

Any separator character I pick — comma, `#`, even `\0` — can legally appear inside
one of the strings, so no delimiter alone can be trusted. Escaping fixes that but
is fiddly to get right under time pressure.

The clean answer is to stop searching for boundaries and instead announce them:
write `len(s)` before each string, terminated by a marker. The decoder reads
digits until the marker, then takes *exactly* that many characters verbatim,
whatever they contain. The `#` is only there to end the number, never to find the
end of the payload, so a `#` inside the data is harmless.

## Approach

**encode**

1. For each `s` in `strs`, emit `str(len(s)) + "#" + s`.
2. Collect the pieces in a list and `"".join` them — repeated `+=` on a string is
   quadratic.

**decode**

3. Keep a cursor `i` at the start of the next record; loop while `i < len(s)`.
4. Advance a second index `j` from `i` until `s[j] == "#"`. Everything in
   `s[i:j]` is the length digits.
5. `length = int(s[i:j])`, then the payload is `s[j + 1 : j + 1 + length]`.
6. Append the payload and set `i = j + 1 + length`, the first character of the
   next record.
7. Edge cases fall out for free: an empty string encodes to `"0#"` and decodes to
   `""`; an empty list encodes to `""` and the `while` never runs.

## Code

```python
class Solution:
    def encode(self, strs: List[str]) -> str:
        parts = []
        for s in strs:
            parts.append(str(len(s)) + "#" + s)
        return "".join(parts)

    def decode(self, s: str) -> List[str]:
        result = []
        i = 0

        while i < len(s):
            j = i
            while s[j] != "#":
                j += 1
            length = int(s[i:j])
            result.append(s[j + 1:j + 1 + length])
            i = j + 1 + length

        return result
```

## Why it works

The encoding is unambiguous because the decoder never has to guess where a string
ends: the count that precedes it is self-delimiting (digits, then the first `#`),
and the payload is then taken by position rather than by search. Both directions
touch each character a constant number of times, so both are `O(m)` in the total
length of the input, and beyond the string being built and the list being returned
the only state is two integer cursors.
