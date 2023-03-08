---
title: "45 | Smiting the Demon Number: How to Solve a Rubik's Cube"
date: "2022-10-23"
description: "Group Theory, Rubik's Cubes"
path: "/blog/demon-number"
---

> I talk to God as much as  
> I talk to Satan 'cause  
> I want to hear both sides[^1]

# Introduction 

Lots of posts about numbers recently, eh?  Well, here's another: in which, we solve a Rubik's Cube.  

Two dueling, and even contentious properties of Rubik's Cubes are (1) the _massive_ number of possible scrambles, and (2) that any of these scrambles is only 20 or so (contentious) moves away from being returned to the solved state.  Due to the at-first unintuitive idea that, no matter how many twists we apply to a Rubik's cube to make it thoroughly jumbled, it can be solved in just twenty moves, that number has been dubbed _**God's Number**_.[^2]  For the sake of motivating this post, I choose to anthropomorphize the search space of solutions to be **_the Demon Number_**.  

The goal of this post is then to mathematically describe the process of moving the pieces of a **valid configuration** of a standard 3x3x3 Rubik's cube, and –in doing so– smite the Demon Number.

## Group Theory

I have a couple other poasts that provide brief summaries of basic group theory.[^3] If you're starting from zero, those might be worth checking out, but this post should also be comprehensive enough (in terms of definitions, perhaps not proofs) to fill in the gaps to get the average reader up to speed.  If you feel out of your depth, that's the fault of my shite writing, and not at all an indication of the readers' competency.  Also worth noting that this post largely stands on the shoulders of the research and lectures of Janet Chen,[^4] once again I offer my meager commentary and observations about the mathematics in terms of cubing.

A **Group** $\langle G, * \rangle$ consists of a set $G$, and a binary operator $*$ such  that:
1. $G$ is closed under $*$, that is if $a, b \in G$, then $a * b \in G$
2. The operator $*$ is associate: $\forall a, b, c \in G$, $a * (b *c) = (a *b) * c$
3. There exists exactly one identity element $e \in G$ satisfying $g = e * g = g * e, \forall g \in G$
4. Every element in $G$ has exactly one inverse: $\forall g \in G, \exists h \in G$ such that $g * h = h * g = e$.  We might also refer to the inverse $h$ as $g^{-1}$. 

The **order** of an element of a group $g \in G$ is the smallest $n$ such that $g^n$ is the identity.  For example, the order of _the sexy move_ $M = RUR'U'$ is six, since the move is a 6-cycle, meaning that 6 repetitions of that sequence of twists returns the cube to whatever state it started in, which is equivalent to the identity: doing nothing.  The largest order of a move $M \in G$ is 1260 – one such move is $M = RU^2D'BD'$ which is like the _least sexy_ move.

## Taxonomy of The Cube

For this post, I focus on only the original 3x3x3 cube ("_The Cube_"), but the techniques described later on can be (in some cases, non-trivially) generalized to other $l \times m \times n$ cubes.

The standard cube is composed of 26 pieces ($3^3$ external faces $- 1$ center core piece which we can't see or meaningfully manipulate, so we don't have to worry about solving).  There are 8 corners, 12 edges, and 6 center pieces; the center pieces we can also largely ignore since they are fixed in place relative to one another.[^5]  One of the first intuitions that novice _cubers_ acquire is that, for standard color schemes, white is opposite yellow, green opposite blue, and red opposite orange; with the additional piece of relative positioning information that yellow is left of orange and also adjacent to blue, we can form the complete standard color scheme.

![](/images/rubiks-cube-1.jpg)

The cube obviously has 6 faces, which we've established have positions derived from their fixed centers, allowing us to completely describe the "correct" solved position of any piece in terms of the face it belongs to.  For example, listing a corner's faces in clockwise order unambiguously refers to precisely one piece.[^6]

For example, $\sf urf$ refers to the yellow, red, blue piece:

![](/images/rubiks-cube-2.jpg)

It is also conventional to refer to corner pieces by their face labels listed in clockwise order when the orientation matters.  Edges only have two possible orientations, so there is less ambiguity.

Along with the pieces themselves, it's useful to uniquely denote the position they belong in: their **cubicles**.  Cubicles form the skeleton of the cube; they do not move, but pieces move in and out of them.  

A **move** is any 90º turn of a face.[^7]  Thus, we have six primitive moves and their inverses (denoted with an apostrophe, or sometimes a negative superscript), from which we can completely manipulate the cube, for a total of 12 primitives:

$$
\{ U, D, L, R, F, B, U', D', L', R', F', B' \}
$$

I'll refer to this set of primitives as $\mathbb{P}$.  Typically, (as in, _in my head_, I read the inverse moves as $M$ "prime").[^8]

As mentioned above, we have four distinct categories for pieces: corners, edges, centers, and core(s) – only two of which we care about (corners and edges) since the rest cannot be meaningfully manipulated.  These categories are distinct since edges can never inhabit corner cubicles and vice versa.

## The Demon Number
The complexity of the cube is given by the number of permutations of each piece in each possible cubicle, confounded with the number of possible orientations each piece can have in each cubicle.  Straightforwardly, we arrive at:

$$
\underbrace{8!}_{\text{corner perms} } \cdot \underbrace{12!}_{\text{edge perms}} \cdot 
\underbrace{3^8}_{\text{corner orientation}} \cdot 
\underbrace{2^{12}}_{\text{edge orientation}}
= 519 \text{ quintillion}
$$

The Demon Number.   

Here, we delineate between permutation and orientation, which are likely familiar notions to any students of intermediate speed cubing techniques such as CFOP: a method where the executor first solves the (C)ross, then completes the (F)irst two layers, then (O)rients the pieces on the last later (OLL), and finally (P)ermutes the pieces of the last layer to their final positions (PLL).[^9]

We'll shortly convince ourselves that –though daunting– this number/search space can be drastically thinned by discounting invalid configurations.  For example, one single corner twist is considered an _invalid configuration_ due to the concept of _parity_.  Formal definitions of what a _configuration_ is, what makes one _valid_ are forthcoming, and what the hell _parity_ means in the context of a puzzle-toy.  Thus, our immediate goal is to widdle away at the Demon Number.

We say that a configuration or cube-state is **valid** if it can be reached from the initial, pristine and solved cube-state using only the legal moves described above.  We call this solved configuration $\mathcal C_0$.  Notably absent from the list of legal moves is anything resembling "pealing the stickers off" or "just taking the pieces out."  These are trash.   

Though we have yet to show that the standard cube is in fact group, the general goal of "solving" is to produce a sequence of moves that can take us from any valid state to the solved state $\mathcal C_0$.

