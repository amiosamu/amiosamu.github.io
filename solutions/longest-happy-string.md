---
# Longest Happy String · Medium · Heap / Priority Queue
# https://leetcode.com/problems/longest-happy-string/
draft: false
pattern: "Greedy max-heap with runner-up fallback"
time: "O(a + b + c)"
space: "O(1)"
---

## Description

Given limits `a`, `b`, and `c` for the corresponding letters, return any longest string that
uses no more than those limits and never contains three equal consecutive characters.

**Example**

```
Input: a = 1, b = 1, c = 7
Output: "ccaccbcc"
```

`"ccaccbcc"` uses one `'a'`, one `'b'`, and six `'c'`s without a triple. A seventh `'c'`
would require a third separator, so length `8` is maximal.

## Intuition

Use the most abundant remaining letter whenever it is legal, because that pile is most likely to be
stranded later. If it already occupies the final two positions, use the next-most abundant letter
as a separator. A max-heap maintains both choices as counts change; negated counts adapt Python's
min-heap implementation.

## Approach

1. Put every positive count into `heap` as `(-count, ch)` and initialize the output list.
2. Pop the letter with the greatest remaining count.
3. If it would create a triple, stop when no alternative exists; otherwise append the runner-up,
   update its count, and return the blocked leader unchanged.
4. If the leader is legal, append it and return it to the heap only when copies remain.
5. Join and return `out`. Zero counts never enter the heap, and all-zero input returns `""`.

## Code

```python
import heapq

class Solution:
    def longestDiverseString(self, a: int, b: int, c: int) -> str:
        heap = [(-count, ch) for count, ch in ((a, 'a'), (b, 'b'), (c, 'c')) if count]
        heapq.heapify(heap)

        out = []
        while heap:
            count, ch = heapq.heappop(heap)

            if len(out) >= 2 and out[-1] == out[-2] == ch:
                if not heap:
                    break
                count2, ch2 = heapq.heappop(heap)
                out.append(ch2)
                if count2 + 1 < 0:
                    heapq.heappush(heap, (count2 + 1, ch2))
                heapq.heappush(heap, (count, ch))
            else:
                out.append(ch)
                if count + 1 < 0:
                    heapq.heappush(heap, (count + 1, ch))

        return "".join(out)
```

## Why it works

Let `M` be the largest letter count and let `O` be the total count of the other letters. Those
`O` letters create at most `O + 1` gaps, and each gap can contain at most two copies of the dominant
letter. Thus no happy string can use more than `O + min(M, 2(O + 1))` characters. The greedy rule
uses all letters unless one dominant letter remains behind a doubled suffix. In that case, every
other letter has been used as a separator and the rule has filled each available gap with two
dominant letters whenever possible, reaching the bound `O + 2(O + 1)`. It therefore attains the
maximum possible length in either case, while the explicit suffix check preserves happiness.

**Complexity**

- **Time:** `O(a + b + c)`; each iteration appends one character and heap size is at most three.
- **Space:** `O(1)` auxiliary heap space, plus `O(a + b + c)` for the returned string.
