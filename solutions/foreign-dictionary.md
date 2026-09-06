---
# Alien Dictionary · Hard · Advanced Graphs
# https://leetcode.com/problems/alien-dictionary/
draft: false
pattern: "Kahn topological sort on letters"
time: "O(C + V + E)"
space: "O(V + E)"
---

## Description

Given a list of `words` from an alien language, sorted lexicographically according to that
language's unknown letter order, derive an order of the letters that is consistent with the
sorting. Return any valid ordering as a single string, or `""` if the input is contradictory
or otherwise cannot correspond to any valid alphabet.

**Example**

```
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
```

Explanation: Comparing each pair of adjacent words at their first differing letter yields
the constraints `t < f`, `w < e`, `r < t`, and `e < r`; the string "wertf" is one letter
ordering consistent with all of them.

## Intuition

A sorted word list tells me almost nothing about most letter pairs. All I can extract
from two adjacent words is **one** fact: at their first differing position, the left
word's letter precedes the right word's letter. Everything after that position is
unconstrained, which is why the `break` matters.

Those facts are edges in a precedence DAG over letters, and any valid alphabet is a
topological order of it. Two failure modes fall out naturally: a cycle in the edges
(contradictory constraints), and the prefix violation `["abc", "ab"]` where a longer
word sorts before its own prefix — impossible in any alphabet, and it produces no edge
at all, so it has to be checked explicitly.

## Approach

1. Build `adj` as `{char: set()}` and `indegree` as `{char: 0}` over every character
   appearing anywhere in `words`. Letters that never appear must not be in the output.
2. For each adjacent pair `w1, w2` with `min_len = min(len(w1), len(w2))`:
   - If `len(w1) > len(w2)` and `w1[:min_len] == w2[:min_len]`, return `""` — the prefix
     violation.
   - Otherwise scan `j` in `range(min_len)`, and at the first `w1[j] != w2[j]` add the
     edge `w1[j] -> w2[j]` and `break`. Use a set so a repeated pair does not
     double-count `indegree`.
3. Kahn: seed a deque with every character of indegree 0, pop one at a time, append it
   to `res`, and decrement each neighbour's indegree, enqueueing on 0.
4. If `len(res) != len(adj)` some letters are stuck in a cycle, so return `""`.
   Otherwise `"".join(res)`.
5. Any valid order is accepted, so the arbitrary tie-breaking among indegree-0 letters
   is fine.

## Code

```python
import collections

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        adj = {c: set() for w in words for c in w}
        indegree = {c: 0 for c in adj}

        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            min_len = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
                return ""
            for j in range(min_len):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:
                        adj[w1[j]].add(w2[j])
                        indegree[w2[j]] += 1
                    break

        queue = collections.deque(c for c in indegree if indegree[c] == 0)
        res = []
        while queue:
            c = queue.popleft()
            res.append(c)
            for nei in adj[c]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)

        return "".join(res) if len(res) == len(adj) else ""
```

## Why it works

The extracted edges are exactly the constraints the input implies — no more, since
characters past the first mismatch are genuinely free, and no fewer, since sortedness of
non-adjacent pairs is implied by transitivity of the adjacent ones. Kahn's outputs a
letter only once every letter that must precede it is already placed, so the result
satisfies every edge; if it stops short, the remaining letters all have positive
indegree, which means a cycle and no valid alphabet exists. Building the graph is
`O(C)` in total input length, and Kahn's visits each of the at most 26 letters and each
edge once: `O(C + V + E)`.