## The Cube is a Group, Dammit!

We can construct our cube group with the set of all possible moves $G$, which includes sequences of the primitive moves described above.  Two moves are identicial if they result in the same configuration when applied to the cube.   E.g. 

$$
U^2 \equiv U'U' \equiv UU
$$ 

The group operation is composition, denoted $\circ$, such that for $M_1, M_2 \in G$, $M_1 \circ M_2$ is the move consisting of $M_1$ followed by $M_2$.  Note that, though $M_1 \circ M_2$ is clearly more than just one _twist_, we can refer to the composition as still just a single _move_.  So, moves can be sequences of twists. 

Thus, $\langle G, \circ \rangle$ is a group since the behavior we've described adheres to the four fundamental properties of groups defined earlier:

1. $G$ is closed under $\circ$ since, if $M_1, M_2$ are moves, $M_1 \circ M_2$ must also be a move.
2. The identity on $G$ is the no-op $M \circ e \equiv M, \forall M \in G$, so $G$ has a _right_ identity.
3. If $M$ is a move, we can reverse all the steps of $M$ to get an inverse $M'$ which is also equivalent to the no-op $e$, therefore every move in $G$ also has a _right_ inverse.
4. Lastly, $\circ$ is associative.  Recal that a move is also described by the spacial permutation and orientation it leaves each piece in.  If we care about the orientation of a piece, we write $M(c)$ for the _oriented_ cubicle that the piece $c$ ends up in after application of move $M$, with the faces of $M(c)$ written in the same order as the faces of $c$. That is, the first face of $M(c)$ should end up in the first face of $c$, and so on.

For example, the move $R$ puts the piece $\sf ur$ in the $\sf br$ cubicle, with the $\sf u$ face of the piece lying on the $\sf b$ face of the cubicle and the $\sf r$ face of the piece lying in the $\sf r$ face of the cubicle.  Thus, we would write $R(\sf{ur}) = \sf br$.

For the move $M_1 \circ M_2$ , $M_1$ moves $c$ to $M_1(c)$, and $M_2$ moves it to $M_2(M_1(c))$, so 

$$
(M_1 \circ M_2)(c) \equiv M_2(M_1(c))
$$
To show that $\circ$ is associative, we need to show that 

$$
(M_1 \circ M_2) \circ M_3 \equiv M_1 \circ (M_2 \circ M_3)
$$
for all $M_1, M_2, M_3 \in G$.  That is, both the sinistral side and dextral sides of this equivalence relation must do the same thing to every piece $c$, leaving the cube in identical configurations.

$$
\begin{aligned}

\; [(M_1 \circ M_2) \circ M_3] (c) &\equiv [M_1 \circ (M_2 \circ M_3)](c)

\\ 

M_3([M_1 \circ M_2])(c) &\equiv (M_2 \circ M_3)(M_1(c))

\\

M_3(M_2(M_1(c))) &\equiv M_3(M_2(M_1(c)))
\end{aligned}
$$

So, composition is associative, and therefore $\langle G, \circ \rangle$ is a group!

## Subgroups and Generators

The Demon Number is frightening because, in order to find our solution, we have sparse moves in an infinite[^10]  search space.  To hack away at the :ghost: spooky number, we first want to examine the subgroups of $G$ to extract any patterns or properties that might be helpful in our quest.  

Any nonempty subset $H$ of $G$ $(H \subseteq G, H \neq \varnothing)$ is called a **subgroup** of $G$.[^11] A group is always a subset of itself.

Let $\langle G, \circ \rangle$ be a group. A nonempty subset $H$ of $G$ is a subgroup of $G$ *iff* $\forall a,b \in H, ab^{-1} \in H$.[^12]  

If $H$ is a subgroup of some group $G$, we say that $H$ **generates** $G$ if $G = \langle S\rangle$; that is, every element of $G$ can be written as a finite product (under group operation, whatever it is) of elements of $S$ and its inverses.

This is useful in reducing The Demon Number since we can more thoroughly state that center positions need not be considered.[^13]

> Peter uses subgroups, it's super effective. 

## The Symmetric Group and Cycles

Recall that there are $8!$ possible positions of the set of corners in the cubicles.  To better understand how these possibilities impact our solution attempts, consider the general case of configuring $n$ objects labeled $1, 2, ..., n$ into $n$ buckets, similarly labeled.

We define a bijection between pieces and labeled cubicles:

$$
\sigma: \{ 1, 2, ..., n\} \rightarrow \{ 1, 2, ..., n\}
$$

by $\sigma(i)$ being assigned to the object put into slot $i$, where $1 \leq i \leq n$.

The **symmetric group** on $n$ letters is the set of bijections from $\{ 1, 2, ..., n\} \rightarrow \{ 1, 2, ..., n\}$, with the operation of composition; we write this group as $S_n$. 

For example, let $\sigma, \tau \in S_3$ be defined by 

$$
\begin{aligned}

	\sigma(1) = 3, \; \tau(1) = 1 \\
	\sigma(2) = 1, \; \tau(2) = 3 \\
	\sigma(3) = 2, \;  \tau(3) = 2 \\	
\end{aligned}
$$
which implies

$$
\begin{aligned}
	(\sigma\tau)(1) = \tau(3) = 2 \\
	(\sigma\tau)(2) = \tau(1) = 1 \\
	(\sigma\tau)(3) = \tau(2) = 3 
\end{aligned}
$$

Notice that these subsets of the symmetric group, as well as their composition, form cycles.  We can express cycles in groups as 

$$
\sigma(i \; j \;k \; l)(m \; n)(o)
$$
where $\sigma(i) = j, \sigma(j) = k, ..., \sigma(l) = i$ and so on.  So we have three cycles in this arbitrary mapping $\sigma \in S_\text{whatever}$.  

Formally, a **cycle** $(i_1 \; i_2 \; ... \; i_k)$ is the element $\tau \in S_n$ defined by 

$$
\tau(i_1) = i_2, \tau(i_2) = i_3, ..., \tau(i_{k-1}) = i_k, \tau(i_k) = i_1
$$
where $\tau(j) = j$ if $j \neq i_r, \forall r$.  The **length** of a cycle is $k$ and the **support** of the cycle is the set $\{ i_1, ..., i_k\}$ of elements which appear in the cycle, denoted $\text{supp } \tau$. 

Two cycles $\sigma, \tau$ are **disjoint** if they have no supporting elements in common: $\text{supp } \sigma \; \cap \; \text{supp } \tau = \varnothing$.

If $\sigma \in S_n$ is the product of disjoint cycles of lengths $k_1, k_2, ..., k_r$ (including its 1-cycles), then the integers $k_1, k_2, ..., k_r$ are the **cycle-type** of $\sigma$. 

