---
title: "Garbage Collection"
date: "2020-10-15"
description: "Python"
path: "/blog/garbage-collection"
---

## Preface

This post walks through an implementation of a mark and sweep garbage collector using python.  This post is mainly for my own edification, but when I encountered the problem in one of my classes, I found it a challenging and satisfying graph problem.

## Setup 

For this project, I'm just going to use Python.

## Problem Statement

On a heap, there are $n$ objects numbered $0, ..., n - 1$ with sizes $s_0, ..., s_{n-1}$. 

Also given are $r$ roots and $m$ pointers, or references stored in objects that refer to other objects.

Write a program that performs a mark-and-sweep collection and outputs the total size of the live heap as well as the total amount of memory which the collector would sweep if the heap were garbage collected.

Report the retained heap size (the additional number of bytes that could be freed if this root were removed from the graph and the collection were repeated) for each of the roots.

The first line of the input contains 3 non-negative integers $n, m, r$ such that $r \leq n$. The second line contains $n$ positive integers $s_i$ that denote the size $s_i$ of object $i$.  

Following that are $m$ lines with tuples $(i,j)$ where $0 \leq i,j \leq n$, each of which denotes a pair of object indices.  A tuple $(i.j)$ means that object $i$ stores a reference to object $j$, keeping it "alive" privded that $s_i$ is reachable from a root. 

The decription of the references is followed by a single line with $r$ integers denoting the roots of the reachability graph $R_0, R_1, ..., R_{r-1}$ which do not have incoming edges that point to them.

Output $R+1$ lines, the first of which should output two numbers $l,s$ where $l$ represents the total size of the live heap, and $s$ the amount of garbage the would be swept if the heap were collected.  Following that, for each root, output how much additional memory could be freed if this root were removed, in the order in which the roots appear in the input.

## Example

Consider the following input and accompanying representation: 

```
15 15 2
8 10 27 21 13 35 33 18 33 0 25 36 0 20 13 11 10
6 14
5 14
70
11 7
81
2 11
86
48
12 7
98
13 6
1 14
7 11
03
9 12
```

![](/images/garbage-1.png)

The program should produce the following output

```
197 95 
89
108
```

## Strategy

The strategy we're going to employ uses a Breadth First Seach beginning at each of the roots, marking nodes as reachable from the root, then perform one sweep to determine how many bytes would be collected (objects not referenced by any nodes referenced by a root), and then a secondary sweep to determine how many additional bytes would be collected by removing the roots.

### Building the Graph

The first step is to parse the input and build our graph.

```python
import sys

lines = sys.stdin.buffer.read().decode('utf-8').split('\n')

# get n, m, r 
args = lines[0].split(' ')
n, m, r = int(args[0]), int(args[1]), int(args[2])
roots = [int(r) for r in lines[-2].split(' ')]

# get the n sizes s_i
sizes = [int(s) for s in lines[1].split(' ')]
```

We'll represent out graph as a perverse adjacency matrix: a list of dictionaries representing objects on the heap with fields for the object's size, the other objects it references, and whether or not is has been marked by our BFS:

```python
graph = [{'size': s, 'refs': [], 'marked': False} for s in sizes]
    
# build graph
for i in range(2, m+2):
    obj = lines[i].split(' ')
    i, j = int(obj[0]), int(obj[1])
    graph[j]['marked'] = False
    graph[i]['refs'].append(j)
```

Next, we'll need to implement a simple BFS algorithm which _marks_ nodes that have been visible:

```python
def mark(node, graph):
    # if the object is already referenced (it is bc we're calling it from somewhere)
    if not node['marked']:
        node['marked'] = True  # mark it 
        # mark all its references too
        for ref in node['refs']:
            mark(graph[ref], graph)
```

Next we ma out the reachability graph from each of the roots:

```python
# mark all the  root connections
for r in roots:
    mark(graph[r], graph)
```

Now, we perform the first sweep to see count and ouput how many bytes would be collected:

```python
# sweep 1
s = 0
for i, node in enumerate(graph):
    if node['marked']:
        node['marked'] = False # reset the reachability graph inline
    else:
        s += node['size']

l = sum(sizes) - s 
print(l, s)
```

Right after that, we can perform the second sweep to account for how many bytes would be reclaimed if each root were removed.

```python
for r in roots:               
    # mark all the other nodes
    for other in roots:
        if other != r:
            mark(graph[other], graph)
    
    # tally the marked sizes, as they would be unreachable 
    s_i = 0
    for i, node in enumerate(graph):
        if node['marked']:
            node['marked'] = False # reset the reachability graph inline 
        else:
            # non roots w/ no incoming edges still get added here
            s_i += node['size']

    print(s_i - s) # diff of garbage collected
```

though the graph representation is a _bit_ ugly, it's easier to comprehend and satisfactorily achieves the desired output!

