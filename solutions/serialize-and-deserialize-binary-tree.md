---
# Serialize And Deserialize Binary Tree · Hard · Trees
# https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
draft: false
pattern: "Preorder with null markers"
time: "O(n)"
space: "O(n)"
---

## Intuition

A traversal alone doesn't determine a tree — that's why "Construct Binary Tree from Preorder and Inorder" needs two of them. But the reason a single pre-order is ambiguous is that missing children are invisible; if I write an explicit marker for every None, the ambiguity disappears, because the reader then knows exactly when a subtree ends. Pre-order is the order to pick: it emits the root before its subtrees, so the reader can create a node and then immediately recurse to fill its children in the same order they were written, consuming the stream strictly left to right with no index arithmetic.

## Approach

1. **serialize** — walk pre-order, appending to a list `parts` and joining once at the end (repeated string concatenation would be O(n²)).
2. In `dfs(node)`: if `node` is None append `"#"` and return; otherwise append `str(node.val)`, then `dfs(node.left)`, then `dfs(node.right)`.
3. Join `parts` with `","`. The separator matters because values are multi-digit and can be negative (`-1000 <= val <= 1000`), so the digits of adjacent nodes must not run together.
4. **deserialize** — split on `","` and wrap in an iterator: `vals = iter(data.split(","))`. The iterator *is* the cursor; `next(vals)` both reads and advances, which is what keeps the two recursions in lockstep without a shared index variable.
5. In `build()`: read `val = next(vals)`. If it is `"#"`, return None — the marker is what terminates a branch. Otherwise create `TreeNode(int(val))`, then set `.left = build()` and **then** `.right = build()`.
6. The left-before-right order is not optional: it must mirror the order `serialize` wrote them, since the whole left subtree occupies a contiguous run of the stream before the right subtree starts.
7. `build()` returns the root. An empty tree round-trips as `"#"` and rebuilds as None, so no special case is needed on either side.

## Code

```python
class Codec:
    def serialize(self, root):
        parts = []

        def dfs(node):
            if not node:
                parts.append("#")
                return
            parts.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(parts)

    def deserialize(self, data):
        vals = iter(data.split(","))

        def build():
            val = next(vals)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node

        return build()
```

## Why it works

With null markers the encoding is a full pre-order of the *extended* tree, in which every real node has exactly two children, and such a sequence is uniquely decodable: reading a token tells you immediately whether to stop or to consume two subtrees, so `build` and `dfs` traverse the same shape in the same order and the iterator's position after decoding a subtree is exactly where the encoder finished writing it. Each node contributes one token and one None-marker per empty slot — at most 2n + 1 tokens — so both directions are O(n) time and O(n) space for the string, plus O(h) recursion.
