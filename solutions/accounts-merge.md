---
# Accounts Merge · Medium · Graphs
# https://leetcode.com/problems/accounts-merge/
draft: false
pattern: "Union-Find over accounts keyed by email"
time: "O(N log N)"
space: "O(N)"
---

## Intuition

There is no edge list here — I have to invent one. The nodes are the account *indices*
`0..len(accounts)-1`, and there is an edge between two accounts whenever they share at
least one email. Merging accounts is then just finding connected components of that graph,
and the transitivity the problem describes ("A shares with B, B shares with C") is exactly
connectivity.

Building the edges explicitly would be quadratic, so instead I keep a dict
`owner[email] -> first account index that listed it`. When account `i` mentions an email
already claimed by account `j`, that is the edge, and I `union(i, j)` on the spot. That
turns the whole grouping into one linear pass plus a final sort of each component's
emails.

## Approach

1. Set up union-find over `n = len(accounts)`: `parent = list(range(n))`,
   `rank = [1] * n`, `find` with path halving, `union` by size.
2. Sweep `for i, acc in enumerate(accounts)` and, for each `email` in `acc[1:]` (skipping
   the name at index 0):
   - if `email in owner`, call `union(i, owner[email])` — same person;
   - else record `owner[email] = i`.
   Keeping only the *first* claimant is enough; every later account holding that email
   gets unioned into the same component through it.
3. Second pass: group emails by component root. Iterate `owner.items()` and append each
   `email` to `groups[find(i)]` using a `collections.defaultdict(list)`. Doing this after
   all unions is important — `find(i)` is only final once the merging is done.
4. `owner` holds each distinct email exactly once, so no de-duplication step is needed;
   duplicates within a single account collapse there too.
5. Build the answer as `[[accounts[root][0]] + sorted(emails) for root, emails in
   groups.items()]`. The name is read off the root account, and every account in a
   component belongs to the same person so any of them carries the right name.
6. Emails must come back sorted; account order in the output is unconstrained.

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

Two accounts belong together iff they are connected through shared emails, and unioning
each account with the first claimant of every email it lists produces exactly that
connectivity: if accounts `a` and `b` share email `e`, both were unioned with
`owner[e]`, so they land in one component, and transitive chains follow because union-find
components are closed under merging. The second pass then assigns each email to the
component of *any* account that listed it, which is well-defined since all such accounts
share a root. With `N` emails in total, the two passes are `O(N * α(N))` and the per-group
sorting sums to `O(N log N)`, which dominates; space is `O(N)` for `owner` and `groups`.
