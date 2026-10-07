---
# Word Ladder · Hard · Graphs
# https://leetcode.com/problems/word-ladder/
draft: false
pattern: "BFS over wildcard-pattern buckets"
time: "O(n * m^2)"
space: "O(n * m^2)"
---

## Description

Given `beginWord`, `endWord`, and a `wordList`, return the number of words in the shortest
transformation sequence from `beginWord` to `endWord`, changing exactly one letter at a
time. Every transformed word, including `endWord`, must appear in `wordList`; `beginWord`
does not need to appear there. Return `0` if no such sequence exists.

**Example**

```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
```

`hit -> hot -> dot -> dog -> cog` is a shortest valid sequence and contains five words.

## Intuition

Treat words as vertices joined when they differ at one position. Because every transformation has
unit cost, BFS finds the shortest sequence. Wildcard patterns such as `h*t` group potential
neighbors without comparing every pair. Once a bucket is expanded, clear it so later words do not
rescan the same adjacency list.

## Approach

1. Return `0` if `endWord` is absent from `wordList`.
2. Bucket every listed word under each wildcard pattern obtained by replacing one character.
3. Start BFS with `beginWord`, sequence length `1`, and mark words when enqueuing them.
4. Process one queue level at a time; return the current length when `endWord` is dequeued.
5. Expand all buckets for each word, enqueue unseen neighbors, then clear each used bucket.
6. Increment the length after each level and return `0` if BFS exhausts the graph.

## Code

```python
import collections

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0

        patterns = collections.defaultdict(list)
        for word in wordList:
            for i in range(len(word)):
                patterns[word[:i] + "*" + word[i + 1:]].append(word)

        visited = {beginWord}
        queue = collections.deque([beginWord])
        steps = 1

        while queue:
            for _ in range(len(queue)):
                word = queue.popleft()
                if word == endWord:
                    return steps
                for i in range(len(word)):
                    pattern = word[:i] + "*" + word[i + 1:]
                    for nei in patterns[pattern]:
                        if nei not in visited:
                            visited.add(nei)
                            queue.append(nei)
                    patterns[pattern] = []
            steps += 1

        return 0
```

## Why it works

Two distinct equal-length words share a wildcard pattern exactly when they differ at the replaced
position, so the buckets encode all valid edges. BFS maintains that a queue level contains exactly
the words at one transformation distance. Marking on enqueue cannot hide a shorter route, and
clearing a bucket is safe because all of its words are discovered at the earliest level when that
bucket is first expanded. Therefore the first visit to `endWord` has minimum sequence length.

**Complexity**

- **Time:** `O(n * m^2)` for `n` words of length `m`; Python pattern slices cost `O(m)`, and
  clearing buckets ensures their entries are scanned once.
- **Space:** `O(n * m^2)` for materialized pattern strings and bucket entries.