## Applying this ish to The Cube

We can use a modified cycle notation to describe what happens to each corner piece after applying a move to a configuration with respect to both its permutation and its face's orientations.

To illustrate this, we "unfold" part of the cube and examine the partial diagram of its faces after a $D$ move, we can see the effect the move has on all the pieces in that slice.  

![](/images/rubiks-cube-3.jpg)

We can describe this effect on a single piece, e.g. $D(\sf {dlf}) = \sf{dfr}$ since the piece $\sf {dlf}$ goes to the $\sf {dfr}$ cubicle.  Using the above cycle notation, we can describe the effect for all the impacted pieces as:

$$
D = (\sf{dlf} \; \sf{dfr} \; \sf{drb} \; \sf{dbl})(\sf{df} \; \sf{dr} \; \sf{db} \; \sf{dl})
$$

where each piece just traverses the clockwise orbit around the $\sf d$ centerpiece.

## Configurations 

Recall that a configuration is completely described by:
1. The positions of the corners
2. The positions of the edges
3. The orientations of the corners
5. The orientations of the edges

1 and 2 can be described by $\sigma \in S_8, \tau \in S_{12}$ respectively, where $S_8, S_{12}$ are the symmetric sets of moves that take the corners or edges from their starting positions to new positions.

To tackle 3 and 4, we need some more notation to describe the orientation of a piece relative to its starting state.  

### Corner Configuration

Each corner has three possible orientations which we number $0, 1, 2$.  We then systematically label each face of every corner cubicle:

$$
\begin{aligned}
1 &\rightarrow \sf{u} \in \sf{ufl} \quad 
	&5 &\rightarrow \sf{d} \in \sf{dbl} \\ 
2 &\rightarrow \sf{u} \in \sf{urf} \quad
	&6 &\rightarrow \sf{d} \in \sf{dlf} \\
3 &\rightarrow \sf{u} \in \sf{ubr} 
	&7 &\rightarrow \sf{d} \in \sf{dfr} \\
4 &\rightarrow \sf{u} \in \sf{ulb} 
	&8 &\rightarrow \sf{d} \in \sf{drb}

\end{aligned}
$$
So each corner piece has 1 face lying in a labeled cubicle.  We label this corner face $0$, then continue around the cube clockwise, labeling the other corner faces $1$ and $2$. 

![](/images/rubiks-cube-4.jpg)

Now, each corner piece has each face labeled.  For any integer $i \in [1, 8]$, we can find the cubicle face with that label, and let $x_i$ be the number of the corner piece face which indicates its orientation on this face.  This gives us an ordered 8-tuple

$$
\mathbf {x} = (x_1, x_2, ..., x_8)

$$ 

which contains all the corner orientation information for a configuration.  We can think of each $x_i \in \mathbf {x}$ as the number of clockwise twists that that corner $i$ is away from having it's $0$-face in the numbered face of the cubicle (the solved orientation).  Observe that a corner piece that is 3 twists away from being solved is identically oriented to that of a piece which is already solved (0 twists away), so we can think of elements of each $x_i$ as being elements of the $\mathbb Z / 3\mathbb Z$.  Thus, $\mathbf x$ is an 8-tuple of elements of $\mathbb Z / 3\mathbb Z$, where each element $x_i \in (\mathbb Z / 3\mathbb Z)^8$.

For example, examining the $\sf R$ slice of the cube:

![](/images/rubiks-cube-5.jpg)

![](/images/rubiks-cube-6.jpg)

The $\sf L$ face is unaffected by an $R$ move, so we have:

$$
\mathbf x = \Bigg (
\begin{aligned}
x_1 = 0 \quad 
	&x_2 = 1 \\ 
x_4 = 0 \quad 
	&x_3 = 2 \\
x_5 = 0 \quad 
	&x_7 = 2 \\
x_6 = 0 \quad 
	&x_8 = 1 \\
\end{aligned}
\Bigg )= (0,1,2,2,0,0,2,1) 
$$
## Edge Configuration

We can repeat this same labeling process for edges.  First, we assign cubicle labels (somewhat arbitrarily, as long as the system is internally consistent):

$$
\begin{aligned}
1 &\rightarrow \sf{u} \in \sf{ub} \quad 
	&5 &\rightarrow \sf{b} \in \sf{lb} 
	&9 &\rightarrow \sf{d} \in \sf{db} \\ 
2 &\rightarrow \sf{u} \in \sf{ur} \quad 
	&6 &\rightarrow \sf{b} \in \sf{rb} 
	&10 &\rightarrow \sf{d} \in \sf{dr} \\  
3 &\rightarrow \sf{u} \in \sf{uf} \quad 
	&7 &\rightarrow \sf{f} \in \sf{rf} 
	&11 &\rightarrow \sf{d} \in \sf{df} \\  
4 &\rightarrow \sf{u} \in \sf{ul} \quad 
	&8 &\rightarrow \sf{f} \in \sf{lf} 
	&12 &\rightarrow \sf{d} \in \sf{dl} \\ 
\end{aligned}
$$

Each piece now has a face lying on a numbered edge cubicle.  We label this edge face $0$ and the other one $1$.  We let $y_i$ be the number of the edge piece face in the cubicle face labeled $i$  yielding  
$$
\mathbf y \in (\mathbb Z / 2 \mathbb Z)^{12}
$$
With this orientation notation, we can completely describe any configuration of 

$$
\begin{aligned}
	\sigma &\in S_8, &\tau &\in S_{12} \\
\mathbf x &\in (\mathbb Z / 3 \mathbb Z)^{8}, &\mathbf y &\in (\mathbb Z / 2 \mathbb Z)^{12} 

\end{aligned}
$$
as a 4-tuple $\mathcal C = (\sigma, \tau, \mathbf x, \mathbf y)$. 

### Example

A common algorithm used in the beginner's method during the last step –orienting the corners of the last face– is a six-cycle $DRD'R'$.[^14] If we jot down the 4-tuple for this algorithm, we get:

$$
\begin{aligned}

D = (\sf{dlf} \; \sf{dfr} \; \sf{drb} \; \sf{dbl})(\sf{df} \; \sf{dr} \; \sf{db} \; \sf{dl}) \\

R = (\sf{rfu} \; \sf{rub} \; \sf{rbd} \; \sf{rdf})(\sf{ru} \; \sf{rb} \; \sf{rd} \; \sf{rf}) \\

\end{aligned}
$$

from which, we also get their inverses:

$$
\begin{aligned}

D' = (\sf{dbl} \; \sf{drb} \; \sf{dfr} \; \sf{dlf})(\sf{dl} \; \sf{db} \; \sf{dr} \; \sf{df}) \\

