---
# Simplify Path · Medium · Stack
# https://leetcode.com/problems/simplify-path/
draft: false
pattern: "Stack of directory names"
time: "O(n)"
space: "O(n)"
---

## Description

Given an absolute Unix-style file path as a string, possibly containing redundant slashes, `.` segments (current directory), and `..` segments (parent directory), return the simplified canonical path: a single leading slash, directories separated by single slashes, no trailing slash (unless the result is the root), and every `.` and resolvable `..` collapsed away.

**Example**

```
Input: path = "/a/./b/../../c/"
Output: "/c"
```

Explanation: The `.` is skipped, the first `..` removes `b`, and the second `..` removes `a`, leaving only `c`.

## Intuition

A canonical path is just the list of directories you are actually inside, and `..` is a pop of that list — so the whole problem is a stack of names. Splitting the path on `/` turns every messy case into a single token: repeated slashes and a trailing slash both produce empty strings, `.` produces a token to ignore, and `..` produces a pop. The only subtlety is that popping at the root is a no-op rather than an error, since `/..` stays `/`.

## Approach

1. Keep `stack`, the directory names currently entered, outermost first.
2. Iterate over `path.split("/")`. Splitting handles `//` and `a/` for free by yielding `""`.
3. Skip a part that is `""` or `"."` — neither changes the current directory.
4. On `".."`, pop from `stack` only `if stack`; at the root there is nothing above, so it is silently ignored.
5. Otherwise the part is a real name (possibly something like `...`, which is a legal directory name, not a special token) — push it.
6. Join with `"/"` and prepend a leading `"/"`, since the result is always absolute.
7. An empty stack yields `"/"` exactly, which is the required canonical root.

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

The stack is the invariant: after processing a prefix of the tokens, it holds exactly the directory chain that prefix walks to, so processing all of them leaves the chain the full path walks to. Canonicity follows from construction rather than from cleanup — nothing empty, no `.`, and no `..` is ever pushed, and there is no trailing slash because the join sits between names. Each token is pushed and popped at most once and the join is linear in the output, so the whole thing is O(n) time and O(n) space for a path of length `n`.
