---
title: "Fundamental Data Structures"
date: "2026-09-06"
description: "A practical guide to core data structures, their common operations, complexity, and Python implementations."
tags: ["data-structures", "algorithms", "python", "coding-interviews"]
---

# Fundamental Data Structures

A data structure is a way to organize values so that the operations a program needs are cheap. The same values may fit in a list, set, tree, or graph; the right choice depends on whether the workload needs indexing, ordered traversal, fast membership tests, priority, prefixes, or relationships.

Complexities below use:

- `n`: number of stored elements
- `L`: length of a string or key
- `h`: height of a tree
- `V`, `E`: number of graph vertices and edges

Space means the storage used by the structure unless it explicitly says **extra space** for an operation.

## Arrays and Dynamic Arrays

An array stores elements in contiguous memory. Given the base address and an index, it can calculate an element's location directly, which makes random access O(1). A fixed array cannot change capacity. A dynamic array allocates a larger backing array and copies its elements when it fills.

Python's `list` is a dynamic array, not a linked list.

| Operation | Time | Notes |
| --- | --- | --- |
| Read or overwrite `a[i]` | O(1) | Direct indexing |
| Append | O(1) amortized | An occasional resize costs O(n) |
| Pop from end | O(1) | Does not shift the prefix |
| Insert or remove at index | O(n) | Later elements shift |
| Search unsorted values | O(n) | Check elements one by one |
| Search sorted values | O(log n) | Binary search |
| Traverse | O(n) | Visit every element |

Space is O(n). A resize temporarily needs O(n) additional space while values are copied.

```python
nums = [10, 20, 30]
nums.append(40)       # [10, 20, 30, 40]
nums.insert(1, 15)    # [10, 15, 20, 30, 40]
removed = nums.pop(2)

print(removed)
print(nums)
print(nums[2])
```

**Sample**

```
Input: nums = [10,20,30], append(40), insert(1,15), pop(2), read(2)
Output: removed = 20, nums = [10,15,30,40], read = 30
```

**Caveat:** O(1) append is amortized, not guaranteed for every call. Also avoid repeated `insert(0, x)` or `pop(0)` on a Python list; both shift all remaining elements. Use a `deque` when both ends matter.

## Strings

A string is a sequence of characters. It supports array-like indexing and slicing, but Python strings are immutable: an operation that appears to edit a string creates a new one.

| Operation | Time | Notes |
| --- | --- | --- |
| Read `s[i]` | O(1) | Python indexes Unicode code points in its internal representation |
| Length | O(1) | Stored with the object |
| Compare | O(L) | May stop at the first mismatch |
| Slice of length `k` | O(k) | Creates a new string |
| Search substring | O(n * L) worst case | Exact implementation is optimized, but do not assume constant time |
| Concatenate | O(n + L) | Creates a new string |
| Build with `''.join(parts)` | O(total characters) | Preferred for many pieces |

Space is O(L). Slices and transformations such as `lower()` generally allocate another O(L) string.

```python
text = "data"
parts = [text[:2], "-", text[2:].upper()]
result = "".join(parts)

print(result)
print(result.find("TA"))
```

**Sample**

```
Input: text = "data", join(text[:2], "-", text[2:].upper()), find("TA")
Output: result = "da-TA", index = 3
```

**Caveat:** Building a result with `result += piece` in a loop can copy the growing prefix repeatedly and become O(n^2). Collect pieces in a list and join once. For user-visible text, remember that one displayed symbol can contain multiple Unicode code points.

## Singly Linked Lists

A singly linked list stores each value in a node with a pointer to the next node. Nodes need not be contiguous. Sequential access is natural, but reaching index `i` requires walking from the head.

| Operation | Time | Notes |
| --- | --- | --- |
| Traverse or search | O(n) | Follow `next` pointers |
| Read by index | O(n) | No direct indexing |
| Insert/remove at head | O(1) | Change the head pointer |
| Insert after a known node | O(1) | Rewire two pointers |
| Remove after a known predecessor | O(1) | Rewire one pointer |
| Append | O(1) with tail, O(n) without | Tail must be maintained |

