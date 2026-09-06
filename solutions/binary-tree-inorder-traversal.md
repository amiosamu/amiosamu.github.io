---
# Binary Tree Inorder Traversal · Easy · Trees
# https://leetcode.com/problems/binary-tree-inorder-traversal/
draft: false
pattern: "Iterative inorder with explicit stack"
time: "O(n)"
space: "O(h)"
---

## Intuition

In-order means left subtree, then node, then right subtree — that's the definition, and the three-line recursion writes itself. The interesting version is the follow-up: do it without recursion. The insight is that recursion's call stack is only ever holding *ancestors whose value hasn't been printed yet*, and every one of those was reached by walking left. So I can replicate it with one explicit `stack`: run all the way down the left spine pushing as I go, then pop, emit, and restart the same descent from the popped node's right child.

## Approach

1. Keep `res` for the output, `stack` for ancestors not yet emitted, and `cur` for the node I'm currently descending from. Start `cur = root`, `stack = []`.
2. Loop while `cur` is not None **or** `stack` is non-empty. Both conditions are needed: `cur` non-None means there's more to descend into, a non-empty `stack` means there are ancestors still owing me a visit.
3. Inner loop: while `cur`, push `cur` onto `stack` and set `cur = cur.left`. This walks the left spine and leaves the deepest left node on top.
4. `cur = stack.pop()` — this node's entire left subtree has now been emitted, so append `cur.val` to `res`.
5. Set `cur = cur.right` and let the outer loop repeat. If the right child is None the outer loop falls straight through to another pop, which is exactly "done with this node, go back up".
6. Return `res`. Empty tree needs no special case: `cur` is None and `stack` is empty, so the loop never runs.

## Code

```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res = []
        stack = []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            res.append(cur.val)
            cur = cur.right
        return res
```

## Why it works

The invariant is that `stack` holds exactly the ancestors of `cur` whose value hasn't been emitted yet, deepest on top, and that a node is popped only after its whole left subtree has been emitted — which is precisely the in-order rule. Each node is pushed once and popped once, so the work is O(n). The stack is bounded by the length of the current root-to-node path, O(h), which is O(log n) for a balanced tree and O(n) for a fully left-skewed one.