R' = (\sf{rdf} \; \sf{rbd} \; \sf{rub} \; \sf{rfu})(\sf{rf} \; \sf{rd} \; \sf{rb} \; \sf{ru}) \\

\end{aligned}
$$

So, the composition of the crycles listed in the complete algorithm $DRD'R'$ is:

$$
\begin{aligned}

DRD'R' = (\sf{dlf} \; \sf{dfr} \; \sf{lfd} \; \sf{frd} \; \sf{fdl} \; \sf{rdf})
(\sf{drb} \; \sf{bru} \; \sf{bdr} \; \sf{ubr} \; \sf{rbd}\; \sf{rub})(\sf{df} \; \sf{dr} \; \sf{br}) \\

\end{aligned}
$$
which has two 6-cycles in terms of corner orientation, and a single 3-cycle in terms of edges.[^15]

![](/images/rubiks-cube-7.gif)



Recall that $\tau$, an element of $S_{12}$, is a bijection from the set of 12 un-oriented edges to the 12 edge cubicles, and can be expressed in disjoint cycle notation.  Here, $DRD'R'$ moves $\sf {df} \rightarrow \sf {dr}$ , $\sf {dr} \rightarrow \sf {br}$, and $\sf {br} \rightarrow \sf {df}$, so $\tau = (\sf{df} \; \sf{dr} \; \sf{br})$.  And, similarly, $\sigma$ can be expressed (without regard to orientation) as $\sigma = (\sf{drb} \; \sf{bru})(\sf{dfl} \; \sf{dfr})$.  

From our labeling scheme for corners, we can see that $DRD'R'$ leaves $x_1, x_2, x_4, x_5$ unaffected, and that this algorithm puts the $\sf b$ face of corner $\sf {drb}$ into the $\sf u$ face of $\sf{ubr}$, so the $\sf b$ face of $\sf {drb}$ is 2: $x_3 =2$, and similarly $x_6 = 2, x_7 =0, x_8 = 2$.  All together: 

$$
\mathbf x = (0, 0, 2, 0, 0, 2, 0,2)
$$

Similarly for the edges, $DRD'R'$ only affects edges of the $\sf{df, dr, br}$ edges.  We know from the labels that only $y_6, y_{10}, y_{11}$ may be non-zero, but incidentally, their orientations remain unchanged after 1 iteration of the 6-cycle, so $\mathbf y = \overline{0}$.  

## Group Homomorphisms

A **homomorphism** is a weaker condition than the structural and relational equivalence defined by an isomorphism. A homorphism exists when sets have the same algebraic structure, but they might have a different number of elements.

Formally, if we let $\langle G, \diamond \rangle$ and $\langle H, \star \rangle$ be two groups. A homomorphism from $G$ to $H$ is a map $\phi: G \rightarrow H$ such that 

$$
\phi(a \diamond b) = \phi(a) \star \phi(b) \quad \forall a, b, \in G
$$ 

We can define a map $\phi: G \rightarrow S_8$ as any move in $G$ which rearranges the corners (that is, all moves other than the identity and equivalent moves).  That is, for any $M \in G \;\backslash\; e$ , define some permutation $\sigma \in S_8$.  Let $\phi_{corner} = \sigma$  such that $\phi_{corner}(M)$ is the element of $S_8$ which describes what $M$ does to the unoriented pieces.  Taking the familiar $DRD'R'$ which has the disjoint cycle composition

$$
(\sf{dlf} \; \sf{dfr} \; \sf{lfd} \; \sf{frd} \; \sf{fdl} \; \sf{rdf})(\sf{drb} \; \sf{bru} \; \sf{bdr} \; \sf{ubr} \; \sf{rbd} \; \sf{rub})(\sf{df} \; \sf{dr} \; \sf{br})
$$

Therefore, $\phi(DRD'R') = (\sf{dlf} \; \sf{dfr})(\sf{drb} \; \sf{bru})$. That is, the corner without respect to orientation.

Similarly, we define $\phi_{edge}: G \rightarrow S_{12}$ by letting $\phi_{edge}(M)$ be the element of $S_{12}$ which describes what $M$ does to the twelve unoriented edges e.g. $\phi_{edge}(DRD'R') = (\sf{df} \; \sf{dr} \; \sf{br})$.  

With these two homomorphisms, we can define the "cube" homomorphism:

$$
\phi_{cube}: G \rightarrow S_{20}
$$
which describes the permutations of the twenty unoriented edges and corners.

### The Sign Homomorphism

We know from properties of generators that $S_n$ is generated by the 2-cycles in $S_n$.  That is, any permutation in $S_n$ can be written as a finite product of 2-cycles.  However, any given permutation of $S_n$ can be written as a finite product of 2-cycles in infinitely many ways (actually infinite, not just like "big numbie" infinity).  So this isn't super useful.

Some permutations in $S_n$ can be expressed as a product of even number 2-cycles; aptly referred to as **even permutations**.  Conversely, all the other permutations of $S_n$, written as a product of an odd number of 2-cycles are called **odd permutations**.  At the moment, it might seem like there's no reason why a permutation couldn't be both odd and even, but as the name suggests: that is –in fact– impossible.

The direct proof is gross, so we'll indirectly approach this statement.

#### Proof of Permutation Parity 

We fix $n$ and let $P(x_1, ..., x_n)$ be a polynomial in $n$ variables.  That is, if $n=1, P(x_1)$ is a polynomial in the variable $x_i$ so that $P(x_i)$ has the shape:

$$
a_mx_1^m + a_{m-1}x_1^{m-1} + \dots + a_0
$$
So $P(x_1)$ is a sum of terms that look like $ax_i$.  For $n=2$, $P(x_1, x_2)$ is the sum of terms that look like $ax_1^ix_2^j$.  In general, $P(x_1, ..., x_n)$ is the sum of terms that look like 

$$
ax_1^{i_1}x_2^{i_2}\dots x_n^{i_n}
$$

If $\sigma \in S_n$, we say $P^\sigma$ is the polynomial defined by 

$$
(P^\sigma)(x_1, ..., x_n) = P(x_{\sigma_{(1)}}, ..., x_{\sigma_{(2)}})
$$

We simply replace $x_i$ with $x_{\sigma_{(i)}}$.   For $n=4$, $P(x_1,x_2,x_3,x_4) = x_1^3 + x_2x_3 +x_1x_4$, and $\sigma \in S_4$ has a cycle decomposition $\sigma = (1 \; 2 \; 3)$.  Then 

$$
\begin{aligned}

