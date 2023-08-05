---
title: "43 | FLDR? I Barely Even Know Her!"
date: "2022-09-23"
description: "dice, trees, integer arithmetic"
path: "/blog/fast-loaded-dice-roller"
---

<style>
  a.eventually {
      background:
          linear-gradient(
          to right,
          rgba(100, 200, 200, 1),
          rgba(100, 200, 200, 1)
          ),
          linear-gradient(
          to right,
          rgba(255, 0, 0, 1),
          rgba(255, 0, 180, 1),
          rgba(0, 100, 200, 1)
      );
      background-size: 100% 3px, 0 3px;
      background-position: 100% 100%, 0 100%;
      background-repeat: no-repeat;
      transition: background-size 400ms;
  }

  a.eventually:hover {
      background-size: 0 3px, 100% 3px;
  }

  a.eventually:hover::before {
    transform-origin: left;
    transform: scaleX(1);
  }
  .my-link {
        text-decoration-color: #6666ff;

  }
  .my-link:hover {
      background: #6666ff;
      cursor: pointer;
      animation-name: colorTransition;
      animation-duration: .5s;
  }
</style>

# Introduction

Fellas, you ever just want to sample from a discrete distribution in optimal space and time complexity?

All the time – right?! 

In this edition of _Peader's Digest_ we'll take a look at a paper from a couple years ago about this very subject: 

> "[The Fast Loaded Dice Roller](https://arxiv.org/abs/2003.03830): A Near-Optimal Exact Sampler for Discrete Probability Distributions."

When I first stumbled across this paper, I think I was literally scrolling through arXiv, _raw_.  Like riding the high of a good TV show which which has come to a conclusion, and browsing Netflix for the next binge, I was looking for something flashy.

![](/images/fldr-1.png)

[^1]

At the time, I thought I got _got_.  Despite a handful of neat diagrams, I was mostly puzzled by the contents, conclusion, and even the initial question being investigated in the first place.  I was doubly stricken with _idkwtf-this-is-ism_ when I looked to the source code and was faced with variable names of a single letter.

<details>
  <summary><u class="my-link">(thoughts on un-obvious variable names of a single character)</u></summary>

