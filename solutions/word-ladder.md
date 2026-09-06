---
# Word Ladder · Hard · Graphs
# https://leetcode.com/problems/word-ladder/
draft: false
pattern: "BFS over wildcard-pattern buckets"
time: "O(n * m^2)"
space: "O(n * m^2)"
---

## Intuition

The graph is implicit: nodes are the words in `wordList` plus `beginWord`, and two words
are adjacent when they differ in exactly one position. The shortest transformation
sequence is the shortest path, and every edge costs 1, so BFS from `beginWord` is exactly
right — the first time BFS reaches `endWord` it is via a minimum number of hops.

The trap is building the edges. Comparing all pairs is `O(n^2 * m)` with `n = 20000`. The
fix is a set of intermediate hub nodes: for each word, generate its `m` wildcard patterns
(`hit` -> `*it`, `h*t`, `hi*`) and bucket the word under each. Two words are neighbours iff
they share a bucket, so neighbour lookup becomes a dict hit and the whole adjacency
structure is built in one linear pass.

## Approach

1. If `endWord not in wordList`, return `0` — there is no node to reach.
2. Build `patterns = collections.defaultdict(list)`: for every `word` in `wordList` and
   every index `i`, append `word` to `patterns[word[:i] + "*" + word[i+1:]]`.
3. Initialise `queue = deque([beginWord])`, `visited = {beginWord}`, and `steps = 1` —
   the problem counts the number of words in the sequence, not the number of edges, so
   `beginWord` alone is already length 1.
4. Process the queue **level by level**: an outer `while queue` and an inner
   `for _ in range(len(queue))`, snapshotting the level size before popping. Increment
   `steps` once per completed level, which is what keeps the counter equal to the current
   distance.
5. Inside the level, pop `word`; if it equals `endWord`, return `steps`.
6. Otherwise, for each index `i`, look up `patterns[word[:i] + "*" + word[i+1:]]` and for
   every `nei` in that bucket not already in `visited`, add it to `visited` and enqueue it.
   Marking on enqueue, not on pop, is essential here: a single word sits in `m` different
   buckets and can be reached several times within one level, and marking late would
   enqueue it repeatedly and blow up the queue.
7. If the queue drains without hitting `endWord`, return `0`. `beginWord` need not be in
   `wordList`, which is fine — it only ever gets read out of the queue, never looked up.

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
                    for nei in patterns[word[:i] + "*" + word[i + 1:]]:
                        if nei not in visited:
                            visited.add(nei)
                            queue.append(nei)
            steps += 1

        return 0
```

## Why it works

Sharing a wildcard bucket is the same relation as differing in exactly one position, so
the buckets encode the true adjacency without ever comparing two words directly. BFS on an
unweighted graph dequeues nodes in nondecreasing distance from the source, so the level
counter `steps` is the true hop count when `endWord` comes off the queue, and marking a
word visited the moment it is enqueued only ever discards a rediscovery at the same or a
greater distance — never a shorter one. With `n` words of length `m`, building `patterns`
costs `O(n * m)` slices of length `m`, i.e. `O(n * m^2)` time and space, and the BFS
visits each word once while scanning its `m` buckets, which is dominated by the same bound.
