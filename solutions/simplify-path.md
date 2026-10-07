---
# Simplify Path · Medium · Stack
# https://leetcode.com/problems/simplify-path/
draft: false
pattern: "Stack of directory names"
time: "O(n)"
space: "O(n)"
---

## Description

Given an absolute Unix path containing possible repeated slashes, `.` segments, and `..`
segments, return its canonical form.

**Example**

```
Input: path = "/a/./b/../../c/"
Output: "/c"
```

Explanation: `.` is ignored, and the two `..` segments remove `b` and `a`, leaving `/c`.

## Intuition

A stack can represent the directory chain from the root to the current location. A normal name
pushes one directory, while `..` pops one if possible. Empty segments from repeated slashes and
`.` do not change the location. Attempts to move above the root are ignored.

## Approach

1. Split `path` on `/` and keep a stack of active directory names.
2. Ignore `""` and `"."`; on `".."`, pop only when the stack is nonempty.
3. Push every other token, including names such as `"..."` that have no special meaning.
4. Join the stack with `/` and prepend `/`. An empty stack naturally produces the root path.

## Code

```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        stack = []

        for part in path.split("/"):
            if part == "" or part == ".":
                continue
            if part == "..":
                if stack:
                    stack.pop()
            else:
                stack.append(part)

        return "/" + "/".join(stack)
```

## Why it works

After each token, the stack is exactly the canonical directory chain reached by the processed
prefix. Ignored tokens preserve the chain, a normal name extends it, and `..` removes its final
directory unless already at root. By induction, the final stack represents the full path.
Joining only stored names creates one leading slash, single separators, and no trailing slash.

**Complexity**

- **Time:** `O(n)` to split, process, and join a path of length `n`.
- **Space:** `O(n)` for tokens and the directory stack.
