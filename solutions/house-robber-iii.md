---
# House Robber III · Medium · Trees
# https://leetcode.com/problems/house-robber-iii/
draft: false
pattern: "Post-order DP returning (rob, skip) pair"
time: "O(n)"
space: "O(h)"
---

## Intuition

A single number per subtree isn't enough: knowing the best haul from a child's subtree doesn't say whether that haul *used the child*, and that's exactly what the parent needs to know, since robbing a node forbids robbing its children. So every subtree reports two numbers — the best total if I rob its root, and the best total if I don't. With both in hand the parent's choice is arithmetic, and the "skip a house, then you may take the grandchildren" reasoning falls out instead of being special-cased.

## Approach

1. Write `dfs(node)` returning a tuple `(rob, skip)` with an exact contract: `rob` is the maximum money from `node`'s subtree **given that `node` itself is robbed**, and `skip` is the maximum **given that `node` is not robbed**. Note `skip` is not "the best without any constraint on children" — the children are free to be robbed or not.
2. Base case: `node` is None, return `(0, 0)`.
3. Post-order: unpack `l_rob, l_skip = dfs(node.left)` and `r_rob, r_skip = dfs(node.right)` before deciding anything, because the answer at a node is a function of its children's answers.
4. `rob = node.val + l_skip + r_skip` — taking this house forces both children to be skipped, so only their `skip` values are admissible.
5. `skip = max(l_rob, l_skip) + max(r_rob, r_skip)` — not taking this house frees each child independently, so take the better option on each side. This is where the grandchildren come in for free: `l_rob` already accounts for them.
6. Return `(rob, skip)`.
7. The answer is `max(dfs(root))` — the root is unconstrained, so take the better of its two cases. Returns 0 for an empty tree.

## Code

```python
class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def dfs(node):
            if not node:
                return (0, 0)
            l_rob, l_skip = dfs(node.left)
            r_rob, r_skip = dfs(node.right)
            rob = node.val + l_skip + r_skip
            skip = max(l_rob, l_skip) + max(r_rob, r_skip)
            return (rob, skip)

        return max(dfs(root))
```

## Why it works

The only constraint linking subtrees is parent-child adjacency, so once I fix whether a node is robbed, its two subtrees become completely independent problems and their optima can simply be added — that is what makes the two-state recurrence exact rather than greedy. Both cases are enumerated at every node, so no valid selection is missed and no invalid one (a node together with a child) is ever counted, since `rob` reaches only into `skip` values. Each node is visited once producing O(1) arithmetic, giving O(n) time and O(h) stack — O(n) on a skewed tree.