Space is O(n), including one `next` pointer per node.

A **dummy** or **sentinel** node is a permanent placeholder before the real head. It removes the special case for inserting or deleting the first real node. The dummy does not represent input data.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class SinglyLinkedList:
    def __init__(self):
        self.dummy = ListNode()

    def insert_front(self, val):
        self.dummy.next = ListNode(val, self.dummy.next)

    def remove_first(self, val):
        prev = self.dummy
        while prev.next and prev.next.val != val:
            prev = prev.next
        if not prev.next:
            return False
        prev.next = prev.next.next
        return True

    def values(self):
        result = []
        curr = self.dummy.next
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result
```

**Sample**

```
Input: insert_front(3), insert_front(2), insert_front(1), remove_first(2), traverse()
Output: removed = true, values = [1,3]
```

Traversal and removal above take O(n) time and O(1) extra pointer space; `values()` uses O(n) output space. `insert_front` is O(1).

**Caveat:** Save the next node before overwriting `curr.next`, or the untouched suffix can become unreachable. A tail pointer makes append O(1), but removing the tail remains O(n) because its predecessor is unknown.

## Doubly Linked Lists

A doubly linked node points both forward and backward. Given a node, it can be removed in O(1), and the list can be traversed in either direction. The cost is another pointer per node and more links to keep consistent.

Head and tail sentinels make every real node have both a predecessor and successor. Insertion and removal then use the same pointer updates at the ends and in the middle.

| Operation | Time | Notes |
| --- | --- | --- |
| Traverse or search | O(n) | Forward or backward |
| Insert at either end | O(1) | With sentinels or head/tail pointers |
| Remove a known node | O(1) | Both neighbors are available |
| Read by index | O(n) | Can start from the nearer end |
| Find then remove by value | O(n) | Finding dominates |

Space is O(n), with `prev` and `next` pointers per node plus two sentinels.

```python
class DoublyNode:
    def __init__(self, val=None):
        self.val = val
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = DoublyNode()
        self.tail = DoublyNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def append(self, val):
        node = DoublyNode(val)
        prev = self.tail.prev
        prev.next = node
        node.prev = prev
        node.next = self.tail
        self.tail.prev = node
        return node

    def remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def values(self):
        result = []
        curr = self.head.next
        while curr is not self.tail:
            result.append(curr.val)
            curr = curr.next
        return result
```

**Sample**

```
Input: a = append(1), b = append(2), append(3), remove(b), traverse()
Output: values = [1,3]
```

Both `append` and `remove(b)` are O(1); traversal is O(n). This known-node removal is the operation used by an O(1) LRU cache together with a hash table.

**Caveat:** Removal is O(1) only when the node reference is already known. Searching for that node is still O(n). When rewiring, update all four affected links; stale backward pointers create bugs that forward-only tests may miss.

## Stacks

A stack is **last in, first out** (LIFO). `push` adds to the top, `pop` removes the top, and `peek` reads it without removal. Call stacks, undo histories, expression parsing, and iterative DFS all use this discipline.

| Operation | Time | Notes |
| --- | --- | --- |
| Push | O(1) amortized | Append to a dynamic array |
| Pop | O(1) | Remove from the end |
| Peek | O(1) | Read the final element |
| Search | O(n) | A stack provides no index by abstraction |

Space is O(n).

```python
stack = []
stack.append(5)
stack.append(8)
top = stack[-1]
removed = stack.pop()

print(top, removed, stack)
```

**Sample**

```
Input: push(5), push(8), peek(), pop()
Output: peek = 8, popped = 8, stack = [5]
```

**Caveat:** Check whether the stack is empty before reading `stack[-1]` or popping unless an empty stack is explicitly an error. In Python, use the end of a list as the top; inserting and removing at index 0 would be O(n).

## Queues and Deques

A queue is **first in, first out** (FIFO): enqueue at the back and dequeue from the front. A deque, or double-ended queue, supports insertion and removal at both ends. BFS, task scheduling, and sliding-window algorithms commonly use them.

Python's `collections.deque` is the standard implementation.

| Operation | Queue | Deque |
| --- | --- | --- |
| Add right | O(1) | O(1) |
| Remove left | O(1) | O(1) |
| Add left | Not part of queue API | O(1) |
| Remove right | Not part of queue API | O(1) |
| Peek either supported end | O(1) | O(1) |
| Search or middle access | O(n) | O(n) |

Space is O(n).

```python
from collections import deque

