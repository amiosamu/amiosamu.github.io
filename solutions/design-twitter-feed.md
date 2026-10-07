---
# Design Twitter · Medium · Heap / Priority Queue
# https://leetcode.com/problems/design-twitter/
draft: false
pattern: "K-way merge with a max-heap"
time: "O(f) per feed, O(1) per post/follow"
space: "O(T + F + U)"
---

## Description

Design a simplified Twitter that supports posting, following, unfollowing, and retrieving
the 10 newest tweet IDs from a user and everyone that user follows.

**Example**

```
Input:
operations = ["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet",
              "getNewsFeed", "unfollow", "getNewsFeed"]
arguments = [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]
Output: [null, null, [5], null, null, [6, 5], null, [5]]
```

User 1 initially sees tweet 5. Following user 2 adds newer tweet 6 to the feed, and
unfollowing user 2 removes it again.

## Intuition

Each user's tweets are already ordered by a global increasing timestamp. A news feed is
therefore a merge of sorted tweet lists, but only its first 10 results are needed. Seed a
heap with the newest tweet from each relevant user, then replace each emitted tweet with
the next older tweet from the same user.

Python's heap is a min-heap, so negated timestamps expose the globally newest candidate.
Sets make repeated follows harmless and `discard` makes an absent unfollow a no-op.

## Approach

1. Store each user's `(time, tweetId)` pairs in append order and each follower's followees
   in a set. Increment the global `time` after every post.
2. For a feed, consider the followee set union `{userId}` so users always see their own
   tweets. The set also prevents a self-follow from duplicating those tweets.
3. Put each relevant user's newest tweet in `heap` as
   `(-time, tweetId, userId, next_older_index)`, then heapify once.
4. Pop at most 10 tweets. After each pop, push the next older tweet from the same user's
   list when one exists.
5. Implement `follow` with set `add` and `unfollow` with `discard`.

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
        for uid in self.following.get(userId, set()) | {userId}:
            posts = self.tweets.get(uid)
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

The heap invariant is that it contains the newest unreported tweet from every relevant user
whose list still has candidates. Its smallest tuple has the most negative timestamp and is
therefore the newest remaining tweet overall. Emitting it and advancing only that user's
cursor restores the invariant. Repeating at most 10 times returns exactly the newest feed
items in order.

**Complexity**

- **Time:** `O(1)` amortized for `postTweet` and expected `O(1)` for `follow` and
  `unfollow`. `getNewsFeed` is `O(f + 10 log f)`, or `O(f)`, for `f` relevant users.
- **Space:** `O(T + F + U)` persistent space for `T` tweets, `F` relationships, and `U`
  users retained by the maps, plus `O(f)` temporary space for one feed request.
- **Output:** `O(1)` because a feed contains at most 10 tweet IDs.
