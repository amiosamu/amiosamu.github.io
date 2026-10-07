---
# Serialize And Deserialize Binary Tree · Hard · Trees
# https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
draft: false
pattern: "Preorder with null markers"
time: "O(n)"
space: "O(n)"
---

## Description

Design methods to serialize a binary tree into a string and deserialize that string into a tree
with the same values and structure.

**Example**

```
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
```

Explanation: Serializing and then deserializing the tree reconstructs the original structure.

## Intuition

Preorder alone is ambiguous because missing children are invisible. Writing a marker for every
`None` child removes that ambiguity: each token now says either "this subtree is empty" or
"create a node and decode two child subtrees." Preorder lets the decoder create each node
before recursively filling its left and right children.

## Approach

1. During serialization, append `"#"` for `None`; otherwise append the node value, then
   serialize its left and right children.
2. Join tokens with commas so multi-digit and negative values remain separated.
3. During deserialization, consume the split tokens through an iterator. Return `None` for
   `"#"`; otherwise create a node from the integer token.
4. Decode the left subtree and then the right subtree, matching the encoder's order.
5. An empty tree becomes the single token `"#"`, so it requires no special outer case.

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

Prove round-trip correctness by induction on a subtree. An empty subtree serializes as `"#"`
and deserializes to `None`. For a real node, the first token reconstructs its value. By the
induction hypothesis, the following contiguous token sequences reconstruct its left and right
subtrees, in that order. Thus the rebuilt subtree has exactly the original value and structure.
The iterator advances once per token, so sibling boundaries are consumed correctly.

**Complexity**

- **Time:** `O(n)` for either operation because each real or null node position is processed
  once.
- **Space:** `O(n)` for tokens and serialized data, plus `O(h)` recursion; the rebuilt tree is
  output space.
