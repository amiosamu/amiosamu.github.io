---
# Lemonade Change · Easy · Greedy
# https://leetcode.com/problems/lemonade-change/
draft: false
pattern: "Greedy change, largest bill first"
time: "O(n)"
space: "O(1)"
---

## Description

Customers buy `$5` lemonade in the order given by `bills`, paying with `$5`, `$10`, or `$20`.
Starting with no cash, return whether exact change can be given to every customer using bills
received from earlier customers.

**Example**

```
Input: bills = [5,5,5,10,20]
Output: true
```

The `$10` payment receives one `$5`, and the `$20` payment receives one `$10` and one `$5`.

## Intuition

A `$10` payment requires one `$5` in change. A `$20` payment can use either `$10 + $5` or three
`$5` bills. Spending a `$10` first preserves more `$5` bills, which are needed for both types of
future change. Received `$20` bills never help make `$5` or `$15`, so they need not be tracked.

## Approach

1. Track the available `$5` and `$10` bills with `fives` and `tens`.
2. For `$5`, increment `fives`; for `$10`, require and spend one `$5`, then record the `$10`.
3. For `$20`, prefer one `$10` and one `$5`; otherwise use three `$5` bills.
4. Return `False` immediately if the required change is unavailable at that point in the queue.
5. Return `True` after every transaction succeeds. The input array is only read, not mutated.

## Code

```python
class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        fives = tens = 0

        for bill in bills:
            if bill == 5:
                fives += 1
            elif bill == 10:
                if fives == 0:
                    return False
                fives -= 1
                tens += 1
            else:
                if tens > 0 and fives > 0:
                    tens -= 1
                    fives -= 1
                elif fives >= 3:
                    fives -= 3
                else:
                    return False

        return True
```

## Why it works

Change for `$5` and `$10` payments is forced. For a `$20`, suppose a successful strategy spends
three `$5` bills while a `$10` is available. Replacing that choice with `$10 + $5` leaves two more
`$5` bills and one fewer `$10`. Those two `$5` bills can replace the `$10` in any later payment,
while also supporting `$10` customers, so the replacement cannot make the future less feasible.
Therefore the greedy preference is safe, and failure means no valid change was available.

**Complexity**

- **Time:** `O(n)` for `n` customers.
- **Space:** `O(1)` auxiliary space.
