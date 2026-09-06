---
# Lemonade Change · Easy · Greedy
# https://leetcode.com/problems/lemonade-change/
draft: false
pattern: "Greedy change, largest bill first"
time: "O(n)"
space: "O(1)"
---

## Description

Given an array `bills` listing, in order, the bill (`$5`, `$10`, or `$20`) each customer pays
for a `$5` lemonade, and starting with no change on hand, determines whether every customer
can be given exact change using only bills collected from earlier customers.

**Example**

```
Input: bills = [5,5,5,10,20]
Output: true
```

Explanation: the three `$5` bills build up change; the `$10` customer gets one `$5` back, and
the `$20` customer gets one `$5` and one `$10` back, so every transaction is covered.

## Intuition

With only three denominations there is exactly one decision in the whole problem: a $20 needs $15
back, which is either a $10 + a $5 or three $5s. Everything else is forced — a $10 always takes a
single $5, a $5 takes nothing. The observation that settles the decision is that $5 bills are
strictly more useful than $10s: a $10 can only ever be part of change for a $20, while a $5 is
needed for a $10 and can also stand in for a $10 (two of them). So I hoard fives and dump tens
first. I never need to track $20s at all — nothing gives a $20 as change.

## Approach

1. Keep two counters, `fives` and `tens`. Nothing tracks twenties: they can never be handed back.
2. Walk `bills` in order — the queue order matters, this is not a multiset problem.
3. `bill == 5`: no change owed, `fives += 1`.
4. `bill == 10`: I owe $5. If `fives == 0` return `False`; otherwise `fives -= 1` and `tens += 1`.
5. `bill == 20`: I owe $15. Prefer `tens > 0 and fives > 0` — spend one of each. Only if that fails
   fall back to `fives >= 3` and spend three. If neither is available return `False`.
6. The order of those two branches is the entire greedy; flipping it breaks cases like
   `[5,5,5,10,20]`, where paying the $20 with three fives leaves a $10 that can never be used.
7. Survive the loop and return `True`.

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

Exchange argument: take any successful sequence of transactions that pays some $20 with three $5s
at a moment when a $10 was in the drawer, and rewrite it to pay with $10 + $5. The drawer after the
rewrite has one fewer $10 and two more $5s, and that inventory dominates the original — every later
payment the old drawer could make, the new one can make too, since any use of a $10 can be replaced
by two $5s but not the reverse. So the rewritten run also succeeds, and greedily preferring the $10
never turns a solvable input into a failure. One pass over `bills` with two integers is O(n) time
and O(1) space.
