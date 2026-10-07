---
# Maximum Frequency Stack · Hard · Stack
# https://leetcode.com/problems/maximum-frequency-stack/
draft: false
pattern: "Stack per frequency level"
time: "O(1)"
space: "O(n)"
---

## Description

Design `FreqStack` with `push(val)` and `pop()`. `pop` removes the most frequent current value,
breaking frequency ties in favor of the value pushed most recently.

**Example**

```
Input: ["FreqStack","push","push","push","push","push","push","pop","pop","pop","pop"], [[],[5],[7],[5],[7],[4],[5],[],[],[],[]]
Output: [null,null,null,null,null,null,null,5,7,5,4]
```

After six pushes, `5` has frequency three. After it is popped, `5` and `7` tie at frequency two,
and the more recently pushed `7` is returned.

## Intuition

When a value reaches frequency `c`, append it to a stack for frequency level `c`. The top of the
highest occupied level is then both maximally frequent and the most recently pushed among values at
that frequency.

Popping decreases one value's frequency by exactly one. If the highest level becomes empty, the
next maximum frequency is exactly one lower.

## Approach

1. Track current counts in `cnt`, level stacks in `groups`, and the largest count in `maxCnt`.
2. On `push`, increment the value's count and append it to the corresponding level stack.
3. Update `maxCnt` if the value reached a new highest frequency.
4. On `pop`, remove the top value from `groups[maxCnt]` and decrement its count.
5. If that level becomes empty, decrement `maxCnt`, then return the removed value.

## Code

```python
class FreqStack:
    def __init__(self):
        self.cnt = {}
        self.groups = {}
        self.maxCnt = 0

    def push(self, val: int) -> None:
        c = self.cnt.get(val, 0) + 1
        self.cnt[val] = c
        self.maxCnt = max(self.maxCnt, c)
        self.groups.setdefault(c, []).append(val)

    def pop(self) -> int:
        val = self.groups[self.maxCnt].pop()
        self.cnt[val] -= 1
        if not self.groups[self.maxCnt]:
            self.maxCnt -= 1
        return val
```

## Why it works

For every frequency `c`, `groups[c]` records in push order the values as they reached count `c`.
Thus the top entry at `maxCnt` is a value with maximum current frequency, and it is the most recent
such value. Popping removes exactly its record at that level and decrements its count, while its
lower-level records remain available. Therefore the representation and tie-breaking invariant are
preserved after every operation.

**Complexity**

- **Time:** `O(1)` amortized for both `push` and `pop`.
- **Space:** `O(n)` after `n` unmatched pushes.
