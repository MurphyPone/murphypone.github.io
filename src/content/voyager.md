---
title: "40 | Voyager"
date: "2022-07-09"
description: "Information Theory"
path: "/blog/voyager"
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

## Introduction

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

## Information Theory: Forward Correction 

Luckily, with their backs against the wall, and Nixon's cronies looking for a reason to scuff the entire program,[^2] NASA did not have to also invent the wheel of Error Correcting Codes.  Much of the groundwork of this realm of Information Theory had already been laid by Claude Shannon, John Hamming, and other bright minds of Bell Research and Signal Corps Laboratories.  I have a few other ever-growing posts on [Information Theory](/blog/information-theory) which house the supporting research for this post in particular, which go into more depth about what error correcting codes are and how they work. But the relevant bits have been included here, since that's kind of like the whole purpose.  

In order to ensure that the information being beamed across the galaxy didn't get nuked in transit like leftovers in a microwave, the signals were encoded with additional data which offered some guarantees about allowable rates of error and mechanisms for correcting those errors.  They employed a **Golay Encoding**, is an extension of a **Hamming Code**, which is perhaps the most famous of binary error correction mechanisms.  To understand how they work, let's start with some definitions and terminology.

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
- The relative distance of $C$ denoted $\delta(C)$ is the normalized quantity $\frac{\Delta(C)}{n}$ where $n$ is the block length of $C$. Thus, any two codewords of $C$ differ in at least a fraction of $\sigma(C)$ positions
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
- They should be pretty familiar for use in bitwise logic as these identities correspond to modulo 2 arithmetic and the boolean exclusive OR operation:

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

The rate of such a code is $R = 1/n$: _abysmal_

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
- And appends it to her message: $m’ = m |  p(m) = 10010$ 
- And transmits it to Bob $A \xrightarrow{m’} B$
- Bob recieves $m’$ with questionable integrity and computes the parity for himself: 
  
$$
1+ 0 + 0 + 0 + 1 + 0(\mod 2) = 0
$$ 
and observes the expected even-parity result.  This same process works under and odd-parity scheme as well.
  
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


