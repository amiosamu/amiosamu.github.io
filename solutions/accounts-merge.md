---
# Accounts Merge · Medium · Graphs
# https://leetcode.com/problems/accounts-merge/
draft: false
pattern: "Union-Find over accounts keyed by email"
time: "O(N log N)"
space: "O(N)"
---

## Description

Given a list of `accounts`, each `[name, email1, email2, ...]`, where the same person may
appear more than once under the same name with some emails in common, merge the accounts
belonging to the same person (two accounts are the same person if they share at least one
email) and return each merged account as `[name, sorted emails...]`, in any order.

**Example**

```
Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
```

Explanation: the first two "John" accounts share `johnsmith@mail.com`, so they merge into
one account holding all three emails sorted, while the third "John" account shares no email
with the others and stays separate.


## Intuition

Treat account indices as graph nodes. Accounts that share an email belong to the same
connected component, including through a chain of shared emails. Union-find builds those
components without comparing every pair of accounts.

The `owner` map records the first account seen for each email. Every later occurrence unions
its account with that first owner, which is enough to connect all accounts containing the email.

## Approach

1. Initialize `parent` and `rank` for union-find. `find` compresses paths, and `union`
   attaches the smaller component to the larger one.
2. Scan every email. Store its first account index in `owner`, or union the current account
   with the stored account when the email has appeared before.
3. After all unions, map each distinct email to `find(owner[email])`. This groups emails by
   their final component root and also removes duplicate occurrences.
4. Sort each component's emails and prefix them with the name from its root account.

## Code

```python
import collections

class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        n = len(accounts)
        parent = list(range(n))
        rank = [1] * n

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a: int, b: int) -> None:
            ra, rb = find(a), find(b)
            if ra == rb:
                return
            if rank[ra] < rank[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            rank[ra] += rank[rb]

        owner = {}  # email -> index of the first account that listed it
        for i, acc in enumerate(accounts):
            for email in acc[1:]:
                if email in owner:
                    union(i, owner[email])
                else:
                    owner[email] = i

        groups = collections.defaultdict(list)
        for email, i in owner.items():
            groups[find(i)].append(email)

        return [[accounts[root][0]] + sorted(emails) for root, emails in groups.items()]
```

## Why it works

For any email, every account containing it is unioned with the same first owner, so all such
accounts share a component. Conversely, unions occur only because of a shared email, so a
component contains exactly one connected group of accounts. Looking up the final root then
places every distinct email in the correct merged account.

**Complexity**

- **Time:** `O(N log N)` for `N` total email entries; union-find costs
  `O(N alpha(N))`, and sorting the merged email groups dominates.
- **Space:** `O(N + A)` auxiliary space for the maps, groups, and union-find arrays, where
  `A` is the number of accounts. The returned accounts require `O(N)` space.