(P^\sigma)(x_1, x_2, x_3, x_4) &= x^3_{\sigma_{(1)}} + x_{\sigma_{(2)}}x_{\sigma_{(3)}} + x_{\sigma_{(1)}}x_{\sigma_{(4)}} \\

&= x^3_2 + x_3x_1 + x_2x_4

\end{aligned}
$$
And note that, for any $\sigma, \tau \in S_n, (P^\sigma)^\tau = P^{\sigma\tau}$.  To prove the assertion about disjoint even and odd permutations, we apply the above decomposition to the following polynomial:

$$
\Delta = \prod_{1 \leq i < j \leq n} (x_i - k_j)
$$

E.g., for $n=3, \Delta = (x_1 - x_2)(x_1 - x_3)(x_2 - x_3)$.  So, for any $\sigma \in S_n, \Delta^\sigma = \pm \Delta$.  For $\sigma = (1 \; 3 \; 2)$:

$$
\begin{aligned}
\Delta^\sigma &= (x_3 - x_1)(x_3 - x_2)(x_1 - x_2) \\
              &= (x_1 - x_2)(x_1 - x_3)(x_2 - x_3) \\
              &= \Delta
\end{aligned}
$$

Alternatively, for $\sigma = (1 \; 2)$

$$
\begin{aligned}
\Delta^\sigma &= (x_2 - x_1)(x_2 - x_3)(x_1 - x_3) \\
              &= -\Delta
\end{aligned}
$$
with the idea being that we match terms of $\Delta$ with the terms of $\Delta^\sigma$.  That is, for each $(x_i - x_j) \in \Delta$, either $(x_i - x_j)$ or its negation appears in $\Delta^\sigma$.  It follows from the definition of $\Delta$ that 

$$
\begin{aligned}
\Delta &= \prod_{1 \leq i < j \leq n} (x_i - x_j)\\ 
\therefore \Delta^\sigma &= \prod_{1 \leq i < j \leq n} (x_{\sigma_{(i)}} - x_{\sigma_{(j)}})
\end{aligned}
$$

The _unrigouresness_ proof of this follows from the definition of a map $\epsilon: S_n \rightarrow \{-1, 1 \}$ by $\sigma\Delta = \epsilon(\sigma)\Delta$.  We know that 

$$
\Delta^{\sigma\tau} = (\Delta^\sigma)^\tau = [\epsilon(\sigma)\Delta]^\tau = \epsilon(\sigma)\epsilon(\tau)\Delta 
$$
Therefore, $\epsilon(\sigma\tau) = \epsilon(\sigma)\epsilon(\tau)$, so $\epsilon$ is a homomorphism called the **sign homomorphism**.  We define that if $\sigma$ is a 2-cycle, then $\epsilon(\sigma) = -1$. 

Proof:  Let $\sigma = (1 \; 2)$, so for the sign homomorphism we have:

$$
\begin{aligned}
\Delta &= \prod_{1 \leq i < j \leq n} (x_i - x_j) \\ 
\end{aligned}
$$

and expanding for $i = 1, 2$ separately we have

$$
\begin{aligned}
\Delta &= \prod_{1 < j \leq n} (x_1 - x_j) \prod_{2 < j \leq n} (x_2 - x_j) \prod_{3 \leq i < j \leq n} (x_i - x_j) \\

&= (x_1 - x_2) \prod_{2 < j \leq n} (x_1 - x_j) \prod_{2 < j \leq n} (x_2 - x_j) \prod_{3 < j \leq n} (x_i - x_j) \\

\\ \therefore \\ \\

\Delta^\sigma &= (x_{\sigma(1)} - x_{\sigma(2)}) \prod_{2 < j \leq n} (x_{\sigma(1)} - x_{\sigma(j)}) \prod_{2 < j \leq n} (x_{\sigma(2)} - x_{\sigma(j)}) \prod_{3 < j \leq n} (x_{\sigma(i)} - x_{\sigma(j)}) \\

&= (x_2 - x_1) \prod_{2 < j \leq n} (x_2 - x_j) \prod_{2 < j \leq n} (x_1 - x_j) \prod_{3 < j \leq n} (x_i - x_j) \\

&= -\Delta

\end{aligned}
$$

So we've proved the theorem for $\sigma = (1 \; 2)$, which can be generalized to any 2-cycle, but there's an easier, softer way.  If we let $\sigma$ be _any_ 2-cycle, we say that $\sigma$ is a **conjugate** to $(1\;2)$, meaning 

$$
\sigma = \tau(1 \; 2)\tau^{-1}; \quad \tau \in S_n
$$
Since $\epsilon$ is a homomorphism, 

$$

\epsilon(\sigma) = \epsilon(\tau)\epsilon(1 \; 2)\epsilon(\tau)^{-1}= \epsilon(1 \; 2)= -1

$$
and since $\epsilon$ is multiplicative, if  $\epsilon(\sigma) = 1$, then $\sigma$ must be a product of an even number of 2-cycles.  Similarly, if $\epsilon(\sigma) = -1$, it must be the product of an odd number of 2-cycles.  So, $\sigma$ is even _iff_ $\epsilon(\sigma) =1$, and odd _iff_ $\epsilon(\sigma) = -1$.

For example, $(1 \; 2)(1 \; 3)$ is even, and just $(1 \; 2)$ is odd.  $\epsilon(1 \; 6 \; 3 \; 4 \; \; 2) = 1$ since 

$$
(1 \; 6 \; 3 \; 4 \; \; 2) = (1\;6)(1\;3)(1\;4)(1\;2)
$$
is the product of four (an even number!) 2-cycles.  In general, if $\sigma$ is a $k$-cycle, then 

$$
\epsilon(\sigma) = (-1)^{k-1}
$$

## The Alternating Group and Parity

Like the set of real numbers, the parity of a group is multiplicative.  That is, the product of an even permutation and an odd permutation is odd, the product of two even permutations or two odd permutations as even.  The inverse of an even permutation is even, the inverse of an odd is odd, so we can define a subgroup of of the symmetric group consisting of all even permutations called the **Alternating Group**: $A_n \subset S_n$:

$$
A_n = \{\sigma \; \vert \; \epsilon(\sigma) = 1, \sigma \in S_n   \}
$$

If $M \in G$ is a face twist, then $\phi_{cube}(M)$ is a product of two 4-cycles.  A 4-cycle: 

$$
(m_1 \; m_2 \; m_3 \; m_4) = (m_1 \; m_2)(m_1 \; m_3)(m_1 \; m_4)
$$

is a product of an odd number of 2-cycles, is also odd, so two 4-cycles is even.  Therefore $\phi_{cube}(M)$ is even.  And since the face twists generate all of $G$, $\phi_{cube}$ is even for all $M \in G$.  So $\phi_{cube}(M) \in A_{20} \forall M \in G$.

