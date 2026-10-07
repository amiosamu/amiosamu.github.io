---
# House Robber III · Medium · Trees
# https://leetcode.com/problems/house-robber-iii/
draft: false
pattern: "Post-order DP returning (rob, skip) pair"
time: "O(n)"
space: "O(h)"
---

## Description

Given a binary tree whose node values are amounts of money, return the maximum amount that
can be robbed without choosing two directly connected nodes.

**Example**

```
Input: root = [3,2,3,null,3,null,1]
Output: 7
```

Explanation: Robbing the root and its two grandchildren gives `3 + 3 + 1 = 7` while
skipping both children.

## Intuition

A parent needs to know whether each child's optimum includes that child. Therefore each
subtree returns two values: the best total when its root is robbed and the best total when
its root is skipped.

Once the current node's state is fixed, its left and right subtrees are independent. Their
appropriate totals can be added in a postorder traversal.

## Approach

1. Define `dfs(node)` to return `(rob, skip)`, the conditional optima for `node`'s
   subtree. Return `(0, 0)` for a missing node.
2. Recursively compute both states for the left and right children.
3. Set `rob = node.val + l_skip + r_skip`, because robbing `node` excludes both children.
4. Set `skip = max(l_rob, l_skip) + max(r_rob, r_skip)`, because each child is then
   unconstrained.
5. Return `max(dfs(root))`. This also returns zero for an empty tree and does not mutate it.

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

By induction on subtree height, `dfs` returns both stated optima. The claim is trivial for a
missing node. If the node is robbed, both children must be skipped, so `rob` combines the
only legal child states. If it is skipped, each child may independently use its better state,
which gives `skip`. These cases cover every valid selection without allowing a parent-child
pair. Taking the larger root state is therefore globally optimal.

**Complexity**

- **Time:** `O(n)` because each node is processed once.
- **Space:** `O(h)` for recursion depth, where `h` is the tree height.