thus distributing the error across the message, making it easier to recover small the complete message (lots of "small" errors are preferable to one gaping hole in our data as we'll see shortly).


## Error Correction and Detection: Better Approaches

### Hamming Codes

Hamming Codes are the most prevalent of _more sophisticated_ mechanisms for error correction and detection. A $q$-ary code block of length $n$ and dimension $k$ will be referred to as an $[n, k]_q$ code.
- If the code has distance $d$, it may be expressed as $[n, k, d]_q$ and when the alphabet size is obvious or irrelevant, the subscript may be ommitted

The simplest **Full Hamming Code** is $[3, 1, 3]_2$ and can be represented geometrically as a cube where the two code words are opposite vertices:

![](/images/voyager-2.png)

Opposite coreners are necessarily three edges away from each other per this code's Hamming Ball property.  We have two codewords which we assume are accurate ($000$, $111$) representing our 1-bit message, and label all the other corners with "what we might get" if one of the bits gets corrupted. 

"_But Peter,_" you might say "_that's not a sphere, that's a cube._"

Go fuck yourself: 

![](/images/it-4.png)

To decode, we take the correct message to correspond to the majority of the bits in our code word.  The corners adjacent to codeword $000$ are $001, 010, 100$.  If we "round" according to the majority, we preserve our target message of $0$.

This code is **"perfect"** since each corner is used as either a target $\{``000", ``111" \}$ or a correction vector.  If the receiver of an encoded message observes a correction vector, the decoding component will select the nearest composite codeword target.

The next full Hamming Codes are $[7, 4, 3]$ and $[15, 11, 3]$, the former of which is also perfect on a 7-dimensional hypercube.  Note that the degree of accuracy of all three of these codes $3, 7, 15, ...$ are all $2^n - 1$, that is, one less than a power of 2.

#### Another Construction

The original presentation of the Hamming code was offered by guess-who in 1949 to correct 1-bit errors using fewer redundant bits.  Chunks of 4 information bits $x_1, x_2, x_3, x_4$ get mapped to a codeword ("encoded") of 7 bits as 

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

Two distinct 4-bit vecotrs $x,y$ get mapped to the code words $Gx, Gy$ which differ in the last 3 bits.  This code can correct all single bit-flip errors since, for any 7-bit vector, there is at most one codeword which can be obtained by a single bit flip.  For any $y \in \{0,1 \}^7$ which is not a codeword, there is always a code word which can be obtained by a single bit flip.

### Linear Codes and Generator Matrices

General codes may have no structure, but of particular interest to us are code with an additional structure called **Linear Codes**. 

If $\Sigma$ is a field and $C \subset \Sigma^n$ is a subspace of $\Sigma^n$ then $C$ is said to be a Linear Code.  As $C$ is a subspace, there exists a basis $c_1, c_2, ..., c_k$ where $k$ is the dimension of the subspace.  Any codeword can be expressed as the linear combination of these basis vecors.  We can write these vectors in matrix form as the columns of an $n \times k$ matrix (as above) which is called a **Generator Matrix**.

Hamming Codes can be understood by the structure of their corresponding parity-check matrices which allow us to generalize them to codes of larger lengths. 

$C_\text{Ham}$ = $[7,4,3]_2$ is a Hamming Code using the Generator Matrix $G$, and a parity matrix $H$

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

and we can see that $HG = \mathbf 0$.

### Correcting single errors with Hamming codes

Suppose that $y$ is a corrupted version of some unknown codeword $c \in C$ with a single error (bit flip).  We know that by the distance property of $C_\text{Ham}$, $c$ is uniquely determined by $y$.  We could determine $c$ by flipping each bit of $y$ and check if the resulting vector is in the null space of $H$ 
- Recall that the nullspace of a matrix $A$ is the set of all $n$-dimensional column vectors $x$ such that $Ax = \mathbf 0$ 

However, a more efficient correction can be performed.  We know that $y = c + e_i$, where $e_i$ is the column vector of all zeros except for a single 1 in the $i$th position.  Note that $Hy = H(c+ e_i) = Hc + He_i =$ the $i$th column of $H$ which is the binary representation of $i$, and thus this recovers the location $i$ of the error
- **Syndrome**: We  say that $Hy$ is the _syndrome_ of $y$ 

#### Examples of Hamming Codes
- $[n, n-1, 2]_2$ corresponds to the binary parity check code consisting of all vectors in $\mathbb F_2^n$ of even Hamming Weight
- $[n, 1, n]_2$ is a binary repetition code consisting of the two vectors $\mathbf 0^n, \mathbf 1^n$
- $[7,4,3]_2$ is the linear Hamming Code discussed above

#### Perfect Codes

There are a few perfect binary codes:
- The Hamming Code $C^{(r)}_\text{Ham}$ 
- The Golay Code
- The trivial codes consistng of just 1 codeword, or the whole space, or the repetition code $\{0^n, 1^n\}$ for odd $n$

While fascinating, these codes can only correct 1 error, so a more robust code may be needed.  

## The Golay Code

Like other Hamming Codes, the Golay Code can be constructed in a number of ways.  $\text{Gol}_{23}$ consists of 

$$
(c_0, c_1, ..., c_{22}) \in \{0,1\}^{23}
$$ 

when  the polynomial $c(X) = c_0X^0 + c_1X^1 + ... +c_{22}X^{22}$ is divisible by 

$$
g(X) = 1 + X + X^5 + X^6 + X^7 + X^9 + X^{11}
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
J_2 = 
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
    
    & & & & & & & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \downarrow & | & | & |  \\ \hline % good

    & & & & & & & 0 & | 1 & 0 & 1 & 1 & 1 & 1 & 0 & 1 & 1 & 1 & 1 & 0  & | & | & | \\ % good
    & & & & & & &   & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \downarrow & \downarrow & \downarrow  \\ \hline % good

    & & & & & & & & & & & | 1 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 1 & 0 & 0 & 0 \\ % good
    & & & & & & & & & & & | \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1 & \color{blue} 1 & \color{blue} 0 & \color{blue} 0 & \color{blue} 0 & \color{blue} 1 & \color{blue} 1   \\ \hline % good

    & & & & & & & & & & & 0 & \color{green} 0 & \color{green}1 & \color{green}1 & \color{green}0 & \color{green}0 & \color{green}0 & \color{green}0 & \color{green}1 & \color{green}0 & \color{green}1 & \color{green}1 \\ % good
\end{array}
$$
[^4]

Thus, $m' / h \mod 2$ yields $\color{green}1100001011$ which is said to be the **syndrome** of the message.  The 11-bit zero vector is replaced with the syndrome, and if decoded with a Hamming polynomial the resultant syndrome or remainder will be 0:

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

We also have $a_i = \sqrt{E_b}(2b_i -1) = -\sqrt{E_b}(-1)^{b_i} = \sqrt{E_b}\tilde{b}_i$, a mapping of a bit $b_i$ or ($\tilde{b}_i$) to a signal amplitude that multiplies a waveform $\varphi_1(t)$ which is a unit-energy signal:

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

We can expand this representation to two dimensions by introducing another signal $\varphi_2(t)$ and modulating the two to establish a signal constellation.  Let $M = 2^m; m \in \mathbb Z$, be the number of points in a constellation.  $M$-ary transmission is obtained by placing $M$ points $\mathcal{S} = \{(a_{1k}, a_{2k}), k = 0, 1, ..., M-1 \}$ in this signal space and assigning each point a unique pattern of $m$ bits.

![](/images/it-3.png)

Maximum-Likelihood Estimation is used to TODO: . pp. 66 determine which signals correspond to which codewords

TODO: diagram of source, encoder, channel, receiver decoder

### Performance of Error Correcting Codes

## Conclusion

Today Voyager 2 is 12 billion miles away, and travelling almost over 840,000 miles per day.

## References

[^1]: Um, so yeah. I'm going to be using imperial measurements.  If only there were a convenient way to <a href="/blog/fibonacci-fun">quickly convert</a> between metric and imperial, say the 42nd and 43rd numbers of the Fibonacci sequence? Easily, we recall that 433,494,437 precedes 701,408,733 in the sequence and thus, 440 million miles is roughly 700 million kilometers. 

[^2]: Nixon was actually a large proponent of the space program, but this story needs an antogonist, and he's as good as any.

[^3]: Marcel was a crackhead for thinking this is a sufficient explanation for the construction.  [The Paper](http://www.lama.univ-savoie.fr/pagesmembres/hyvernat/Enseignement/1617/info528/TP-Golay/golay_paper.pdf), if it can even be called that, could fit on a napkin.  Mathematicians of a certain flavor exhibit the same kind of stoney-Macgyver behavior. TODO: 

[^4]: This diagram took me 4 hours.  Please clap.

[^5]: This diagram was taken from _Error Correction Coding: Mathematical Methods and Algorithms_ which is a good book.

- Your device has more computing power: https://www.nasa.gov/mission_pages/voyager/multimedia/vgrmemory.html
- Voyager timeline: https://voyager.jpl.nasa.gov/mission/timeline/#event-voyager-2-encounters-jupiter
- Voyager fast facts: https://voyager.jpl.nasa.gov/frequently-asked-questions/fast-facts/
- Voyager Gallery: https://voyager.jpl.nasa.gov/galleries/
- Nixon cuts funding: https://www.planetary.org/articles/20141003-how-richard-nixon-changed-nasa#:~:text=Nixon's%201971%20budget%20included%20a,the%20success%20of%20Apollo%2011.
- Other geometric representations: https://giam.southernct.edu/DecodingGolay/decoding.html