queue = deque([1, 2])
queue.append(3)
first = queue.popleft()

dq = deque([2, 3])
dq.appendleft(1)
dq.append(4)
right = dq.pop()

print(first, list(queue))
print(right, list(dq))
```

**Sample**

```
Input: queue [1,2], enqueue(3), dequeue(); deque [2,3], appendleft(1), append(4), pop()
Output: dequeued = 1, queue = [2,3]; popped = 4, deque = [1,2,3]
```

**Caveat:** `list.pop(0)` is not a queue operation with O(1) performance; it shifts the rest of the list. A bounded `deque(maxlen=k)` silently discards an item from the opposite end when full, which is useful for rolling histories but dangerous if data must not be lost.

## Hash Tables and Sets

A hash table applies a hash function to a key to choose a bucket. Python's `dict` maps unique hashable keys to values, while `set` stores only unique keys. Collisions occur when keys choose the same location, so implementations probe or maintain another collision-resolution structure.

### Hash Maps

| Operation | Average time | Worst case |
| --- | --- | --- |
| Insert or update | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Membership | O(1) | O(n) |
| Traverse keys and values | O(n) | O(n) |

Space is O(n), usually with spare capacity to keep the load factor low.

```python
counts = {}
for word in ["red", "blue", "red"]:
    counts[word] = counts.get(word, 0) + 1

print(counts)
print(counts.get("green", 0))
```

**Sample**

```
Input: words = ["red","blue","red"]
Output: counts = {"red": 2, "blue": 1}, count("green") = 0
```

### Hash Sets

A set has the same average lookup, insertion, and deletion costs but answers membership rather than mapping to a value. It naturally removes duplicates.

```python
seen = set([4, 1, 4, 2])
seen.add(3)
seen.discard(1)

print(sorted(seen))
print(4 in seen, 1 in seen)
```

**Sample**

```
Input: values = [4,1,4,2], add(3), discard(1), contains(4), contains(1)
Output: values = [2,3,4], contains(4) = true, contains(1) = false
```

Set union is O(n + m), intersection is O(min(n, m)) on average, and difference is O(n), with result space proportional to the output.

**Caveat:** O(1) is an average-case guarantee, and resizing still causes occasional O(n) work. Keys must be hashable and their hash/equality must not change while stored, so a Python list cannot be a key but a tuple of hashable values can. Do not rely on set iteration order; use `sorted` when output order matters.

## Trees

A tree is a connected acyclic hierarchy. Each node may have children, and every node except the root has one parent. A binary tree limits each node to `left` and `right` children; it does not imply any ordering.

Common traversals are:

- Preorder: node, then children. Useful for copying or serialization.
- Inorder for a binary tree: left, node, right.
- Postorder: children, then node. Useful when a result depends on subtrees.
- Level order: breadth first with a queue.

| Operation | Time | Extra space |
| --- | --- | --- |
| DFS traversal | O(n) | O(h) call stack |
| BFS traversal | O(n) | O(w), where `w` is maximum width |
| Search unordered tree | O(n) | O(h) DFS or O(w) BFS |
| Insert/remove with no ordering rule | Depends on representation | Finding a position may cost O(n) |

The nodes themselves use O(n) space.

```python
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result
```

**Sample**

```
Input: root = [1,2,3,4,5,null,6] in level-order notation
Output: level_order(root) = [1,2,3,4,5,6]
```

**Caveat:** Recursive DFS is concise, but a skewed tree has height O(n) and can exceed Python's recursion limit. Use an explicit stack for deep or adversarial trees. Array-based tree encodings need explicit `null` placeholders when children are missing.

## Binary Search Trees

A binary search tree (BST) adds an invariant: all keys in a node's left subtree are smaller and all keys in its right subtree are larger, according to the chosen duplicate policy. Inorder traversal therefore visits keys in sorted order.

| Operation | Average | Worst case |
| --- | --- | --- |
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Remove | O(log n) | O(n) |
| Minimum/maximum | O(log n) | O(n) |
| Inorder traversal | O(n) | O(n) |

Each operation follows one root-to-leaf path, so its exact cost is O(h). Space is O(n); iterative search uses O(1) extra space, while recursive operations use O(h).

Deletion has three cases: remove a leaf, replace a one-child node with its child, or replace a two-child node's key with its inorder successor and then remove that successor.

```python
def bst_insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = bst_insert(root.left, val)
    elif val > root.val:
        root.right = bst_insert(root.right, val)
    return root


