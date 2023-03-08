---
title: "30 | CS 4104 Algorithms Notes"
date: "2021-07-01"
description: "Graphs, analysis, networks flows, borderline fake math"
path: "/blog/algorithm-notes"
---
<style> .n { visibility: hidden; } </style>

# Contents 

- [00 - Introduction](#intro)
    - [Glossary](#gl) 
- [01 - Stable Matching](#ch1)
- [02 - Analysis of Algorithms](#ch2)
- [03 - Review of Graphs and Priority Queues](#ch3)
- [04 - Linear Time Algoirthms](#ch4)
- [05 - Greedy Algorithms](#ch5)
- [06 - Greedy Graph Algorithms](#ch6)
- [07 - Applications of Minimum Spanning Trees](#ch7)
- [08 - Divide and Conquer Algorithms](#ch8)
- [09 - Dynamic Programming](#ch9)
- [10 - Network Flow](#ch10)
- [11 - Network Flow Applications](#ch11)
- [12 - NP and Computational Tractibility](#ch12)
- [13 - NP-Complete Problems](#ch13)
- [14 - Coping with NP-Completeness](#ch14)
- [15 - Solutions](#ch15)
    
# <a name="intro" class="n"></a> Introduction

Notes from CS 4104 with exercises and derivations from "Algorithm Design" by Kleinberg and Tardos.

## <a name="gl" class="n"></a> Glossary 

| Term | Definition |
|----------|---------|
| **Matching** | each man is paired with ≤ 1 woman and vice versa |
| **Perfect Matching** | each man is paired with _exactly_ 1 woman and vice versa |
| **Rogue Couple** | a man and a woman who are not matched, but prefer each other to their |
| **Stable Matching** | a perfect matching without any roogue couples |
| **polynomial** running time | if there exists constants $c,d > 0$ such that $\forall n$, the running time is bounded by $cn^d$ |
| **Asymptotic Upper Bound** | a function $f(n)$ is $O(g(n))$ if there exists constants $c > 0, n_0 \geq 0$  s.t. $\forall n \geq n_0, \quad f(n) \leq cg(n)$ |
| **Asymptotic Lower Bound** | a function $f(n)$ is $\Omega(g(n))$ if there exist constants $c > 0, n_0 \geq 0$ s.t. $\forall n \geq n_0, \quad f(n) \geq cg(n)$ | 
| **Asymptotic Tight Bound** | a function $f(n)$ is $\Theta(g(n))$ if $f(n)$ is $O(g(n))$ and $f(n)$ is $\Omega(g(n))$ | 
| **Euler Path** | Only possible if the number of nodes with odd degree is at most 2|
| A $v_1 - v_k$ **path** | in an undirected graph $G = (V,E)$ is a sequence of $P$ nodes $v_1, v_2, \mathellipsis, v_{k-1}, v_k; v_k \in V$ s.t. every consecutive pair of nodes $v_i; v_{i+1}, 1 \leq i < k$ is connected by an edge $E$ | 
| **simple path** | all its nodes are distinct | 
| **cycle** | is a path where $k>2$, the first $k-1$ nodes are distinct and $v_1 = v_k$ |
| **connected** undirected graph | for every pair of nodes $u,v \in V$, there is a path from $u$ to $v$ in $G$ |
| **distance** $d(u,v)$ | the minimum number of edges in any $u-v$ path |
| **connected component of $G$ containing $s$** | the set of all nodes $u$ such that there is an $s-u$ path in $G$ |
| **Adjaceny Matrix** | $n \times n$ boolean matrix, where the entry in row $i$, col $j$ is 1 iff the graph contains the edge $(i, j)$ |
| **Adjaceny List** | array $Adj$, where $Adj[v]$ stores the list of all nodes adjacent to $v$ |
| **bipartite** | A graph $G = (V, E)$ is **bipartite** if $V$ can be partitioned into two subsets $X,Y$ such that every edge in $E$ has one endpoint in $X$ and one in $Y$ |
| **Greedy algorithm** | makes the best current choice without looking back.  Assume the choices made prior were perfect |
| **inversion** | A schedule has an **inversion** if a job $i$ with a deadline $d(i)$ is scheduled before another job $j$ with an earlier deadline $d(j)$ i.e. $d(j) < d(i), s(i) < s(j)$ | 
| **spanning tree** | A subset $T of E$ is a **spanning tree** of $G$ if $(V, T)$ is a tree |



# <a name="ch1" class="n"></a> 01 - Stable Matching

### Problem

- Each man ranks all the women in order of preference

- Each woman ranks all the men in order of preference 

- Each person uses all ranks from $1, ... , n$ s.t. there are no ties or incomplete lists

#### Male preference matrix:

|       | $w_1$ | $w_2$ | $w_3$ | $w_4$ |
|-------|-------|-------|-------|-------|
| $m_1$ | 1     | 2     | 3     | 4     |
| $m_2$ | 4     | 3     | 1     | 2     |
| $m_3$ | 4     | 3     | 1     | 2     |
| $m_4$ | 3     | 1     | 4     | 2     |

#### Female preference matrix:

|       | $m_1$ | $m_2$ | $m_3$ | $m_4$ |
|-------|-------|-------|-------|-------|
| $w_1$ | 1     | 2     | 3     | 4     |
| $w_2$ | 4     | 1     | 3     | 2     |
| $w_3$ | 4     | 1     | 2     | 3     |
| $w_4$ | 3     | 1     | 2     | 4     |

- A **Matching**: each man is paired with ≤ 1 woman and vice versa
- A **Perfect Matching**: each man is paired with _exactly_ 1 woman and vice versa
  - "perfect" means one-to-one mapping
- A **Rogue Couple**: a man and a woman who are not matched, but prefer each other to their current partners
- A **Stable Matching**: A perfect matching without any rogue couples

### Solution: Gale-Shapley Algorithm

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Initially, all men and all women are free} \\
    &\text{Set } S \text{ of matched pairs is empty} \\ 
    &\text{While there is at least one free man who has not proposed to every woman} \\
      &\quad\text{Choose such a man } m \\
        &\qquad m \text{ proposes to his highest-ranked woman } w \text{ to whom he has not yet proposed} \\
      &\quad\text{If } w \text{ is free} \\
        &\qquad\text{she becomes engaged to } m \text{ s.t. } S \leftarrow S \cup \{m, w\} \\
      &\quad\text{Else if } w \text{ is engaged to } m' \text{ and she prefers } m \text{ to } m' \\
        &\qquad\text{she becomes engaged to } m \text{ s.t. } S \leftarrow S \cup \{m, w\} \\
        &\qquad m' \text{ becomes free s.t. } S \leftarrow S \backslash \{m', w\} \\
      &\quad\text{Otherwise, } m \text{ remains free} \\ 
    &\text{Return set } S \text{ of engaged pairs}
  \end{aligned}
}     
$$

#### Proof of Perfection
1. Suppose the set $S$ of pairs returned by Gale-Shapley algorithm is not perfect
2. $S$ is a matching, therefore there must be at least one free man $m$
3. $m$ has proposed to all women (since the algorithm terminated)
4. Therefore, each woman must be engaged (since she remains engaged after the first proposal to her)
5. Therefore, all men must be engaged, contradicting ⚔️  the assumption that $m$ is free
6. That matching is perfect since the program terminated QED.

#### Proof of Stability
1. Suppose $S$ is not stable i.e. there are two pairs $(m_1, w_1)$, $(m_2, w_2) \in S$ s.t $m_1$ prefers $w_2 > w_1$ and $w_2$ prefers $m_1 > m_2$
2. $m_1$ must have proposed to $w_2$ prior to $w_1$ because at that stage $w_2$ must have rejected $m_1$; otherwise she would have been paired with $w_1$, which would in turn prevent the pairing of $(m_2, w_2)$ in a later iteration
3. When $w_2$ rejected $m_1$, she must have been paired with some man $m_3 > m_1$ 
4. Since $m_2$ is paired with $w_2$ at termination, $w_2$ must prefer $m_2$ to $m_3$ or $m_2 = m_3$
5. This contradicts ⚔️ our conclusion (from instability) that $w_2$ prefers $m_1 > m_2$ QED.

### Observations
- This algorithm computes a matching i.e. each woman gets pair with at most one man and vice versa
- The man's status can alternate between being free and being engaged
- The woman's status remains engaged after the first proposal
- The ranking of a man's partner remains the same or goes down
- The ranking of a woman's partner can never go down
- The number of proposals made after $k$ iterations is the best indicator of progress
- The max number of total proposals (or iterations) that can be made is $n^2$
- Always produces the same matching in which each man is paired with his best, valid partner, but each woman is paired with her worst, valid partner

# <a name="ch2" class="n"></a> 02 - Analysis of Algorithms

### Polynomial Time

- Essentially brute forcing
- e.g. brute force sorting:
  - Given $n$ numbers, permute them so that they appear in increasing order
  - Try all $n!$ permutations
  - For each permutation, check if it is sorted
  - $O(nn!)$
- Desirable scaling property: when the input size doubles, the algorithm should only slow down by some constant $c$
- An algorithm has **polynomial** running time if there exists constants $c,d > 0$ such that $\forall n$, the running time is bounded by $cn^d$
- an algorithm is said to be efficient if it has a polynomial running time

### Upper and Lower Bounds

- **Asymptotic Upper Bound:** a function $f(n)$ is $O(g(n))$ if there exists constants $c > 0, n_0 \geq 0$  s.t. $\forall n \geq n_0, \quad f(n) \leq cg(n)$
  - e.g. $100n \log_2n$ is $O(n^2)$ for $c = 100, n_0 = 1$
- **Asymptotic Lower Bound:** a function $f(n)$ is $\Omega(g(n))$ if there exist constants $c > 0, n_0 \geq 0$ s.t. $\forall n \geq n_0, \quad f(n) \geq cg(n)$
  - e.g. $ \frac{n}{10}\log_2 n $ is $\Omega(n)$ for $c = 1, n_0 = 1024$

In general, we attempt to find a sufficiently large $n_0$ such that our upper and lower bounds are satisfied.

- **Asymptotic Tight Bound:** a function $f(n)$ is $\Theta(g(n))$ if $f(n)$ is $O(g(n))$ and $f(n)$ is $\Omega(g(n))$

Transitively: 
  - if $f = O(g)$ and $g = O(h)$, then $f = O(h)$
  - if $f = \Omega(g)$ and $g = \Omega(h)$, then $f = \Omega(h)$
  - if $f = \Theta(g)$ and $g = \Theta(h)$, then $f = \Theta(h)$

Additively:
  - if $f = O(h)$ and $g = O(h)$, then $f + g = O(h)$
  - Similar statements hold for lower and tight bounds
  - if $k$ is a constant and there are $k$ functions: $f_i = O(h), 1\leq i \leq k$ 

  $$
  \begin{aligned}
    f_1 + f_2 + ... + f_k = O(h)
  \end{aligned}
  $$

  - if $f = O(g)$, then $f + g = \Theta(g)$

### Examples

$p,q,n > 0$

| $f(n)$        | $g(n) $     | Reason |
|--------------|-----------|--------|
| $pn^2 + qn + r$ | $\Theta(n^2)$ | $pn^2 + qn + r \leq (p + q + r)n^2 $, and we can ignore low order terms|
| $pn^2 + qn + r$ | $O(n^3)$ | $n^2 \leq n^3, \text{ if } n \geq 1$ |
| $\displaystyle\sum_{0 \leq i \leq d} a_i n^i$ | $\Theta(n^d)$ | if $d > 0$ is an integer constant and $a_d > 0$ |
| $O(n^{1.59})$ | polynomial time | $n^{1.59}$ is $O(n^2)$ |
| $\log_a n$ | $O(\log_b n)$ | $\log_2(x) = \frac{\log_{10}(x)}{\log_{10}(2)} \forall a,b > 1$ therefore the base is irrelevant |

- $\forall \text{ constant } x > 0, \log n = O(n^x)$ e.g. $\log n = n^{0.00001}$
- $\forall \text{ constant } r > 1, d >0, n^d = O(r^n)$ e.g. $n^3 = O(1.1^n)$

# <a name="ch3" class="n"></a> 03 - Review of Graphs and Priority Queues

## Priority Queues: Motivation 

### Sorting  

- **Instance**: Nonempty list $[x_1, x_2, \mathellipsis, x_n]$ of integers
- **Solution**: A permutation $[y_1, y_2, \mathellipsis, y_n]$ of $x_1, x_2, \mathellipsis, x_n$ such that $y_i \leq y_{i+1}$ for all $1 \leq i < n$$

Possible algorithm:
- insert each number into some data structure $D$
- Repeatedly find the smallest number in $D$, output it, and remove it
- To get $O(n \log n)$ running time, each "find minimum" step and each remove step must additively take $O(\log n)$

## Priority Queues
- Store a set $S$ of elements where each element $v$ has a priority value $key(v)$
- smaller key values = higher priorities
- Supported operations:
  - find element with smallest key
  - remove smallest element
  - insert an element
  - delete an element
  - update the key of an element
- element deletion and key update require knowledge of the position of the element in the priority
- combines benefits of both lists and sorted arrays
- balanced binary tree
- **heap order**. For every element $v$ at a node $i$, the element $w$ at $i$'s parent satisfies $key(w) \leq key(v)$
- Each node's key is at least as large as its parent's
- storing nodes of the heap in an array:
  - Node at index $i$ has children at indices $2i$ and $2i+1$, with a parent at index $\lfloor \frac{i}{2} \rfloor$
  - index 1 is the root
  - if $2i > n$, where $n$ is the current number of elements in the heap, the node at index $i$ is a leaf

### Inserting an Element: `Heapify-up`

- insert a new element at index $n+1$
- Fix heap order using `Heapify-up(H, n+1)`

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Heapify-up(H, i)} \\
    &\text{If } i > 1 \text{ then} \\
      &\quad\text{let } j = \text{parent(i) } = \lfloor \frac{i}{2} \rfloor \\
      &\quad\text{If key[H[i]] < key[H[j]] then } \\
      &\qquad\text{swap entries H[i], H[j]} \\
      &\qquad\text{Heapify-up(H, j)} \\
  \end{aligned}
}     
$$

#### Proof of Running Time Complexity for `Heapify-up(i)`
- each invocation decreases the second argument by a factor of at least 2
- after $k$ invocations, argument is at most $\frac{i}{2^k}$
- Therefore $\frac{i}{2^k} \geq 1$ which implies that $k \leq \log_2 i$ therefore heapify up is $O(\log i)$ 

### Deleting an Element: `Heapify-down`
- Suppose $H$ has $n+1$ elements
- Delete element $H[i]$ moving element at $H[n+1]$ to $H[i]$
- If element at $H[i]$ is too small, fix the heap order using `Heapify-up(H, i)`
- If element at $H[i]$ is too large, fix heap order using `Heapify-down(H, i)`

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Heapify-down(H, i)} \\
    &\text{let } n = length(H) \\
    &\text{If } 2i > n \text{ then} \\
      &\quad\text{Terminate with } H \text { unchanged} \\
    &\text{Else If } 2i < n \text{ then} \\
      &\quad\text{Let Left, Right } = 2i, 2i+1 \\
      &\quad\text{Let } j \text{ be the index that minimizes key[H[Left]] and key[H[Right]]} \\
    &\text{Else } 2i = n \text{ then} \\
      &\quad\text{Let } j = 2i \\
    &\text{If key[H[j]] < key[H[i]] then } \\
      &\quad\text{swap the entries H[i] and H[j]} \\
      &\quad\text{Heapify-down(h,j)} \\

  \end{aligned}
}     
$$

#### Proof of Running Time Complexity for `Heapify-down(i)`
- Each invocation increases is second argument by a factor of at least 2
- after $k$ invocations arguments must be at least $i2^k \leq n$, which implies that $k \leq \log_2 \frac{n}{i}$
- Therefore running time is $ O(\log_2 \frac{n}{i})$

## Sorting
- **Instance**: Nonempty list $[x_1, x_2, \mathellipsis, x_n]$ of integers
- **Solution**: A permutation $[y_1, y_2, \mathellipsis, y_n]$ of $x_1, x_2, \mathellipsis, x_n$ such that $y_i \leq y_{i+1}$ for all $1 \leq i < n$$

Final algorithm:
- Insert each number in a priority queue $H$
- Repeatedly find the smallest number in $H$, output it, and delete it from $H$

Thus, each insertion and deletion take $O(\log n)$ for a total running time of $O(n \log n)$

--- 

## Graphs: Motivation

- Contact tracing hahaaaaa

### Taxonomy of a Graph
- comprised of vertices and (directed / undirected) edges, they can form face.
- **Euler Path**: Only possible if the number of nodes with odd degree is at most 2
- Formally, an Undirected graph $G = (V, E)$ where $V, E$ are sets of vertices and edges with $E \subseteq V \times V$
  - Elements of $E$ are **unordered pairs**
  - $Edge(u, v)$ is **incident** on $u,v$ meaning $u,v$ are neighbors of one another
  - Exactly one edge between any pair of nodes
  - $G$ contains no self loops, i.e. no edges of the from $(u,u)$

- Formally, an directed graph $G = (V, E)$ where $V, E$ are sets of vertices and edges with $E \subseteq V \times V$
  - Elements of $E$ are **ordered pairs**
  - $e = (u, v)$ where $u$ is the **tail** of the edge $e$, $v$ is the head, and we can say that $e$ is directed from $u$ to $v$
  - A pair of nodes may be connected by two directed edges $(u,v)$ and $(v,u)$
  - $G$ contains no self loops

- A $v_1 - v_k$ **path** in an undirected graph $G = (V,E)$ is a sequence of $P$ nodes $v_1, v_2, \mathellipsis, v_{k-1}, v_k; v_k \in V$ s.t. every consecutive pair of nodes $v_i; v_{i+1}, 1 \leq i < k$ is connected by an edge $E$
- a path is **simple** if all its nodes are distinct
- a **cycle** is a path where $k>2$, the first $k-1$ nodes are distinct and $v_1 = v_k$
- An undirected graph $G$ is **connected** if, for every pair of nodes $u,v \in V$, there is a path from $u$ to $v$ in $G$
- The **distance** $d(u,v)$ between nodes $u,v$ is the minimum number of edges in any $u-v$ path
- The **connected component of $G$ containing $s$** is the set of all nodes $u$ such that there is an $s-u$ path in $G$

#### Computing Connected Components

- Rather than computing the connected component of $G$ that contains $s$ and check if $t$ is in that component, we can "explore" $G$ starting from $s$, maintaining a set $R$ of visited nodes

$$ 
\boxed{ 
  \begin{aligned} 
    &R \text{will consist of nodes to which } s \text{has a path} \\
    &\text{Initially } R = \{s\} \\
    &\text{While there is ad edge } (u,v) \text{ where } u \in R, v \notin R \\
    &\quad\text{Add } v \text{ to } R
    
  \end{aligned}
}     
$$

## Breadth First Search
- Explore $G$ starting at $s$ and going "outward" in all directions, adding nodes one "layer" at a time
- Layer $L_0$ only contains $s$
- Layer $L_1$ contains $s$ and all its neighbors, etc. etc.
- Layer $L_0, L_1, \mathellipsis , L_j, L_{j+1}$ contains all nodes that:
  - do not belong to an earlier layer
  - are connected by an edge to a node in layer $L_j$
  - The shortest path from $s$ to each node contains $j$ edges
- Claim: For each $j \geq 1$, layer $L_j$ consists of all nodes exactly at distance $j$ from $S$
- A **non-tree edge** is an edge of $G$ that does not belong to the BFS tree $T$

### Proof
- There is a path from $s$ to $t$ if an only iff $t$ is a member of some layer
- Let $v$ be a node in layer $L_{j+1}$ and $$u$ be the "first" node in $L_j$ such that $(u,v)$ is an edge in $G$. Consider the graph $T$ formed by all edges, directed from $u$ to $v$
  - Notice that $T$ is a tree because it is connected and the number of edges in $T$ is the number of nodes in all the laters minus one
  - $T$ is called the BFS Tree

### Inductive Proof of BFS Distance Property
- for every $j \geq 0$, for every node $u \in L_j$, $d(s, u) = j$ 
- Basis: $k =0$, $d(s,s) = 0$
- Inductive Hypothesis: Assume the claim is true for every node $v \in L_k$, $d(s, v) = k$
- Inductive Step: Prove for every node $x \in L_{k+1}$, $d(s, x) = k + 1$
  - $d(s,x) = d(s, y) + 1$ if $y$ is a node in $L_k$
  - Therefore $d(s,x) = k+1$

## Depth First Search
- Explore $G$ as if it were a maze: start from $s$, traverse first edge out (to node $v$), traverse first edge out of $v$, . . . , reach a dead-end, backtrack, repeat

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Mark } u \text{as explored and add it to the reachable set} R \\
    &\text{For each edge } (u,v) \text{incident to } u \\
      &\quad\text{If } v \text{ is not marked, invoke DFS(} v \text{)} \\ 
    
  \end{aligned}
}     
$$

## Properties of each
- BFS and DFS visit the same set of nodes, but in a different order 

## Representing Graphs
- A Graph $G = (V,E)$ has two input parameters: $|V| =n, |E| = m$, with $ n-1 \leq m \leq \binom{n}{2}$
  - Size of graph is defined to be $m + n$
  - Strive for algorithms whose running time is linear in graph size i.e. $)(m + n)$
- We assume that $V = {1, 2, \mathellipsis, n}$
- Use an **Adjaceny Matrix**: $n \times n$ boolean matrix, where the entry in row $i$, col $j$ is 1 iff the graph contains the edge $(i, j)$
  - the space used is $\Theta(n^2)$, which is optimal in the worst case
  - can check if there is an edge between nodes $i$, $j$ in $O(1)$ time
  - iterate over all the edges incident on node $i$ in $\Theta(n)$ time 
- Use an **Adjaceny List**: array $Adj$, where $Adj[v]$ stores the list of all nodes adjacent to $v$
  - an edge $e = (u,v)$ appears twice: $Adj[u], $Adj[v]$
  - $n_v$ is the number of neighbors of node $v$
  - space used is $O(\displaystyle\sum_{v \in G}n_v) = O(m+n)$
  - check if there is an adge between nodes $u, v$ in $O(n_u)$ time
  - Iterate over all the edges incident on node $u$ in $\Theta(n_u)$ time
  - Inserting an edge takes $O(1)$ time
  - Deleting an edge takes $O(n)$ time

| Operation/Space | Adj. Matrix | Adj. List |
|-----------------|-------------|-----------|
| Is $(i, j)$ an edge? | $O(1)$ time | $O(n_i)$ time | 
| Iterate over edges incident on node $i$ | $O(n)$ time | $O(n_i)$ time | 
| Space used | $O(n^2)$ | $O(m + n)$ | 

# <a name="ch4" class="n"></a> 04 - Linear-Time Graph Algorithms

## Bipartite Graphs

- A graph $G = (V, E)$ is **bipartite** if $V$ can be partitioned into two subsets $X,Y$ such that every edge in $E$ has one endpoint in $X$ and one in $Y$
  - $X \times X \cap E = \emptyset$ and $Y \times Y \cap E = \emptyset$
  - Color the nodes in $X$ red and the nodes in $Y$ blue.  No edge in $E$ connects nodes of the same graph

- no cycle with an odd number of nodes is bipartite, similarly all cycles of even length _are_ bipartite
- Therefore, if a graph is bipartite, then it cannot contain a cycle of odd length

### Algorithm for Testing Bipartite
- Assume $G$ is connected, otherwise apply the algorithm to each connected component separately
- Pick an arbitrary node $s$ and color it red. 
- Color all it's neighbors blue.  Color the uncolored neighbors of _these_ nodes red, and so on till all nodes are colored
- Check if every edge has endpoints of different colours

more formally: 

1. Run BFS on $G$. Maintain an array for the color
2. When we add a node $v$ to a layer $i$, set $\text{color[i]}$ to red if $i$ is even, blue of odd
3. At the end of BFS, scan all the edges to check if there is any edge both of whose endpoints received the same color 

Running time is linear proportional to the size of the graph: $O(m + n)$ since we do a constant amount of work per node in addition to the time spent by BFS.

#### Proof of Correctness of a "two-colorable" algorithm
Need to prove that if the algorithm says $G$ is bipartite, then it is actually bipartite AND need to prove that if $G$ is _not_ bipartite, can we determine why?

- Let $G$ be a graph and let $L_0, L_1, \mathellipsis, L_k$ be the layers produced by the BFS, starting at node $s$.  Then exactly one of the following statements is true:
  - No edge of $G$ joins two nodes in the same layer: Bipartite since nodes in the even laters can be colored red and those in odd blue
  - There is an edge of $G$ that joins two nodes in the same layer: Not Bipartite
  - $| L_i - L_j | = 1, \quad \forall L \in BFS$  

# <a name="ch5" class="n"></a> 05 - Greedy Algorithms

- **Greedy algorithms**: make the best current choice without looking back.  Assume the choices made prior were perfect

## Example Problem: Interval Scheduling
- At an amusement park, want to compute the largest number of rides you can be on in one day
- Input: start and end time of each ride
- Constraint: cannot be in two places at one time

- **Instance:** nonempty set $\{(s(i), f(i)), 1 \leq i \leq n\}$ of start and finish times of $n$ jobs
- **Solution:** The largest subset of mutually compatible jobs

- Two jobs are **compatible** if they do not overlap
- Problem models the situation where you have a resource, a set of fixed jobs, and you want to schedule as many jobs as possible
- For any input set of jobs, the algorithm must provably compute the **largest** set of compatible jobs (measured by interval count, not cumulative interval length)

### Template for a Greedy Algorithm
- Process jobs in some order. Add next job to the result if it is compatible with the jobs already in the result
- key question: in what order should we process job?
  - earliest start time: increasing order of start time $s(i)$
  - earliest finish time: increasing order of start time $f(i)$
  - shortest interval: increasing order of $f(i) - s(i)$
  - fewest conflicts: increasing order of the number of conflicting jobs

### Earliest Finish Time
- the most optimal general solution

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Initially let } R \text{ be the set of all jobs, and let } A \text{ be empty} \\
    &\text{While } R \text{ is not yet empty}\\
      &\quad\text{Choose a job } i \in R \text{ that has the smallest finishing time } \\
      &\quad\text{Add request } i \text{ to } A \\
      &\quad\text{Delete all jobs from } R \text{ that are not compatible with job } i \\
  &\text{Return the set } A \text{ as the set of accepted/scheduled jobs} \\   
  \end{aligned}
}     
$$

### Proof of Optimality 
- Claim $|A|$ is a compatible set of jobs that is the largest possible in _any_ set of mutually compatible jobs
- Proof by contradiction that there's no "better" solution at each step of the algorithm
  - need to define "better", and what a step is in terms of the progress of the algorithm
  - order the output in terms of increasing finish time for a measure of progress
- Finishing time of a job $r$ selected by $A$ must be less than or equal to the finishing time of a job $r$ selected by any other algorithm
- Let $O$ be an optimal set of jobs.  We will show that $|A| = |O|$
- Let $i_1, i_2, \mathellipsis, i_k$ be the set of jobs in $A$ in order of finishing time
- Let $j_1, j_2, \mathellipsis, j_m$ be the set of jobs in $O$ in order of $m \geq k$
- Claim: for all indices $r \leq k, \quad f(i_r) \leq f(j_r)$
- Base case: is it possible for finish time of the first job of our algorithm to be later than the opposing job?
  - $f(i_1) > f(j_1)$ is not possible, only $f(i_1) \leq f(j_1)$
- Inductive Hypothesis: this is always the case for any generic job index $r$:
  - $f(i_r) \leq f(j_r)$ for some $r \leq k$
- Inductive Step: show that the same claim holds for the next job:
  - $f(i_{r+1}) \leq f(j_{r+1})$ for some $r+1 \leq k$
  - $s(j_{r+1}) \geq f(i_r) \geq f(i_r)$
- claim $m = k$: $f(i_{k}) \leq f(j_{k}) \leq s(j_{k+1})$

A complete proof can be found here:

<object data="/images/algorithms-eft.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="http://yoursite.com/the.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="http://yoursite.com/the.pdf">Download PDF</a>.</p>
    </embed>
</object>

### Implementing EFT
- Sort jobs in order of increasing finish time
- Store starting time of jobs in an array $S$
- $k=1$
- While $k \leq |S|$
  - output job $k$
  - Let the finish time of job $k$ be $f$
  - Iterate over $S$ from $k$ onwards to find the first index $i$ s.t. $S[i] \geq f$
  - $k = i$
- Must be careful to iterate over $S$ s.t. we never scan same index more than once
- Running time is $O(n \log n)$ since it's dominated by the first sorting step


## Scheduling to Minimize Lateness
- Suppose a job $i$ has a length $t(i)$ and a deadline $d(i)$
- want to schedule all $n$ jobs on one resource
- Goal is to assign a starting time $s(i)$ to each job such that each job is delayed as little as possible 
- A job $i$ is **delayed** if $f(i) > d(i)$; the **lateness** of job is $\max(0, f(i) - d(i))$
- the **lateness of a schedule** is $\max \limits_{1 \leq i \leq n}(\max(0, f(i) - d(i)))$
  - the largest of each job's lateness values

### Minimizing Lateness
- **Instance**: Set $\{ (t(i), d(i)), 1 \leq i \leq n \}$ of lengths of deadlines of $n$ jobs
- **Solution**: Set $\{ s(i), 1 \leq i \leq n \}$ such that $\max \limits_{1 \leq i \leq n}(\max(0, f(i) - d(i)))$ is as small as possible

## Template for Greedy Algorithm
- Key question: In what order should we schedule the jobs:
  - **Shortest length**: increasing order of length $t(i)$. Ignores deadlines completely, shortest job may have a very late deadline:

  | $i$ | 1 | 2 |
  |---|---|---|
  | $t(i)$ | 1 | 10 |
  | $d(i)$ | 100 | 10 |

  - **Shortest slack time**: Increasing order of $d(i) - t(i)$. Bad for long jobs with late deadlines. Job with smallest slack may take a long time: 
  
  | $i$ | 1 | 2 |
  |---|---|---|
  | $t(i)$ | 1 | 10 |
  | $d(i)$ | 2 | 10 |

  - **Earliest Deadline**: Increasing order deadline $d(i)$. Correct? Does it make sense to tackle jobs with earliest deadlines first?

## Proof of Earliest Deadline Optimality

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Order the jobs in order of increase deadlines } d(i) \\
    &\text{Assume for simplicity of notation that } d(1) \leq \mathellipsis d(n) \\
    &\text{Initially, } f = 0 \\
    &\text{Consider the jobs } i=1, \mathellipsis, n { in this order }\\
      &\quad\text{Assign the job } i \text{ to the time interval from } s(i) = f \text{ to } f(i) = f + t_i\\
      &\quad f \leftarrow f + t_i \\
    &\text{Return the set of scheduled intervals} [s(i), f(i)], \text{ for } i = 1, \mathellipsis, n\\
  \end{aligned}
}     
$$ 

### Inversions
- A schedule has an **inversion** if a job $i$ with a deadline $d(i)$ is scheduled before another job $j$ with an earlier deadline $d(j)$ i.e. $d(j) < d(i), s(i) < s(j)$
  - if two jobs have the same deadline, they cannot cause an inversion
- in $n$ jobs, the maximum amount of inversion is $n \choose 2$
- Claim: if a schedule has and inversion, then there must be a pair of jobs $i, j$ such that $j$ is scheduled immediately after $i$ and $d(j) < d(i)$

#### Proof of Local Inversion
- If we have an inversion between $l, m$ s.t. $s(l) < s(m), d(l) > d(m)$, then we can find some inverted $i,j$ scheduled between $l,m$ 
- This is because: in a list where each element is greater than the last (in terms of deadline), then the list is sorted. 
- The contrapositive of this is: if a list is unsorted, then there are two adjacent elements that are unsorted.

## Properties of Schedules
- Claim 1: The algorithm produces a schedule with no inversion and no idle time (i.e. jobs are tightly packed)
- Claim 2: All schedules (produced from the same input) with no inversions have the same lateness
  - Case 1: All jobs have distinct deadlines. There is a unique schedule with no inversions and no idle time.
  - Case 2: Some jobs have the same deadline. Ordering of the jobs does not change the maximum lateness of these jobs.
- Claim 3: There is an optimal schedule with no idle time.
- Claim 4: There is an optimal schedule with no inversions and no idle time. 
  - Start with an optimal schedule $O$ (that may have inversions) and use an **exchange argument** to convert $O$ into a schedule that satisfies Claim 4 and has lateness not larger than $O$.
  - If $O$ has an inversion, let $i, j$ be consecutive inverted jobs in $O$. After swapping $i, j$ we get a schedule $O'$ with one less inversion.
  - Claim: The lateness of $O'$ is no larger than the lateness of $O$
  - It is sufficient to prove the last item, since after $n \choose 2$ swaps, we obtain a schedule with no inversions whose lateness is no larger than that of $O$
  - In $O$, assume each job $r$ is scheduled for the interval $[s(r), f(r)]$ and has lateness $\mathcal l(r)$. For $O'$, let the lateness of $r$ be $l'(r)$
    - Claim: $l'(k) = l(k), \quad \forall k \neq i,j$
    - Claim: $l'(j) = l(j)$,
    - Claim: $l'(j) \leq l(j)$ because $l'(j) = f(j) - d_i \leq f(j) - d_j = l(j)$
  - N.B. common mistakes with exchange arguments: 
      - Wrong: start with algorithm's schedule A and argue it cannot be improved by swapping two jobs
      - Correct: Start with an arbitrary schedule O (which can be optimal) and argue that O can be converted into a schedule that is essentially the same as A without increasing lateness
      - Wrong: Swap two jobs that are not neighboring in $O$. Pitfall is that the completion time of all intervening jobs then changes
      - Correct: Show that an inversion exists between two neighboring jobs and swap them
- Claim 5: The greedy algorithm produces an optimal schedule, follows from 1, 2, 4

## Summary
- Greedy algorithms make local decisions
- Three strategies:
  - **Greedy algorithm stays ahead** - Show that after each step in the greedy algorithm, its solution is at least as good as that produced by any other algorithm
  - **Structural bound** - First, discover a property that must be satisfied by every possible solution. Then show that the (greedy) algorithm produces a solution with this property
  - **Exchange argument** - Transform the optimal solution in steps into the solution by the greedy algorithm without worsening the quality of the optimal solution

# <a name="ch6" class="n"></a> 06 - Greedy Graph Algorithms

## The Shortest Path Problem
- $G(V,E)$ is a connected, directed graph. Each edge has a length $l(e) \geq 0$
- **length of a path** $P$ us the sum of the lengths of the edges in $P$
- Goal: compute the shortest path from a specified start node $s$ to every other node in the graph
- Instace: A directed graph $G(V,E)$, a function $I: E \rightarrow \reals^+$ and a node $s \in V$
- Solution: A set $\{P_u, u \in V\}$ of paths, where $P_u$ is the shortest path in $G$ from $s$ to $u$

## Generalizing BFS
- If all edges have the same wight, or distance, BFS would work, processing nodes in order of distance.
- What if the graph has integer edge weights, can we make the graph unweighted?
  - yes, placing dummy edges and nodes to pad out lengths > 1 at the expense of memory and running time
  - Edge weight of $w$ gets $w - 1$ nodes
  - Size of the graph (and therefore runtime) becomes $m + n + \sum_{e \in E} l(e)$. _Pseudo-polynomial_ time depending on input values

## Dijkstra's Algorithm
![](http://www.norsemathology.org/wiki/images/8/8e/Ellis2.gif)
- Famous for pointing out the harm of the `goto` command, in doing so developed the shortest path algorithm
- Like BFS: explore nodes in non-increasing order of distance $s$. Once a node is explored, its distance is fixed
- Unlike BFS: Layers are not uniform, edges are explored by evaluating candidates by edge wight
- For each unexplored node, determine "best" preceding explored node. Record shortest path length only through explored nodes
- Like BFS: Record previous node in path, and build a tree.

### Formally:
- Maintain a set $S$ of _explored_ nodes
  - For each node $u \in S$, compute $d(u)$, which (we will prove, _invariant_) is the length of the shortest path from $s$ to $u$
  - For each node $x \notin S$, maintain a value $d'(x)$, which is the length of the shortest path from $s$ to $x$ using only the nodes in $S$ and $x$ itself 
- Greedily add a node $v$ to $S$ that has the smallest value of $d'(v)$

$$ 
\boxed{ 
  \begin{aligned} 
    &S = \{s\} \text{ and } d(s) = 0 \\
    &\text{while } S \neq V \\
      &\quad\text{for every node } x \in V - S \\
        &\qquad\text{Set } d'(x) = \min_{(u, x): u \in S} (d(u) + l(u, x)) \\
      &\quad\text{Set } v = \arg \min_{x \in V - S }(d'(x)) \\
      &\quad\text{Add } v \text{ to } S \text{ and set } d(v) = d'(v)\\
  \end{aligned}
}     
$$

What does $v = \arg \min_{x \in V - S }(d'(x))$ mean?
- Run over all unexplored nodes $x \in V - S$
- examine all $d'$ values for each node
- Return the argument (i.e. the node) that has the smallest value of $d'(x)$

To compute the shorts paths: when adding a node $v$ to $S$, store the predecessor $u$ that minimizes $d'(v)$

### Proof of Correctness
- Let $P_u$ be the path computed by the algorithm for an arbitrary node $u$
- Claim: $P_u$ is the shortest path from $s$ to $u$
- Prove by induction on the size of $S$
  - _Base case_: $|S| = 1$. The only node in $S$ is $s$
  - _Inductive Hypothesis_: $|S| = k$ for some $k \geq 1$. The algorithm has computed $P_u$ for every node $u \in S$. Strong induction.
  - _Inductive step_: $|S| = k+1$ because we add the node $v$ to $S$. Could the be a shorter path $P$ from $s$ to $v$? We must prove this is not the case. 
      - poll: $P'$ must contain an edge from x to y where x is explore (in S) and y is unexplored (in V - S)
      - poll: The node v in P' must be explored (in S)

- Locate key nodes on $P'$
  - Break $P'$ into sub-paths from $s$ to $x$, $x$ to $y$, $y$ to $v$
        - use $l$ to denote the lengths of the sub-paths in $P'$
        - $d(x) \leq l(s, x)$
        - $d(u) + l(u,v) \leq d(x) + l(x, y)$
        - $0 \leq l(y,v)$
        - $d(u) + l(u,v) = d(v) \leq l(P') = l(s,x) + l(x,y) + l(y,v)$

### Observations about Dijkstra's Algorithm
- As described, it cannot handle negative edge lengths
- Union of shortest paths output by Dijkstra's forms a tree: why?
- Union of the shortest paths from a fixed source $s$ forms a tree; paths not necessarily computed by computed by Dijkstra's

#### Running time of Dijkstra's

$$ 
\boxed{ 
  \begin{aligned} 
    &S = \{s\} \text{ and } d(s) = 0 \\
    &\text{while } S \neq V \\
      &\quad\text{for every node } x \in V - S \\
        &\qquad\text{Set } d'(x) = \min_{(u, x): u \in S} (d(u) + l(u, x)) \\
      &\quad\text{Set } v = \arg \min_{x \in V - S }(d'(x)) \\
      &\quad\text{Add } v \text{ to } S \text{ and set } d(v) = d'(v)\\
  \end{aligned}
}     
$$  

- $V$ has $n$ nodes and $m$ edges, so their are $n-1$ iterations on the while loops
- In each iteration, for each node $x \in V - S$, compute $d'(x) = \min_{(u, x): u \in S} (d(u) + l(u, x))$ which is proportional the the number of edges incident on $x$
- Running time per iteration is $O(m)$, since the algorithm processes each edge $(u,x)$ in the graph exactly once (when computing $d'(x)$)
- Therefore, the overall running time is $O(mn)$

### Optimizing our Algorithm
- Observation, if we add $v$ to $S$, $d'(x)$ changes only if $(v, x)$ is an edge in $G$
- Idea: For each node $x \in V - S$, store the current value of $d'(x)$. Upon adding a node $v$ to $S$, update $d'()$ only for neighbors of $v$
- How do we efficiently compute $v = \arg \min_{x \in V - S }(d'(x))$
  - Priority Queue!

$$ 
\boxed{ 
  \begin{aligned} 
    &Insert(Q, s, 0) \\
    &S = \{s\} \text{ and } d(s) = 0 \\
    &\text{while } S \neq V \\
      &\quad(v, d'(v)) = ExtractMin(Q) \\
      &\quad\text{Add v to S and set d(v) = d'(v)}\\
      &\quad\text{for every node } x \in V - S \text{ } s.t. (v,x)\text{ is an edge in } G \\
        &\qquad\text{If } d(v) + l(v,x) < d'(x) \\
          &\qquad\quad d'(x) d(v) + l(v,x) \\
          &\qquad\quad ChangeKey(Q,x,d'(x)) \\
  \end{aligned}
}     
$$  

- For each node $x \in V - S$, store the pair $(x, d'(x))$ in a priority queue $Q$ with $d'(x)$ as the key
- Determine the next node $v$ to add to $S$ using $ExtractMin$
- After adding $v$ to $S$, for each node $x \in V - S$ such that there is an edge from $v$ to $x$, check if $d'(x)$ should be updated i.e. if there is a shortest path from $s$ to $x$ via $v$
- in line 8, if $x$ is not in $Q$, simply insert it

### New Runtime
- $ExtractMin$ happens $n - 1$ times
- For every node $v$, the running time of step 5 $O(deg_v)$, the number of _outgoing_ neighbors of $v$: $\sum_{v \in V} O(deg_v) = O(m)$
- $ChangeKey$ is invoked at most once for each edge, $m$ times, and is an $O(\log n)$ operation
- So, the total runtime is $O(m \log n)$

## Network Design
- want to connect a set of nodes using a set of edges with certain properties
- Input is usually a graph, and the desired network (output) should use a subset of edges in the graph
- Example: connect all nodes using a cycle of shortest total length. This problem is the NP-complete traveling salesman problem

## Minimum Spanning Tree (MST)
- Given an undirected graph $G(V,E)$ with a cost $c(e) > 0$ associated with each edge $e \in E$.
- Find a subset $T$ of edges such that the graph $(V,T)$ is connected and the cost $\sum_{e \in T} c(e)$ is as small as possible
- Instance: An undirected graph $G(V,E)$ and a function $c: E \rightarrow \R^+$
- Solution: A set $T \sube E$ of edges such that $(V, T)$ is connected and the cost $\sum_{e \in T} c(e)$ is as small as possible
- Claim: if $T$ is a minimum-cost solution to this problem, then $(V,T)$ is a tree
- A subset $T of E$ is a **spanning tree** of $G$ if $(V, T)$ is a tree

### Characterizing MSTs
- Does the edge of smallest cost belong to an MST? Yes
  - Wrong proof: Because Kruskal's algorithm adds it.
  - Right proof: tbd
- Which edges must belong to an MST?
  - What happens when we delete an edge from an MST?
  - MST breaks up into sub-trees
  - Which edge should we add to join them?
- Which edges cannot belong to an MST?
  - What happens when we add an edge to an MST?
  - We obtain a cycle
  - Which edge in the cycle can we be sure does not belong to an MST

### Greedy Algorithm for the MST Problem
- Template: process edges in some order.  Add an edge to $T$ if tree property is not violated.
  - **increasing cost order**: Process edges in increasing order of cost. Discard an edge if it creates a cycle – **Kruskal's**
  - **Dijkstra-like**: Start from a node $s$ and grow $T$ outward from $s$: add the node that can attached most cheaply to current tree – **Prim's**
  - **Decreasing cost order**: Delete edges in order of decreasing cost as long as graph remains connected – **Reverse-Delete**
  - each of these works
  - Simplifying assumption: all edge costs are distinct

## Graph Cuts
- a **cut** in a graph $G(V,E)$ is a set of edges whose removal disconnects the graph (into two or more connected components)
- Every set $S \sub V$ ($S$ cannot be empty or the entire set $V$) has a corresponding cut: cut($S$) is the set of edges (v,w) such that $v \in S, w \in V - S$
- cut($S$) is a "cut" because deleting the edges in cut($S$) disconnects $S$ from $V - S$
- Claim: for every $S \sub V, S \neq \empty$, every MST contains the cheapest edge in cut$(S$)
  - will have to proof by contradiction using exchange argument

### Proof of Cut Property of MSTs
- Negation of the desired property: There is a set $S \sub V$ and an MST $T$ such that $T$ does not contain the cheapest edge in cut($S$)
- Proof strategy: If $T$ does not contain $e$, show that there is a tree with a smaller cost than $T$ that contains $e$.
- Wrong proof:
  - Since $T$ is spanning, it must contain _some_ edge e.g. $f$ in cut($S) 
  - $T - \{f\} \cup \{e\}$ has smaller cost than $T$ but may not be a spanning tree
- Correct proof:
  - Add $e$ to $T$ forming a cycle
  - This cycle must contain an edge $e'$ in cut($S$)
  - $T - \{e'\} \cup \{e\}$ has smaller cost than $T$ and is a spanning tree

## Prim's Algorithm 
- Maintain a tree (S, T), i.e., a set of nodes and a set of edges, which we will show will always be a tree
- Start with an arbitrary node $s \in S$
- Step 3 is the cheapest edge in cut(S) for the currently explored set S
- In other words, each step in Prim's algorithm computes and adds the cheapest edge in the current value of cut($S$)
  - $\arg \min_{(u,v):u \in S, v \in V - S} c(u,v) \equiv \arg \min_{(u,v) \in cut(S)} c(u,v)$

$$ 
\boxed{ 
  \begin{aligned} 
   &S = \{s\} \text{ and } T = \empty \\
   &\text{while } S \neq V \\
    &\quad\text{Compute } (u, v) = \arg \min_{(u,v):u \in S, v \in V - S} c(u,v) \\
    &\quad\text{Add the node } v \text{ to } S \text{ and add the edge } (u,v) \text{ to } T
  \end{aligned}
}     
$$

### Optimality of Prim's
- Claim: Prim's algorithm outputs an MST
  - Prove that every edge inserted satisfies the cut property (true by construction, in each iteration $(u, v)$ is necessarily the cheapest edge in cut($S$) for the current value of $S$)
  - Prove that the graph constructed is a spanning tree
    - Why are there no cycles in $(V, T)$
    - Why is $(V,T)$ a spanning tree (edges in $T$ connect all nodes in $V$) - Because $G$ is connected, if there were an unconnected node $v$ at the end, then Prim's would not have terminated

### Final version of Prim's Algorithm
$$ 
\boxed{ 
  \begin{aligned} 
   &Insert(Q, s, 0, \empty) \\
   &\text{while } S \neq V \\
    &\quad(v, a(v), u) = ExtractMin(Q) \\
    &\quad\text{Add node } v \text{ to } S \text{ and edge } (u,v) \text{ to } T \\
    &\quad\text{for every node } x \in V - S \text{ s.t. } (v, x) \text{ is ans edge in } G \\
      &\qquad\text{ if } c(v,x) < a(x) \text{then }\\
        &\qquad\quad a(x) = c(v,x) \\ 
        &\qquad\quad ChangeKey(Q,x,a(x),v) \\
  \end{aligned}
}     
$$ 

- $Q$ is a priority queue
- Each element in $Q$ is a triple, the node, its attachment cost, and its predecessor in the MST
- In step 8, if $x$ is not already in $Q$, simply insert (x, a(x), v) into $Q$
- Total of $n - 1$ $ExtractMin$ and $m$ $ChangeKey$ operations, yielding a running time of $O(m \log n)$
- running time of step 5 is proportional to the degree of $x$ which is proportional to the number of edges in the graph $m$

## Kruskal's Algorithm
- Start with an empty set $T$ of edges
- Process edges in $E$ in increasing order of cost
- Add the next edge $e$ to $T$ only if adding $e$ does not create a cycle. Discard $e$ otherwise
- Note: at any iteration, $T$ may contain several connected components and each node in $V$ is in some component
- Claim: Kruskal's algorithm outputs an MST
  -  For every edge $e$ added, demonstrate the existence of a set $S \sub V$ (and $V - S$) such that $e$ and $S$ satisfy the cut property, i.e.e, the cheapest edge in $cut(S)$
      - If $e = (u,v)$, let $S$ be the set of nodes connected to $u$ in the current graph $T$
      - Why is $e$ the cheapest edge in cut($S$) - because we process them in increasing order of cost
  - Prove that the algorithm computes a spanning tree
      - $(V,T)$ contains no cycles by construction
      - If $(V,T)$ is not connected, then there exists a subset $S$ of nodes not connected to $V-S$. What is the contradiction?

### Implementing Kruskal's Algorithm
- start with an empty set $T$ of edges
- Process edges in $E$ in increasing order of cost
- Add the next edge $e$ to $T$ only if adding $e$ does not create a cycle
- Sorting edges takes $O(m \log n)$ time 
- Key question: "Does adding $e = (u,v)$ to $T$ create a cycle?
  - Maintain set of connected components of $T$
  - $Find(u)$: return the name of the connected component of $T$ that $u$ belongs to
  - $Union(A,B)$: merge connected components A, B

### Analysing Kruskal's Algorithm
- How many $Find$ invocations does Kruskal's need? $2m$
- How many $Union$ invocations? $n-1$
- Two implementations of $Union-Find$:
  - Each $Find$ take $O(1)$, $k$ invocations of $Union$ takes $O(k \log k)$ time in total – $O(m + n \log n)$
  - Each $Find$ take $O(\log n )$, each invocation of $Union$ takes $O(1)$ – $O(m \log n + n)$
- In general $m < n$, but in either case, the total running time is $O(m \log n)$ since we have to spend $O(m \log n)$ time sorting the edges by increasing cost, regardless of the underlying implementation of the $Union-Find$ data structure

### Comments on Union-Find and MST
- useful to maintain connected components of a graph as edges are added to the graph
- Data structure does not support edge deletion efficiently
- Current best algorithm for MST runs in $O(m\alpha (m,n))$ time (Chazelle 2000) where $\alpha(m,n)$ is a function of $m,n$ and $O(m)$ randomized time
  - Let $\log^* n =$ the number of times you take $\log n$ before you reach 1
  - e.g. $\log^*(2^{10}) = 4$, $\log^*(2^{2^{10}}) = 5$
- Holy grail: $O(m)$ deterministic algorithm for MST

## Cycle Property
- When can we be sure that an edge cannot be in _any_ MST
- Let $C$ be any cycle in $G$ and let $e = (v,w)$ be the most expensive edge in $C$
- Claim: $e$ does not belong to any MST of G 
- Proof: exchange argument. 
  - If a supposed MST $T$ contains $e$, show that there is a tree with smaller cost than $T$ that does not contain $e$

### Reverse-Delete Algorithm

¯\\_(ツ)_/¯ 

### Observations about MST algorithms
- Any algorithm that constructs a spanning tree by including the Cut and Cycle properties (include edges that satisfy the cut P, delete edges that satisfy the cycle property) will be an MST

# <a name="ch7" class="n"></a> 07 - Applications of Minimum Spanning Trees

## Minimum Bottleneck Spanning Tree (MBST)
- MST minimizes the total cost of the spanning network
- Consider another network design criterion
  - build a network connecting all cities in mountainous region, but ensure the highest elevation is as low as possible
  - total road length is not a criterion
- Idea: compute an MST in which the edge with the highest cost is as cheap as possible
- In an undirected graph $G(V,E)$, let $(V,T)$ be a spanning tree. The **bottleneck edge** in $T$ is the edge with the largest cost in $T$
- Instance: An an undirected graph $G(V,E)$ such that $V,T$ is a spanning tree
- Solution: A Set $T \sube E$ of edges such that $(V,T)$ is a spanning tree and there is no spanning tree in $G$ with a cheaper bottleneck

Is every MST and MBST, or vice versa?
  - If a tree is an MBST, it might not be an MST
  - If a tree is an MST, it will be an MBST

Proof:
  - Let $T$ be the MST, and let $T'$ be a spanning tree with a cheaper bottleneck edge. 
  - Let $e$ be the bottleneck edge in $T$
  - Every edge in $T'$ has lower cost than $e$
  - Adding $e$ to $T'$ creates a cycle consisting only of edges, where $e$ is the costliest edge in the cycle
  - Since $e$ is the costliest edge in this cycle, by the cycle property, $e$ cannot belong to any MST, which contradicts the fact that $T$ is an MST

## Motivation for Clustering
- Given a set of objects and distances between them
- objects can be anything
- Distance function: increase distance corresponds to dissimilarity 
- Goal: group objects into clusters, where each cluster is a group of similar objects

### Formalizing the Clustering Problem
- Let $U$ be the set of $n$ objects labels $p_1, p_2, \mathellipsis, p_n$
- For every pair $p_i, p_j$, we have a distance $d(p_i, p_j)$
- We require that $d(p_i, p_i) = 0$, $d(p_i, p_j) > 0$, $d(p_i, p_j) = d(p_j, p_i)$, 
- Given a positive integer $k$, a **k-clustering** of $U$ is a partition of $U$ into $k$ non-empty subsets or clusters $C_1, C_2, ..., C_k$
- that **spacing** of a clustering is the smallest distance between objects in 2 different subsets:
  - $spacing(C_1, C_2, ..., C_k) = \min_{1 \leq i,j \leq k, i\neq j, p \in Ci, q \in C_j} d(p,q)$
  - **spacing** is the minimum of distance between objects in two different subsets

```python
minimum = inifnity
for every cluster C_i
  for every cluster C_j ≠ i
    for every point p in C_i
      for every point q in C_j
        if d(p,q) < minimum
          minimum = d(p,q)

return minimum
```

- Clustering of Maximum Spacing
  - Instance: a Set $U$ of objects, a distance function $d : U \times U \rightarrow \Reals^+$
  - Solution: A k-clustering of $U$ whose spacing is the largest over all possible k-clusterings
  - $O(n^2)$ on $n$ clusters and then $O(i \times j)$ on points in disparate cluster

## Algorithm for Max Spacing
- intuition: greedily cluster objects in increasing order of distance
- Let $\mathcal C$ be the set of $n$ clusters, with each object in $U$ in its own cluster
- Process pairs of objects in increasing order of distance
  - Let $(p,q)$ be the next pair with $p \in C_p$ and $q \in C_p$
  - If $C_p \neq C_q$ add a new cluster $C_p \cup C_q$ to $\mathcal{C}$, delete $C_p, C_q$ from $\mathcal{C}$
- Stop when there are $k$ cluster in $\mathcal{C}$
- Same as Kruskal's algorithm, but do not add the last $k-1$ edges in MST
- Given a clustering $\mathcal{C}$, what is spacing($\mathcal{C}$)?
  - The length of the next edge that would be added - the cost of the $(k-1)$st most expensive edge in the MST.  Let this cost be $d^*$

### Proof of optimal computing
- Let $\mathcal{C'}$ be any other cluster (with $k$ clusters).  
- We will prove that spacing($\mathcal{C'}$) $\leq d^*$ 
  - There must be two objects $p_i, p_j \in U$ in the same cluster $C_r \in \mathcal{C}$ but in different clusters in $\mathcal{C'}$: spacing($\mathcal{C'}$) $\leq d(p_i, q_i)$ 
  - Suppose $p_i \in C'_s$ and $p_j \in C'_t$ in $\mathcal{C}$
  - All edges in the path $Q$ connecting $p_i \rightarrow p_j$ in the MST have lengths $\leq d^*$
  - In particular, there is an object $p \in C'_s$ and an object $p' \notin C'_s$ s.t. $p$ and $p'$ are adjacent in $Q$
  - $d(p, p') \leq d^* \implies$ spacing($\mathcal{C'}$) $\leq d(p, p') \leq d^*$

Explanation
- $d^*$ is the name we give to the variable denoting the spacing produced by our algorithm$
- The above proof shows that any other clustering will have a smaller spacing

![](/images/algorithms-proof-of-spacing.png)

# <a name="ch8" class="n"></a> 08 - Divide and Conquer Algorithms

## Mergesort
- Instance: nonempty list $L = x_1, x_2, ..., x_n$ integers
- Solution: A permutation $y_1, y_2, ..., y_n$ of $L$ such that $y_i \leq y_{i+1}$ for all $1 \leq i \leq n$
- Mergesort  is a divide and conquer algorithm for sorting
  - Partition $L$ into two lists $A, B$ of sizes $\lfloor n/2 \rfloor, \lceil n/2 \rceil$
  - Recursively sort $A, B$,
  - Merge the sorted lists $A,B$ into a sorted list
  
### Merging Two Sorted Lists
- Maintain a _current_ pointer for each list
- initialize each pointed to the front of the list 
- While both lists are non-empty:
  - let $a_i, b_i$ be the elements pointed to by each pointer
  - append the smaller of the two to the output list
  - advance the current pointer in the list that the smaller element belonged to
- append the rest of the non-empty list to the output
- Running time of this algorithm is $O(k+l)$, $k = len(L)$

### Analysing Mergesort
- Running time for $L$ = running time for $A + $ running time for $B +$ time to split the input into two lists $ + $ time to merge two sorted lists
  - what is this in the worst case?  
  - $\leq $ worst case running time for $\lfloor n/2 \rfloor + \lceil n/2 \rceil + $ time to split input into two lists + time to merge two sorted lists
- This sucks to read, need a shorthand.  Let's assume $n$ is a power of 2
- Let $T(n)$ be the worst-case running time for $n$ elements, $\forall n \geq 1$
- Worst-case running time:
  - $T(n) \leq 2T(n/2) + cn, n > 2$, $c$ is some constant time to split the list
  - $T(2) \leq c$
  - Can assume $T(n) = O(n \log n)$ for problem sets

### Analysing Mergesort in the Worst Case
- Partition $L$ into two lists $A$ and $B$ of size $\lfloor n/2 \rfloor, \lceil n/2 \rceil$ respectively
- Recursively sort $A$ and $B$
- Merge the sorted lists $A, B$ into a single sorted list 
- Worst case running time for $n$ elements ≤ 
  - worst case running time for $\lfloor n/2 \rfloor$ +
  - worst case running time for $\lceil n/2 \rceil$ +
  - time to split the input into two lists +
  - time to merge two sorted lists 
- Assuming $n$ is a power of 2: $T(n) \leq 2t(n/2) + cn, \quad n > 2$
- Three basic ways of solving this recurrence relation:
  - "Unrolling" the recurrence 
  - Guess a solution and substitute into recurrence to check
  - Guess a solution in $O( )$ form and substitute into recurrence to determine the constants 

## Unrolling

![](/images/algorithms-unrolling.png)

- Input to each sub problem on level $i$ has size $n/2^i$
- Recursion tree has $\log n$ levels
- Number of sub-problems on level $i$ has size $2^i$
- Total work done at each level is $cn$
- Running time of the algorithm is $cn \log n$


### Substituting a Solution into the Recurrence
- Guess that the solution is $T(n) \leq cn \log n$ (log base 2)
- Use induction to check if the solution satisfies the recurrence relation
- Base case: $n = 2$. Is $T(2) = c \leq 2c \log 2$? yes.
- (strong) Inductive Hypothesis: must include $n/2$
  - Assume $T(m) \leq cm \log_2 m$, for all $2 \leq m < n$, therefore 
  - $T({n \over 2}) \leq {cn \over 2} \log ({n \over 2})$
- Inductive Step: Prove $T(n) \leq cn \log n$
  $$
  \begin{aligned}
    T(n) &\leq 2T({n \over 2}) + cn \\
         &\leq 2({cn \over 2} \log ({n \over 2})) \\
         &= cn \log ({n \over 2}) + cn \\
         &= cn \log n - cn + cn \\
         &= cn \log n \\
  \end{aligned}
  $$
- Why is $T(n) \leq kn^2$ a "loose" bound?
- Why doesn't an attempt to prove $T(n) \leq kn$, for some $k > 0$ work?
  - (strong) Inductive Hypothesis: must include $n/2$
    - Assume $T(m) \leq km \log m$, for all $m < n$, therefore 
    - $T({n \over 2}) \leq {cn \over 2} \log ({n \over 2})$
  - Inductive Step: Prove $T(n) \leq kn \log n$
  
  $$
  \begin{aligned}
    T(n) &\leq 2T({n \over 2}) + cn \\
         &\leq 2({km \over 2} \log ({m \over 2}) + cn \leq k(\frac{n}{2})^2 + cn\\
         &\leq kn \log n - kn + cn \leq \frac{kn^2}{2} + cn\\
         &\leq cn \log n \text{ (if k ≥ c), } \leq kn^2 \\
         
  \end{aligned}
  $$

  what about $T(n) \leq kn$: it breaks down (I guess?)

  $$
  \begin{aligned}
    T(n) &\leq 2T({n \over 2}) + cn \\
         &\leq 2({kn \over 2}) + cn\\
         &\leq kn \log n - kn + cn \leq \frac{kn^2}{2} + cn\\
         &\leq kn + cn = (k +c)n \\
         &\leq kn \\
         
  \end{aligned}
  $$

  ### Partial Substitution
- Guess that the solution is $kn \log_2 n$
- Substitute guess into the recurrence relation to check what value of $k$ will satisfy the recurrence relation
- $k \geq c$ will work

### Proof for all Value of $n$
- We assumed that $n$ is a power of 2
- How do we generalize the proof?
- Basic axiom: $T(n) \leq T(n+1)$, for all $n$: worst case running time increase as input size increases
- Let $m$ be the smallest power of 2 larger than $n$
- $T(n) \leq t(m) = O(m \log m) = $O(n \log n)$ because $m \leq 2n$

### Other Recurrence Relations
- Divide into $q$ sub-problems of size $n/s$ and merge in $O(n)$ time
- two distinct cases: $q = 1, q > 2$
- Divide into two subproblems of size $n/2$ and merge in $O(n^2)$ time
- Consider: $T(n) = q T(n/2) + cn, q = 1$ (finding the median in a set of data)
  - Each invocation reduces the problem by a factor of 2 -> there are $\log n$ levels in the recursion tree
  - At level $i$ of the tree, the problem size is $n/2^i$ and the work done is $cn/2^i$
  - Therefore the total work done is 
  
  $\displaystyle\sum^{i = \log n}_{i=0} \frac{cn}{2^i} = 2 = O(n)$

  since 

  $$
  \begin{aligned}
    S &= 1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + ... \\
    2S &= 2 + 1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + ... \\
    2S-S &= 2
  \end{aligned}
  $$

- What about $q > 2$: $T(n) = qT(n/2) + cn$?
- $n \log n$ levels in the recursion tree
- At level $i$ of the tree, there are $q^i$ sub problems, each of size $n/s^i$
- Total work done at level $i$ is $q^icn/2^i$, therefore the total work is 

  $$
  \begin{aligned}
    T(n) &\leq \displaystyle\sum^{i = \log_2 n}_{i=0} q^i \frac{cn}{2^i} \leq \displaystyle\sum^{i = \log_2 n}_{i=0} (\frac{q}{2})^i \\
         &\leq O \Big( cn (\frac{q}{2})^{\log_2 n} \Big) = O \Big(cn (\frac{q}{2})^{(log_{q/2} n)(\log_2 q/2)} \Big) \\
         &\leq O(cn \text{ } n^{\log_2 q/2}) = O(n^{\log_2 q})
  \end{aligned}
  $$

  ## Counting Inversions
- Motivation: 
  - collaborative filtering - match one user's preferences to those of other users
  - Meta-search engines - merge results of multiple search engines into a better search results
- Two rankings of things are very similar if they have few inversions
  - Two rankings $a,b$ have an inversion if there exists $i,j$ such that $i < j$ but $a_i > a_j$
  - the number of inversions $s$ is a measure of the difference between the rankings
- **Kendall's rank correlation** of two lists of numbers is $\frac{1-2s}{n(n-1)}$
- Instance: A list $L = x_1, x_s, ..., x_n$ of distinct integers between $1, n$
- Solution: The number of pairs $(i,j), 1 < i < j \leq n$ s.t. $x_i > x_j$
- How many inversions can there be in a list of $n$ numbers? 
  - $\frac{n(n-1)}{2} = \Omega(n^2)$ since every inversion involves a pair of two numbers
- Sorting removes all inversion in $O(n \log n)$ time. Can we modify mergesort to count inversions?
- Candidate algorithm:
  - Partition $L$ into $A,B$ of size $n/2$ each
  - Recursively count the number of inversions in $A$ and sort $A$
  - Recursively count the number of inversions in $B$ and sort $B$
  - Count to number of inversions involving on element in $A$ and one element in $B$

### "Conquer" step 
- Given lists $A = a_1, a_2, ..., a_m$ and $B = b_1, b_2, ..., b_m$, compute the number of pairs $a_i$ and $b_j$ s.t. $a_i > b_j$
  - This step is much easier if $A,B$ are sorted
- Merge-And-Count Procedure:
  - Maintain a `current` pointer for each list
  - Maintain a variable `count` initialized to 0
  - Initialize each pointer to the front of each list
  - While both lists are non-empty
      - Let $a_i, b_j$ be the elements pointed to by the `current` pointers
      - Append the smaller of the two to the output list
      - _Do something clever in $O(1)$ time_ --> if $b_j < a_i$ then `count += m - i`, since every element following $a_{i^+}$ will also be an inversion with $b_j$
      - Advance the `current` pointer of the list containing the smaller list
  - Append the rest of the non-empty list to the output
  - Return `count` _and_ the merged list
  - $O(m)$

### Sort and Count 
$$ 
\boxed{ 
  \begin{aligned} 
    &\text{If the list has one element} \\
      &\quad\text{There are no inversions and the list is sorted } \\
     &\text{Divide the list into two halves} \\
      &\quad A \leftarrow list \lfloor n/2 \rfloor \\
      &\quad B \leftarrow list \lceil n/2 \rceil \\
  \end{aligned}
}     
$$  

### Proof of Correctness
- Proof by induction: Strategy 
  - a) every inversion in the data is counted exactly once
  - b) no non-inversions are counted
- Base case: $n = 1$
- Inductive Hypothesis: Algorithm counts number of inversion correctly for all sets of $n-1$ or fewer numbers
- Inductive Step: Consider an arbitrary inversion, i.e., any pair $k,l$ such that $k < l$ but $x_k > x_l$. When is this inversion counted by the algorithm
  - $k,l \leq \lfloor n/2 \rfloor: x_k, x_l \in A$, counted in $r_A$ but the inductive hypothesis
  - $k,l \geq \lceil n/2 \rceil: x_k, x_l \in B$, counted in $r_B$ but the inductive hypothesis
  - $k \leq \lfloor n/2 \rfloor, l \geq \lceil n/2 \rceil: x_k \in A, x_l \in B$. Is this inversion counted by Merge-And-Count? Yes: when $x_l$ is output to the final list is when we count this inversion
  - Why is no non-inversion counted? When $x_l$ is output, it is smaller than all remaining elements in $A$ since $A$ is sorted

# <a name="ch9" class="n"></a> 09 - Dynamic Programming

## Motivation
- Goal: design efficient polynomial time algs
- Greedy:
  - pro: natural approach to algorithm design
  - con: many greedy approaches; only some may work
  - con: many problems for which no greedy approach is known
- Divide and conquer
  - pro: simple to develop algorithm skeleton
  - con: conquer step can be very hard to implement efficiently
  - con: usually reduces time for a problem known to be solvable in polynomial time
- Dynamic Programming
  - more powerful than greedy and divide and conquer strategies
  - implicitly explore the space of all possible solutions
  - solve multiple sub-problems and build up correct solutions to larger and larger subproblems
  - careful analysis needed to ensure number of sub-problems solved is polynomial in the size of the input

## Example: Greedy Scheduling, but using a DP approach
  - Input: start and end time of day: Set $\{(s(i), f(i)), 1 \leq i \leq n\}$
  - Constraint: cannot be in two places at one time
  - Goal: maximum number of rides you can go on: **largest** subset of mutually compatible jobs
  - EFT: sort jobs in order of increasing finish time, and add compatible jobs to the set
  - Use DP to solve a **Weighted Interval Scheduling** problem:
    - Instance: nonempty set $\{(s_i f_i), 1 \leq i \leq n\}$ and a weight $v_i \geq 0$ associated with each job
    - Solution: A set $S$ of mutually compatible jobs such that the value $\sum_{i \in S} v_i$ is maximized 
    - Greedy algorithm can produce arbitrarily bad results for this problem depending on weights

### Detour: Binomial Identity

```
      1
    1   1
  1   2   1
1   3   3   1
```

- sum of a row = $2^n$
- Value of a cell $k$ in row $n$ = $n \choose k$
- each element is the sum of the two elements above it
- ${n \choose r} = {n-1 \choose r-1} + {n-1 \choose r}$ 

## Approach
- Sort jobs in increasing order of finish time and relabel: $f_1 \leq f_2 \leq ... \leq f_n$
- Job $i$ comes before job $j$ if $i < j$
- $p(j)$ is the largest index $i < j$ such that job $i$ is compatible with job $j$
  - $p(j) = 0$ if there is no such job $i$
  - All jobs that come before $p(j)$ are also compatible with job $j$

![](/images/algorithms-schedule1.png)

### Sub-problems
- Let $O$ be the optimal solution: it contains a subset of the input jobs. Two cases to consider:
  - Case 1: Job $n$ is not in $O$.  
      - $O$ must be the optimal solution for jobs $\{1, 2, ..., n - 1\}$
  - Case 2: Job $n$ is in $O$
      - $O$ cannot use incompatible jobs $\{p(n) + 1, p(n) + 2, ..., n - 1\}$
      - Remaining jobs in $O$ must be the optimal solution for jobs $\{1, 2, ..., p(n)\}$
  - One of the two cases must be true: $O$ is the best of the two choices
  - Suggests finding optimal solution for sub-problems consisting of jobs $\{1, 2, ..., j - 1, j\}$, for all values of $j$

### Recursion
- Let $O_j$ be the optimal solution for jobs $\{1, 2, ..., j\}$ (a set of jobs) and $OPT(j)$ be the value of this solution: $OPT(0) = 0$
- We are sooking $O_n$ with a value of $OPT(n)$, but we start with $j4
- To compute $OPT(j)$:
  - Case 1: $j \notin O_j$: $OPT(j) = OPT(j-1)$
  - Case 2: $j \in O_j$: $OPT(j) = v_j + OPT(p(j))$ // $p(j) < j$
  - $OPT(j) = \max (v_j + OPT(p(j)), OPT(j - 1))$
- When does job $j$ belong to $O_j$?
  - Iff $OPT(j) = v_j + OPT(p(j))$

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Compute } OPT(j) \\
    &\text{If } j = 0 \\
      &\quad\text{Return } 0 \\
    &\text{Else} \\
      &\quad\text{Return } \max (v_j + OPT(p(j)), OPT(j-1)) \\
  \end{aligned}
}     
$$  

![](/images/algorithms-schedule2.png)

### Running Time of Recusrive Algorithm
- It _can_ be exponential in $n$ when $p(j) = j - 2 , \quad\forall j \geq 2$: recursive calls are for $j-1, j-2$
- Slide
- However, the same sub-problems get used over and over again, we can cache them 

## Memoisation
- Store $OPT(j)$ values in a cache using `m_compute_opt(j)` and reuse them rather than compute them:

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{M-Compute-OPT}(j) \\
    &\text{If } j = 0 \\
      &\quad\text{Return } 0 \\
    &\text{Else if } M[j] \text{ is not empty} \\
      &\quad \text{Return } M[j] \\
    &\text{Else} \\
      M[j] \leftarrow \max (v_j + &\texttt{M-Compute-OPT}(j),\texttt{M-Compute-OPT}(j-1)) \\
      &\quad\text{Return } M[j] \\
  \end{aligned}
}     
$$ 

- Claim: running time of algorithm is $O(n)$ after sorting
- Time spent in a single call to M-Compute-Opt is $O(1)$ apart from time spent in
recursive calls
- Total time spent is the order of the number of recursive calls to M-Compute-Opt
- How many such recursive calls are there in total?
- Use number of filled entries in $M$ as a measure of progress
- Each time M-Compute-Opt issues two recursive calls, it fills in a new entry in $M$
- Therefore, total number of recursive calls is $O(n)$

### Computing $O$ in addition to $OPT(n)$
- explicitly soted $O_j$ in addition to $OPT(j)$
- Recall: request $j$ belong to $O_j$ iff $v_j + OPT(p(j)) \geq OPT(j -1)$
- Can recover $O_j$ from values of optimal solutions in $O(j)$ time

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{Find-Solution}(j) \\
    &\text{If } j = 0 \\
      &\quad\text{Return nothing}  \\
    &\text{Else } \\
      &\quad \text{If } v_j + M[p(j)] \geq M[j - 1] \text{ then } \\
        &\quad\text{Return } j, Find-Solution(p(j)) \\
      &\quad\text{Else } \\
        &\quad\text{Return } Find-Solution(j-1) \\
  \end{aligned}
}     
$$ 

### From Recursion to Iteration
- Unwind the recursion and convert it into iteration
- Can compute values of $M$ iteratively in $O(n)$ time
- Find solution works as before

## Basic Outline of Dynamic Programming
- need a collection of sub-problems that satisfy a few properties
- There are a polynomial number of sub problems
- The solution to the problem can by computed easily from the solutions to the sub problems
- There is a natural ordering from "smallest" to "largest"
- There is an easy to compute recurrence that allows us to compute the solution to the sub-problems from solutions to some smaller sub problems

## Least Squares Problem
- Given a set of scientific or statistical data plotted on two axes, find the best line that passes through these points
- Instance: Set $P = \{(x_1, y_1), (x_2, y_2), ... , (x_n, y_n)\}$ of $n$ points
- Solution: Line $L: y = ax + b$ that minimizes Error(L,P) $ = \displaystyle\sum_{i=1}^n(y_i - ax_i - b)^2$
- How many unknown parameters must we find values for?
  - $a,b$ via Lagrangian
  - $a = \frac{n\sum x_i y_i - (\sum x_i)(\sum y_i)}{n \sum x_i^2 - (\sum x_i)^2}$ and $b = \frac{\sum y_i - a \sum x_i}{n}$

## Segmented Least Squares
- Want to fit multiple lines through $P$
- Each line must fit contiguous set of x-coordinates
- Lines must minimize total error
- Divide the points into segments; each **segment** contains a consecutive set of points ordered by increasing x-coordinate
- Instance: Set $P = \{p_i = (x_i, y_i), 1 \leq i \leq n\}$ of $n$ points, $x_1 < x_2 < ... < x_n$ and a parameter $C > 0$
- Solution 
  - an integer $k$
  - a partition of $P$ into $k$ segments $\{P_1, P_2, ..., P_k\}$ 
  - for each segment $P_j$, the best fit line $L_j: y = a_jx + b_j, 1 \leq j \leq k$ that minimises the total error $\displaystyle\sum_{j=1}^k Error(L_j, P_j) + Ck$

- if $C$ is very large then one line works, if $C$ is small, then we fit many lines 
- How many unknown parameters here? $2k, k$ since we need to find the slope and intercept of $k$ lines as well a the optimal value of $k$ itself

### Formulating the Recursion
- Let $e_j$ denote the minimum error of a (single) line that fits $\{p_1, p_2, ..., p_i\}$
- Let $OPT(i)$ be the optimal total error for the points $\{p_1, p_2, ..., p_i\}$
- We want to compute $OPT(n)$
- Observation: Where does the last segment in the optimal solution end? $p_n$, and this segment starts at some point $p_i$. So the rest of the solution must be the optimal fit for points up to $p_i$: $OPT(i-1)$
- $OPT(n)$ is the error for the line that goes through points $i, n$ plus the penalty for adding a line $C$ plus the best solution for the last $i-1$ points
- If the last segment in the optimal solution is $\{p_i, p_{i+1}, ..., p_n\}$, then 

  $OPT(n) = e_i,n + C + OPT(i-1)$

- Suppose we want to solve the sub-problem on the first $j$ points: $\{p_1, p_2, ..., p_j\}$: we want to compute $OPT(j)$
- If the last swgment in the optimal partition is $\{p_i, p_{i+1}, ..., p_j\}$ then 

  $OPT(j) = e_i,j + C + OPT(i-1)$

- But $i$ can take only $j$ distinct values: $1, 2, 3, ..., j$ therefore:

  $OPT(j) = \min \limits_{1 \leq i \leq j} (e_i,j + C + OPT(i-1))$

- Segment $\{p_i, p_{i+1}, ..., p_j\} is part of the optimal solution for this sub-problem iff the values of $OPT(j) is obtained using index $i$

### DP Algorithm

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{Segmented-Least-Squares}(n) \\
    &\text{Array } M[0, ..., n] \\
    &\text{Set } M[0] = 0 \\
    &\text{For all pairs } i \leq j \\
      &\quad\text{Compute the least squares error } e_{i,j} \text{ for the segment } p_i, ..., p_j\\
    &\text{For} j = 1,2, ..., n \\
      &\quad\text{Use the recurrence from (6.7) to compute } M[j] \\
    &\text{Return } M[n]
  \end{aligned}
}     
$$ 

- Computing $OPT(j)$ takes $O(j)$
- $\sum_{j=1}^n O(j) = O(n^2)$

$$
\begin{aligned}
  \displaystyle\sum_{1 \leq i \leq j} O(j - i) &= j(j-1)/2 \\
                                               &\leq \sum j^2/2 \\
                                               &\leq \sum j^2

\end{aligned}
$$

- Let $T(n)$ be the running time of this algorithm ($j - i$ since we compute segments)

  $T(n) = \displaystyle\sum_{i \leq j \leq n}\sum_{1 \leq i \leq j} O(j - i) = O(n^3)$

---

## RNA Molecules
- basic biological molecule. Single stranded
- RNA molecules fold into complex "secondary structures"
- Secondary structure governs the behavior of an RNA molecule
- carious rules govern secondary structure formation
- Pairs of bases match up; each base matches with ≤ 1 other base
- Adenine : Uracil
- Cytosine : Guanine
- There are no kinks in the folded molecule 
- Structures are "knot-free"
- High level problem: given an RNA molecule, predict its secondary structure

### Formulating the Problem
- an **RNA Molecule** is a string $B = b_1 b_2 ... b_n$; each $b_i \in \{A, C, G, U\}$
- A **secondary structure on $B$** is a set of pairs $S = \{(i,j)\}$ where $1 \leq i,j \leq n$ and 
  - No kinks: if $(i,j) \in S$  then $i < j - 4$
  - Watson Crick: The elements in each pair of $S$ consist of either $\{A, U\}$ or  $\{c, G\}$
  - $S$ is a **matching**: no index appears in more than one pair
  - No knots: If $(i, j)$ and $(k, l)$ are two pairs in $S$, then we cannot have $i < k < j < l$
- The **Energy** of a secondary structure $\propto$ the number of base pairs in it.
- Problem: Compute the largest secondary structure, i.e. with the largest number of base pairs

### Dynamic Programming Approach
- $OPT(j)$ is the maximum number of base pairs in a secondary structure for $b_1b_2...b_j$, $OP(j) = 0, j \leq 5$
- In the optimal secondary structure on $b_1b_2...b_j$
  - If $j$ is not a member of any pair, use $OPT(j-1)$
  - If $j$ pairs with some $t < j - 4$, then the knot condition yields tow independent sub-problems: $OPT(t-1)$, ???
      - Note that we need that sub-problems to be indexed by both start and by end
- $OPT(i,j)$ is the maximum number of base pairs in a secondary structure for $b_ib_{i+1}...b_j$, $OPT(i,j) = 0, i \geq j-4$
- In the optimal secondary structure on $b_ib_{i+2}...b_j$
    - If $j$ is not a member of any pair, compute $OPT(i, j-1)$
    - If $j$ pairs with somme $t < j -4$, compute $OPT(i, t-1)$ and $OPT(t+1, j-1)$

$OPT(i,j) = \max \Big( OPT(i, j-1), \max \limits_t (1 + OPT(i, t-1) + OPT(t+1, j-1)) \Big)$

- In the "inner" maximization, $t$ runs over all indices between $i,j-5$ that are allowed to pair with $j$
- There are $O(n^2)$ sub-problems: we have a matrix of $i,j$ with the lower right triangle filled out: $\sum_{j=5}^n \sum_{i=1}^j = n^3$ since the inner summation is less than $j(j-1)/2$ which we then sum another $n$ times
- How do we order them from "smallest" to "largest"? increasing order of $j-i$
- Note that computing $OPT(i,j)$? $O(i-j)$ : involves sub-problems $OPT(l,m)$ where $m - l < j - i$

$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Initialize OPT(i,j) = 0 whenever } i \geq j -4\\ 
    &\text{For } k = 5,6,...,n-1 \\
      &\quad\text{For } i = 1,2,...,n-k \\
        &\qquad\text{Set } j = i + k \\ 
        &\qquad\text{Compute } OPT(i,j) \text{ using the recurrence above }\\
    &\text{Return } OPT(1,n)
  \end{aligned}
}     
$$ 

- Total running time for the algorithm is $O(n^3)$

## Dynamic Programming for Shortest Path 

### Motivation
- Computational finance
  - Each node is a financial agent
  - The cost $c_{uv}$ of an edge $(u,v)$ is the cost of a transaction in which we buy from agent $u$ and sell to agent $v$
  - Negative cost corresponds to profit
- Internet routing protocols
  - Dijkstra's algorithm needs knowledge of the entire network
  - Routers only know which other routers they are connected to
  - Algorithm for shortest paths with negative edges is decentralized 
  - Not covered in class, but described in Chapter 6.9

### Problem Statement
- Input: a directed graph $G = (V,E)$ with a cost function $c: E \rightarrow \reals$ i.e., $c_{uv}$ is the cost of the edge $(u,v) \in E$
- A **negative cycle** is a directed graph whose edges have a total cost that is negative
- Two related problems:
  - If $G$ has no negative cycles, find the **shortest s-t path**: a path from source $s$ to destination $t$ with minimum total cost
  - Does $G$ have a negative cycle?

![](/images/algorithms-cycle1.png)

### Approaches for Shortest Path Algorithm
1. Dijkstra's 
  - Computes incorrect answers because it is greedy
2. Add some largest constant to each edge
  - Computes incorrect answers because the minimum cost path changes

### DP Approach
- Assume $G$ has no negative cycles
- Claim: there is a shortest path from $s$ to $t$ that is **simple** (does not repeat a node) and therefore has at most $n-1$ edges
- How do we define sub-problems?
  - Proof: The portion of the $s \rightarrow t$ path between the two appearances of the node $u$ must have a positive cost
  - Shortest $s \rightarrow t$ path has $\leq n -1$ edges: how can we reach $t$ using $i$ edges, for different values of $i$?
  - We do not know which nodes will be in shortest $s \rightarrow t$ path: how we can reach $t$ from each node in $V$
- Sub-problems defined by varying the number of edges in the shortest path and by varying the starting node in the shortest path

### DP Recursion
- $OPT(i,v)$: minimum cost of a $v \rightarrow t$ path that uses **at most** $i$ edges
- $t$ is not explicitly mentioned in the sub-problems
- Goal is to compute $OPT(n - 1, s)$
- Let $P$ be the optimal path whose cost is $OPT(i,v)$
  - If $P$ actually uses $i -1$ edges, then $OPT(i,v) = OPT(i - v)$ 
  - If first node on $P$ is $w$, then $OPT(i,v) = c_{vw} + OPT(i -1, w$

$$
  OPT(0, v) = 
  \begin{cases}
    0; v = t \\
    \infty; v \neq t
  \end{cases}
$$

$OPT(i,v) = \min \Big(OPT(i-v), \min \limits_{w \in V} (c_{vw} + OPT(i -1, w)) \Big)$

### Alternate DP Formulation
- $OPT(i,v)$: minimum cost of a $v \rightarrow t$ path that uses **exactly** $i$ edges
- a bit harder, but it's in the slides

### Bellman-Ford Algorithm

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{Shortest-Path}(G,s,t)\\ 
    &n = |V| \in G \\
    &m[0, ... , n-1, V] \\
    &\text{Define} M[0,t]=0, M[0,v] = \infty \text{ for all other } v \in V \\
    &\text{For } i = 1,2, ..., n -1 \\
      &\quad\text{For each} v \in V \text{ (in any order)} \\
        &\qquad\text{Compute} M[i,v] \text{ using the recurrence} \\ 
    &\text{Return } M[n - 1, s]
  \end{aligned}
}     
$$ 

- space used is $O(n^2)$, running time is $O(n^3)$
- If shortest path uses $k$ edges, we can recover it in $O(kn)$ time by tracing back through smaller sub-problems

### An Improved Bound on the Running Time
- Suppose $G$ has $n$ nodes and $m \ll {n \choose 2}$ edges. Can we demonstrate a better upper bound on the running time

$M[i,v] = \min \Big( M[i-1, v], \min \limits_{w \in N_v} (c_{wv} + M[i-1, w]) \Big)$

- $w$ only needs to range over outgoing neighbors $N_v$ of $v$
- if $n_v = |N_v|$ is the number of outgoing neighbors of $v$, then in each round, we spend time equal to 

$\displaystyle\sum_{v \in V} = m$

- So the total running time can be improved to $O(mn)$

### Improving the Memory Requirements

$M[i,v] = \min \Big( M[i-1, v], \min \limits_{w \in N_v} (c_{wv} + M[i-1, w]) \Big)$

- Algorithm still uses $O(n^2)$ space to store the 2D array $M$
- However, $M[i,v]$ depends only on $M[i-1, *]$ and no other indices
- Modified algorithm:
  - Maintain two arrays $M$ and $M'$ indexed over $V$
  - At the beginning of each iteration, copy $M$ into $M'$
  - To update $M$, we use 

$M[v] = \min \Big( M'[v], \min \limits_{w \in N_v} (c_{wv} + M'[w]) \Big)$

- claim: at the beginning of iteration $i$, $M$ stores values of $OPT(i - 1, v)$ for all nodes $v \in V$
- space used is $O(n)$

## Computing the Shortest Path: Algorithm

$M[v] = \min \Big( M'[v], \min \limits_{w \in N_v} (c_{wv} + M'[w]) \Big)$

- How can we recover the shortest path that has cose $M[v]$?
- For each node $v$, compute and update $f(v)$, the first node after $v$ in the current shortest path from $v$ to $t$
- Updating $f(v)$: If $x$ is the node that attains the minimum in $\min \limits_{w \in N_v} (C_{vw} + M'[w])$ and $M'[v] > c_{vx} + M'[x]$, set
  - $M[v] = c_{vx} + M'[x]$
  - $f(v) = x$
- At the end, follow $f(v)$ points from $s \rightarrow t$ (and hope for the best lol??)

## Computing the Shortest Path: Correctness
- **Pointer graph** $P(V, F)$: each edge in $F$ is $(v, f(v))$
  - Can $P$ have cycles?
  - is there a path from $s \rightarrow t$ in $P$?
  - Can there be multiple paths $s \rightarrow t$ in $P$?
  - Which of these is the shortest path?

### Computing the Shortest Path: Cycles in $P$
$M[v] = \min \Big(M'[v], \min \limits_{w \in N_v} (c_{vw} + M'[w])\Big)$
- Claim: If $P$ has a cycle $C$, then $C$ has negative cost.
  - Suppose we set $f(v) = w$, at this instant $M[v] = c_{wv} + M'[w]$
  - Comparing $M[w]$ and $M'[w]$, we know that $M[w] \leq M'[w]$
  - Between this assignment and the assignment of $f(v)$ to some other node, $M[w]$ may itself decrease. Hence, $M[v] \geq c_{wv} + M[v]$, in general
  - Let $v_1, v_2, ..., v_k$ be the nodes in $C$ and assume that $(v_k, v_1)$ is the last edge to have been added.
  - What is the situation just before this addition?
      - $M[v_i] - M[v_{i+1}] \geq c_{v_iv_{i+1}}$ for all $1 \leq i < k -1$, $f(v_i) = v_{i+1}$
      - $M[v_k] - M[v_1] > c_{v_kv_1}$
      - Adding all these inequalities: $0 > \sum_{i=1}^{k -1} c_{v_iv_{i+1}} + c_{v_kv_1} = $ cost of $C$
  - Corollary: if $G$ has no negative cycles then $P$ does not either

### Computing the Shortest Path: Paths in $P$
- Let $P$ be the pointer graph upon termination of the algorithm
- Consider the path $P_v$ in $P$ obtained by following the pointers from $v$ to $f(v) = v_1$ to $f(v_1) = v_2$ and so on
- Claim: $P_v$ terminates at $t$
- Claim $P_v$ is the shortest path in $G$ from $v$ to $t$

### Bellman-For algorithm: One Array
$M[v] = \min \Big( M[v], \min \limits_{w \in N_v} (c_{vw} + M[w]) \Big)$
- In general, after $i$ iterations, the path whose length is $M[v]$ may have many more than $i$ edges
- Early termination: if $M$ does not change after processing all the nodes, we have computed all shortest paths to $t$

# <a name="ch10" class="n"></a> 10 - Network Flow

## Motivation
- Fundamental problems in combinatorial optimization
- duality between flow and cuts

## Flow Networks
- Use directed graphs to model **transport networks**:
  - edges carry traffic and have capacities
  - nodes act as switches
  - _source_ nodes generate traffic, _sink_ nodes absorb traffic
- A **flow network** is a directed graph $G = (V,E)$
  - each edge $e \in E$ has a capacity $c(e) > 0$
  - There is a single source node $s \in V$
  - There is a single sink node $s \in V$
  - Nodes other than $s,t$ are internal

## Defining Flow
- In a flow network $G = (V,E)$, an **$s-t$ flow** is a function $f: E \rightarrow \Reals^+$ such that:
  - (Capacity conditions) for each $e \ in E, 0 \leq f(e) \leq c(e)$
  - (Conservation conditions) for each internal node $v$, $\displaystyle\sum_{e \text{ into } V} f(e) = \displaystyle\sum_{e \text{ out of } V} f(e)$
- The **value** of a flow is $v(f) = \sum_{e \text{ out of } } f(e)$

## Maximum-Flow Problem
- Instance: a flow network $G$
- Solution: The flow with the largest value in $G$, where the maximum is taking over all possible flows on $G$
- Output should assign a flow value to each edge in the graph
- The flow on each edge should satisfy the capacity condition
- The flow into and out of each internal node should satisfy the conservation conditions
- the value of the output flow, i.e., the total flow out of the source node in the output flow, must be the largest possible over all possible flows in $G$
- Assumptions:
  - Node edges enter $s$, no edges leave $t$
  - There is at least one edge incident on each node
  - all edge capacities are integers

## Developing the Algorithm
- No known DP algorithm
- Greedy approach instead
  - Start with zero flow along all edges
  - find an $s-t$ path and push as much flow along it as possible
  - idea is to increase flow: push flow along edges with leftover capacity and undow flow along edges already carrying flow

## Residual graph
- Give a flow network $G = (V,E)$ and a flow $f$ on $G$, the **residual graph** $G_f$ of $G$ w.r.t. $f$ is a directed graph such that:
  - (Nodes) $G_f$ has the same nodes as $G$
  - (Forward edges) for each edge $e = (u,v) \in E$ s.t. $f(e) < c(e)$, $G_f$ contains the edge $(u,v)$ with a **residual capacity** $c(e) - f(e)$
  - (Backward edges) for each edge $e \in E$ s.t. $f(e) > 0$, $G_f$ contains the edge $e' = (u,v)$ with a residual capacity

## Augmenting Paths in a Residual graph
- Let $P$ be a simple $s-t$ path in $G_f$
- $b = bottleneck(P,f)$ is the minimum residual capacity of any edge in $P$

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{augment}(f, P) \\
    &\text{Let } b = bottleneck(P, f) \\
    &\text{For } (u,v) \in P \\
      &\quad\text{If } e = (u,v) \text{ is a forward edge in } P \\ 
        &\qquad\text{increase } f(e) \in G \text{ by } b\\ 
      &\quad\text{Else } e = (u,v) \text{ is a backward edge in } P \\ 
        &\qquad\text{decrease } f(e) \in G \text{ by } b\\ 
      &\text{Return } f \\
  \end{aligned}
}     
$$ 

- $e$ is forward in $G_f$ iff flow _increases_ along $e \in G$
- $e = (v,u)$ is backward in $G_f$ iff flow _decreases_ along $e = (v,u) \in G$

### Correctness of $\texttt{augment}(f,P)$
- A simple $s-t$ path in the residual graph is an **augmenting path**
- Let $f'$ be the flow returned by $\texttt{augment}(f,P)$
- Claim: $f'$ is a flow. Verify capacity and conservation conditions
  - Only need to check edges and internal nodes in $P$
  - Capacity condition on $e = (u,v) \in G_f$: note that $b = bottleneck(P,f) \leq$ residual capacity of $(u,v)$
    
  - $e$ is a forward edge: $0 \leq f(e) \leq f'(e) = f(e) + b \leq f(e) + (c(e) - f(e)) = c(e)$

![](/images/forward.png)

  - $e$ is a backward edge: $c(e) \geq f(e) \geq f'(e) = f(e) - b \geq f(e) - f(e) = 0$

![](/images/backward.png)

  - Conservation condition on internal node $v \in P$ – four cases to work out:
  
![](/images/conservation.png)

## Ford-Fulkerson Algorithm

$$ 
\boxed{ 
  \begin{aligned} 
    &\texttt{Max-Flow}(G) \\
    &\text{Initially}  f(e) = 0 \quad \forall e \in G \\
    &\text{while there is an s-t path in the residual graph } G_f \\
      &\quad\text{Let } P \text{ be a simple s-t path in } G_f \\ 
      &\quad f' = \texttt{augment}(f, P) \\
      &\quad f \leftarrow f' \\
      &\quad G_f \leftarrow G_{f'} \\
    &\text{Return } f \\
  \end{aligned}
}     
$$ 

- Does it terminate? What is it doing?

![](/images/algorithms-residual1.png)

![](/images/algorithms-residual2.png)

![](/images/algorithms-residual3.png)

- We can see here, the max flow path is $s-d-b-c-t$, with a bottleneck of $b=10$ along, that $b-d$ edge gets augmented

- Repeat 

### Analysis of the Ford-Faulkerson Algorithm
- Running time:
  - Does it terminate? If so, how many loops, since each loop is $O(m)$
- Claim at each stage, flow values and residual capacities are integers. Prove by induction
- Claim: Flow value strictly increase when we apply $\texttt{augment}(f,p)$
  - $v'(f) = v(f) + bottleneck(P,f) > v(f)$
  - recall every edge that is incident on $s$ is a forward edge
  - the flow along these edges will increase by $b$
- Claim : Maximum value of any flow $C = \sum_{e \text{ out of } s} c(e)$
- Claim: Algorithm terminates in at most $C$ iterations
- Claim: Algorithm runs in $O(mC)$ time

### Correctness of the Ford-Faulkerson Algorithm
- How large can the flow be?
- Can we characterize the magnitude of the flow in terms of the structure of the graph? For example, for every flow $f, v(f) \leq C = \sum_{e \text{ out of } s} c(e)$
- Is there a better bound?
- Proof strategy:
  - Define $s-t$ cut, its capacity, and flow in and out of the cut
  - For _any_ $s-t$ cut, prove _any_ flow $\leq$ its capacity
  - Define a specific $s-t$ cut at the end of the Ford-Faulkerson algorithm
  - Prove that the flow across this cut _equals_ its capacity

## $s-t$ Cuts and Capacities
- An **$s-t$ cut** is a partition of $V$ into sets $A$ and $B$ such that $s \in A$ and $t \in B$
- **Capacity** of the $cut(A, B)$ is 

$c(A,B) = \displaystyle\sum_{e \text{ out of } A} c(e)$

- Intuition: For every flow $f, v(f) \leq c(A,B)$

![](/images/algorithms-cut1.png)

![](/images/algorithms-cut2.png)

### Fun Facts about Cuts
- Let $f$ be any $s-t$ flow and $(A,B)$ any $s-t$ cut
- Claim: $f(v) = f_{out}(A) - f_{in}(A)$
  - $v(f) = f_{out}(s)$ and $f_{in}(s) = 0 \rArr v(f) = f_{out}(s) - f_{in}(s)$
  - For ever other node $v \in A$, $0 = f_{out}(v) - f_{in}(v)$
  - Summing up all these equations, $v(f) = \sum_{v \in A}(f_{out}(v) - f_{in}(v)$
      - An edge $e$ that has both ends in $A$ or both ends out of $A$ does not contribute
      - An edge $e$ that has its tail in $A$ contributes $f(e)$
      - An edge $e$ that has its head in $A$ contributes $-f(e)$
  - $\sum_{v \in A} (f_{out}(v) - f_{in}(v) = \sum_{e \text { out of } A} f(e) - \sum_{e \text{ into A} } f(e) = f_{out}(A) - f_{in}(A)$
- Corollary: $v(f) = f_{in}(B) - f_{out}(B)$

### Important Fact about Cuts
- $v(f) \leq c(A,B)$

$$
\begin{aligned}
  v(f) &= f_{out}(A) - f_{in}(A) \\
       &\leq f_{out} = \displaystyle\sum_{e \text{ out of} A} f(e) \\
       &\leq \displaystyle\sum_{e \text{ out of} A} c(e) = c(A,B)

\end{aligned}
$$

## Max-Flows and Min-Cuts
- Let $f$ be any $s-t$ flow and $(A,B)$ any $s-t$ cut. We proved $v(f) \leq c(A,B)$
- Very strong statement: The value of _every_ flow is $\leq$ capacity of _any_ cut
- Corollary: The maximum flow is at most the smallest capacity of a cut
- Question: Is the reverse true? Is the smallest capacity of a cut at most the maximum flow
- Answer: Yes, the Ford-Faulkerson algorithm computes this cut!

## Flows and Cuts
- Let $\overline f$ denote the flow computed by the Ford-Faulkerson algorithm
- Enough to show $\exist s-t$ cut $(A^*,B^*)$ such that $v(\overline f) = c(A^*, B^*)$
- When the algorithm terminates, the residual graph has no $s-t$ path
- Claim: If $f$ is an $s-t$ flow such that $G_f$ has no $s-t$ path, then there is an $s-t$ cut $(A^*, B^*$ such that $v(f) = c(A^*, B^*)$
  - Claim applies to _any_ flow $f$ such that $G_f$ has no $s-t$ path, and not just to the flow $\overline f$ computed by the Ford-Faulkerson algorithm

### Proof of Claim Relating Flows to Cuts
- Claim: $f$ is an $s-t$ flow and $G_f$ has no $s-t$ path $\rArr \exist s-t$ cut $(A^*,B^*), v(f) = c(A^*,B^*)$
- $A^* =$ set of nodes reachable from $s$ in $G_f, B^* = V - A^*$
- Claim: $(A^*,B^*)$ is an $s-t$ cut in $G$
- Claim: If $e = (u,v)$ such that $u \in A^*, v \in B^*$, then $f(e) = c(e)$
- Claim: If $e' = (u', v')$ such that $u' \in B^*, v' \in A^*$, then $f(e') = 0$
- Claim $v(f) = c(A^*, B^*)$

$$
\begin{aligned}
  v(f) &= f_{out}(A^*) - f_{in}(A^*) \\
       &= \displaystyle\sum_{e \text{ out of } A^*} f(e) - \displaystyle\sum_{e \text{ into } A^*} f(e) \\
       &= \displaystyle\sum_{e \text{ out of } A^*} c(e) - \displaystyle\sum_{e \text{ into } A^*} 0 \\ 
       &= c(A^*, B^*) \\
\end{aligned}
$$

### Max-Flow Min-Cut Theorem
- The flow $\overline f$ computed by the Ford-Faulkerson algorithm is a maximum flow
- Given a flow of maximum value, we can compute a minimum $s-t$ cut in $O(m)$ time
- In every flow network, there is a flow $f$ and a cut $(A,B)$ such that $v(f) = c(A,B)$
- **Max-Flow Min-Cut Theorem**: in every flow network, the maximum value of an $s-t$ flow is equal to the minimum capacity of an $s-t$ cut
- Corollary: If all capacities in a flow network are integers, then there is a maximum flow $f$ where $f(e)$, the value of the flow on edge $e$, is an integer for every edge $e \in G$

### Real-Valued Capacities
- If capacities are real-valued, Ford-Faulkerson algorithm may not terminate!
- But Max-Flow Min-Cut theorem is still true, why?

## Improving Ford-Faulkerson Algorithm
- Bad case for Ford-Faulkerson is when the bottleneck edge is the augmenting path has a low capacity
- Idea: decrease number of iterations by picking $s-t$ path with bottleneck edge of largest capacity. Computing this path can slow down each iteration considerably.
- Modified idea: Maintain a **scaling parameter** $\Delta$ and choose only augmenting paths with bottleneck capacity at least $\Delta$
- $G_f(\Delta)$: residual network restricted to edges with residual capacities $\geq \Delta$

# <a name="ch11" class="n"></a> 11 - Network Flow Applications

## Maximum Flow and Minimum Cut Problems

## Matching in Bipartite Graphs
- **Bipartite Graph** a graph $G(V,E)$ where
  - $V = X \cup Y, X,Y$ are disjoint and
  - $E \subseteq X \times Y$
- Bipartite graphs model situations in which objects are matched with or assigned to other objects: e.g. marraiges, residents/hospitals, jobs/machines
- A **Matching** in a bipartite graph $G$ is a set $M \subseteq$ of edges such that each node of $V$ is incident on at most edge of $M$
- A set of edges $M$ is a **perfect matching** if every node in $V$ is incident on exactly one edge in $M$
- Instance: A bipartite graph $G$
- Solution: The matching of largest size in $G$

### Algorithm for Bipartite Graph Matching
- Convert $G$ to a flow network $G'$: direct edges from $X$ to $Y$, add nodes $s$ and $t$ connect $s$ to each node in $X$ and $t$ to each node in $y$, set all edge capacities to 1
- Computer the maximum flow in $G'$
- Convert the maximum flow in $G'$ into a matching in $G$
- Claim: the value of the maximum flow in $G'$ equals the size of hte maximum matching in $G$
- In general, there is a matching of size $k$ in $G$ if an only if there is a (integer valued) flow of $k$ in $G'$

### Strategy for Proving Correctness
- Preclude the possibilities that $G'$ has a flow of value $k$ but we cannot construct a matching in $G$ with $k$ edges
- Matching => flow: if there is a matching with $k$ edges in $G$, there is an $s-t$ flow of value $k$ in $G'$
- How do we construct this flow? 
  - Consider every edge $(u,v)$ in the matching: $u \in X, v \in Y$
  - Send on unit of flow along the path $s \rightarrow u \rightarrow v \rightarrow t$
- Why have we constructed a flow
  - Capacity constraint: No edges receive a flow $> 1$ because we started with a matching
  - Conservation constraint: Every node other than $s$ and $t$ has one incoming unit and one outgoing unit of flow because we started with a matching
- What is the value of the flow? $k$, since exactly that many nodes out of $s$ carry flow

Now let us consider the reverse side of the reduction 

- Flow => matching: if there is a flow $f'$ in $G'$ with value $k$, there is a matching $M$ in $G$ with $k$ edges
  - There is an integer-valued flow $f'$ of value $k \implies$ flow along any edge is 0 or 1 
  - Let $M$ be the set of edges _not_ incident on $s$ or $t$ with flow equal to 1
  - Claim: $M$ contains $k$ edges
  - Claim Each node in $X$ (respectively, $Y$) is the tail (respectively, head) of at most one edge in $M$
- Conclusion: size of the maximum matching in $G$ is equal to the value of the maximum flow in $G'$: the edges in this matching are those that carry flow from $X$ to $Y$ in $G'$

In general, we must prove that the reduction is bi-directional, or isomorphic

### Running time of Bipartite Graph Matching Algorithm
- Suppose $G$ has $m$ edges in $n$ nodes in $X$, and in $Y$
- $C \leq n$
- Ford-Fulkerson algorithm runs in $O(mn)$ time
- How do we determine if a bipartite graph $G$ has a perfect matching? Find the maximum matching and check if it is perfect
- Suppose $G$ has no perfect matching. Can we exhibit a short "certificate" of that fact? What can such certificates look like?
- $G$ has no perfect matching iff there is a cut in $G'$ with capacity less than $n$. Therefore, the cut is a certificate
- We would like the certificate in terms of $G$
  - For example, two nodes in $Y$ with on incident edge each with the same neighbor in $X$
  - Generally, a subset $S \subseteq X$ with neighbors $\Gamma (A) \subseteq Y$, such that $|A| < |\Gamma(A)|$
- **Hall's Theorem** Let $G(X \cup Y, E)$ be a bipartite graph such that $|X| = |Y|$. Then $G$ either has a perfect matching or there is a subset $A \subseteq Y$ such that $|A| > | \Gamma (A) |$. We can compute a perfect matching or such a subset in $O(mn)$ time.
  - $\Gamma (x_5) = \{y_4, y_5\}$, the neighbors of $x_5$

## Edge-Disjoint Paths
- A set of paths in a directed graph $G$ is **edge disjoint** if each edge in $G$ appears in at most one path
- Instance: Directed graph $G(V,E)$ with two distinguished nodes $s,t$
- Solution: The maximum number of edge-disjoiint paths between $s$ and $t$

### Mapping to the Max-Flow Problem
- Convert $G$ into a flow network with edge capacities of 1
- Claim: There are $k$ edge-disjoint $s-t$ paths from in a directed graph $G$ if and only if there is a $s-t$ flow in $G$ with value $\geq k$
- Paths => flow: if there are $k$ edge-disjoint paths from $s$ to $t$, send one unit of flowin along each to yield a flow with value $k$
- Flow => paths: Suppose there is an integer-valued flow of value at least $k$. Are there $k$ edge-disjoint paths? If so, what are they?
  - There is an integral flow. Therefore flow on each edge is 0, or 1
  - Claim: if $f$ is a 0-1 value flow of value $v(f) = k$, the the set of edges with flow $f(e) = 1$ contains a set of $k$ edge-disjoint paths
- But how do we show that this set of edges with flow value of 1 actually form paths?
  - Claim if $f$ is a $0-1$ valued flow of value $v(f) = k$m then the set of edges with flow $f(e) = 1$ contains a set of $k$ edge-disjoint paths
- Prove by induction on the number of edges in $f$ that carry flow. Let this number be $\kappa(f)$.
  - Base case: $v = 0$. Nothing to prove
  - Inductive Hypothesis: For every flow $f'$ in $G$ with 
      - value $v(f') < k$   carrying flow on $\kappa (f') < \kappa (f)$ edges or 
      - value $v(f') = k$   carrying flow on $\kappa (f') < \kappa (f)$ edges, the set of edges with $f'(e) = 1$ contains a set of $v(f')$ edge-disjoint $s-t$ paths
  - Inductive Step: Construct a set of $k$ $s-t$ paths from $f$. Work out by hand
- Note: formulating the inductive hypothesis can be trick
- Strategy is to prove the inductive step first
- During this proof, we observe two types of "smaller" flows:
  - When you succeed in finding an $s-t$ path, we get a new flow $f'$ that is smaller, i.e. $v(f') < k$ carrying flow on fewer edges, i.e. $\kappa (f') < \kappa (f)$
  - When we run into a cycle, we get a new flow $f'$ with $v(f') = k$ but carrying flow on fewer edges, i.e. $\kappa (f') < \kappa (f)$
- We combine both situations in the inductive hypothesis

### Certificate for Edge-Disjoint Paths Algorithm
- A set $F \subseteq E$ of edges separatees $s,t$ if the graph $(V, E-F)$ contains no $s-t$ paths
- **Menger's Theorem:** In every directed graph with nodes $s,t$, the maximum number of edge disjoint $s-t$ paths is equal to the minimum number of edges whose removal disconnes $s$ from $t$.

### Running Time of the Edge-Disjoint Paths Algorithm
- Given a flow of value $k$, how quickly can we determine the $k$ edge-disjoint paths? $O(mn)$
- Corollary: The Ford-Fulkerson algorithm can be used to find a maximum set of edge-disjoint $s-t$ paths in a directed graph $G$ in $O(mn)$ time.

## Edge-Disjoint Paths in Undirected Graphs
- Can extend the theorem to undirected graphs
- Replace each edge with two directed edges of capacity 1 and apply the algorithm for directed graphs
- Problem: Both counterparts of an undirected edge $(u,v)$ may be used by differnt edge-disjoint paths on the directed graph
  - resolved by zeroing out flow for edges where flow goes in both directions
- Can obtain an integral flow where only one of the directed counterparts of $(u,v)$ has non-zero flow
- We can find the maximum number of edge disjoint paths in $O(mn)$ time
- We can prove a version of Menger's theorem for undirected graphs: in every undirected graph with nodes $s,t$, the maximum number of edge-disjoint $s-t$ paths is equal to the minimum number of edges whose removal separates $s$ from $t$

## Image Segmentation
- Fundemental problem in computer vision: segmentaing an image into coherent regions
- A basic segmentation problem is that of partitioning an image into a foreground and a background: label each pixel in the image as belonging to one of those two
- Let $V$ be the set of pixels in an image
- Let $E$ be the set of pairs of neighboring pixels
- $V$ and $E$ yield an undirected graph $G(V,E)$
- Each pixel $i$ has a likelihood $a_i > 0$ that it belongs to the foreground and a likelihood $b_i$ that it belongs to the background
- These likelihoods are specified in the input to the problem
- We want to fg/bg boundary to be smooth: for each pait $(i,j)$ of pixels, there is a separation penalty $p_{ij} \geq 0$ for placing one of them in the foreground and the other in the background

### Formulating the Problem
- Instance: Pixel graphs $G(V,E)$, likelihood functions $a,b: V \rightarrow \Reals^+$, penalty function $p: E \rightarrow \Reals^+$
- Solution: **Optimum labelling**: partition of the pixels into two sets $A,B$ that maximizes

$$
\begin{aligned}
  q(A,B) &= \displaystyle\sum_{i \in A} a_i + \displaystyle\sum_{j \in B} b_i - \displaystyle\sum_{  (i,j) \in E |A \cap \{i,j\}|=1 } p_{ij}
\end{aligned}
$$

- There is a similarity between cuts and labellings
- Differences:
  - Maximizing an objective function rather than minimizing 
  - There is no source or sink in the segmentation problem
  - We have values on the nodes
  - The graph is undirected

### Maximization to Minimization
- Let $Q - \sum_i (a_i + b_i)$
- Notice that $\sum_{i \in A} a_i \sum_{j \in B} b_j = Q - \sum_{i \in A} b_i - \sum_{j \in B} a_j$
- Therefore, maximizing 

$$
\begin{aligned}
  q(A,B) &= \displaystyle\sum_{i \in A} a_i + \displaystyle\sum_{j \in B} b_i - \displaystyle\sum_{  (i,j) \in E |A \cap \{i,j\}|=1 } p_{ij} \\
         &= Q - \sum_{i \in A} b_i - \sum_{j \in B} a_j - \displaystyle\sum_{  (i,j) \in E |A \cap \{i,j\}|=1 } p_{ij}
\end{aligned}
$$

is identical to minimizing 

$$
\begin{aligned}
  q'(A,B) &= \sum_{i \in A} b_i + \sum_{j \in B} a_j + \displaystyle\sum_{  (i,j) \in E |A \cap \{i,j\}|=1 } p_{ij}
\end{aligned}
$$

### Solving the Other Issues
- Solve the other issues like we did earlier:
  - Add a new "super-source" $s$ to represent foreground
  - Add a new "super-sink" $t$ to represent the background
  - Connect $s,t$ to every pixel and assign capacity $a_i$ to edge $(s, i)$ and capacity $b_i$ to edge $(i,t)$
  - Direct edges away from $s$ and into $t$
  - Replace each edge $(i,j)$ in $E$ with two directed edges of capacity $p_{ij}$
- Now we want the minimum capacity $s-t$ cut

### Cuts in the Flow Network
- Let $G'$ be this flow network and $(A,B)$ and $s-t$ cut
- What does the capacity of the cut represent? 
- Edges crossing the cut can be one of three types:
  - $(s,w), w \in B$ contributes to $a_w$
  - $(u,t), u \in A$ contributes to $b_u$
  - $(u,w), u \in A, w \in B$ contributes to $p_{uw}$

$$
\begin{aligned}
  c(A,B) &= \displaystyle\sum_{i \in A} b_i + \displaystyle\sum_{j \in B} a_j + \displaystyle\sum_{  (i,j) \in E |A \cap \{i,j\}|=1 } p_{ij} = q'(A,B)
\end{aligned}
$$

- So, the capacity of an $s-t$ cut $c(A,B)$ exactly measure the quantity $q'(A,B)$
- To maximise $q(A,B)$, we compute the $s-t$ cut $(A,B)$ of minimum capacity
- Deleting $s,t$ from the cut yields the desired segmentation of the image
- Thus, Image Segmentation is reduced to a Minimum Cut problem

# <a name="ch12" class="n"></a> 12 - NP and Computational Intractibility

- $N = 1, P = 0$

## Algorithm Design
- Patterns:
  - Greed $O(n \log n)$ interval scheduling
  - Divide and Conquer $O(n \log n)$ counting inversions
  - Dynamic Programmming $O(n^3)$ RNA folding
  - Duality: $O(n^2 m)$ maximum flow and minimum cuts
  - Reductions
  - Local search
  - Randomization
- Anti-Patterns
  - NP-completeness: $O(n^k)$ algorithm unlikely
  - PSPACE-completeness: $O(n^k)$ certification algorithm unlikely
  - Undecidability: no algorithm possible

## Computational Tractability
- When is an algorithm an efficient solution to a problem? When the running time is polynomial in the size of the input
- A problem is **computationally tractable** if it has a polynomial time algorithm solution

|Polynomial time| Probably not|
|-|-|
| Shortest path | Longest Path |
| Matching | 3D Matching | 
| Min cut | Max cut|
| 2-SAT| 3 SAT |
| Planar four-color | Planar 3 color|
| Bipartite vertex cover | vertex cover |
| Primarily testing | Factoring |

## Problem Classification
- Classify problems based on whether they admit efficient solutions or not
- Some extremely hard problems cannot be solved efficiently (e.g. chess on an $n \times n$ board)
- However, classification is unclear for a large number of problems 
- We can prove that these problems are fundementally equivalent and are manifestations of the same problem!

## Polynomial-Time Reduction
- Goal is to express statements of the type: "Problem X is at least as hard as problem Y"
- Use the notion of reductions
- **Y is polynomial-time reducible to $X$ $(Y \leq_P X)$** if any arbitrary instance (input) of $Y$ can be solved using a polynomial number of standard operations, plus one call to a black box that solves problem $X$
  - Maximum Bipartite Matching $\leq_P$ Maxmum $s-t$ Flow
      - Maximum Bipartite Matching $\nleq_P$ Maxmum $s-t$ Flow because you can't reduce a network flow to a bipartite matching...
      - You can get 4 from 3 by adding 1, but you can't get 3 from 4 by adding 1
  - Image Segmentation $\leq_P$ Minimum $s-t$ Cut
  - $\leq_P = $ polynomial time reducable
- $Y \leq_P X$ implies that "$X$ is at least as hard as $Y$"
- Such reductions are **Karp reductions. Cook reductions** allow a polynomial number of calls to the black box that solves $X$

## Usefulness of Reductions
- Claim: If $Y \leq_P X$ and $X$ can be solved in polynomial time, then $Y$ can be solved in polynomial time
- Contrapositive: If $Y \leq_P X$ and $Y$ cannot be solved in polynomial time, then $X$ cannot be solved in polynomial time
- Informally: If $Y$ is hard, and we can show that $Y$ reduces to $X$, then the hardness "spreads" to $X$

## Reduction Strategies
- Simple equivalence

- Special case to general case
- Encoding with gadgets

## Optimisiation versus Decision Problems
- So far, we have developed algorithms that solve optimisation problems
  - Compute the _largest_ flow
  - Find the _closest_ pair of points
  - Find the schedule with the _least_ completion time
- Now, we turn our attention to _decision versions_ of problems, e.g. is there a flow with value at least $k$, for a given value of $k$
- Decision problem: answer to every input is yes or no

### Primes
- Instance: A natural number $n$
- Question: Is $n$ prime?

## Independent Set and Vertex Cover
- Given an undirected graph $G = (V,E)$, a subset $S \subseteq V$ is an **independent set** if no two vertices in $S$ are connected by an edge
  - Instance: Undirected graph $G$ and an integer $k$
  - Question: Does $G$ contain an independent set of size $\geq k$
- Given an undirected graph $G = (V,E)$, a subset $S \subseteq V$ is a **vertex cover** if every edge in $E$ is incident on at least one vertex in $S$
  - Instance: Undirected graph $G$ and an integer $k$
  - Question: Does $G$ contain a vertx cover of size $\geq k$
- Goal: Demonstrate a simple equivalence between these two problems
- Claim: Independent Set $\leq_P$ Vertex Cover and Vertex Cover $\leq_P$ Independent Set 
- N.B. the inverse of an independent set must be a vertex cover

## Strategy for Proving Independent Set $\leq_P$ Vertex Cover
- Start with an arbitrary instance of IS: an undirected graph $G=(V,E)$ and an integer $k$
- From $G=(V,E)$ and $k$, create an instance of VC: an undirected graph $G'=(V', E')$ and an integer $k'$
- $G'$ is related to $G$ in some way
- $k'$ can depend upon $k$ and size of $G$
- Prove that $G=(V,E)$ has an IS of size $\geq k$  iff $G'$ has a vertex cover of size $\leq k'$
- Transformation and proof must be correct for all possible graphs $G$ and all possible values of $k$
  - This proof is an **iff** because we're using a blackbox algorithm for VC to solve IS
      - If there is an independent set size $\geq k$, we must be sure that there is a vertex cover of size $\leq k'$, so that we know that the black box will find this vertex cover
      - If the black box finds a vertex cover of size $\leq k'$, we must be sure we can construct an independent set of size $\geq k$ from this vertex cover
- Arbitrary instance of IS: $G, k$
- Let $|V| = n$
- Create an instance of VC: $G, k' = n - k$
- Claim: $G$ has an IS of size $\geq k$ iff $G$ has a VC of size $\leq n - k$
- Proof: $S$ is an IS in $G$ iff $V-S$ is a VC in G
- The same idea proces that VC $\leq_P$ IS

## Vertex Cover and Set Cover
- IS is a "packing" problem: pack as many vertices as possible, subject to constraints (the edges)
- VC is a "covering" problem: cover all edges in the graph with as few vertices as possible

### Microbe Cover
- Instance: A set $U$ of $n$ compounds, a collection $M_1, M_2, ..., M_l$ of microbes, where each microbe can make a subset of compounds in $U$, and an integer $k$
- Question: Is there a subset of $\leq k$ microbes that can together make all the compounds in $U$?

![](/images/algorithms-microbe.png)

### Vertex Cover $\leq_P$ Microbe Cover

![](/images/algorithms-microbe2.png)

- Input to VC: an undirected graph $G=(V,E)$ and an integer $k$
- Let $|V| = l$
- Create an instance $\{U, \{ M_1, M_2, ..., M_l\} \}$ of Microbe cover where:
  - $U = E$, i.e. each element of $U$ is an edge of $G$
  - For each node $i \in V$, create a microbe $M_i$ whose compounds are the set of edges incident on $i$
- Claim: $U$ can be covered with $\leq k$ microbes iff $G$ has a VC cover with $\leq k$ nodes
- Proof strategy:
  - If $G$ has a VC of size $\leq k$, then $U$ can be covered with $\leq k$
  - If $U$ can be covered with $\leq k$ microbes, then $G$ has a vertex cover of size $\leq k$
- this is a different form of the Set Cover problem:
  - Instance: A set $U$ of $n$ elements, a collection $S_1, S_2, ..., S_m$ of subsets of $U$, and an integer $k$
  - Question: Is there a collection of $\leq k$ sets in the collections whose union is $U$?

## Boolean Satisfiability
- Abstract problems formulated in Boolean notation
- given a set $X = \{ x_1, x_2, ..., x_n\}$ of $n$ Boolean variables
- Each term can take the value of $0,1$
- **Term**: a variable $x_i$ or its negation $\bar{x_i}$
- **Cause of Length**: (or) $l$ distinct terms $t_1 \lor t_2 \lor ... t_l$
- **Truth assignment** for $X$: is a function $v: X \rightarrow \{ 0,1 \}$
- An assignment $v$ **satisfies** a clause $C$ if it causes at least one term in $C$ to evaluate to 1 (since $C$ is an **or** of terms)
- An assignment **satisfies** a collection of clauses $C_1, C_2, ..., C_k$ if it causes all clauses to evaluate to 1 i.e. $C_1 \land C_2 \land ... C_k = 1$ 
  - $v$ is a **satisfying assignment** with respect to $C_1, C_2, ..., C_k$
  - set of clauses $C_1, C_2, ..., C_k$ is **satisfiable**

### Examples
- $X = \{ x_1, x_2, x_3, x_4\}$
- Terms: $x_1, \bar{x_1}, x_2, \bar{x_2}, x_3, \bar{x_3}, x_4, \bar{x_4},$
- Clauses:
  - $x_1 \lor \bar{x_2} \lor \bar{x_3}$
  - $x_2 \lor \bar{x_3} \lor x_4$
  - $x_3 \lor \bar{x_4}$
- Assignment: $x_1 = 1, x_2 = 0, x_3 = 1, x_4 = 0$
  - Not satisfying because of clauses 1, 3
- Assignment: $x_1 = 1, x_2 = 0, x_3 = 1, x_4 = 0$
  - is satisfying

## SAT and 3-SAT
- Instance: A set of clauses $C_1, C_2, ..., C_k$, each of length **3**, over a set $X = \{ x_1, x_2, ..., x_n\}$ of $n$ variables
- Question: IS there a satisfying truth assignment for $X$ with respect to $C$
- SAT and 3-SAT are fundemental combinatorial search problems
- We have to make $n$ independent decisions (the assignments for each variable) while satisfying the set constrains
- Satisfying each constraint in isolation is easy, but we have to make our decision so that all constraints are satisfied simultanesouly

### Example
Clauses: 
  - $C_1 = x_1 \lor 0 \lor 0$
  - $C_2 = x_2 \lor 0 \lor 0$
  - $C_3 = \bar{x_2} \lor \bar{x_2} \lor 0$
- Is $C_1 \land C_2$ satisfiable? Yes by $x_1 =1, x_2 = 1$
- Is $C_1 \land C_3$ satisfiable? Yes by $x_1 =1, x_2 = 0$
- Is $C_2 \land C_3$ satisfiable? Yes by $x_1 =0, x_2 = 1$
- Is $C_1 \land C_2 \land C_3$ satisfiable? No

### 3-SAT $\leq_P$ Independent set
- $C_1 = x_1 \lor \bar{x_2} \lor \bar{x_3}$
- $C_2 = \bar{x_1} \lor x_2 \lor x_4$
- $C_3 = \bar{x_1} \lor x_3 \lor \bar{x_4}$
- Two ways to think about 3-SAT:
  - Make an independent 0/1 decision on each variable and succeed if we achieve on of three ways in which to satisfy each clause
  - Choose (at least) one term from each clause. Find a truth assignment that causes each chose term to evaluate to 1. Ensure that no two terms selected **conflict** e.g. select $\bar{x_2}$ in $C_1$ and $x_2$ in $C_2$
- We are given an instance of 3-SAT with $k$ clauses of length three over $n$ variables

![](/images/algorithms-3-SAT.png)

- Construct an instance of Independent Set: graph $G=(V,E)$ with $3k$ nodes
  - For each clause $C_i, 1 \leq i \leq k$, add a triangle of three nodes $v_{i1}, v_{i2}, v_{i3}$ and three edges to $G$
  - Label each node $v_{ij}, 1 \leq j \leq 3$ with the $j$th term in $C_i$
  - Add an edge between each pair of nodes whose labels correspond to terms that conflict
  - N.B. size of largest IS is $k$
  - $x_4$ can be assigned either 0 or 1 to satisfy the clauses.
- Claim: 3-SAT instance is satisfiable iff $G$ has an independent set of size $k$
- Satisfiable assignment $\rightarrow$ Independent Set of size $k$: Each triangle in $G$ has at least one node whose label evaluates to 1. Set $S$ of nodes consisteing of one such node from each triangle forms an independent set of size = $k$. Why?
-  Independent Set of size $k$ $\rightarrow$ Satisfiable assignment: the size of this set is $k$. How do we construct a ssatisfying truth assignment from the nodes in the independent set?
  - For each variable $x_i$, only $x_i$ or $\bar{x_i}$ is the label of a node in $S$. 
  - If $x_i$ is the label of a node in $S$, set $x_i = 1$; else set $x_i = 0$ 

## Transitivity of Reductions
- Claim: If $Z \leq_P Y$ and $Y \leq_P X$, than $Z \leq_P X$
  - Note that If $Z \leq_P Y$, then $Y \leq_P Z$ ? False
- We have shown that 3-SAT $\leq_P$ Independent Set $\leq_P$ Vertex Covert $\leq_P$ Set Cover

### Finding vs. Certifying
- Is it easy to check if a given set of vertices in an undirected graph forms an independent set of size at least $k$
- Is it east to check if a particular truth assignment satisfies a set of clauses?
- We draw a contrast between _finding_ a solution and _checking_ a solution (in polynomial time)
- Since we have not been able to develop efficient algorithms to solve many decision problems, let us turn our attention to whether we can check if a proposed solution is correct

## Problems and Algorithms
Primes
- Instance: A natural number $n$
- Question: Is $n$ prime?
- Decision problem $X$: for every input $s$ answer $X(s)$ is yes or no
- An algorithm $A$ for a decision problem receives an input $s$ and returns $A(S) \in \{ yes, no \}$
- An algorithm $A$ **solves** the problem $X$ if for every input $s$
  - if $X(s) = yes$  then $A(s) = yes$ and
  - if $X(s) = no$  then $A(s) = no$ 
- $A$ has a **polynomial running time** if there is a polynomial function $p(\bullet)$ such that for every input $s$, $A$ terminates on $s$ in at most $O(p(|s|)$ steps
  - There is an algorithm such that $p(|s|) = |s|^{12}$ for the Primes problem, improved to $|s|^6$
- $\mathcal P$: is a set of problems $X$ for which there is a polynomial time algorithm
- A decision problem $X$ is in $\mathcal P$ iff there is an algorithm $A$ with polynomial running time that solves $X$

### Efficient Certification
- A "checking" algorithm for a decision problem $X$ has a different structure from an algorithm that solves $X$
- Checking an algorithm needs input $s$ as well as a separate "certificate" $t$ that contain evidence that $X(s) = yes$
- An algorithm $B$ is an **efficient certifier** for a problem $X$ if 
  - $B$ is a polynomial time algorithm that takes two inputs $s,t$ and 
  - for all inputs $s$: 
        - $X(s) = yes$ iff there is a certificate $t$ such that $B(s,t) = yes$, and
        - the size of $t$ is polynomial in the size of $s$ 
- Certifier's job is to take a candidate certificate $t$ that $s \in X$ and check in polynomial time whether $t$ is a correct certififcate
- Certificate $t$ must be "short" so that certifier can run in polynomial time
- Certifier does not care about how to find these certificates

### $\mathcal {NP}$ 
- $\mathcal P$: Set of problems $X$ for which there is a polynomial time algorithm
- $\mathcal NP$: Set of all problems for which there exists an efficient certifier
- 3-SAT $\in \mathcal P$
  - Certificate $t$: a truth assignment to the variables
  - Certifier $B$: checks whether the assignment causes every clause to evaluate to true
- Independent set $\in \mathcal P$
  - Certificate $t$: a set of at least $k$ vertices
  - Certifier $B$: checks that no pair of vertices are connected by an edge
- Set Cover $\in \mathcal P$:
  - Certificate $t$: a list of $k$ sets from the collection
  - Certifier $B$: checks if the union of these sets is $U$

### $\mathcal {P}$ vs. $\mathcal {NP}$ 
- Claim: $\mathcal{P} \subseteq \mathcal{NP}$
  - Let $X$ be any problem in \mathcal{P}
  - There is a polynomial time algorithm $A$ that solves $X$
  - $B$ ignores $t$ and simply returns $A(s)$. Why is $B$ an efficient certifier
      - $B$ just has to check the certificate, not compute it 
- Is $\mathcal{P} = \mathcal{NP}$ or is $\mathcal{NP} - \mathcal{P} \neq 0$.  Major unsolved problem in CS

## Summary
- $\mathcal{P} \subseteq \mathcal{NP}$
- 3-SAT, Vertex Cover, Set Cover, Independent Set are in $\mathcal{NP}$
- 3-SAT $\leq_P$ Independent Set $\leq_P$ Vertex Cover $\leq_P$ Set Cover
- What is the structure of the problems in $\mathcal{NP}$
  - Is there a sequence of problems $X_1, X_2, X_3, ...$ in $\mathcal{NP}$, such that $X_1 \leq_P X_2 \leq X_3 ... $
  - Are there two problems $X_1$ and $X_2$ in $\mathcal{NP}$ such that there is no problem $X \in \mathcal{NP}$ such that there is no problem 

### $\mathcal {NP}$-Complete and $\mathcal {NP}$-Hard problems
- A problem $X$ is $\mathcal {NP}$-Complete if
  - $X \in \mathcal{NP}$ and 
  - for **every** problem $Y \in \mathcal NP, Y \leq_P X$

- A problem $X$ is $\mathcal {NP}$-Hard if
  - for **every** problem $Y \in \mathcal NP, Y \leq_P X$

- Claim: Suppose $X$ is $\mathcal {NP}$-Complete, then $X \in \mathcal P$ iff $\mathcal P \in NP$
- Corollary: If there is any problem in $\mathcal NP$ that cannot be solved in polynomial time, then no $\mathcal NP$-Complete problem can be solved in polynomial time
- Does even one $\mathcal NP$-Complete problem exist?! If it does, how can we prove that _every_ problem in $\mathcal NP$ reduces to this problem

## Circuit Satisfiability
- **Cook-Levin Theorem**: Circuit Satisfiability is $\mathcal NP$-Complete
- A **circuit** $K$ is a labelled, directed acyclic graph such that
  - the **sources** in $K$ are labelled with constants (0 or 1) or the name of a distinct variable (the **inputs** of the circuit)
  - every other node is labeled with one Boolean operator $\land, \lor, \neg$
  - a single node with not outgoing edges represents the **output** of $K$
- Instance: A circuit $K$
- Question: Is there a truth assignment to the inputs that causes the output to have value 1?

# <a name="ch13" class="n"></a> 13 - NP-Complete Problems

## Proving Other Problems $\mathcal NP$-Complete
- Claim: If $Y$ is $\mathcal NP$-Complete and $X \in \mathcal NP$ such that $Y \leq_P$, then $X$ is $\mathcal NP$-Complete
- Recall that $X$ is $\mathcal NP$-Complete if
  - $X$ is in $\mathcal NP$ and
  - for every problem $Z$ in $\mathcal NP$, $Z \leq_P X$
- Given a new problem $X$, a general strategy for proving it $\mathcal NP$-Complete is
  - Prove that $X \in \mathcal NP$
  - Select a problem $Y$ known to be $\mathcal NP$-Complete
  - Prove that $X \leq_P Y$

## 3-SAT is $\mathcal NP$-Complete
- Why is 3-SAT in $\mathcal NP$
- Circuit Satifiability $\leq_P$ 3-SAT
  - Given an input to Circuit Satisfiability, create an input to SAT in which each clause has at most 3 variables
  - Convert this input to SAT into an input to 3-SAT

## More $\mathcal NP$-Complete Problems
- Circuit Satisfiability is $\mathcal NP$-Complete
- We just show Circuit Satisfiability $\leq_P$ 3-SAT
- 3-SAT $\leq_P$ IS $\leq_P$ VC $\leq_P$ Set Cover
- All of these problems are in $\mathcal NP$
- Therefore, all $\mathcal NP$-Complete problems are reducible to each other

## Hamiltonian Cycle
- Problems we have seen so far involve searching over subsets of a collection of objects
- Another type of computationally hard problem involves searching over the set of all permutations of a collection of objects
- In a directed graph $G=(V,E)$, a cycle $C$ is a **Hamiltonian Cycle** if $C$ visits each vertex exactly once
- Instance: A directed graph $G$
- Question: Does $G$ contain a Hamiltonian Cycle?

### Hamiltonian Cycle is $\mathcal NP$-Complete
- Claim: 3-SAT $\leq_P$ Hamiltonian Cycle
- Proof coming up

## Travelling Salesman Problem
- A salesman must visit $n$ cities $v_1, v_2, ..., v_n$ starting at home city $v_1$
- Salseman must find a $tour$, an order in which to visit each city exactly once and return home
- Goal is to find as short a tour as possible
- For every pair $v_i, v_j$ $d(v_i, v_j) > 0$ is the distance between them
- a **tour** is a permutation of  $v_1, v_2, ..., v_n$
- The length of a tour is $\sum_{j=1}^{n-1} = d(v_{i_j}, v_{i_{j+1}} + d(v_{i_n}, v_{i_1})$ 
- Instance: A set $V$ of $n$ cities, a function $d : V \times V \rightarrow \Reals^+$, anda number $D > 0$
- Question: Is there a tour of length at most $D$

### Travelling Salesman is $\mathcal NP$-Complete
- Why is the problem in $\mathcal NP$
- Why is the problem $\mathcal NP$-Complete
- Claim: Hamiltonian Cycle $\leq_P$ Trevelling Salesman

| HC | TSP | 
|-|-|
| Directed Graph $G=(V,E)$ | Cities | 
| Edges have identical weights | Distance between cities can vary |
| Not all pairs of nodes are connected in $G$ | Every pair of cities has a distance |
| $(u,v)$ and $(v,u)$ may both be edges ||

# <a name="ch14" class="n"></a> 14 - Coping with NP-Completeness

- These problems come up in real life
- $\mathcal{NP}$-Complete means that a problem is hard to solve in the worse case.  Can we come up with better solutions at least in some cases?
  - Develop algorithms that are exponential in one parameter in the problem
  - Consider special cases of the input e.g. graphs that "look like" trees
  - Develop algorithms that can provably compute a solution close to the optimal

## Vertex Cover
- Instance: Undirected graph $G$ and an integer $k$
- Question: Does $G$ contain a vertex cover of size at most $k$?
- Problem has two parameters: $k,n$
- What is the running time of a brute force algorithm: $O(kn  {n \choose k}) = O(kn^{k+1})$
- Can we devise an algorithm whose running time is exponential in $k$ but polynomial in $n$ e.g. $O(2^kn)$
  - Fixed parameter tractable

### Designing the Vertex Cover Algorithm
- Intuition: if a graph has a small Vertex Cover, it cannot have too many edges
- Claim: If $G$ has $n$ nodes and $G$ has a vertex cover of size at most $k$, then $G$ has at most $kn$ edges
- Easy part of algorithm: Return no if $G$ has more than $kn$ edges
- $G - \{ u \}$ is the graph $G$ w/o the node $u$ and the edge incident on $u$
- Consier an edge $(u,v)$. Either $u$ or $v$ must be in the vertex cover
  - Claim: $G$ has a vertex cover of size at most $k$ iff for any edge $(u,v)$ either $G - \{ u \}$ or $G - \{ v \}$ has a vertex cover of size at most $k-1$

### Analysing the Vertex Cover Algorithm
- Develop a recurrence relation for the algorithm with parameters
- Let $T(n,k)$ denote the worst-case running time of the algorithm on an instance of Vertex Cover with parameters $n,k$
- $T(n, 1) \leq cn$
- $T(n, k) \leq 2T(n, k-1) + ckn$
  - We need $O(kn)$ time to count the number of edges
- Claim: $T(n,k) = O(2^kkn)$

## Solving $\mathcal{NP}$-Hard Problems on Trees
- "$\mathcal{NP}$-Hard: at least as hard as $\mathcal{NP}$-Complete. We use $\mathcal{NP}$-Hard to refer to optimisation version of decision problems
- Many $\mathcal{NP}$-Hard problems can be solved efficiently on tree
- Intuition: subtree rooted at any node $v$ pf the tree interacts with the rest of the treee only through $v$. Therefore, depending on whether we include $v$ in the solution or not, we can decouple solving the problem in $v$'s subtree from the rest of the tree

## Approximation Algorithms
- Methods for optimisation version of $\mathcal{NP}$-Complete Problems
- Run in polynomial time
- Solution returned is guaranteed to be within a small factor of the optimal solution


### Approximation Algorithm for Vertex Cover
$$ 
\boxed{ 
  \begin{aligned} 
    &\text{Initially, } C, E' \leftarrow \empty, \empty \\
    &\text{While } G \text{ has at least one edge } \\ 
      &\quad\text{Let } (u,v)  \text{ be any edge in } G \\
      &\quad\text{Add } u,v  \text{ to } C \\
      &\quad G \leftarrow G - \{u,v\} \\
      &\quad\text{Add } (u,v)  \text{ to } E' \\
  &\text{Return } C\\
  \end{aligned}
}     
$$
- Running time is linear on the size of the graph
- Claim: $C$ is a vertex cover
- Claim: No two edges in $E'$ can be covered by the same node
- Claim: The size $c^*$ of the smallest vertex cover is at least $|E'|$
- Claim: $|C| = 2|E'| \leq 2c^*$
- No approximation algorithm with a factor better than 1.3606 is possible unless $\mathcal{P=NP}$ (Dinur, Safra 2006)
- No approximation algorithm with a factor better than 2 is possible if the "unique games conjecture" is true (Khot, Regev 2008)

## Load Balancing Problem
- Given a set of $m$ machines $M_1, M_2, ...,M_m$
- Given a set of $n$ jobs: job $j$ has processing time $t_j$
- Assign each job to one machine so that the time spent is minimised
- Let $A(i)$ be the set of jobs assigned to machine $M_i$
- Total time spent on machine $i$ is $T_i = \sum_{k \in A(i)} t_k$
- Minimise **makespan** $T = \max_i T_i$, the largest load on any machine
  - This is $\mathcal{NP}$-Complete

$$
Algorithm here
$$

### Lower Bounds on the Optimal Makespan
- Need a lower bound on the optimum makespan $T^*$
- The two bound below suffice:

$$
\begin{aligned}
  T^* &\geq \frac{1}{m} \displaystyle \sum_j t_j \\
      &\geq \max \limits_j t_j
\end{aligned}
$$

- Claim: computed makespane $T \leq 2T^*$
- Let $M_i$ be the machine whose load is $T$ and $j$ be the last job placed on $M_i$
- What was the situation just before placing this job?
  - $M_i$ had the smallest load and its load was $T - t_j$
  - For every machine $M_k$, load $T_k \geq T - t_j$

$$
\begin{aligned}
  \displaystyle \sum_k T_k &\geq m(T - t_j) \text{ k ranges over all machines }\\
   \displaystyle \sum_j t_j &\geq m(T - t_j) \text{ j ranges over all jobs } \\
   T - t_j &\leq 1/m \displaystyle \sum_j t_j \leq T^* \\
   T &\leq 2T^*, \text{ since } t_j \le T^*

\end{aligned}
$$

### Improving the Bound
- It is easy to construct an example for which the greedy algorithm produces a solution close to a factor of 2 away from the optimal
- How can we improve?
- What if we process the jobs in decreasing order of processing time

$$
Sorted Balance algorithm
$$

## Analyzing Sorted-Balance
- Claim: if there are fewer than $m$ jobs, algorithm is optimal
- Claim: if there are more than $m$ jobs, then $T^* \geq 2t_{m+1}$
  - Consider only the first $m+1$ jobs in sorted order
  - Consider _any_ assignment of these $m+1$ jobs to machines
  - Some machine must be assigned two hobs, each with processing time $\geq t_{m+1}$
  - This machine will have a load at least $2t_{m+1}$
- Claim: $T \leq 3T^*/2$
- Let $M_i$ be the machine whose load is $T$ and $j$ be the last job placed on $M_i$ ($M_i$ has at least two jobs)

$$
\begin{aligned}
  t_j &\leq T^*/2 \text{ since } j \geq m +1\\ 
  T - t_j &\leq T^* \text{ from Greedy-Balance proof}\\
  T &\leq 3T^*/2
   
\end{aligned}
$$
- There is an even better bound $T \leq 4T^* / 3$
- **polynomial-time approximation scheme:** for every $\epsilon >0$, compute solution with makespan $T \leq (1 + \epsilon)T^*$ in $O((n/\epsilon)^{1/\epsilon^2})$

## Partition Problem
- Instance: a set of $n$ natural numbers $w_1, w_2, ..., w_n$
- Solution: a subset $S$ of numbers such that $\sum_{i \in S} w_i = \sum_{i \notin S} w_i$

## Subset Sum Problem
- Instance: a set of $n$ natural numbers $w_1, w_2, ..., w_n$ and a target $W$
- Solution: a subset $S$ of numbers such that $\sum_{i \in S} w_i$ is maximized subject to the constraint $\sum_{i \in S} w_i \leq W$
- $OPT(i, w)$ is the largest sum possible using only the first $i$ numbers with target $w$

$$
\begin{aligned}
  OPT(i, w) &= OPT(i-1, w), \quad i > 0, w_i > w \\ 
  OPT(i, w) &= \max(OPT(i-1, w), w_i + OPT(i-1, w - w_i)), \quad i > 0, w_i \leq w\\
  OPT(0, w) &= 0
\end{aligned}
$$

- Running itme is $O(nW)$

- All of these are $\mathcal{NP}$-Complete: 3D-Matching $\leq_P$ Partition $\leq_P$ Subset Sum $\leq_P$ Knapsack

## Knapsack Problem
- Instance: a set of $n$ elements, with each element $i$ having a weight $w_i$ and a value $v_i$, and a knapsack capacity of $W$
- Solution: a subset $S$ of items such that $\sum_{i \in S} v_i$ is maximized subject to the constraint $\sum_{i \in S} w_i \leq W$

# Dynamic Programming for Knapsack
- Can generalize the DP program for Subset Sum
- Develop a different DP program that will be useful later
- $OPT(i,v)$ is the smallest knapsack weight so that there is a solution using only the first $i$ items with total value $\geq v$
- What are the ranges of $i,v$?
  - $i$ ranges between $0,n$, the number of items
  - Given $i,v$ ranges between $0, \sum_{1 \leq j\leq i} v_j$
  - Largest value of $v$ is $\sum_{1 \leq j \leq n}v_n \leq nv^*$ where $nv^* = \max_i v_i$
- The solution we want is the largest value $v$ such that $OPT(n,v) \leq W$
- $OPT(i,0) =0$ for every $i \geq 1$
- $OPT(i,v) = \max (OPT(i-1, v), w_i + OPT(i-1, v-v_i))$, otherwise
- Can find items in the solution by tracing back
- Running time is $O(n^2v^*)$ which is pseudo-polynomial in the input size

## Intuition underlying Approximation Algorithm
- What is the running time if all values are the same
- What if they're all small integers
- Idea: 
  - round and scale all the values to lie in a smaller range
  - run the DP algorithm with the modified new values
  - Return items in this optimal solution
  - prove that the value of this solution is not much smaller than the true optimum

### Approximation Scheme for Knapsack
- $0 < \epsilon < 1$ is a precision parameter: assume that $1/ \epsilon$ is an integer
- Scaling factor $\theta = \frac{\epsilon v^*}{2n}$
- for every item $i$, and set:
  - $\widetilde{v_i} = \lceil \frac{v_i}{\theta} \rceil \theta $
  - $\widehat{v_i} = \lceil \frac{v_i}{\theta} \rceil$
- algorithm:
  - solve knapsack problems using the DP program with the values $\widehat{v_i}$ 
  - Return the set $S$ of items found
  - Running time of Knapsack-Approx? $O(n^2 \max_i \widehat{v_i}) = O(n^2v^*/\theta) = O(n^3/\epsilon)$
      - Have to include $\epsilon$ here because it determines the size of the input
  - We need to show that the value of the solution returned by Knapsack-Approx is good

### Approximation Guarantee for Knapsack-Approx
- Let $S$ be the solution computed by Knapsack-Approx
- Let $S^*$ be any other solution satisfying $\sum_{j \in S^*} w_j \leq W$
- Claim:  $\sum_{i \in S} v_i \geq \sum_{j \in S^*} v_j $
- Since Knapsack-Approx is optimal for the values $\widetilde{v_i}$:

$\sum_{i \in S} \widetilde{v_i} \geq \sum_{j \in S^*} \widetilde{v_j}$

- Since for each $i, v_i \leq \widetilde{v_i} \leq v_i + \theta $,

$$
\sum_{j \in S^*} v_j \leq 
  \sum_{j \in S^*} \widetilde{v_j} \leq 
  \sum_{i \in S} \widetilde{v_i } \leq 
  \sum_{i \in S} v_i + n \theta  = \sum_{i \in S} v_i + \frac{\epsilon v^*}{2}
$$

- Apply argument to $S^*$ containing only the items with the largest value:

$math$

- Therefore

$\sum_{j \in S^*} v_j \leq \sum_{i \in S} v_i + \frac{\epsilon v^*}{2} \leq (1 + \epsilon) \sum_{i \in S} v_i$

- The running time can be improved to $O(n \log_2 \frac{1}{\epsilon} + \frac{1}{\epsilon^4})$

# <a name="ch15" class="n"></a> 15 - Solutions

<a href="/images/4104-hw1.pdf" target="_blank">Homework 1</a>

<a href="/images/4104-hw2.pdf" target="_blank">Homework 2</a>

<a href="/images/4104-hw3.pdf" target="_blank">Homework 3</a>

<a href="/images/4104-hw4.pdf" target="_blank">Homework 4</a>

<a href="/images/4104-midterm.pdf" target="_blank">Midterm</a>

<a href="/images/4104-hw5.pdf" target="_blank">Homework 5</a>

<a href="/images/4104-hw6.pdf" target="_blank">Homework 6</a>

<a href="/images/4104-hw7.pdf" target="_blank">Homework 7</a>

<a href="/images/4104-final.pdf" target="_blank">Final</a>