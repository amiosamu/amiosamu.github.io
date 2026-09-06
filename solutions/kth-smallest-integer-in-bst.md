---
# Kth Smallest Element In a Bst · Medium · Trees
# https://leetcode.com/problems/kth-smallest-element-in-a-bst/
draft: false
pattern: "Iterative inorder, stop at k"
time: "O(h + k)"
space: "O(h)"
---

## Intuition

In-order traversal of a BST emits values in sorted order — that is the whole problem. So the kth smallest is simply the kth value the in-order walk produces, and I don't need to collect anything: I count pops and return the moment the counter hits `k`. Doing it iteratively rather than recursively is what makes the early exit clean, since I can just `return` out of the loop instead of unwinding a recursion with a flag.

## Approach

1. Keep `stack` for ancestors not yet visited and `cur` for the node I'm descending from; start `cur = root`, `stack = []`.
2. Loop while `cur` or `stack` — `cur` non-None means there is more to descend into, a non-empty stack means ancestors still owe me a visit.
3. Inner loop: while `cur`, push it and move `cur = cur.left`. This runs down the left spine, so the smallest remaining value ends up on top.
4. Pop into `cur`. Its entire left subtree has now been emitted, so this pop is the next value in sorted order.
5. Decrement `k`. If `k == 0`, return `cur.val` — this is the kth smallest and there's no reason to touch the rest of the tree.
6. Otherwise set `cur = cur.right` and let the outer loop continue; if the right child is None the loop falls straight through to the next pop, which is "go back up to the ancestor".
7. `1 <= k <= n` is guaranteed, so the loop always returns before running dry.
8. For the follow-up (many queries on a frequently modified tree): store a subtree-size count in each node, then each query descends once, comparing `k` against `left.size + 1` to pick a side — O(h) per query, with O(n) one-off setup and O(h) maintenance per insert or delete.

## Code

```python
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right
```

## Why it works

The step that uses the BST invariant is the claim that in-order order equals sorted order: every value in a node's left subtree is smaller than it and every value in its right subtree is larger, so emitting left, node, right produces a strictly increasing sequence — by induction over the whole tree. Counting pops therefore counts values in ascending order, and the kth pop is the kth smallest. The initial descent costs O(h), after which each of the `k` pops does O(1) amortized work plus its own descent, giving O(h + k) time and a stack bounded by the current root-to-node path, O(h), which is O(n) for a degenerate tree.
