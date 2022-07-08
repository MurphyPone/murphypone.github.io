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

All this to say that you’re firing on all cylinders, transmitting observed measurements and images as you encounter them, lest you forget.

Telemtry takes place via a ~~3.7 meter~~ 14 foot high-gain antenna (HGA), which can send and receive data at a smooth 160 bits/second.  Transmission is pretty much _all-or-nothing_, though, since your memory-span is as competitive as triceratops' or another maastrichtian creature of comparable synaptic ELO.  There’s no retry protocol, you’ve already forgotten your name, and you’re hurtling through space faster than any prior man made object.  No takesies backsies.  No do-overs. And certainly no exponential backoff.

Among the numerous tried and true scapegoats which software engineers so often leverage when their code inevitably malfunctions are 🔥 cosmic ray bit flips 🔥.  "How could I, _in my infinite wisdom_, have produced illogical behavior within my program.  Nay, ’twas the sun who hath smited mine server farm and flipped the bits just so."  (The anthropomorphisation of inanimate objects isn't going away any time soon). And of course, there’s the obligatory relevant xkcd:

![](https://imgs.xkcd.com/comics/real_programmers.png)

But in _**OUTER SPACE**_, where part of the goal of the mission is to _measure_ cosmic rays, said cosmic rays are slighlty more prevalent.  Bit flips are bound to happen at some point during the ~16 hour transit from the HGA back to Houston.  And the engineers at NASA knew this to be the case before sending their half-a-billion dollar reconnaisance babies out into the wild.  **How, then, is the integrity of the data preserved?**

## Information Theory: Forward Correction 

Luckily, with their backs against the wall, and Nixon's cronies looking for a reason to scuff the entire program[^2], NASA did not have to also invent the wheel of Error Correcting Codes.  Much of the groundwork of this realm of Information Theory had already been laid by Claude Shannon, John Hamming, and other bright minds of Bell Research and Signal Corps Laboratories.  I have a few other ever-growing posts on Information Theory which house the supporting research for this post in particular, which go into more depth about what error correcting codes are and how they work, but the relevant bits have been included here, since that's kind of like the whole purpose.  

In order to ensure that the information being beamed across the galaxy didn't get nuked in transit like leftovers in a microwave, the signals were encoded with additional data which offered some guarantees about allowable rates of error and mechanisms for correcting those errors.  They employed a **Golay Encoding** which is an extension of a **Hamming Code** which is perhaps the most famous of binary error correction mechanisms.  To understand how they work, let's start with some definitions and terminology

## Definitions

### Error Control Codes 

**Error Control Codes** are comprised of error _detection_ and error _correction_, where an error is any bit in a message sequence which differs from its intended position.  For example, our message $m$ might be $[1, 0, 1, 0]$ and an error in this message might manifest as a pesky bit flip in the 3rd position: $m' = [1, 0, \color{red}0\color{black}, 0]$.

### Entropy

Error is intrinsically related to **Entropy**, which is a measure of _average uncertainty_ about random variables 
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
- Elements of $C$ are codewords in $C$, and the collection of all the codewords is sometimes called a codebook.
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
The fractional or relative Hamming Distance between $x,y \in \Sigma^n$ is given by 

$$
\delta(x,y) = \frac{\Delta(x,y)}{n}
$$

The **distance** of an error correcting code is the measurement of error resilience quantified in terms of how many errors need to be introduced to cofuse one codeword with another
- The minimum distance of a code $C$ denoted $\Delta(C)$ is the minimum Hamming distance between two distinct codewords of $C$: 

$$
    \Delta(C) = \min\limits_{{c_1, c_2 \in C \atop c_1 \neq c_2}} \Delta(c_1, c_2) \\
    
$$

- For every pair of distinct codewords in $C$, the Hamming Distance is at least $\Delta(C)$
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

## An Aside about Galois Fields

A significant portion of the discussion surrounding error correcting codes takes place within the context of **Fields** which sound more imposing than they actually are.

A **finite** or **Galois Field** is a finite set on which addition, subtraction, multiplicaiton, and division are defined and correspond to the same operations on rational and real numbers.

- A field is denoted as $\mathbb F_q$ or $\mathbf {GF}_q$ where $q$ is a the **order** or size of the field given by the number of elements within 
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
and observes the expected even-parity result
- This same process works under and odd-parity scheme as well
  
### Interleaving 

**Interleaving** is a means of distributing burst errors over a message.  A **burst error** is an error which affects a neighbordhood of bits in a message sequence, rather than just a single position.  

For example, if we have a message ()

$$
m = [m_1, m_2, m_3, ..., m_{16}]
$$

which is struck by a particularly beefy cosmic ray such that a range of positions are affected: 

$$
m' = [m_1, m_2, m_3, \color{red} m_4 \color{black},\color{red} m_5 \color{black},\color{red} m_6\color{black},\color{red} m_7 \color{black}, m_8,..., m_{16}]
$$

By arranging the message in a matrix, transposing it, then unwrapping the matrix back into a vecotr, cryptographic diffusion is achieved:

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


thus distributing the error across the message, making it easier to recover small the complete message (lots of "small" errors are preferable to one gaping hole in our data).


## Error Correction and Detection: Better Approaches

### Hamming Codes

Hamming Codes are the most prevalent of _more sophisticated_ mechanisms for error correction and detection. A $q$-ary code block of length $n$ and dimension $k$ will be referred to as an $[n, k]_q$ code.
  - If the code has distance $d$, it may be expressed as $[n, k, d]_q$ and when the alphabet size is obvious or irrelevant, the subscript may be ommitted

The simplest Full Hamming Code is $[3, 1, 3]_2$ and can be represented geometrically as a cube where the two code words are opposite vertices:

![](/images/voyager-2.png)

Opposite coreners are necessarily three edges away from each other.  We have two codewords which we assume are accurate ($000$, $111$) representing our 1-bit message, and label all the other corners with "what we might get" if one of the bits gets corrupted. 

To decode, we consider correct message to correspond to the majority of the bits in our code word.  The corners adjacent to codeword $000$ are $001, 010, 100$.  If we "round" according to the majority, we preserve our target message of $0$.

This code is **"perfect"** since each corner is used as either a target $\{``000", ``111" \}$ or a correction vector.  If the receiver of an encoded message observes a correction vector, the decoding component will select the nearest composite codeword target.

### The Golay Code

### How to Actually Beam Them Up, Scotty?

### Performance of Error Correcting Codes

## Conclusion

Today Voyager 2 is 18.5B km away, and travelling almost over 840,000 miles per day.

## References

[^1]: Um, so yeah. I'm going to be using imperial measurements.  If only there were a convenient way to <a href="/blog/fibonacci-fun">quickly convert</a> between metric and imperial, say the 42nd and 43rd numbers of the Fibonacci sequence? Easily, we recall that 433,494,437 precedes 701,408,733 in the sequence and thus, 440 million miles is roughly 700 million kilometers. 

[^2]: Nixon was actually a large proponent of the space program, but this story needs an antogonist, and he's as good as any.

- Your device has more computing power: https://www.nasa.gov/mission_pages/voyager/multimedia/vgrmemory.html
- Voyager timeline: https://voyager.jpl.nasa.gov/mission/timeline/#event-voyager-2-encounters-jupiter
- Voyager fast facts: https://voyager.jpl.nasa.gov/frequently-asked-questions/fast-facts/
- Voyager Gallery: https://voyager.jpl.nasa.gov/galleries/
- Nixon cuts funding: https://www.planetary.org/articles/20141003-how-richard-nixon-changed-nasa#:~:text=Nixon's%201971%20budget%20included%20a,the%20success%20of%20Apollo%2011.