Recall that $\phi_{cube}(M) = \phi_{corner}(M)\phi_{edge}(M)$, so either the edge homomorphism or corner homomorphism are both even, or both odd– but they _must_ have the same sign.  So, for any valid configuration $\mathcal C$, the sign of $\sigma, \tau$ must be the same. 

## Kernels

The **kernel** of a homomorphism $\phi: G \rightarrow H$ is defined to be the _pre-image_ of the identity of $g$ in $G$

$$
\text{ker}(\phi) = \{ g \; \vert \; \phi(g) =1_H, g \in G\}
$$
The kernel consists of all moves of the cube which do not change the permutations of any pieces.  That is, _only_ the moves that change the orientations, which is straightforwardly useful. In particular, $A_n$ is the kernel of $\epsilon: S_n \rightarrow \{-1, 1\}$. 

<!-- TODO: how we use them -->

## Group Actions

If the cube is in some configuration $\mathcal C$, the applying some move $M_1 \in G$ takes the cube state to a new configuration we call $\mathcal C \circ M_1$.  If we take another move $M_2 \in G$, we can compose or chain the resulting states together:

$$
(\mathcal C \circ M_1) \circ M_2
$$
which is the same as executing $(M_1 \circ M_2)$ on $\mathcal C$ directly. This is the essence of group actions.

Formally, a _right_ **Group Action** of $\langle G, \circ \rangle$ on a non-empty set $A$ is a map $A \times G \rightarrow A$.  That is, given $a \in A, g\in G$ we can produce another element of $A$, for which we write $a \cdot g$ satisfying the following properties:

1. $(a \cdot g_1) \cdot g_2 = a \cdot (g_1 \circ g_2); \quad \forall g_1, g_2 \in G, a \in A$
2. $a \cdot e = a; \quad \forall a\in A$

These are called _right_ group actions since we associate group elements on the right.  When we have a group action of $G$ on $A$, we say that "$G$ acts on $A$."  $G$ acts on the set of configurations of the cube (both valid and invalid).  

Oftentimes, we are interested in the case where the set $A$ is the group itself.  For $a, g \in G$ we def $a \cdot g = ag$ to just be group multiplication.  If $G$ acts on a set $A$, the **orbit** of $a \in A$ under this action is the set $\{ ag \; \vert \; g \in G \}$. We can think of orbits as the configurations that are reachable by repeating some (sequence of) move(s).  

If $G$ acts  on the set of configurations of the cube, the orbit of the starting configuration under this action is exactly the set of valid configurations of the cube.  This is a super nifty tid bit which further eradicates the spookiness of the Demon Number.  

If a group action only has one orbit, we say that the action is transitive, or that the group _acts transitively_.  We often want to prove something about all the elements of an orbit, like oh I don't know, _all valid configurations of a cube_.

Suppose a finite group $G$ acts on a set $A$, and let $S$ be a set of generators of $G$, and $P$ be some set of conditions such that the following is true: whenever $a \in A$ satisfies $P$ and $s \in S$, $a \cdot s$ _also_ satisfies $P$. Then, if $a_0 \in A$ satisfies $P$, then every element in the orbit of $a_0$ also satisfies $P$! In the case of the cube, we will apply this theorem to the action of $G$ on the set $A$ of configurations, where $S = \mathbb P, a_0 = \mathcal C_0$ in order to prove other statements about the set of valid configurations.

Pragmatically speaking, $G$ acts on the set of configurations of the cube.  The valid configurations, then, form a single orbit of this action, so it makes sense that the statements we make about valid configations can be generalized to other orbits.

## Valid Configurations of the Cube 

Six and a half thousand words in and I'm just now getting pissed that there's no Rubik's cube emoji.  WTF unicode, get it together.

Using all this notation and abstraction of the innocuous toy from the seventies into dumb made up math, we can form characterizations of the cube which actually help us solve it.  Only a couple more theorems, I promise. 

THEOREM!! : A configuration $\mathcal C = (\sigma, \tau, \mathbf x, \mathbf y)$ is valid _iff_ each of the following conditions are met:

$$
\begin{aligned}
\text{sign}(\sigma) &= \text{sign}(\tau), \\
\sum x_i &\equiv 0 \mod 3, \\
\sum y_i &\equiv 0 \mod 2,
\end{aligned}
$$

Lemma: If $\mathcal C_1, \mathcal C_2$ are configurations in the same orbit, then 

$$
\text{sign}(\sigma)\text{sign}(\tau) = \text{sign}(\sigma^{-1})\text{sign}(\tau^{-1})
$$

Proof of this lemma provides some further insight into the notion parity.  It is sufficient to show that $\mathcal C' = \mathcal C \circ M$ where $M$ is one the six primitives $\mathbb P$.  Then, 

