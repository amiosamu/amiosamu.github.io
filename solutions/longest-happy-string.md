---
# Longest Happy String · Medium · Heap / Priority Queue
# https://leetcode.com/problems/longest-happy-string/
draft: false
pattern: "Greedy max-heap with runner-up fallback"
time: "O(a + b + c)"
space: "O(1)"
---

## Intuition

There is no fixed order to sort into — which letter is safe to append depends on the two characters already written. The greedy is to always take the letter with the most copies left, because the letters that run out last are the ones that end up stranded, and spending the biggest pile first keeps the piles even. The only exception is when that letter would form a third consecutive copy; then I take the runner-up for one character and immediately go back to the leader. Both "leader" and "runner-up" mean *current maximum of a changing multiset*, which is a **max-heap** — `heapq` negated, as always.

## Approach

1. Build `heap = [(-count, ch) for count, ch in ((a, 'a'), (b, 'b'), (c, 'c')) if count]` and `heapify`. Skipping zero counts keeps the heap free of exhausted letters.
2. Keep `out`, the characters appended so far. Loop while the heap is non-empty.
3. Pop `(count, ch)` — the letter with the most copies remaining.
4. If `len(out) >= 2 and out[-1] == out[-2] == ch`, appending it would make three in a row. In that case: if the heap is now empty, `break` — nothing legal is left and the string is finished. Otherwise pop the runner-up `(count2, ch2)`, append `ch2`, push it back if it has copies left (`count2 + 1 < 0`), and push the leader `(count, ch)` back untouched so it is chosen again next round.
5. Otherwise append `ch` and push `(count + 1, ch)` back if `count + 1 < 0`. Adding 1 to a negated count spends one copy; reaching 0 means the letter is used up and must not go back in.
6. The runner-up is only ever used for a single character, which is enough — after it, `out[-1] != out[-2]`, so the leader is legal again.
7. Return `"".join(out)`. There is no failure case; the answer can legitimately be the empty string only when `a = b = c = 0`.

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

Taking the largest available pile is safe by an exchange argument: if a schedule ever writes a scarcer letter while a more plentiful one is legal, swapping them keeps the string happy and leaves the remaining counts no worse, since the plentiful letter is the one that will need slots later. The loop terminates when the only remaining letter is already doubled at the tail, and at that point no longer happy string exists on those counts, so the greedy output is maximal. Every iteration appends exactly one character except the final `break`, so it runs at most `a + b + c` times with O(log 3) heap work each — linear time, constant space.
