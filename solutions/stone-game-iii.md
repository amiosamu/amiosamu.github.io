---
# Stone Game III · Hard · 1-D Dynamic Programming
# https://leetcode.com/problems/stone-game-iii/
draft: false
pattern: "Suffix minimax on score difference"
time: "O(n)"
space: "O(n)"
---

## Description

Alice and Bob alternately take one, two, or three values from the front of `stoneValue` and add
them to their scores. Alice starts, and both play optimally. Return `"Alice"`, `"Bob"`, or
`"Tie"` according to the final scores.

**Example**

```
Input: stoneValue = [1,2,3,7]
Output: "Bob"
```

Explanation: Alice can score `6` by taking three stones, but Bob then takes `7` and wins.

## Intuition

Track the best score difference the current player can force from each suffix. After taking some
value `take`, the opponent becomes the current player on the remaining suffix. Their optimal
difference counts against the original player, producing `take - dp[next]`. This symmetric state
avoids tracking separate Alice and Bob totals.

## Approach

1. Define `dp[i]` as the maximum current-player score minus opponent score from
   `stoneValue[i:]`; set `dp[n] = 0`.
2. Fill states right-to-left. Accumulate `take` while considering one, two, or three available
   stones, and maximize `take - dp[next]`.
3. Initialize each `best` to negative infinity because stone values may be negative; every
   nonempty suffix has at least one legal move.
4. Interpret `dp[0]`: positive means Alice wins, negative means Bob wins, and zero means a tie.

## Code

```python
class Solution:
    def stoneGameIII(self, stoneValue: List[int]) -> str:
        n = len(stoneValue)
        dp = [0] * (n + 1)

        for i in range(n - 1, -1, -1):
            take = 0
            best = float("-inf")
            for k in range(3):
                if i + k < n:
                    take += stoneValue[i + k]
                    best = max(best, take - dp[i + k + 1])
            dp[i] = best

        if dp[0] > 0:
            return "Alice"
        return "Bob" if dp[0] < 0 else "Tie"
```

## Why it works

Prove the recurrence by backward induction. With no stones, both scores are zero, so `dp[n] = 0`.
Assume all shorter suffixes are solved optimally. For any legal move at `i`, `take` is added to
the mover's score, while `dp[next]` is the opponent's optimal advantage afterward; the resulting
advantage is `take - dp[next]`. Taking the maximum covers every legal first move and chooses the
optimal one. Thus `dp[0]` is Alice's optimal final score difference, and its sign determines the
result.

**Complexity**

- **Time:** `O(n)` because each state checks at most three moves.
- **Space:** `O(n)` for `dp`.
