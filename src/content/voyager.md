---
title: "40 | Voyager 2"
date: "2022-07-09"
description: "Information Theory, Error Correcting Codes"
path: "/blog/voyager-2"
---

<style>

    @keyframes colorTransition {
        from { background-color: white;}
        to { background-color: #6666ff;}
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

> Less morose and more present.  Dwell on my gifts for a second
> 
> A moment one solar flare would consume, so why not
> 
> Spin this flammable paper on the film that's my life

![](https://voyager.jpl.nasa.gov/assets/images/posters/grand_tour.jpg)

# Introduction

The date is July 9th, 1979.  You are the Voyager 2 space craft, and for the past 23 months, you have been _voyaging_ towards the outer planets of Earth's solar system.  Cape Canaveral is over 440 million miles away and growing about half a million miles[^1] more distant every “day,” but mankind has never been closer to Europa.  Europa looks dope btw.

![](https://www.researchgate.net/profile/Richard-Hoover-3/publication/328682910/figure/fig2/AS:688314826887169@1541118451354/Voyager-2-image-of-the-Jovian-satellite-Europa-The-dark-lines-are-brownish-in-color-and.ppm)

As with your twin craft on an exploratory mission of the same name, you are outfitted with numerous instruments for measuring the phenomena of the furthest reaches of our planetary system, including magnetic fields, low energy charged particles, cosmic rays, plasma, and plasmatic waves.  You’re also equipped with several cameras for capturing images of celestial bodies:

![](/images/voyager-1.png)

– Oh, and a Golden Record containing, amongst other things, a playlist curated by Carl Sagan himself.  The images you capture will remain unparalleled in quality until the launch of the Hubble telescope, which won’t happen for another decade.  You are the king of space exploration.

However, considering the technological constraints of your mission’s birth in 1972, your brain is _reaaally_ small.  So small that you can barely remember the first sentence of this exposition.  _Perhaps that’s an exaggeration_, but you’re only working with about 70kb of memory which isn’t even enough to store a novel.  It’s no help that despite the success of your predecessors, like the Apollo 11 mission, Tricky Dicky has cut funding to your program. 

<details>
  <summary><strong><u class="my-link">NASA's Response to Richard Nixon Slashing Funding</u></strong></summary>
  
  <video width="360" height="240" controls>
  <source src="/images/NASA_response.mp4" type="video/mp4">
</details>

<br>

All this to say that you’re firing on all cylinders, transmitting observed measurements and images in real time, as you encounter them, lest you forget.

Telemtry takes place via a ~~3.7 meter~~ 14 foot high-gain antenna (HGA), which can send and receive data at a smooth 160 bits/second.  Transmission is pretty much _all-or-nothing_, though, since your memory-span is as competitive as triceratops' or another maastrichtian creature of comparable synaptic ELO.  There’s no retry protocol, you’ve already forgotten your name, and you’re hurtling through space faster than any prior man made object.  No takesies backsies.  No do-overs. And certainly no exponential backoff.

Among the numerous tried and true scapegoats which software engineers so often leverage when their code inevitably malfunctions are 🔥 cosmic ray bit flips 🔥.  "How could I, _in my infinite wisdom_, have produced illogical behavior within my program.  Nay, ’twas the sun who hath smited mine server farm and flipped the bits just so."  (The anthropomorphisation of inanimate objects isn't going away any time soon). And, of course, there’s the obligatory relevant xkcd:

![](https://imgs.xkcd.com/comics/real_programmers.png)

But in _**OUTER SPACE**_, where part of the goal of the mission is to _measure_ cosmic rays, said cosmic rays are slighlty more prevalent.  Bit flips are bound to happen at some point during the ~16 hour transit from the HGA back to Houston.  And the engineers at NASA knew this to be the case before sending their half-a-billion dollar reconnaisance babies out into the wild.  **How, then, is the integrity of the data preserved?**

# Information Theory: Forward Correction 

Luckily, with their backs against the wall, and Nixon's cronies looking for a reason to scuff the entire program,[^2] NASA did not have to also invent the wheel of Error Correcting Codes.  Much of the groundwork of this realm of Information Theory had already been laid by Claude Shannon, John Hamming, and other bright minds of Bell Research and Signal Corps Laboratories.  I have a few other ever-growing posts on Information Theory which house the supporting research for this post in particular, which go into more depth about what error correcting codes are and how they work. But the relevant bits have been included here, since that's kind of like the whole purpose.  

In order to ensure that the information being beamed across the galaxy didn't get nuked in transit like leftovers in a microwave, the signals were encoded with additional data which offered some guarantees about allowable rates of error and mechanisms for correcting those errors.  They employed a **Golay Encoding**, an extension of a **Hamming Code**, which is perhaps the most famous of binary error correction mechanisms.  To understand how they work, let's start with some definitions and terminology.

## Definitions

### Error Control Codes 

**Error Control Codes** are comprised of error _detection_ and error _correction_, where an error is any bit in a message sequence which differs from its intended position.  For example, our message $m$ might be $[1, 0, 1, 0]$ and an error in this message might manifest as a pesky bit flip in the 3rd position: $m' = [1, 0, \color{red}0\color{black}, 0]$.

### Entropy

Error is intrinsically related to **Entropy**, which is a measure of _average uncertainty_ about random variables. 
- For a discrete random variable $X \in \{0, 1\}$, the information conveyed by observing an outcome $x$ is $-\log_2 P(X=x)$ bits.
- If $P(X=1)=1$, an outcome of 1 is certain, then observing $X=1$ yields $- \log_2(1) = 0$ bits of information.
- Conversely, observing $X=0$ in this case yields $- \log_2(0) = \infty$; a total surprise at observing an impossible outcome

### Noiseless Coding Theorem

Shannon's **Noiseless Coding Theorem** states that given $n$ independent and identically distributed random variables, each with entropy $H(x)$: 
- $H(x)$ can be compressed into $n(H(x) + \epsilon)$ bits with negligible loss
- or alternatively compressed into  $n(H(x) - \epsilon)$ bits entailing certain loss
- Given a noisy communication channel, a message of $k$ bits output by a source coder (like our HGA), the theorem states that every such channel has a precisely defined real numbered **capacity** that quantifies the maximum rate of reliable communication

In other words, provided that the rate $R$ of transmission is less than the channel capacity $C$, there exists a code such that the probability of error can be made arbitrarily small

### Code 

An error correcting **code** $C$ of length $n$ over a finite alphabet $\Sigma$ is a subset of $\Sigma^n$.  
- Elements of $C$ are codewords in $C$
- The alphabet of $C$ is $\Sigma$, and if $|\Sigma| = q$, we say that $C$ is $q$-ary (binary, ternary, etc.)
- The length $n$ of codewords in $C$ is called the **block length** of $C$
- Associated with a code is also an encoding map $E$ which maps the message set $\mathcal M$, identified in some canonical way with $\{1, 2, ..., |C| \}$ to codewords in $\Sigma^n$
  - The code is then the image of the encoding map

### Rate 

Given a noisy channel with a capacity $C$, if information is transmitted at **rate** $R$ (meaning $k=nR$ message bits are transmitted in $n$ uses of the channel), then 
- if $R < C$, there exist coding schemes (encoding and decoding pairs) that guarantee negligible probability of miscommunication, 
- whereas if $R > C$, then –regardless of a coding scheme– the probability of an error at the receiver is bounded below some constant (which increases with $R$, exponentially in $k$)

The rate of a code can also be understood in terms of the amount of redundancy it introduces.

$$
R(C) = \frac{\log |C|}{n \log |\Sigma^n|}
$$

which is the amount of non-redundant information per bit in codewords of a code $C$, not to be confused with capacity.
- The dimension of $C$ is given by $\frac{\log |C|}{\log |\Sigma^n|}$
- A $q$-ary code of dimension $\ell$ has $q^\ell$ codewords
  
### Distance

The **Hamming Distance** between two strings $x,y$ of the same length over the alphabet $\Sigma$ is denoted $\Delta(x,y)$  and defined as the number of positions at which $x$ and $y$ differ:

$$
\Delta(x,y) = |\{ i | x_i \neq y_i\}| 
$$
The fractional or relative Hamming distance between $x,y \in \Sigma^n$ is given by 

$$
\delta(x,y) = \frac{\Delta(x,y)}{n}
$$

The **distance** of an error correcting code is the measurement of error resilience quantified in terms of how many errors need to be introduced to confuse one codeword with another
- The minimum distance of a code $C$ denoted $\Delta(C)$ is the minimum Hamming distance between two distinct codewords of $C$: 

$$
    \Delta(C) = \min\limits_{{c_1, c_2 \in C \atop c_1 \neq c_2}} \Delta(c_1, c_2) \\
    
$$

- For every pair of distinct codewords in $C$, the Hamming distance is at least $\Delta(C)$
- The relative distance of $C$ denoted $\delta(C)$ is the normalized quantity $\frac{\Delta(C)}{n}$ where $n$ is the block length of $C$. Thus, any two codewords of $C$ differ in at least a fraction of $\delta(C)$ positions
- For example, the parity check code, which maps $k$ bits to $k+1$ bits by appending the parity of the message bits, is an example of a distance 2 code with rate $k/(k+1)$ 

### Hamming Weight

The **Hamming Weight** is the number of non-zero symbols in a string $x$ over alphabet $\Sigma$ 

$$
\begin{aligned}
	w(x) &= |\{ i | x_i \neq 0 \}| \\ 
	w(x-y) &= \Delta(x, y)
\end{aligned}
$$

### Hamming Ball

A **Hamming Ball** is given by the radius $r$ around a string $x \in \Sigma^n$ given by the set 

$$
\{y \in \Sigma^n | \Delta(x,y) \leq r\}
$$

### Properties of Codes

1. $C$ has a minimum distance of $2t + 1$
2. $C$ can be used to correct all $t$ symbol errors
3. $C$ can be used to detect all $2t$ symbol errors
4. $C$ can be used to correct all $2t$ symbol _erasures_ – that is, some symbols are erased and we can determine the locations of all erasures and fill them in using filled position and the redundancy code

--- 

## An Aside About Galois Fields

A significant portion of the discussion surrounding error correcting codes takes place within the context of **Fields** which sound more imposing than they actually are.

A **finite** or **Galois Field** is a finite set on which addition, subtraction, multiplicaiton, and division are defined and correspond to the same operations on rational and real numbers.

- A field is denoted as $\mathbb F_q$, where $q$ is a the **order** or size of the field given by the number of elements within 
  - A finite field of order $q$ exists if and only if $q$ is a prime power $p^k$, where $p$ is prime and $k$ is a positive integer
  - In a field of order $p^k$, adding $p$ copies of any element always results in zero, meaning tat the characteristic of the field is $p$
  - All fields of order $q = p^k$ are isomorphic, so we can unambiguously refer to them as $\mathbb F_q$ 
- $\mathbb F_q$, then, is the field with the least number of elements and is said to be unique if the additive and multiplicative identities are denoted $0, 1$ respectively

They should be pretty familiar for use in bitwise logic as these identities correspond to modulo 2 arithmetic and the boolean exclusive OR operation:

<div style=“block”>

| $\pm$ | 0 | 1 |
|---|--|----|
| 0 | 0 | 1 |
| 1 | 1 | 0 |

</div>

 
|XOR|AND|
|--|--|
|<table><tr><th>±</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>0</td></tr> </table> | <table><tr><th>x</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>1</td></tr> </table> |

Other properties of binary fields
- Every element $x$ of $\mathbb F_2$ satisfies $x + x = 0; \;-x = x$ 
- Every element $x$ of $\mathbb F_2$ satisfies $x^2 = 0$  

---

## Error Correction and Detection: Naive Approaches

There are numerous trivial means of encoding information in an effort to preserve its integrity.  Some are better than others.  

### Repetition Code

A **repetition code**, denoted $(n, k)$ where $n$ is odd is a code obtained by repeating the input of length $k$-bits $n$ times in the output codeword.  That is, the codeword representing the input 0 is a block of $n$ zeros and likewise for the codeword representing the input 1. 

The code $C$ consists of the set of the two codewords:

$$
C = \{[0, 0, ..., 0], [1, 1, ..., 1] \} \subset \mathbb F_2^n
$$

If $m$ is our desired message, the corresponding codeword is then 

$$
c = [\underbrace{m, m, ...., m}_{n \text{ copies}} ]
$$

The rate of such a code is _abysmal_.

### Parity Check

A simple Parity-bit Check code uses an additional bit denoting the even or odd parity of a messages Hamming Weight which is appended to the message to serve as a mechanism for error detection (but not correction since it provides no means of determing the position of error). 

- Such methods are inadeqaute for multi-bit errors of matching parity e.g., 2 bit flips might still pass a parity check, despite a corrupted message

| data | Hamming Weight | Code (even parity) | odd |
|------|------------------| --------------------|-----|
| $0000000$ | 0 | $0000000\color{red}{0}$ | $\color{red}{1}$ |
| $1010001$ | 3 | $1010001\color{red}{1}$ |$\color{red}{0}$ |
| $1101001$ | 4 | $1101001\color{red}{0}$ | $\color{red}{1}$ |
| $1111111$ | 7 | $1111111\color{red}{1}$ | $\color{red}{0}$ |

#### Application 

- Suppose Alice wants to send a message $m=1001$
- She computes the parity of her message $p_{even}(m) = 1+ 0 + 0 + 0 + 1 (\mod 2) = 0$
- And appends it to her message: $m’ = m ||  p(m) = 10010$ 
- And transmits it to Bob $A \xrightarrow{m’} B$
- Bob recieves $m’$ with questionable integrity and computes the parity for himself: 
  
$$
1+ 0 + 0 + 0 + 1 + 0(\mod 2) = 0
$$ 

and observes the expected even-parity result.  

If, instead, the message were corrupted in transit such that 

$$
m' = 10\color{red}1\color{black}10
$$

then Bob's parity check would detect the error:

$$
1+ 0 + 0 + \color{red} 1\color{black} + 1 + 0(\mod 2) = 1 \neq 0
$$ 

and Bob would curse the skies for flipping his bits. This same process works under and odd-parity scheme as well, by checking the mod 2 sum of Hamming Weight of the message against 1 instead of 0.
  
### Interleaving 

**Interleaving** is a means of distributing burst errors over a message.  A **burst error** is an error which affects a neighborhood of bits in a message sequence, rather than just a single position.  

For example, if we have a message:

$$
m = [m_1, m_2, m_3, ..., m_{16}]
$$

which is struck by a particularly beefy cosmic ray such that a range of positions are affected: 

$$
m' = [m_1, m_2, m_3, \color{red} m_4 \color{black},\color{red} m_5 \color{black},\color{red} m_6\color{black},\color{red} m_7 \color{black}, m_8,..., m_{16}]
$$

By arranging the message in a matrix, transposing it, then unwrapping the matrix back into a vector, an effect analogous to cryptographic diffusion is achieved:

$$
M = \begin{bmatrix} 
                m_1 &             m_2 &             m_3 & \color{red} m_4 \\
    \color{red} m_5 & \color{red} m_6 & \color{red} m_7 & m_8             \\
    m_9             & m_{10}          & m_{11}          & m_{12}          \\
    m_{13}          & m_{14}          & m_{15}          & m_{16}          \\
    \end{bmatrix} \implies

M^T = \begin{bmatrix} 
    m_1             & m_5             & m_9                & \color{red} m_{13} \\
    \color{red} m_2  & \color{red} m_6& \color{red} m_{10} &  m_{14}             \\
    m_3             & m_{7}           & m_{11}             & m_{15}             \\
    m_{4}           & m_{8}           & m_{12}             & m_{16}             \\
    \end{bmatrix} \\   
    

\begin{aligned}
\\m^T &= [1, 5, 9, \color{red}13 \color{black},\color{red} 2\color{black},\color{red} 6\color{black},\color{red} 10 \color{black}, 14, 3, 7, 11, 15, 4, 8, 12, 16] \\

m &= [1, \color{red} 2 \color{black}, 3, 4, 5, \color{red}6 \color{black}, 7, 8, 9, \color{red}10 \color{black}, 11, 12, \color{red}13 \color{black}, 14, 15, 16] \\

\end{aligned}
$$


thus distributing the error across the message, making it easier to recover the complete message (lots of "small" errors are preferable to one gaping hole in our data as we'll see shortly).

## Error Correction and Detection: Better Approaches

### Hamming Codes

Hamming Codes are the most prevalent of _more sophisticated_ mechanisms for error correction and detection. A $q$-ary code block of length $n$ and dimension $k$ is referred to as an $[n, k]_q$ code.
- If the code has distance $d$, it may be expressed as $[n, k, d]_q$ and when the alphabet size is obvious or irrelevant, the subscript may be ommitted

The simplest **Full Hamming Code** is $[3, 1, 3]_2$ and can be represented geometrically as a cube where the two code words are opposite vertices:

![](/images/voyager-2.png)

Opposite corners are necessarily three edges away from each other per this code's Hamming Ball property.  We have two codewords which we assume are accurate ($000$, $111$) representing our 1-bit message, and label all the other corners with "what we might get" if one of the bits gets corrupted. 


<details>
  <summary><u class="my-link"><em>"But Peter,"</em> you might say, <em>"that's not a sphere, that's a cube."</em></u></summary>
  
  Go fuck yourself: 

![](/images/it-4.png)
</details>

<br>

To decode, we take the correct message to correspond to the majority of the bits in our codeword.  The corners adjacent to codeword $000$ are $001, 010, 100$.  If we "round" according to the majority of bits present, we preserve our target message of $0$.

This code is **"perfect"** since each corner is used as either a target $\{``000", ``111" \}$ or a correction vector.  If the receiver of an encoded message observes a correction vector, the decoding component will select the nearest composite codeword target.

The next full Hamming Codes are $[7, 4, 3]$ and $[15, 11, 3]$, the former of which is also perfect on a 7-dimensional hypercube.  Note that the degree of accuracy of all three of these codes $3, 7, 15, ...$ are all $2^n - 1$, that is, one less than a power of 2.

## Linear Codes and Generator Matrices

General codes may have no structure as we've seen above, but of particular interest to us are code with an additional structure called **Linear Codes**. 

If $\Sigma$ is a field and $C \subset \Sigma^n$ is a subspace of $\Sigma^n$ then $C$ is said to be a Linear Code.  As $C$ is a subspace, there exists a basis $c_1, c_2, ..., c_k$ where $k$ is the dimension of the subspace.  Any codeword can be expressed as the linear combination of these basis vecors.  We can write these vectors in matrix form as the columns of an $n \times k$ matrix which is called a **Generator Matrix**.

Hamming Codes can be understood by the structure of their corresponding parity-check matrices which allow us to generalize them to codes of larger lengths. 

$C_\text{Ham}$ = $[7,4,3]_2$ is a Hamming Code using the Generator Matrix $G$, and a parity matrix $H$:

$$
 G = \begin{bmatrix}
   1 & 0 & 0 & 0 \\
   0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1 \\
   0 & 1 & 1 & 1 \\
   1 & 0 & 1 & 1 \\
   1 & 1 & 0 & 1 \\
\end{bmatrix}, 

\qquad 

H = \begin{array}{rcl} 
    &\begin{array}{c}
        \color{red}1  \ \ \ \  2 \ \ \ \  3  \ \ \ \ 4 \ \ \ \ 5 \ \ \ \ 6 \ \ \ \ 7 
    \end{array} \\ 
    
    &\begin{bmatrix}
        0 & 0 & 0 & 1 & 1 & 1 & 1 \\
        0 & 1 & 1 & 0 & 0 & 1 & 1 \\
        1 & 0 & 1 & 0 & 1 & 0 & 1 \\
    \end{bmatrix}
\end{array}
$$

and we can see that $HG = \mathbf 0$, which means that if a message is encoded with $G$ yield $Gx$ and the product against the parity-check matrix is _not_ 0, we know that we have an error, and we can not only deduce the location of the error, but also _correct_ it.

#### Linear Construction

The original presentation of the Hamming code was offered by guess-who in 1949 to correct 1-bit errors using fewer redundant bits.  Chunks of 4 information bits $x_1, x_2, x_3, x_4$ get mapped to ("encoded") a codeword of 7 bits as 

$$
x_1, x_2, x_3, x_4, \\ x_2 \oplus x_3 \oplus x_4, \\ x_1 \oplus x_3 \oplus x_4,
\\ x_1 \oplus x_2 \oplus x_4
$$

which can be equivalently represented as a mapping from $x$ to $Gx$ (operations performed $\mod 2$) where $x$ is the column vector $[x_1x_2x_3x_4]^T$ and $G$ is the matrix 

$$
G = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0 \\
        0 & 0 & 1 & 0 \\
        0 & 0 & 0 & 1 \\
        0 & 1 & 1 & 1 \\
        1 & 0 & 1 & 1 \\
        1 & 1 & 0 & 1 
    \end{bmatrix}
$$

Two distinct 4-bit vectors $x,y$ get mapped to the codewords $Gx, Gy$ which differ in the last 3 bits.  This code can correct all single bit-flip errors since, for any 7-bit vector, there is at most one codeword which can be obtained by a single bit flip.  For any $y \in \{0,1 \}^7$ which is not a codeword, there is always a codeword which can be obtained by a single bit flip.


#### Graph Construction

A **Wolf trellis** for a Hamming Code is a graph associated with a block of a given called.  Paths on the graph correspond to vectors $\mathbf v$ that satisfy the parity check condition $\mathbf vH^T = \mathbf 0$.  The trellis states at the $k$th stage are obtained by taking all possible binary linear combinations of the first $k$ columns of $H$.  The **Viterbi Algorithm** for decoding this representation finds the best path through the graph.

This is the Wolf trellis for the above $[7,4,3]_2$ Hamming Code:

![](/images/it-8.png)

#### Mogul 

I'm just going to come out and say it.  John Conway was a lizard man with an unparalled case of chronic pattern-matching-brain.  The man was of a different breed; the opposite of a maastrichtian.

Legend has it that a collegial IEEE Fellow of Conway's saw him dominating the schoolyard children in various games of *Turning Turtles* and *Dots and Boxes* and said "I bet you can't turn that into a Binary Lexicode of $[n \leq 44, k, d \leq10]_2$" to which Conway famously responded "Hold my beer."[^6]

Attached for the author's amusement is an image of this _absurd_ paper:

![](/images/it-9.png)

Madlad. Conway and Sloane showed that winning positions of a game of Mogal can be used to construct a Golay Code. 

> a position in Mogul is a row of 24 coins. Each turn consists of flipping from one to seven coins such that the leftmost of the flipped coins goes from head to tail. The losing positions are those with no legal move. If heads are interpreted as 1 and tails as 0 then moving to a codeword from the extended binary Golay code guarantees it will be possible to force a win.

## Correcting Single Errors with Hamming codes

Suppose that $y$ is a corrupted version of some unknown codeword $c \in C$ with a single error (bit flip).  We know that by the distance property of $C_\text{Ham}$, $c$ is uniquely determined by $y$.  We could determine $c$ by flipping each bit of $y$ and check if the resulting vector is in the null space of $H$ 
- Recall that the nullspace of a matrix $A$ is the set of all $n$-dimensional column vectors $x$ such that $Ax = \mathbf 0$ 

However, a more efficient correction can be performed.  We know that $y = c + e_i$, where $e_i$ is the column vector of all zeros except for a single 1 in the $i$th position.  Note that $Hy = H(c+ e_i) = Hc + He_i =$ the $i$th column of $H$ which is the binary representation of $i$, and thus this recovers the location $i$ of the error. We  say that $Hy$ is the **_syndrome_** of $y$. 

### Examples of Hamming Codes
- $[n, n-1, 2]_2$ corresponds to the binary parity check code consisting of all vectors in $\mathbb F_2^n$ of even Hamming Weight
- $[n, 1, n]_2$ is a binary repetition code consisting of the two vectors $\mathbf 0^n, \mathbf 1^n$
- $[7,4,3]_2$ is the linear Hamming Code discussed above

While fascinating, these codes can only correct 1 error, so a more robust code may be needed.  

#### Perfect Codes

There are a few perfect binary codes:
- The Hamming Code $C^{(r)}_\text{Ham}$ 
- The Golay Code
- The trivial codes consistng of just 1 codeword, or the whole space, or the repetition code $\{0^n, 1^n\}$ for odd $n$

## The Golay Code

Like other Hamming Codes, the Golay Code can be constructed in a number of ways.  A popular construction of $\text{Gol}_{23}$ consists of 

$$
(c_0, c_1, ..., c_{22}) \in \{0,1\}^{23}
$$ 

when  the polynomial $c(X) = c_0X^0 + c_1X^1 + ... +c_{22}X^{22}$ is divisible by 

$$
g(X) = X^{11} + X^9 + X^7 + X^6 + X^5 + X +1 
$$ 

in the ring $\mathbb F[X]/(X^{23}-1)$.  "The Ring" here is just a generalization of a Galois field with some additional properties.  It is sufficient to think of it as a field with $\mod 2$ operations.

The seminal paper on this code was initially published by Marcel Golay in 1949 in an effort to devise a lossless binary coding scheme under a repetition constraint (i.e. all or nothing, no retries).  It extends Claude Shannon's 7-block example to the case of any $2^n-1$ binary string. When encoding a message, the $n$ redundant symbols $x_m$ are determined in terms of the message symbols $Y_k$ from the congruent relations:

$$
E_m \equiv x_m + \sum_{k=1}^{k_m(p^n-1)/(p-1)-n} a_{mk} / Y_k \equiv 0 (\mod p)
$$

In decoding, the $E$'s are recalculated with the recieved symbols, and their ensemble forms a number on the base $p$ which determines unequivocally the transmitted symbol and its correction.

This approach can be generalized from $n \rightarrow n+1$ via a matrix of $n$ rows and $p^n-1/p-1$ columns formed with the coefficients of the $X$'s and $Y$'s in the expression above related $p$ times horizontally, while an $n+1$st row added –consisting of $p^n-1/p-1$ zeroes, followed by as many ones up to $p-1$; an added column of $n$ zeroes with a one for the lowest term completes the matrix for $n+1$.[^3]

The coding scheme below for 23 binary symbols and a max of 3 transmission errors yields a power saving of $1 \frac{1}{2}$ db for vanishing probabilities of errors, and approaches 3 db for increasing $n$'s of blocks of $2^n-1$ binary blocks, and decreasing probailities of error, but loss is always encountered for $n=3$.

$$

\begin{aligned} 
\begin{array}{rcl} 
	&\begin{array}{c} 1 \ \ \ \ 2 \ \ \ \ 3 \ \ \ \ 5 \ \ \ \ 6  \ \ \ \ 7  \ \ \ \ 8  \ \ \ \ 9  \ \ \ \ 10  \ \ \ \ 11  \ \ \ \ 12 \end{array} \\

	\begin{matrix}
	    1 \\ 
	    2 \\ 
	    3 \\ 
	    4 \\ 
	    5 \\ 
	    6 \\ 
	    7 \\ 
	    8 \\ 
	    9 \\ 
	    10 \\ 
	    11 
	\end{matrix}

	\hspace{-1em} 

	&\begin{bmatrix}
	    1 & 0 & 0 & 1 & 1 & 1 & 0 & 0 & 0 & 1 & 1 & 1 \\ 
	    1 & 0 & 1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 & 0 & 1 \\
	    1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 & 1 & 0 & 1 & 0 \\
	    1 & 0 & 1 & 1 & 1 & 0 & 1 & 1 & 0 & 1 & 0 & 0 \\
	    1 & 1 & 0 & 0 & 1 & 1 & 1 & 0 & 1 & 1 & 0 & 0 \\
	    1 & 1 & 0 & 1 & 0 & 1 & 1 & 1 & 0 & 0 & 0 & 1 \\
	    1 & 1 & 0 & 1 & 1 & 0 & 0 & 1 & 1 & 0 & 1 & 0 \\
	    1 & 1 & 1 & 0 & 0 & 1 & 0 & 1 & 0 & 1 & 1 & 0 \\
	    1 & 1 & 1 & 0 & 1 & 0 & 1 & 0 & 0 & 0 & 1 & 1 \\
	    1 & 1 & 1 & 1 & 0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 \\
	    0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\
	     
	    
	\end{bmatrix}
	

\end{array}
\end{aligned}
$$

### Using Golay Codes

The Golay Code consists of 12 information bits and 11 parity bits, resulting in a Hamming distance of 7: $[23, 12, 7]_2$.

Given a data stream, we partition our information into 12-bit chunks and encode each as a codeword using special Hamming Polynomials:

$$
\begin{aligned}
    X^{11} + X^9 + X^7 + X^6 + X^5 + X + 1 &= \color{blue} 101011100011 \\
    X^{11} + X^{10} + X^6 + X^5 + X^4 + X^2 + 1 &= \color{blue} 110001110101 \\
\end{aligned}    
$$

We'll define our data as a trivial message of convenient length 12: 

$$
m = \color{red}101010101010
$$

We append 11 zero bits to the right of our data block:

$$
\begin{aligned}
m' &= m || \mathbf 0^{11} \\
   &= \color{red}  \underbrace{\color{red}101010101010}_{\color{black}12} \color{black} \; \underbrace{00000000000}_{11}
\end{aligned}
$$

 and perform division on the polynomial via the bitwise XOR operation:

$$
\begin{array}{cc}

    \color{red} 1 & \color{red} 0 & \color{red} 1 & \color{red} 0 & \color{red} 1 & \color{red} 0 & \color{red} 1 & \color{red} 0 & \color{red} 1 & \color{red} 0 & \color{red} 1 & \color{red} 0 & \color{black} 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 &  \\

    \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{black} \downarrow & \downarrow & \downarrow & \downarrow & \downarrow & | & | & | & | & | & | &  \\ \hline % good

    0 & 0 & 0 & 0 & 0 & | 1 & 0 & 0 & 1 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & | & | & | & | & | & | \\ % good

    & & & & & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \downarrow & \downarrow & | & | & | & |  \\ \hline % good

    & & & & & 0 & 0 & | 1 & 1 & 1 & 1 & 0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 & | & | & |& |  \\ % good
    
    & & & & & & & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \downarrow & | & | & |  \\ \hline % good

    & & & & & & & 0 & | 1 & 0 & 1 & 1 & 1 & 1 & 0 & 1 & 1 & 1 & 1 & 0  & | & | & | \\ % good
    & & & & & & &   & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \downarrow & \downarrow & \downarrow  \\ \hline % good

    & & & & & & & & 0 & 0 & 0 & | 1 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 1 & 0 & 0 & 0 \\ % good
    & & & & & & & & & & & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1   \\ \hline % good

    & & & & & & & & & & & 0 & \color{green} 0 & \color{green}1 & \color{green}1 & \color{green}0 & \color{green}0 & \color{green}0 & \color{green}0 & \color{green}1 & \color{green}0 & \color{green}1 & \color{green}1 \\ % good
\end{array}
$$
[^4]

Thus, $m' / h \mod 2$ yields $\color{green}1100001011$: the **syndrome** of the message.  The 11-bit zero vector is replaced with the syndrome, and if decoded with a Hamming polynomial the resultant syndrome or remainder will be 0:

$$
\color{red}101010101010 \; \color{green}01100001011 \color{black}/ \color{blue} 101011100011\color{black} = 0 \mod 2
$$

A 1-bit error in transmission such as 

$$
\color{red}101010101010 \; \color{green}0\color{black}\underset{\uparrow}{0}\color{green}100001011 \color{black} / \color{blue} 101011100011\color{black} = 00\color{red}1\color{black}00000000
$$

would have a syndrome of 1.  

However, syndrome should not be construed as proportionate to magnitude of error.  A 1-bit error in the information bits yields a syndrome of 7: 

$$
\color{red}101\color{black}\underset{\uparrow}{1}\color{red}10101010 \; \color{green}0\color{green}100001011 \color{black} / \color{blue} 101011100011\color{black} = \color{red}11\color{black}000\color{red}11\color{black}0\color{red}11
$$

An algorithm for decoding the parity bits of a Golay Code is as follows:
1. Compute the syndrome $\hat{s}$ of the codeword.  If it is 0, then no errors exist, and proceed to (5).
2. If $w(\hat{s}) \leq n = 3$, the syndrome matches the error pattern bit-for-bit and can be used to XOR the errors out of the codeword.  If possible, remove errors and toggle back the _toggled bit_ and proceed to (5).
3. Toggle a trial bit in the codeword to eliminate one bit error.  Restore any previously toggled trial bit.  Proceed to (4), else return to (2) with $n=2$.
4. Rotate the codeword cyclically left by 1 bit and go to (1)
5. Rotate the codeword back to its initial position.

## How to Actually Beam Them Up, Scotty?

_"Okay but how do these encodings actually get transmitted?  I mean we're talking about space here, not an IRC channel."_

**Binary Phase-Shift Keying** is a technique for mapping a binary sequence to a waveform for transmission over a channel.  Given a binary sequence $\{..., b_{-2}, b_{-1}, b_{0}, b_{1}, b_{2}, ... \}$, we map the set $\{0, 1\} \rarr \{-1, 1\}$ via 

$$
\tilde{b}_i = (2b_i - 1) \text{ or }\tilde{b}_i = -(2b_i - 1)
$$

We also have $a_i = \sqrt{E_b}(2b_i -1) = -\sqrt{E_b}(-1)^{b_i} = \sqrt{E_b}\hat{b}_i$, a mapping of a bit $b_i$ or ($\hat{b}_i$) to a signal amplitude that multiplies a waveform $\varphi_1(t)$ which is a unit-energy signal:

$$
\int^\infty_{-\infty} \varphi_1(t)^2dt = 1
$$

over $[0, T)$.  $E_b$ is the amount of energy required to transmit a single bit across the channel. A bit $b_i$ arriving at $iT$ can be represented as the signal $a_i\varphi_1(t - iT)$ where the energy required to transmit the bit $b_i$ is given by

$$
\int^\infty_{-\infty} (a_i \varphi_1(t))^2 dt = E_b
$$

The transmitted signal $\pm \sqrt{E_b}\varphi_1(t)$ are points $\pm \sqrt{E_b}$ in a (for our purposes: one-) dimensional signal space on the unit-energy $\varphi_1$ axis

![](/images/it-1.png)

such that a sequence of bits $[1,1,0,1,0]$ can be expressed as a waveform[^5]:

![](/images/it-2.png)

We can expand this representation to two dimensions by introducing another signal $\varphi_2(t)$ and modulating the two to establish a **signal constellation**.  Let $M = 2^m; m \in \mathbb Z$, be the number of points in a constellation.  $M$-ary transmission is obtained by placing $M$ points $\mathcal{S} = \{(a_{1k}, a_{2k}), k = 0, 1, ..., M-1 \}$ in this signal space and assigning each point a unique pattern of $m$ bits.

![](/images/it-3.png)

Once our message has been encoded for error correction, and further transformed via signal constellation $\mathcal S$ into a waveform, it must be read by a receiver somewhere.  We call the transmitted value $\mathbf S \in \mathcal S$, chosen with prior probability $P(\mathbf S=s)$.  The receiver uses the received point $\mathbf R =r$ to determine what value to acsribe to the signal. This estimated decision is denoted

$$
\hat s = \begin{bmatrix} \hat a_1 \\ \hat a_2\end{bmatrix} \in \mathcal S
$$

and is used to determine the likelihood of observing a signal given a received data point $P(s | r)$.  The decision rule which minimizes the probability of error is to choose $\hat s$ to be the value of $s$ which maximizes $P(s | r)$, where the possible values of $s$ are those in the signal constellation:

$$
\begin{aligned}
    \hat s &= \arg \max \limits_{s \in \mathcal S} \;P(s | r) \\
\tag{Bayes' rule} &= \arg \max \limits_{s \in \mathcal S} \;\frac{p_{R | S}(r | s)P(s)}{p_R(r)}
\end{aligned}
$$

Since the denominator of this expression does not depend on $s$, we can further simplify:

$$
= \arg \max \limits_{s \in \mathcal S}\; p_{R | S}(r | s)P(s)
$$

leaving us with the **Maximum _A Posteriori_** decision rule.  And, in the case that all priors are equal (as we assume with our binary code), this can also be further simplified to a **Maximum Likelihood** decision rule:

$$
\hat s = \arg \max \limits_{s \in \mathcal S} \;p_{R | S}(r | s)
$$.

Once the decision $\hat s$ is made, the corresponding bits are determined by the constellation; the output of the receiver is a maximum likelihood estimate of the actual bits transmitted.  $\hat s$ is selected to be the closest point according to Euclidian distance $\parallel r - \hat s^2 \parallel$.  

The "raw" signal distributions are dueling Gaussians about the corresponding mean measurements of $b \in \{0, 1\}$ under our projections to $\hat{b} \in \{-1, 1\}$. 

$$
p(r|s=\sqrt{E_b}) = \frac{1}{2 \pi}e^{-\frac{1}{2 \sigma^2}(r - \sqrt{E_b})^2} \\ 
p(r|s=-\sqrt{E_b}) = \frac{1}{2 \pi}e^{-\frac{1}{2 \sigma^2}(r + \sqrt{E_b})^2}
$$

![](/images/it-5.png)

and the weighted conditional densities of the Maximum A Posteriori decision rule distribution resemble:

![](/images/it-6.png)

where $\tau$ is threshold at which 

$$
p(r|s =\sqrt{E_b})P(s=\sqrt{E_b}) = p(r|s = -\sqrt{E_b})P(s=-\sqrt{E_b})
$$

which, when met or exceeded, implies that our decision rule becomes

$$
\hat{s} = \begin{cases}
  -\sqrt{E_b} &\implies b_i = 0 &\text{if } r < \tau \\
   \sqrt{E_b} &\implies b_i = 1& \text{if } r > \tau \\ 
\end{cases}
$$

which can be computed explicitly by solving for the intersection point:

$$
\tau = \frac{\sigma^2}{2\sqrt{E_b}}\ln \frac{P(s = -\sqrt{E_b})}{P(s = \sqrt{E_b})}
$$.

Binary _Detection_ errors in signal reception can still occur when a received point $R$ exceeds this threshold $\tau$ which can be computed with a Cumulative Distribution Function:

$$
Q(x) = P(N > x) = \frac{1}{\sqrt{2\pi}} \int_x^\infty e^{-n^2/2} dn
$$

which we will use in measuring the performance of various coding schemas.

In the special case where measured signal strengths are assumed to be equal, the overall probability of error is given by:

$$
P(\varepsilon) = Q\Big(\frac{|b-a|}{2\sigma}\Big)
$$

where $a,b$ are signals.

All together, our Binary Phase-Shift Keying transmission system from HGA to Houston looks something like this:

![](/images/it-7.png)

## Performance of Error Correcting Codes

How "expensive" is it to add these redundant bits to our transmission?  _Is it worth it?_ 

What, you didn't think Europa looked cool? 

Recall that in our system, $k$ inputs result in $n$ output bits where $n > k$.  $R=k/n$ is the rate of our correcting code, and for some arbitrary transmission budget we have $E_b$ joules/bit for the unencoded $k$ bits of data which is spread over more $n$ _encoded_ bits.  This relationship can be expressed as $E_c = RE_b$, where $E_c$ is understood as the "energy per coded bit," and necessarily $E_c < E_b$ meaning that unencoded transmission performs better in terms of energy, but we risk error by ommitting the encoding process.

At the receiver, the detected coded bits are passed to the decoder to attempt to correct errors.  In order to be of any use to us, the value of the code must be strong enough so that the bits received can compensate for the lower energy per bit in the channel. 

### Reptition Code

For a repetition code with a transmission rate of 1 bit/second, we must send $n$ coded bits/second and with $n$ times as many bits to send, there is still a constant amount of power shared by all bits: $E_c = E_b/n$.  Thus there is less energy available for each bit to convery information, and the probability of error is 

$$
Q(\sqrt{2E_c/N_0}) = Q(\sqrt{2E_b/nN_0})
$$

Notice that the probability of error is _higher_ as a result of using such a code! 💩

### Golay Code

As a concrete example, let's compare the relative performance of a Golay Code against a pure stream of data, that is a message that has 0 redundant bits (but high risk of data loss): 
- System $\mathscr S_1$ transmits data bits directly
- System $\mathscr S_2$ trasmits a total of 23 bits for every 12 data bits

We assume a constant unit of power is available to each system.  System $\mathscr S_2$ employs a Golay Code transmitting roughly twice as many bits as $\mathscr S_1$, so the strength of energy across each bit is halved.  $a$ is the amplitude of detected output, which will be $1/\sqrt{2}$ since $E \propto A^2$,[^7] but the cost of these penalty bits is necessary to ensure corrective ability. $P(\varepsilon)$ is the measure of penalty in terms of error for decreasing the power of transmission by a factor of 2.

| | $E_b$ | $a$ | $P(\varepsilon)$ |  
|-|-|-|-|
| $\mathscr S_1$ | $1$ | 1 | $1/2000$ |
| $\mathscr S_2$ | $1/2$ | $1/\sqrt{2}$ | $1/100$ |

Thus, $\mathscr S_2$ is twenty-times _more susceptible_ to error because of the reduced strength of energy per bit, meaning that the receiver will have more difficulty correctly measuring which codeword is being transmitted.  However, the redundancies which the Golay Code introduces allow for guaranteed recovery of the complete message, whereas one in two thousand bits in our pure stream of data from $\mathscr S_1$ are simply lost forever like the Bitcoin I mined on the family computer ten years ago.

### The Hadamard Code

The dual of the Hamming Code $C^{(r)}_\text{Ham}$ has a generator matrix $G_r = (H_r)^T$ which is a $(2^r-1)\times r$ matrix whose rows are all non-zero bit vectors of length $r$.  This yields a $[2^r-1, r]_2$ code and is called a **simplex code**.

The **Hadamard Code**, is obtained by adding an all-zeros row to $G_r$.

$\text{Had}_r$ is a $[2^r, r]_2$ linear code whose $2^r \times r$ generator matrix has all $r$-bit vectors as its rows. Its encoding map encodes $x \in \mathbb F_2^r$ by a string in $F_2^{2^r}$ consisting of the dot product $\langle x,a \rangle$ for every $a \in \mathbb F^k_q$. The Hadamard code can also be defined over $\mathbb F_q$, by encoding a message in $\mathbb F_q^k$ with its dot product with every other vector in that field.

It is _the most redundant_ linear code in which no two codeword symbols are equal in every codeword, implying a robust distance property:
- The Hadamard Code has a minimum distance of $2^{r-1}$.  
- The $q$-ary Hadamard Code of dimension $r$ has a distance $(1-\frac{1}{q})q^r$ 

Binary codes cannot have a relative distance $\delta(c)$ of more than $\frac{1}{2}$, unless they only have a fixed number of codewords.  Thus, the relative distance of Hadamard Codes is optimal, but their rate is necessarily poor.

## Limits of Error Correcting Codes

The Hamming and Hadamard codes exhibit two extreme trade-offs between _rate_ and _distance_
- Hamming Code’s _rates_ approach 1 (optimal), but their _distance_ is only 3
- Conversely, Hadamard Code’s have an optimal relative _distance_ of $\frac{1}{2}$, but their _rate_ approaces 0

The natural question that follows is _is there a class of codes which have good rate and good relative distance_ such that neither approach 0 for large block lengths? To answer this question, we consider asymptotic behavior of code families:

Define a code family $\mathcal C$ to be an infinite collection $\{ C_i | i \in N \}$, where $C_i$ is a $q_i$-ary code of block length $n_i$, with $n_i > n_{i-1}$ and $q_i > q_{i-1}$
	
The **Familial Rate** and **Distance** of a category of codes are denoted:

$$
\mathcal {R(C)} = \lim_{i \rightarrow \infty } \frac{k_i}{n_i} 
$$

$$
\delta\mathcal {(C)} = \lim_{i \rightarrow \infty } \frac{\Delta(C_i)}{n_i} 
$$

A $q$-ary family of codes is said to be asymptotically _good_ if its rate and relative distance are bounded away from zero such that there exist constant

$$
\begin{aligned}
    \mathcal{R}_0 &> 0, &\delta_0 > 0 \; s.t. \\
    
    \mathcal{R(C)} &> \mathcal{R}_0, &\delta(\mathcal{C}) > \delta_0
\end{aligned}
$$ 

While a good deal is known about the existence or even explicit construction of good codes as well as their limitations, the best _possible_ asymptotic trade-off between rate and relative distance for binary codes remains a fundamental open question which has seen little advance since the late 70s, in part due to the the fundamental trade off between large rate and large relative distance.

The Hamming and Hadamard Codes help to highlight the flexibility and main take aways of the Channel Coding Theorem as outlined by Wiley:
- As long as $R < C$, arbitrarily reliable transmission is possible
- Code lengths may have to be long to achieve desired reliability.  The closer $R$ is to $C$, the larger we would expect $n$ to need to be in order to obtain some specified degree of performance
- The theorem is general, based on ensembles of ranom codes, and offers little insight into what _the best code_ should be.  We don't know how to design the, just that they exist
- Random codes have a higher probability of being good, so we can reliably just pick one at random

> What then, is the problem?  Why the need for decades of research into the field if random selection of a code might be our best bet?

The answer lies in the complexity of representing and decoding a "good" code.  To represent a random code of length $n$, there must be sufficent memory to store _all_ associated codewords, which requires $n2^{Rn}$ bits.  To decode a recived word $y$, Maximum Likelihood Estimation decoding for a random signal requires that a received vector must be compared with all $2^{Rn}$ possible codewords.  For a middling rate of $R=1/2$, with block length $n = 1,000$ (still relatively modest), $2^{500}$ comparisons must be made for each received signal vector... This is prohibitively expensive, beyond practical feasibility for even massiviley parallelized computing systems, let alone our 70kb, Fortran-backed integrated circuit.


# Conclusion

Today Voyager 2 is 12 billion miles away, and travelling over 840,000 miles further each day.  We're still actively transmitting and receiving data (intact) from both of the Voyager spacecrafts.  

It's somewhat difficult to appreciate the absurd amounts of genius which made make that feat possible.  I find the difference in the orders of magnitude between the 30,000-odd words worth of computing power available to the space craft and the _billions of miles_ of distance separating the scientists from their experiment which they expertly designed _to outlive_ them to be mind boggling. 

Pretty sick if you ask me.

Happy Discovery of Adrastea day.

## References and Footnotes

[^1]: Um, so yeah. I'm going to be using imperial measurements.  If only there were a convenient way to <a href="/blog/fibonacci-fun">quickly convert</a> between metric and imperial, say the 42nd and 43rd numbers of the Fibonacci sequence? Easily, we recall that 433,494,437 precedes 701,408,733 in the sequence and thus, 440 million miles is roughly 700 million kilometers. 

[^2]: Nixon was actually a large proponent of the space program, but this story needs an antogonist, and he's as good as any.

[^3]: Marcel was a crackhead for thinking this is a sufficient explanation for the construction.  [The Paper](http://www.lama.univ-savoie.fr/pagesmembres/hyvernat/Enseignement/1617/info528/TP-Golay/golay_paper.pdf), if it can even be called that, could fit on a napkin.  Mathematicians of a certain flavor exhibit the same kind of stoney-Macgyver behavior, see Conway.

[^4]: These diagrams took me several hours.  Please clap.

[^5]: This diagram was taken from _Error Correction Coding: Mathematical Methods and Algorithms_ which is a good book.

[^6]: More lizard brain pattern matching [at work here](http://neilsloane.com/doc/Me122.pdf).

[^7]: Energy in a wave is proportional to Amplitude squared.

[^8]: [Lexicographic Codes: Error-Correcting Codes from Game Theory](http://neilsloane.com/doc/Me122.pdf)

[^9]: [Voyager timeline](https://voyager.jpl.nasa.gov/mission/timeline/#event-voyager-2-encounters-jupiter)

[^10]: [Other geometric representations of codes](https://giam.southernct.edu/DecodingGolay/decoding.html)