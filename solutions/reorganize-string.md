---
# Reorganize String · Medium · Heap / Priority Queue
# https://leetcode.com/problems/reorganize-string/
draft: false
pattern: "Greedy max-heap, hold back previous"
time: "O(n)"
space: "O(1)"
---

## Description

Given a string `s`, rearrange its characters so that no two adjacent characters are the same, and return any such rearrangement, or an empty string if none exists.

**Example**

```
Input: s = "aab"
Output: "aba"
```

Explanation: rearranging `"aab"` as `"aba"` places the two `a`s apart with `b` between them, so no two adjacent characters match.

## Intuition

Placing letters in sorted order fails immediately — sorting groups identical letters together, which is the one thing forbidden. The right greedy is to always place the letter with the most copies left, because that letter is the one at risk of being stranded in a run at the end; postponing it only makes the problem harder. That means I need the maximum count *after every placement*, and the counts change every step, so a **max-heap** of `(-count, char)` it is. The one twist: the letter I just used must be excluded from the next pick, so I hold it aside in `prev` for exactly one round and push it back afterwards.

## Approach

1. Count with `collections.Counter(s)` and build `heap = [(-c, ch) for ch, c in counts.items()]`, then `heapify`. Negated counts turn `heapq` into a max-heap on frequency; the second field `ch` only breaks ties, deterministically and harmlessly, since any valid rearrangement is accepted.
2. Keep `out`, the list of characters placed, and `prev = None`, the letter used on the previous step and therefore banned this step.
3. While the heap is non-empty: pop `(count, ch)` — the most frequent *allowed* letter, since the banned one is not in the heap — and append `ch` to `out`.
4. Now that a different letter has been placed, push `prev` back onto the heap if it is not `None`.
5. Do `count += 1` (counts are negative, so this spends one copy) and set `prev = (count, ch)` if any copies remain, else `None`.
6. The loop ends when the heap is empty and `prev` is either exhausted or still stuck — which is the failure case: some letter had copies left but nothing legal to alternate with.
7. Return `"".join(out)` if `len(out) == len(s)`, else `""`. Comparing lengths is the cleanest failure test; no separate `count > (n + 1) // 2` check is needed.

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

Withholding `prev` for one round makes every adjacency legal by construction, so the only question is whether the greedy ever gets stuck when a valid answer exists. It does not: the arrangement is possible exactly when no letter exceeds `(n + 1) // 2` copies, and always spending the largest count keeps the multiset as balanced as any schedule can, so if the heap empties with `prev` still holding copies then that letter alone outnumbered all the rest and no arrangement existed either. Each character is pushed and popped a constant number of times on a heap of at most 26 entries, so the work is O(n) time and O(1) auxiliary space.