def bst_search(root, target):
    while root and root.val != target:
        root = root.left if target < root.val else root.right
    return root is not None


def bst_remove(root, val):
    if not root:
        return None
    if val < root.val:
        root.left = bst_remove(root.left, val)
    elif val > root.val:
        root.right = bst_remove(root.right, val)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = bst_remove(root.right, successor.val)
    return root
```

**Sample**

```
Input: insert [5,3,7,2,4,6,8], search(4), remove(3), inorder()
Output: search = true, inorder = [2,4,5,6,7,8]
```

**Caveat:** Inserting already sorted values into a plain BST produces a linked-list-shaped tree, making operations O(n). Balanced variants such as AVL and red-black trees maintain O(log n) height. Decide how duplicates are represented before implementing the invariant.

## Heaps and Priority Queues

A binary heap is a complete binary tree usually stored in an array. In a min-heap, every parent is no greater than its children, so the minimum is always at index 0. A priority queue is the abstract behavior; a heap is its common implementation.

For index `i`, children are `2 * i + 1` and `2 * i + 2`, and the parent is `(i - 1) // 2`.

| Operation | Time | Notes |
| --- | --- | --- |
| Peek minimum | O(1) | Root of min-heap |
| Push | O(log n) | Append, then sift up |
| Pop minimum | O(log n) | Move last to root, then sift down |
| Build heap from values | O(n) | Bottom-up heapify |
| Search arbitrary value | O(n) | Heap is only partially ordered |

Space is O(n). In-place heapify uses O(1) auxiliary space apart from implementation details.

```python
import heapq

priority_queue = [(2, "write"), (1, "fix"), (3, "ship")]
heapq.heapify(priority_queue)
heapq.heappush(priority_queue, (1, "review"))

order = []
while priority_queue:
    order.append(heapq.heappop(priority_queue))

print(order)
```

**Sample**

```
Input: jobs = [(2,"write"),(1,"fix"),(3,"ship")], push((1,"review")), pop all
Output: [(1,"fix"),(1,"review"),(2,"write"),(3,"ship")]
```

**Caveat:** A heap does not keep the whole array sorted; only the root is guaranteed to be globally minimal. Python compares later tuple fields to break equal priorities, so include a monotonic counter when payloads are not comparable or FIFO tie-breaking is required. Negating numeric priorities provides a max-heap on Python versions without max-heap APIs.

## Tries

A trie, or prefix tree, stores strings one character per edge. Shared prefixes share nodes, making prefix queries independent of how many keys are stored. Each node needs an end marker because a complete word can also be a prefix of another word.

| Operation | Time | Extra space |
| --- | --- | --- |
| Insert word | O(L) | Up to O(L) new nodes |
| Search complete word | O(L) | O(1) iterative |
| Check prefix | O(L) | O(1) iterative |
| Remove word | O(L) | O(L) recursion if pruning |

Total space is O(K), where `K` is the total number of inserted characters in the worst case; shared prefixes reduce the actual node count.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, text):
        node = self.root
        for ch in text:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

**Sample**

```
Input: insert("car"), insert("card"), search("car"), search("ca"), starts_with("ca")
Output: true, false, true
```

**Caveat:** Tries trade memory for predictable prefix performance; a hash set is usually smaller and simpler for exact membership only. Removing `"car"` must clear its end marker without deleting nodes still needed by `"card"`. A dictionary per node handles broad alphabets but has substantial overhead.

