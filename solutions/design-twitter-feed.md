---
# Design Twitter · Medium · Heap / Priority Queue
# https://leetcode.com/problems/design-twitter/
draft: false
pattern: "K-way merge with a max-heap"
time: "O(f) per feed, O(1) per post/follow"
space: "O(tweets + follows)"
---

## Intuition

Each user's own tweet list is already sorted by time — appended in order — so a news feed is a **k-way merge of f sorted lists**, and I only want the first 10 items of the merge. Merging all of them and sorting would cost O(total tweets log total tweets) per call; instead I seed a max-heap with the newest tweet of each followee and pop 10 times, refilling from whichever list the winner came from. A global counter stamped on every tweet gives the ordering, so I never depend on wall-clock time and never get a tie.

## Approach

1. State: `self.time`, an ever-increasing stamp; `self.tweets`, a `defaultdict(list)` mapping user to a list of `(time, tweetId)` in post order; `self.following`, a `defaultdict(set)`.
2. `postTweet`: append `(self.time, tweetId)` to that user's list and increment `self.time`. O(1).
3. `getNewsFeed`: for each `uid` in `self.following[userId] | {userId}` — the user always sees their own tweets — take the *last* entry of their list, if any, and collect `(-t, tweetId, uid, i - 1)` where `i` is the index of that entry. Negating `t` makes `heapq` behave as a max-heap on time; `i - 1` is the cursor into the rest of that user's list.
4. `heapify` the collected tuples, then pop up to 10 times, appending the `tweetId` to `feed`. Each time a tuple from user `uid` is popped, if its cursor `i >= 0` push that user's next-older tweet with the cursor decremented.
5. The stamps are globally unique, so the heap never has to compare the later tuple fields — the ordering is fully decided by `-t`.
6. `follow` adds to the set; `unfollow` uses `discard`, not `remove`, so unfollowing someone you never followed (or yourself) is a no-op rather than a `KeyError`.
7. Return `feed` — at most 10 ids, newest first.

## Code

```python
import collections
import heapq

class Twitter:

    def __init__(self):
        self.time = 0
        self.tweets = collections.defaultdict(list)    # userId -> [(time, tweetId)]
        self.following = collections.defaultdict(set)  # userId -> {followeeId}

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> List[int]:
        heap = []
        for uid in self.following[userId] | {userId}:
            posts = self.tweets[uid]
            if posts:
                i = len(posts) - 1
                t, tweetId = posts[i]
                heap.append((-t, tweetId, uid, i - 1))
        heapq.heapify(heap)

        feed = []
        while heap and len(feed) < 10:
            _, tweetId, uid, i = heapq.heappop(heap)
            feed.append(tweetId)
            if i >= 0:
                t, older = self.tweets[uid][i]
                heapq.heappush(heap, (-t, older, uid, i - 1))

        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)
```

## Why it works

The heap invariant is that it always holds the newest not-yet-emitted tweet from every followee, so its root is the newest tweet in the whole union — that is exactly the merge step, and popping it 10 times yields the 10 most recent in order. Refilling only from the list that just lost an element keeps the invariant with one push. Building the heap is O(f) for f followees and each of the at most ten pops is O(log f), so a feed costs O(f) — dominated by walking the followee set, not by the merge — while posting and following are O(1).