$$
\begin{aligned}
\text{sign}(\mathcal C') &= \text{sign}(\mathcal C) \\
\sigma' &= \sigma \phi_{corner}(M) \\
\tau' &= \tau \phi_{edge}(M) \\

\\ \therefore \\ \\
\text{sign}(\sigma')\text{sign}(\tau') &= \text{sign}(\sigma)\text{sign}(\phi_{corner}(M))\text{sign}(\tau)\text{sign}(\phi_{edge}(M))

\end{aligned}
$$ 
and if $M \in G$ (which it better be, let's be honest.  When have we dealt with $M \notin G$), then $\phi_{corner}, \phi_{edge}$ are both 4-cycles with sign $-1$, so 

$$
\text{sign}(\sigma')\text{sign}(\tau') = \text{sign}(\sigma)\text{sign}(\tau)
$$

This can be generalized to all valid configurations: $\text{sign}(\sigma) = \text{sign}(\tau)$ which is _why_ we know a single corner or edge twist is invalid as a direct consequence of all valid configurations being in the orbit of $\mathcal C_0 = (1, 1, \mathbf 0, \mathbf 0)$. 

Lemma: If $\mathcal C'$  is in the same orbit as $\mathcal C$, then 


$$
\begin{aligned}
\sum x_i' &\equiv \sum x_i \mod 3, \\
\sum y_i' &\equiv \sum y_i \mod 2,
\end{aligned}
$$
Once more, it suffices to show that if $\mathcal C' = \mathcal C \circ M, M \in \mathbb P$, then $\sum \cdot' =  \sum \cdot  \mod \cdot$.

We can illustrate this with a table and diagram:
<!-- TODO: check these -->

| $M$  | $\mathbf {x', y'}$ | 
|----|------|
| $U$ | $(x_2, x_3, x_4, x_1, x_5, x_6, x_7, x_8), \\ (y_4,y_1,y_2, y_3, y_5, y_6, y_7, y_8, y_{9},y_{10},y_{11},y_{12}$ |
| $D$ | $(x_1, x_2, x_3, x_4, x_8, x_5, x_6, x_7), \\ (y_1,y_2,y_3, y_4, y_5, y_6, y_7, y_8, y_{10},y_{11},y_{12},y_9)$ |
| $R$ | $(x_1, x_7 + 1, x_2 + 2, x_4, x_5, x_6, x_8 + 2, x_3 + 1), \\ (y_1, y_7, y_3, y_4, y_5, y_2, y_{10}, y_8, y_{9},y_{6},y_{11},y_{12})$ |
| $L$ | $(x_4 + 2, x_2, x_3, x_5 + 1, x_6 +2, x_1 + 1, x_7, x_8), \\ (y_1, y_2, y_3, y_5, y_{12}, y_6, y_{7}, y_4, y_{9},y_{10},y_{11},y_{8})$ |
| $F$ | $(x_6 + 1, x_1 + 2, x_3, x_4, x_5, x_7 + 2, x_2 + 1, x_8), \\ (y_1, y_2, y_8 + 1, y_4, y_{5}, y_6, y_{3} + 1, y_{11} + 1, y_{9},y_{10},y_{7} + 1,y_{12})$ |
| $B$ | $(x_1, x_2, x_8 + 1, x_3 + 2, x_4 + 1, x_6, x_7, x_5 + 1), \\ (y_{6} + 1, y_2, y_3, y_4, y_{1} + 1, y_9 + 1, y_{7}, y_8, y_{5} + 1,y_{10},y_{11},y_{12})$ |

To make sense of this table, let's examine how we arrive at $\mathbf x'$  for $M = R$.  The cubicles of the right face and are: 

<!-- TODO: img demon number 4 -->

So $\mathbf x' = (x_1, x_7 + 1, x_2 + 2, x+4, x_5, x_6, x_8 + 2, x_3 + 1)$ , implying 

$$
\sum x_i' + 6 \equiv \sum x_i \mod 3
$$
Furthermore, _any_ configuration $\mathcal C$ where $\sum x_i \equiv 0 \mod 3, \sum y_i \equiv 0 \mod 2$ is a valid configuration as a direct consequence of the previous assertion that valid configurations are in the orbit of the starting configuration $(1, 1, \mathbf 0, \mathbf 0)$.   Recall the ultimate goal: to show that there exists a sequence of moves from some initial, valid conifugration which takes us to $\mathcal C_0$.  We do this by writing down the steps of solving a cube (5head moment). 

## Solving the Cube

1. If $\mathcal C$ is a configuration where

$$
\begin{aligned}
\text{sign}(\sigma) &= \text{sign}(\tau), \\
\sum x_i &\equiv 0 \mod 3, \\
\sum y_i &\equiv 0 \mod 2,
\end{aligned}
$$

then there exists some move $M \in G$ such that $\mathcal C \circ M$ has the form $(1, \tau', \mathbf x', \mathbf y')$ with

$$
\begin{aligned}
\text{sign}(\sigma') &= \text{sign}(\tau'), \\
\sum x_i' &\equiv 0 \mod 3, \\
\sum y_i' &\equiv 0 \mod 2,
\end{aligned}
$$

In other words, there exists a move to put all the corner positions into their correct positions. 

2. If $(1, \tau, \mathbf x, \mathbf y)$ is a configuration where

$$
\begin{aligned}
\text{sign}(\tau) &= 1 \\
\sum x_i &\equiv 0 \mod 3, \\
\sum y_i &\equiv 0 \mod 2,
\end{aligned}
$$

then there exists some move $M \in G$ such that $\mathcal C \circ M$ has the form $(1, \tau', \mathbf 0, \mathbf y')$ with 

$$
\begin{aligned}
\text{sign}(\tau') &= 1 \\
\sum y_i &\equiv 0 \mod 2,
\end{aligned}
$$In other words, there exists a move to orient all the corners.

3. If $(1, \tau, \mathbf 0, \mathbf y)$ is a configuration where

$$
\begin{aligned}
\text{sign}(\tau) &= 1 \\
\sum y_i &\equiv 0 \mod 2,
\end{aligned}
$$
then there exists a move $M \in G$ such that $\mathcal C \circ M$ has the form $(1, 1, \mathbf 0, \mathbf y')$ with $\sum y_i' \equiv 0 \mod 2$. That is, we can permute all the edges (without wrecking all the corner work we've _proved_ we can achieve).

4. Finally, if $(1, 1, \mathbf 0, \mathbf y)$ is a configuration with $\sum y_i \equiv 0 \mod 2$, then there exists a move $M \in G$ such that $\mathcal C \circ M = (1, 1, \mathbf 0, \mathbf 0)$ WHICH IS $\mathcal C_0$!!!!!!!!! 

In proving the viability of these steps, it's worth pointing out that if some $\mathcal C$ satisfies 

$$

$$
$$
P = \begin{cases} 
\text{sign}(\sigma) &= \text{sign}(\tau), \\
\sum x_i &\equiv 0 \mod 3, \\
\sum y_i &\equiv 0 \mod 2
\end{cases}
$$
then, for any subsequent configuration $\mathcal C' = (\sigma', \tau', \mathbf x', \mathbf y')$ in the same orbit as $\mathcal C$, also satisfies $P$.  So we only have to prove the existence of:

1. $M \in G$ such that $(\sigma, \tau, \mathbf x, \mathbf y)$ satisfying $P$ contains in its orbit a configuration $(1, \tau', \mathbf x', \mathbf y')$
2. $M \in G$ such that $(1, \tau', \mathbf x', \mathbf y')$ satisfying $P$ contains in its orbit a configuration $(1, \tau', \mathbf 0, \mathbf y')$
3. $M \in G$ such that $(1, \tau', \mathbf 0, \mathbf y')$ satisfying $P$ contains in its orbit a configuration $(1, 1, \mathbf 0, \mathbf y')$
4. $M \in G$ such that $(1, 1, \mathbf 0, \mathbf y')$ satisfying $P$ contains in its orbit a configuration $(1, 1, \mathbf 0, \mathbf 0)$

### But how do we find these moves?

Lemma: The homomorphism $\phi_{corner}: G \rightarrow S_8$ is _onto_.

Proof: $S_8$ is generated by the set of 2-cycles in the image of $\phi_{corner}$.  It suffices to show that $S \subset \langle \text{image}(\phi_{corner}) \rangle$. We know that $\text{image}(\phi_{corner})$ is a group, so $\langle \phi_{corner} \rangle = \text{image} \phi_{corner}$.  With this info, we want to show that every 2-cycle in $S_8$ is in the image of $\phi_{corner}.  One such move is $M_0 = (DRD'R'F)^3$ which has the disjoint cycle decomposition 

$$
(\sf dbr \; \sf urb)(\sf dbdr \; \sf rf)(\sf df \; \sf lf)
$$

Examining just the effects of the corner $\phi_{corner}(M_0) = (\sf dbr \; \sf urb)$, we know _at least_ this cycle exists in $\phi_{corner}$.  If we let $c_1, c_2$ be any pair of corner pieces, we know we can devise a move $M$ which sends $\sf dbr$ to $c_1$ and $\sf urb$ to $c_2$.  Letting $\sigma = \phi_{corner}(M)$, then $\sigma(\sf dbr) = c_1, \sigma(\sf urb) = c_1$.  Since $\phi_{corner}$ is a homomorphism:

$$
\begin{aligned}
\phi_{corner}(M'M_0M) &= \phi_{corner}(M)' \; \phi_{corner}(M_0) \; \phi_{corner}(M) \\

&= \sigma' (\sf drb \; \sf urb) \sigma \\
&= (\sigma(\sf drb \; \sf urb) \sigma(\sf urb)) \\
&= (c_1 \; c_2) \\

\\ \therefore \\ 

(c_1, c_2) &\in \text{image}(\phi_{corner})
\end{aligned}
$$

By the above proof, we _know_ that there exists a move $M \in G$ usch that $\phi_{corner}(M) = \sigma'$, so... $\mathcal C \circ M = (1, \tau', \mathbf x, \mathbf y)$ for some 

$$
\begin{aligned}

\tau' &\in S_{12}, \\ 
\mathbf x' &\in (\mathbb Z / 3\mathbb Z)^8, \\ 
\mathbf y' &\in (\mathbb Z / 2\mathbb Z)^{12}

\end{aligned}
$$

Queue EE Dee.

This... solves the cube.  Completing ThE tHeOrEm.  This proof also tells us that the demon number can be dodecimated from $2^{12}3^88!12!$ to $\frac{1}{12}$ of this number due to the elimination of invalid conigurations.  That's still about four quadrillion, but it's much better.



--- 

## Foonotes & References

[^1]: _God and Satan_, [Biffy Clyro](https://www.youtube.com/watch?v=RAtacHPAHLI).

[^2]: More on God's number here: http://cube20.org/. 

[^3]: [Notes on Information Theory](https://www.murphyandhislaw.com/blog/information-theory#wiley-2) (which includes some Group Theory).

[^4]: "Group Theory and the Rubik’s Cube."  [Janet Chen](https://people.math.harvard.edu/~jjchen/docs/Group%20Theory%20and%20the%20Rubik's%20Cube.pdf).

[^5]: There exist other cubes with face patterns that have center pieces with orientation (example).  For these cubes, we do need to consider the _orientation_ of the center pieces relative to their surrounding edges, but their positions are still fixed.  For even-dimensional cubes, those that do not have single, fixed-position center pieces some of the theorems relating to parity do not hold (as they're specified for the odd-dimensional cubes).  Nonetheless, commutators discussed later can still be applied to form the centers and solve resulting parity issues introduced by the absence of fixed centers.

[^6]: The number of bits needed to describe a piece's location is logarithmic in the number of pieces/positions it can inhabit: $2^3$  For each of the three spacial axes, we have 2 options: Up/Down, Left/Right, Front/Back.

[^7]: The WCA also treats 180º single face twists as just one move [(Article 12a1c)](https://www.worldcubeassociation.org/regulations/), but for the sake of our notation, you'll quickly see that it doesn't matter whether or not we treat 180º twists as one or two moves, since the composition of individual twists also constitute a single move.


[^8]: A note on extended notation: many cubers may also be familiar with middle slice moves $M$, lowercase moves $f$, and cube rotations $x,y,z$ and their respective inverses.  This expanded notation is more ergonomic to execute and semantic to read, but it's worth pointing out that each of these can be expressed in terms of primitives above as well as cube rotations which aren't really moves since they just change our view of the cube on the whole, but not the configuration of the pieces therein. 

  E.g. $M' \equiv LR'x$, $f \equiv B'y'$, etc. 
  
  Each of these extended notation moves produces the same configuration, regardless of the notation describing the moves. 


[^9]: With some practice, most folks who set out to learn the handful of algorithms needed to solve the standard cube with 2-Look Last Layer (link) can achieve a sub 30s average.  By "some practice" I mean like  two weekends, or a couple thousand solves.  It's not crazy hard if you're sufficiently motivated, but the advent of this intermediate method destroys expectations set by those who witnessed the birth of Erno Rubik's puzzle.  
  
  In his collection of essays to [_American Science_](https://ia600901.us.archive.org/22/items/MetamagicalThemas/Metamagical%20Themas%2C%20Hofstadter.pdf) , Douglas Hofstadter –yes, that one– writes of "There is a young Englander from Nottingham named Nicholas Hammond who has got his average solving time down to close to 30 seconds! Such a phenomenal performance calls for several skills" (pp. 140).  I disagree! With more advanced techniques, even a passive enthusiast can get their average solve time consistently below 15s. 

[^10]: Count to 519 quintillion and then tell me it isn't basically infinity, stfu. 

[^11]: We frequently refer to groups by just their setname once we've defined the group operation which we implicitly keep in mind.

[^12]: Another notational note, we also commonly express group operations as multiplication, e.g. as listed earlier,  $U^2 \equiv U'U'$, we interpret the righthand side as $U' \circ U'$.  Furthermore, exponentiation can be interpreted accordingly: $U^3 \equiv UUU \equiv U'$.

[^13]: I told you center pieces didn't count!

  We know that $\mathbb P \subset G$, so every $M \in \mathbb P$ satisfies the property that "$M$ leaves all the center pieces in their cubicles."  If $M_1, M_2 \in G$ have this property, then their composition $M_1 \circ M_2$ also has this property, and since $\langle \mathbb P \rangle$ generates $G$, every element of $G$ also has this property.  So, **no sequence of legal moves actually displaces the centers from their cubicles.**
  
  The point of this note is to show that by studying the properties of the six basic moves and their inverses, rather than all 519 quintillion moves, we can extract a lot of information about the nature of the cube. 
  

[^14]: It's commonly executed $R'D'RD$ with the "target" corner in the $\sf urf$ cubicle.

[^15]: If you don't have a cube on hand, you can convince yourself with an online [simulator](https://rubikscu.be/) which allows you to input a sequence of moves.