![](https://y.yarn.co/e75a8db8-2227-4d30-94a7-37b17bf7212f_text.gif)

</details>

<br>

I had printed it out for something to read during a long flight, struggled through it to the best of my ability, and forgot about it entirely until earlier this week (2 years and some change later) when I realized that much of the CRDT paper[^2] that also went over my head when I first encountered it years ago was now rather comprehensible.  

The point being _that it is important for me to regularly read things that I don't understand_.  Eventually[^3] I might return to one such challenging piece of literature with greater appreciation, equipped with even just a few more semesters or years worth of exposure to the subjects which I once found alien.  The digest and examination[^4] of a selection the algorithms described in the paper are the focus of this post. 

As with many of my posts in the past couple years, much of the contents are for my own edification, as a more-public form expression rubber-duckying[^5] my way through things I'm trying to teach myself, while hopefully also providing some occasionally insightful or humorous commentary along the way.

# Motivation: Men Who Stare at Lava Lamps

So, why the hell would we want a Fast Loaded Dice Roller?  At first glance, it almost seems like a glorified inspection of `/dev/random`.  Smarter people than I[^6]<sup>,</sup>[^7]<sup>,</sup>[^8] have written about pseudo-random number generation at length and how incorporating uncertainty can help machines make human-like predictions to improve simulation of phenomena that rely on probabilistic decision making. 

However, _encoding_ probability distributions to be sampled according to a PRG is either a time- or space-expensive exercise.  Entropy _optimal_ distribution samplers do already exist, as shown by Knuth and Yao,[^9] but as Saad points out: 

> Many applications that run quickly use a lot of memory, and applications that use little memory can have a long runtime. Knuth and Yao’s algorithm falls into the first category, making it elegant but too memory-intensive for any practical use.

The goal of their paper is to strike a balance between this trade-off, producing a more efficient sampler in terms of both time and space complexity. 

# The Problem

Formally, the authors present the problem as follows.  

Suppose we have a list of positive integers $a = (a_1, a_2, ..., a_n)$ which sum to $m$.  These integers can be thought of as _weights_ on a loaded die.  We can normalize these weights to get a probability distribution $p = (\frac{a_i}{m} \; | \;a_i \in a )$.

The goal is to construct a sampler (a die) for discrete distributions with rational entries, like our $p$.

Sampling in this manner is a fundamental operation in many fields and has applications in climate modeling, HFT, and (most recently [for me]) fantasy Smite Pro League drafting.  Existing models for sampling from a non-uniform (weighted) discrete distribution have been constrained by the prohibitive resources required to form the encode and sample from 

## Understanding Knuth and Yao's Optimal DDG

A random source $S$ lazily (as needed) emits $0$ or $1$, which can be interpreted as fair, independent and identically distributed coin flips.  For any discrete distribution $p$, $S$ can be thought of as a partial map $A$ from the finite sequence of coin flips to outcomes.  

$$
\underbrace{S}_{\text{Entropy} \atop \text{source}} \; \xrightarrow[b_1 \; b_2 \; b_3 \; b_4]{0 \; 1 \; 1 \; 0} \underbrace{A}_{\text{Sampling} \atop \text{algorithm}} \longrightarrow p
$$ 

That is, $A$ is the disjoint union of sequences of $0,1$ mapped to the rational entries in $p$:

$$
A: \coprod \{0,1\}^k \rarr \{1, ..., n \}
$$

We treat $A$ as the sampling algorithm for $p$ and we can represent it as a **Complete Binary Tree**.

### Aside: Taxonomy of a Tree

Though not exhaustive, it's worth spending a brief minute examining the structure of a tree, specifically binary trees.

Trees are a common recursive structure used throughout computer science, and those who venture outside have even claimed to see some naturally occurring trees in the wild!

Trees are a special kind of directed acyclic graph where the topmost node is referred to as a **root** with 0 or more children.  Nodes can have many children, but the most common variety of tree, and the kind used for the samplers being discussed, are **binary** trees, meaning they can have at most 2 children.  A node that has no children is called a **leaf**, and nodes with children are called **internal**.

A tree is said to be **complete** if every level of the tree, except for perhaps the deepest level, is completely filled, and all nodes are as far _left_ as possible.  This is not to be confused with a **full** binary tree, where every node except for the leaves have two children. 

![](https://www.andrew.cmu.edu/course/15-121/lectures/Trees/pix/full_complete.bmp)

<!-- The one I've included is not complete, since it's nodes are not filled to the leftmost. -->

The **depth** of a tree is given by the length of the longest path from root to leaf.  The root has a depth of 0 (since it is itself), it's children a depth of 1, and so on.  

<!-- _Is it asinine to use 1-indexing in a binary expansion?_ yes. does it make the math more comprehensible than thinking "0th digit of the binary expansion of a rational entry" also yes. Caveat emptor – some of the proofs of correctness of the FLDR rely on **level** which is the zero-indexed version of depth.  -->

![](/images/fldr-5.png)

Here, $B$ is the root, $D$ is an internal node, and $A,C,F$ are leaf nodes.  This tree is full, but not complete.

#### Tree representation

Trees can be modeled as a recursive class e.g.

```python
class TreeNode
  def __init__(self, data):
    # references to another TreeNode mayhaps
    self.left  = None 
    self.right = None
    
    self.data  = data
```

this is like straight up the laziest representation of a Tree you can imagine. There's no reason to do this in lieu of other class methods which I have not supplied.

Other, _speedier_ representations include [adjacency matrices](https://en.wikipedia.org/wiki/Adjacency_matrix) and [heaps](https://en.wikipedia.org/wiki/Heap_(data_structure)) which come with some nice properties of there own:

#### Graph as an Adjacency Matrix

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/6n-graph2.svg/400px-6n-graph2.svg.png)


The above graph has the corresponding adjacency matrix: 

$$
G = \begin{bmatrix}
 1 & 1 & 0 & 0 & 1 & 0 \\
 1 & 0 & 1 & 0 & 1 & 0 \\ 
 0 & 1 & 0 & 1 & 0 & 0 \\ 
 0 & 0 & 1 & 0 & 1 & 1 \\ 
 1 & 1 & 0 & 1 & 0 & 0 \\ 
 0 & 0 & 0 & 1 & 0 & 0 \\ 
\end{bmatrix}
$$

where a $G_{ij} = 1$ implies an edge between node $i$ and $j$.

---

### Aside about Binary Expansion of Rational Numbers

Another Aside? Call that a Bside.  Call that a coin. 

Intuitively,[^10] we can convince ourselves that given a base $b$, a rational number has a finite representation in that base _iff_ the prime factors of the reduced denominator each divide base $b$.  So, in binary, the base of information theory, the only rational numbers with finite representations are dyadics of the form $\frac{a}{2^n}, \; n \in Z^+$.  So, unfortunately for us, _most_ numbers will instead have infinite binary representations.   

#### Converting from Binary to Base 10

The dyadics themselves are rather straightforward:

$$
\begin{aligned}
  1_2 &\rarr 2^0 &= \frac{1}{1} \\
  \\ 
  0.1_2 &\rarr 2^{-1} &= \frac{1}{2} \\
  \\ 
  0.01_2 &\rarr 2^{-2} &= \frac{1}{4} \\
  \\ 
  0.001_2 &\rarr 2^{-3} &= \frac{1}{8} \\
  &\vdots
\end{aligned}
$$

But for more greebled numbers, like, y'know, most of the ones we encounter outside of the memory bus, we instead have to take our binary representation, and sum the product of  each digit with the corresponding power of two:

$$
\sum_i \frac{d_i}{2^i}
$$

For the decimal representation of $d = \color{red}0.0\color{black}11\color{red}0\color{black}1\color{red}0\color{black}1_2$ we have:

$$
\begin{aligned}
& = \color{red}0 \times \frac{1}{2^0} + 0 \times \frac{1}{2^1}\color{black} + 1 \times \frac{1}{2^2} + 1 \times \frac{1}{2^3} + \color{red}0 \times \frac{1}{2^4}\color{black} + 1 \times \frac{1}{2^5} + \color{red} 0 \times \frac{1}{2^6}\color{black} + 1 \times \frac{1}{2^7} \\
&= 0.25 + 0.125 + 0.03125 + 0.0078125 \\
&= 0.4140625
\end{aligned}
$$

Since the geometric series 

$$
\sum^\infty_{n=1} \frac{1}{2^n}
$$ 

converges to $1$, we know it's theoretically possible to build _any_ decimal with the sum of negative powers of two via ad hoc removal of the entries of the series we don't want, yielding our decimal.

#### Converting from Base 10 to Binary

This process is a bit more tedious, but fundamentally the inverse of the above conversion.

We double our decimal, and whenever the resulting product is greater than $1$, append a $1$ to our binary sequence and truncate the product, otherwise we append a $0$:

For the binary representation of $d = 0.2912_{10}$, we have:

$$
\begin{aligned}
  0.2912 \times 2 &= 0.5824 \rarr 0.0 \\
  0.5824 \times 2 &= 1.1648 \rarr 0.01 \\
  0.1648 \times 2 &= 0.3296 \rarr 0.010 \\
  0.3296 \times 2 &= 0.6592 \rarr 0.0100 \\
  0.6592 \times 2 &= 1.3184 \rarr 0.01001 \\
  0.3184 \times 2 &= 0.6368 \rarr 0.010010 \\
  0.6368 \times 2 &= 1.2736 \rarr 0.0100101 \\
  &\vdots
\end{aligned}
$$

and as noted above, this can go on for _awhile_: decimals with finite digits may have infinite binary expansions...  The binary representations will be exact _iff_ $2$ is the sole prime factor of the denominator which is like anti-swag.

---

## Entropy-Optimal Sampling (Knuth and Yao)

The algorithm for sampling from a discrete distribution $p$ using a binary tree $A$ is as follows:

1. Start at the root, traverse to a child according to the output of our entropy source $S$ which is accessed via primitive function $flip() = \begin{cases} \text{left} &\text{if } 0 \\ \text{right} &\text{if } 1 \\\end{cases}$ 
2. If the child is a leaf, return its label, otherwise repeat

![](/images/fldr-2.png)

We call such a tree a Discrete Distribution Generating Tree (DDG).

For a fair dice $p = (\frac{1}{6},\frac{1}{6},\frac{1}{6},\frac{1}{6},\frac{1}{6},\frac{1}{6})$, we have the map from sequences of coin flips $001, 010, 011, 100, 101, 110$ mapped to outcome of a dice roll $1,2,3,4,5,6$ where $000 \rarr 0$ and $111 \rarr 7$ are rejected and the tree is sampled again for a value in the domain of the distribution. 

Back to Knuth and Yao's optimal DDG: 

This begs the question, what is the entropy optimal number of flips, that is –the least, average number of flips– needed for a DDGT of some distribution $p = (p_i, ..., p_n)$?  

In _Algorithms and Complexity: New Directions and Recent Results_, Knuth and Yao present a theorem stating that the entropy-optimal tree has leaf $i$ at level $j$ _iff_ the $j$th bit in the binary expansion of $p_i = 1$.

For example, for the distribution 

$$
\begin{aligned}
p &= (\frac{1}{2}, \frac{1}{4}, \frac{1}{4}) \\
  &= \begin{bmatrix} p_1 \\ p_2 \\ p_3 \end{bmatrix}
   = \begin{bmatrix} 1/2 \\ 1/4 \\ 1/4 \end{bmatrix}
   = \begin{bmatrix} 0.10_2 \\ 0.01_2 \\ 0.01_2 \end{bmatrix}
\end{aligned}
$$

This is rather useful as it dictates precisely how we can build the optimal tree by simply reading off the binary expansion of the probabilities of our target distribution.

To construct the tree, we create a root, and two children since a die is necessarily _at least two_ sided. For the first entry in the distribution, corresponding to the first face of our loaded die, we have $p_1 = 1/2 = 0.\color{red}1\color{black}0_2$.  Since we need the tree to be complete, we fill from left to right.  The first layer of children corresponds to $d=j=1$, and the $j$th digit in the binary expansion of $p_1$ is a 1, so we add the label $1$ to that node. $p_2$ and $p_3$ both have $0$s in the $j=1$th position of their binary expansion, but _do_ have 1s in the $j=2$th position, so we create two children whose parent is the left child of the root, and add the labels $2$ and $3$ to those leaves, yielding the following optimal tree:

![](/images/fldr-3.png)

That was a rather easy and contrived example since $p$ was constructed to be **dyadic**, meaning all it's entries were powers of two:

$$
\forall p_i \in p, p_i = \frac{1}{2^n}, \; n \in \Z^+
$$ 

But as we observed in Figure 1 above, for even just a conventional six-sided dice, non-dyadic entries become necessary to account for.  This is where the caveat of "_near_-optimal" comes into play.

Consider instead a discrete probability with rational (aka _annoying_ entries).  The binary expansions of these entries may be infinite.  But fear not, we can make use of **back edges** which refer back to a node at a higher depth in the tree whose descendants capture the repeating portion of the expansion:

$$
\begin{aligned}
p &= (\frac{3}{10}, \frac{7}{10}) \\
  &= \begin{bmatrix} p_1 \\ p_2 \end{bmatrix}
   = \begin{bmatrix} 3/10 \\ 7/10 \end{bmatrix}
   = \begin{bmatrix} 0.\overline{1001}_2 \\ 0.1\overline{0110}_2 \end{bmatrix}
\end{aligned}
$$

![](/images/fldr-4.png)

> What about discrete transcendental distributions, like $p = (1/\pi, 1 - 1/\pi)?$

![](http://www.reactiongifs.com/r/2012/01/cut-it-out.gif)

Eric Weisstein, no not that one, _nor that one_, but the cool one does research for Wolfram Alpha published a paper earlier this year showing that binary transcendental distributions might actually be more tractable than was previously thought: https://arxiv.org/abs/2201.12601

Knuth and Yao's theorem actually still holds for irrationals and transcendentals.  However, we can't represent these on a computer with finite memory, and by definition, there's no repeating structure for irrational probabilities, so back edges can't help us out much further.

### 2nd Main Theorem

The second main theorem introduced by Knuth and Yao which has direct relevance to FLDR is that _the expected number of flips in an entropy-optimal satisfier satisfies the following constraint:_

$$
H(p) \leq \mathbb E[\text{\# flips}] < H(p) + 2
$$

where $H(p) = \sum_i p_i \log_2(\frac{1}{p_i})$ is the Shannon entropy or _amount of information_ per bit.  Information is inherently related to "surprise," –that is: we are unsurprised when an event occurs with probability $1$, (duh, that's what we expected to happen), and immensely surprised when we observe an event that had $0$ probability of occurring.  

The lower bound of this theorem follows from the definition of Shannon entropy –_we can't receive less than one bit of information per flip_.

The upper bound is less obvious, but Knuth and Yao prove that for a uniform distribution on $\{0,...2^k\}$ which can be represented as a full binary tree with exactly $k$ bits, the worst case cost for sampling this distribution is 2-bits for _non-full_ Binary Trees.

## So, What's the Problem...?

Why not just use an optimal sampler as described above?  Well, if you hadn't guessed already, they require a _ton_ of memory.

In general, the sampler described above is exponentially large in the number of bits needed to encode the target distribution $p$:

$$
\begin{aligned}
  &\Omega(n \log m) \text{ bits to encode } p \\
  &\Omega(n m) \text{ bits to encode the optimal DDG}  \\
\end{aligned}
$$

for $(a_1, ..., a_n) \in Z^+$ summing to $m$, with $p_i = \frac{a_i}{m}$.  To go from the logarithmic encoding of $p$ to the polynomial encoding of the KY-DDG is an exponential scaling process.  In other words, to optimally encode and sample a binomial distribution with $n=50, p=61/500$, the KY-DDG has a staggering depth of $10^{104}$ which is roughly equivalent to $10^{91}$ terrabytes.  Talk about combinatorials which fry your gonads![^11]

FLDR, on the other hand, scales _linearly_ with the number of bits needed to encode $p$:

![](/images/fldr-6.png)

Whereas the entropy-optimal sampler is bounded by $H(p) < A < H(p) + 2$ per Knuth and Yao's 2nd theorem, FLDR only increases the upper bound by 4 flips in the worst case:

$$
H(p) < A < H(p) + 6
$$

with a depth given by $2(n+1)\lceil \log m \rceil$, and boasting $\Omega(n \log m)$ bits to encode both $p$ _and_ the FLDR-DDG.

## How Does FLDR Work?

The basic idea behind FLDR is rejection sampling.  The advances made in reducing the encoding costs are gained from clever representation of the DDG.

A naive approach to rejection sampling might be a tabular approach like the following:

for $(a_1, ..., a_n)$ with $p_i = a_i / m$, build a look-up table where $a_i$ is represented proportionately:

![](/images/fldr-7.png)

where $k$ is fixed so that $2^{k-1} < m \leq 2^k$. To encode a distribution as such a table, generate $k$ random bits to form an integer $Z$ until $Z < m$ and return the lookup table of size $Z$ to be sampled from.

This _will work_, but is still an exponentially sized array.  

We can do a bit better by shrinking the table from size $m$ to $n$ by using inverse Cumulative Distribution Function Sampling: 

![](/images/fldr-8.png)

Similarly, with this approach, generate $k$ random bits to form an integer $Z$ until $Z < m$ and return $\min \{ j \vert Z < Table[j]\}$

And finally, FLDR is a DDG Tree with Rejection Sampling.  Once again, fixing $k$ so that $s^{k-1} < m \leq 2^k$, we also introduce a new distribution $q$ where $q_i = \frac{a_i}{2^k}, q_{n+1} = 1 - \frac{m}{2^k}$ and build from $T_q$ which is the optimal DDGT of this distribution $q$ which has been "padded" to form a dyadic distribution, where the extra entries are "rejects."

![](/images/fldr-9.png)

Comparing each of these approaches: 

| approach | bits/sample | time complexity | space complexity |
|-|-|-|-|
| Naive Rejection Sampling | $k$ | $O(1)$ | $\Omega(m)$ |
| Inverse CDF | $k$ | $O(1)$ | $\Omega(n)$ |
| FLDR | $H(p) + c$ | $H(p) + c$ | $\Omega(n \log m)$ |


## Results
The main advantages of FLDR over other approaches include:
- memory required scales linearly in the number of bits needed to encode $p$
- FLDR requires 10,000 times less memory than the entropy-optimal sampler
- Rejection sampling from $q$ incurs only a 1.5x runtime penalty
- FLDR is 2x-10x faster in preprocessing

<!-- honestly fuck this explanation, leverage his slides instead -->

<!-- ## Code: Adj Maj

Reference the fast inverse Square 

```python
w = (r >> ((k-1) - j)) & 1;
```

Just add some prints around this using example weights from the slides, I’d expect them to be the same numbers

## Not a Spiteful Appendix 

TODO: 

_mea numquam culpa_

While by no means an exhaustive verification of correctness of FLDR (not even close), I've included the following appendix to crush some BEEF about how many rolls it would take to verify whether or not a dice is balanced.

![](/images/fldr-10.png)

- Call FLDR on some weights, sample n=5,10,100,500,1000x 
- plot the error between chi-square and actual frequencies -->

# Footnotes & References

[^1]: I will never stop using memes in my posts.  In fact, every year that passes erodes the mountain of cringe that might otherwise be earned from tossing a rage comic in here...

[^2]: https://www.murphyandhislaw.com/blog/strong-eventual-consistency

[^3]: I'm over <a class="eventually">this bit</a>, don't worry

[^4]: The authors of this pre-print receive 3/5 swag points from me for uploading their code along with the paper.  -2 swag for said code being hard to read.  An example of a paper with code that receives 5/5 swag points from Peter is _"Escaping the State of Nature: A Hobbesian Approach to Cooperation in Multi-agent Reinforcement Learning"_([arXiv:1906.09874](https://arxiv.org/abs/1906.09874)) by William Long.  Actually, 6/5 Will responded to me when I reached out asking about [the code](https://github.com/wlong0827/state_of_nature) and later offered me a job when I was first looking for fulltime work.  (The best way to swag points is bribery with a salary).  

[^5]: https://rubberduckdebugging.com/

[^6]: Randomness 101: LavaRand in Production. [CloudFlare](https://blog.cloudflare.com/randomness-101-lavarand-in-production/)

[^7]: Method for seeding a pseudo-random number generator with a cryptographic hash of a digitization of a chaotic system. [Patent US5732138A](https://patents.google.com/patent/US5732138).

[^8]: Recommendation for Random Number Generation Using Deterministic Random Bit Generator. [NIST](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90Ar1.pdf).

[^9]: Donald Knuth, Andrew Yao. "The Complexity of Nonuniform Random Number Generation." _Algorithms and Complexity: New Directions and Recent Results_. Traub. <br>Were you looking for a link? I bought the last hardcopy on Amazon.  Awkward...

[^10]: "Intuitively" is a word mathematicians use to describe their understanding of something after they've suffered an acid flash back in their kitchen

[^11]: https://www.murphyandhislaw.com/blog/voting-power#infertility