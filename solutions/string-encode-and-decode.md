---
# Encode and Decode Strings · Medium · Arrays & Hashing
# https://leetcode.com/problems/encode-and-decode-strings/
draft: false
pattern: "Length-prefix framing"
time: "O(m)"
space: "O(m)"
---

## Description

Design methods to encode a list of arbitrary strings into one string and decode it back into the
original list. Input strings may contain any character, including the encoding's delimiter.

**Example**

```
Input: strs = ["neet","code","love","you"]
Output: ["neet","code","love","you"]
```

Explanation: One encoding is `"4#neet4#code4#love3#you"`, which decodes to the original list.

## Intuition

A delimiter alone is ambiguous because it may occur in a payload. Prefix each payload with its
character count followed by `#`. The decoder uses `#` only to locate the end of the numeric
length, then consumes exactly that many characters. Delimiters and digits inside the payload
therefore need no escaping.

## Approach

1. For each input string, append `str(len(s)) + "#" + s` to `parts`, then join the parts once.
2. To decode, place cursor `i` at the next record and scan `j` to the first `#`.
3. Parse `s[i:j]` as `length`, then append the exact slice
   `s[j + 1:j + 1 + length]`.
4. Move `i` past that payload and repeat. `"0#"` represents an empty string, while an empty
   encoded string represents an empty list.

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

Each encoded record begins with decimal digits terminated by the first `#`, so its length field
has a unique endpoint. That length identifies the payload's unique endpoint regardless of its
contents. After decoding one record, `i` points exactly to the next record; induction over the
records shows that every original string is recovered once and in order. Empty payloads consume
zero characters and preserve the same argument.

**Complexity**

- **Time:** `O(m)` for either method, where `m` is the total encoded size.
- **Space:** `O(m)` in this implementation: `encode` stores `parts` before joining, and `decode`
  returns payload copies totaling `O(m)`; cursor state alone is `O(1)`.
