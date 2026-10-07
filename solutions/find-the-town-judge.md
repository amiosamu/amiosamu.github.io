---
# Find the Town Judge · Easy · Graphs
# https://leetcode.com/problems/find-the-town-judge
draft: false
pattern: "In-degree minus out-degree tally"
time: "O(E + n)"
space: "O(n)"
---

## Description

Given `n` people labeled `1` through `n` and pairs `[a, b]` stating that `a` trusts `b`,
find the person who trusts nobody and is trusted by every other person. Return `-1` when
no such town judge exists.

**Example**

```
Input: n = 2, trust = [[1,2]]
Output: 2
```

Explanation: Person `2` trusts nobody and is trusted by the only other person.

## Intuition

Treat each trust pair as a directed edge. The judge must have in-degree `n - 1` and
out-degree `0`. A single score can track both conditions:
`score[p] = indegree(p) - outdegree(p)`.

Because trust pairs are distinct and nobody trusts themselves, an in-degree cannot exceed
`n - 1`. A score of `n - 1` can therefore occur only for the judge.

## Approach

1. Allocate `score` with `n + 1` entries so each label can be used as an index.
2. For every pair `[a, b]`, subtract one from `score[a]` and add one to `score[b]`.
3. Return the label whose score is `n - 1`.
4. Return `-1` if there is no such label. For `n == 1`, the untouched score is `0`, which
   correctly equals `n - 1`.

## Code

```python
class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        score = [0] * (n + 1)

        for a, b in trust:
            score[a] -= 1
            score[b] += 1

        for i in range(1, n + 1):
            if score[i] == n - 1:
                return i

        return -1
```

## Why it works

For each person, the computed score equals in-degree minus out-degree. If a person is the
judge, that score is `(n - 1) - 0 = n - 1`. Conversely, since in-degree is at most `n - 1`
and out-degree is nonnegative, reaching `n - 1` requires both judge conditions exactly.
Thus the scan returns the judge if one exists and rejects every other person.

**Complexity**

- **Time:** `O(E + n)`, where `E` is the number of trust pairs.
- **Space:** `O(n)` for the score array.