## Graphs

A graph models arbitrary relationships. Vertices are connected by edges, which may be directed or undirected and weighted or unweighted. Unlike a tree, a graph may contain cycles, multiple paths, and disconnected components.

The representation determines basic operation costs:

| Representation | Space | Test edge `(u, v)` | Iterate neighbors of `u` | Best fit |
| --- | --- | --- | --- | --- |
| Edge list | O(E) | O(E) | O(E) | Algorithms that process all edges |
| Adjacency list | O(V + E) | O(deg(u)) | O(deg(u)) | Most sparse graphs |
| Adjacency sets | O(V + E) | O(1) average | O(deg(u)) | Frequent edge membership checks |
| Adjacency matrix | O(V^2) | O(1) | O(V) | Dense graphs or constant-time edge checks |

With adjacency lists, BFS and DFS both take O(V + E) time and O(V) extra space for the visited set plus queue or stack. Adding a vertex is O(1); adding an edge is O(1) amortized. Removing an edge from list-backed neighbors costs O(deg(u)), but is O(1) average with adjacency sets.

```python
from collections import deque


def build_undirected_graph(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
        graph.setdefault(b, []).append(a)
    return graph


def bfs(graph, start):
    queue = deque([start])
    seen = {start}
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in seen:
                seen.add(neighbor)
                queue.append(neighbor)
    return order
```

**Sample**

```
Input: edges = [(A,B),(A,C),(B,D),(C,D)], start = A
Output: bfs = [A,B,C,D]
```

The output assumes neighbors remain in insertion order. A different valid adjacency order may produce `[A,C,B,D]` while visiting the same reachable vertices.

**Caveat:** Mark a vertex visited when it is enqueued, not when it is dequeued, or several parents may enqueue it repeatedly. A traversal from one start only covers that connected component; loop over all vertices to cover a disconnected graph. For weighted shortest paths, plain BFS is correct only when every edge has equal weight; use Dijkstra's algorithm with a priority queue for non-negative unequal weights.

## Disjoint Set Union

Disjoint set union (DSU), also called union-find, maintains a partition of elements into connected groups. It supports finding a representative and merging two groups. It is especially useful for connectivity queries and Kruskal's minimum spanning tree algorithm.

Path compression flattens trees during `find`, and union by size attaches the smaller tree under the larger one.

| Operation | Amortized time | Notes |
| --- | --- | --- |
| Find representative | O(alpha(n)) | Effectively constant for practical inputs |
| Union two groups | O(alpha(n)) | Includes two finds |
| Test connectivity | O(alpha(n)) | Compare representatives |

Space is O(n). `alpha` is the inverse Ackermann function, which grows extraordinarily slowly.

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while x != self.parent[x]:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True
```

**Sample**

```
Input: n = 5, union(0,1), union(1,2), connected(0,2), connected(0,4)
Output: true, false
```

Here `connected(a, b)` means `find(a) == find(b)`.

**Caveat:** DSU answers whether nodes are connected but does not recover the path between them. It handles additions well, not arbitrary edge deletions. Representatives are implementation details and can change after a union, so do not treat a root ID as stable application data.

## Choosing a Structure

| Requirement | Typical choice |
| --- | --- |
| Fast indexing and compact sequential storage | Dynamic array |
| Character processing | String, often converted to a list while editing |
| Frequent insertion/removal through known node references | Linked list |
| Last-in-first-out processing | Stack |
| First-in-first-out or operations at both ends | Queue or deque |
| Fast membership, deduplication, or key-value lookup | Hash set or hash map |
| Hierarchical relationships | Tree |
| Ordered search with maintained balance | Balanced BST |
| Repeatedly retrieve the smallest or largest item | Heap-backed priority queue |
| Prefix lookup | Trie |
| Arbitrary relationships and paths | Graph |
| Repeated component merging and connectivity checks | DSU |

The complexity table is only the first filter. Also consider input size, ordering requirements, memory overhead, cache locality, whether worst-case guarantees matter, and which operations dominate the real workload. The simplest structure that makes those operations cheap is usually the right one.
