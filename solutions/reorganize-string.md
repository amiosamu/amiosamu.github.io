---
# Reorganize String · Medium · Heap / Priority Queue
# https://leetcode.com/problems/reorganize-string/
draft: false
pattern: "Greedy max-heap, hold back previous"
time: "O(n)"
space: "O(1)"
---

## Description

Rearrange the lowercase letters of `s` so adjacent characters differ. Return any valid
rearrangement, or `""` when none exists.

**Example**

```
Input: s = "aab"
Output: "aba"
```

Explanation: Placing `b` between the two `a`s avoids equal adjacent characters.

## Intuition

The character with the largest remaining count is most likely to become impossible to separate, so
place the most frequent currently allowed character at each step. A max-heap supplies that choice.
The previously placed character must be temporarily withheld from the heap for one iteration,
which guarantees that it cannot be selected twice in a row.

## Approach

1. Count the characters and heapify pairs `(-count, ch)`. Negative counts make Python's
   min-heap act as a max-heap; characters only break equal-frequency ties.
2. Keep the previous pair in `prev` instead of the heap. Pop the most frequent allowed character
   and append it to `out`.
3. Reinsert the older `prev` after a different character has been placed. Increment the popped
   negative count and retain it as the new `prev` only if copies remain.
4. Continue while the heap has an allowed character. If `out` reaches `len(s)`, join and return
   it; otherwise `prev` is stranded, so return `""`.

## Code

```python
import collections
import heapq

class Solution:
    def reorganizeString(self, s: str) -> str:
        counts = collections.Counter(s)
        heap = [(-c, ch) for ch, c in counts.items()]
        heapq.heapify(heap)

        out = []
        prev = None

        while heap:
            count, ch = heapq.heappop(heap)
            out.append(ch)
            if prev:
                heapq.heappush(heap, prev)
            count += 1
            prev = (count, ch) if count else None

        return "".join(out) if len(out) == len(s) else ""
```

## Why it works

Because `prev` is absent from the heap, every appended character differs from the preceding one.
For `R` remaining positions, feasibility requires the withheld character to occur at most
`floor(R / 2)` times and every allowed character at most `ceil(R / 2)` times. These bounds are
also sufficient because the most frequent characters can be alternated with the others.

The greedy step preserves those bounds. It chooses a largest allowed count, spends one copy, and
withholds that character; its new count is at most `floor((R - 1) / 2)`. Reinserted `prev` and all
other counts are at most `ceil((R - 1) / 2)`; when `R` is odd, two counts cannot both exceed that
bound because their sum would exceed `R`. Induction therefore shows that every feasible input can
complete. If the heap empties early, only `prev` remains and no separator exists, so failure is
correct.

**Complexity**

- **Time:** `O(n)` because the heap contains at most 26 lowercase letters.
- **Space:** `O(1)` auxiliary space for the fixed alphabet, excluding the `O(n)` output.
