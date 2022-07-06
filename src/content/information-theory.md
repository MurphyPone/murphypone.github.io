---
title: "39 | Notes: Information Theory"
date: "2022-07-01"
description: "Claude, Hamming, Hadamard, CMU, Wiley"
path: "/blog/information-theory"
---
<style> .n { visibility: hidden; } </style>

Notes on Information Theory from various sources

# Index 

- [Lectures](#lectures)
  - [1 | Introduction to Coding Theory](lectures-1)
- [Error Correction Coding, wiley](#wiley)
  -  [1 | A context for Error Correction Coding](wiley-1)

# <a name="lectures" class="n"></a> Lectures

## <a name="lectures-1" class="n"></a> 1 | Introduction to Coding Theory

- Shannon’s seminal book “A Mathematical theory of communication” (1948) measured information content in the output of a random source in terms of its **entropy**  
- In his book, he presented the **Noiseless Coding Theorem**: given $n$ independent and identically distributed random variables, each with entropy $H(x)$... 
  - $H(x)$ can be compressed into $n(H(x) + \epsilon)$ bits with negligible loss
  - or alternatively compressed into  $n(H(x) - \epsilon)$ bits entailing certain loss
  - Given a noisy communication channel whose behavior is given by a stochastic channel law and considering a message of $k$ bits output by a source coder, the theorem states that every such channel has a precisely defined real numbered **capacity** that quantifies the maximum rate of reliable communication
  - Given a noisy channel with a capacity $C$, if information is transmitted at rate $R$ (meaning $k=nR$ message bits are transmitted in $n$ uses of the channel), then if $R < C$, there exist coding schemes (encoding and decoding pairs) that guarantee negligible probability of miscommunication, whereas if $R > C$, then –regardless of a coding scheme– the probability of an error at the received is bounded below some constant (which increases proportionately to $R$)
    - Conversely, when $R > C$, the probability of miscommunication goes exponentially to 1 in $k$

### 1 - A Simple Code

Suppose we need to store 64-bit words in such a way that they can be recovered even if a single bit per word gets flipped
  - We could duplicate each bit at least three times, thus storing 21 bits of information per word, and limiting ourselves to roughly 1/3 of the information per word.  But the tradeoff is that we could correct any single bit flip since the majority value of the three copies gives te correct value of the bit if one of them is flipped.

In 1949, Hamming proferred his code to correct 1-bit errors using fewer redundant bits. Chunks of 4 information bits $x_1, x_2, x_3, x_4$ get mapped to (encoded) to a codeword of 7 bits as

$$
    x_1, x_2, x_3, x_3, x_2 \oplus x_3 \oplus x_4, x_1 \oplus x_3 \oplus x_4, x_1 \oplus x_2 \oplus x_4
$$

which can be equivalently represented as a mapping from $x$ to $Gx$ (operations do $\mod 2$ ) where $x$ if the column vector $[1, 2]^T$ and $G$ is the matrix

$$
 \begin{bmatrix}
   1 & 0 & 0 & 0 \\
   0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1 \\
   0 & 1 & 1 & 1 \\
   1 & 0 & 1 & 1 \\
   1 & 1 & 0 & 1 \\
\end{bmatrix}
$$

- Two distinct 4-bit vectors $x, y$ get mapped to the codewords $Gx, Gy$ which differ in the last 3 bits (define $w = x - y, w \neq 0$ and check that, for each non-zero $w$, $Gw$ has at least 3 bits which are $1$) 
  
- This code can correct all single bit flips since, for any 7-bit vector, there is at most 1 codeword which can be obtained by a single bit flip
  
- For any $y \in \{0, 1\}^7$ which is not a codeword, there is always a codeword which can be obtained by a single bit flip

### Basic Definitions

#### Hamming Distance

The **Hamming Distance** between two strings $x,y$ of the same length over the alphabet $\Sigma$ is denoted $\Delta(x,y)$  and defined as the number of positions at which $x$ and $y$ differ:

$$
\Delta(x,y) = |\{ i | x_i \neq y_i\}| 
$$
The fractional or relative Hamming Distance between $x,y \in \Sigma^n$ is given by 

$$
\delta(x,y) = \frac{\Delta(x,y)}{n}
$$

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

### Code 
An error correcting **code** $C$ of length $n$ over a finite alphabet $\Sigma$ is a subset of $\Sigma^n$.  
- Elements of $C$ are codewords in $C$, and the collection of all the codewords is sometimes called a codebook.
- The alphabet of $C$ is $\Sigma$, and if $|\Sigma| = q$, we say that $C$ is $q$-ary (binary, ternary, etc.)
- The length $n$ of codewords in $C$ is called the **block length** of $C$
- Associated with a code is also an encoding map $E$ which maps the message set $\mathcal M$, identified in some canonical way with $\{1, 2, ..., |C| \}$ to codewords in $\Sigma^n$
  - The code is then the image of the encoding map

### Rate 

The **rate** of a code is defined by the amount of redundancy it introduces.

$$
R(C) = \frac{\log |C|}{n \log |\Sigma^n|}
$$
which is the amount of non-redundant information per bit in codewords of $C$.
- The dimension of $C$ is given by $\frac{\log |C|}{\log |\Sigma^n|}$
- A $q$-ary code of dimension $\ell$ has $q^\ell$ codewords

### Distance

- The **distance** of an error correcting code is the measurement of error resilience quantified in terms of how many errors need to be introduced to cofuse one codeword with another
- The minimum distance of a code $C$ denoted $\Delta(C)$ is the minimum Hamming distance between two distinct codewords of $C$: 

$$
    \Delta(C) = \min\limits_{{c_1, c_2 \in C \atop c_1 \neq c_2}} \Delta(c_1, c_2) \\
    
$$

- For every pair of distinct codewords in $C$, the Hamming Distance is at least $\Delta(C)$
- The relative distance of $C$ denoted $\delta(C)$ is the normalized quantity $\frac{\Delta(C)}{n}$ where $n$ is the block length of $C$. Thus, any two codewords of $C$ differ in at least a fraction of $\sigma(C)$ positions
- For example, the parity check code, which maps $k$ bits to $k+1$ bits by appending the parity of the message bits, is an example of a distance 2 code with rate $k/(k+1)$ 

## Properties of Codes
1. $C$ has a minimum distance of $2t + 1$
2. $C$ can be used to correct all $t$ symbol errors
3. $C$ can be used to detect all $2t$ symbol errors
4. $C$ can be used to correct all $2t$ symbol _erasures_ – that is, some symbols are erased and we can determine the locations of all erasures and fill them in using filled position and the redundancy code
   
--- 

## An Aside about Galois Fields

- A **finite** or **Galois Field** is a finite set on which addition, subtraction, multiplicaiton, and division are defined and correspond to the same operations on rationals and reals
- A field is denoted as $\mathbb F_q$ or $\mathbf {GF}_q$ where $q$ is a the **order** or size of the field given by the number of elements within 
  - A finite field of order $q$ exists if and only if $q$ is a prime power $p^k$, where $p$ is prime and $k$ is a positive integer
  - In a field of order $p^k$, adding $p$ copies of any element always results in zero, meaning tat the characteristic of the field is $p$
  - All fields of order $q = p^k$ are isomorphic, so we can unambiguously refer to them as $\mathbb F_q$ 
- $\mathbb F_q$, then, is the field with the least number of elements and is said to be unique if the additive and multiplicative identities are denoted $0, 1$ respectively
- It should be pretty familiar for bitwise logic then as these identities correspond to modulo 2 arithmetic and the boolean XOR operation:

<div style=“block”>

| $\pm$ | 0 | 1 |
|---|--|----|
| 0 | 0 | 1 |
| 1 | 1 | 0 |

</div>

 
|XOR|AND|
|--|--|
|<table><tr><th>±</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>0</td></tr> </table> | <table><tr><th>x</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>1</td></tr> </table> |

- Other properties of binary fields
  - Every element $x$ of $\mathbb F_2$ satisfies $x + x = 0; \;-x = x$ 
  - Every element $x$ of $\mathbb F_2$ satisfies $x^2 = 0$  

---

## 3 - Linear Codes
General codes may have no structures, but of particular interest to us are a subclass of codes with an additional structure, called **Linear Codes** defined over alphabets $\Sigma$ which are finite fields $\mathbb F_q$ where $q$ is a prime number in which case $\mathbb F_q = \{0, 1, ..., q-1\}$ with addition and multiplication defined modulo $q$.

- Formally, if $\Sigma$ is a field and $C \subset \Sigma^n$ is a subspace of $\Sigma^n$ then $C$ is said to be a Linear code
- As $C$ is a subspace, there exists a basis $c_1, c_2, ..., c_k$ where $k$ is the dimension of the subspace. Any codeword can be expressed as the linear combination of these basis vectors. We can write these vectors in matrix form as the columns of an $n \times k$ matrix call a generator matrix

### Generator Matrices and Encoding

- Let $C \subseteq \mathbb F_q^n$ be a linear code of dimension $k$.  A matrix $G \in \mathbb F^{n \times k}_q$ is said to be a generator matrix for $C$ if its $k$ columns span $C$
- It provies a way to encode a message $x \in \mathbb F^k_q$ (a column vector) as the codeword which is a linear transformation from $x$ to $Gx$
- Note that a Linear Code admits many different generator matrices, corresponding to the different choices of bases for the code as a vector space
- A $q$-ary code block of length $n$ and dimension $k$ will be referred to as an $[n, k]_q$ code
  - If the code has distance $d$, it may be expressed as $[n, k, d]_q$ and when the alphabet size is obvious or irrelevant, the subscript may be ommitted
  
---

### Aside about Parity-Bit Check Codes

In simple Parity-bit Check code uses an additional bit denoting the even or odd parity of a messages Hamming Weight is appended to the message to serve as a mechanism for error detection (but not correction since it provides no means of determing the position of error). 

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
- Bob recieves $m’$ with questionable integrity and computes the parity for himself: $1+ 0 + 0 + 0 + 1 + 0(\mod 2) = 0$ and observes the expected even-parity result
- This same process works under and odd-parity scheme as well
  
---

#### Examples of Codes

- $[n, n-1, 2]_2$ corresponds to the binary parity check code consisting of all vectors in $\mathbb F^n_2$ of even Hamming Weight
- $[n, 1, n]_2$ is a binary repetition code consisting of the two vectors $0^n, 1^n$ 
- $[7,4,3]_2$ is the linear Hamming Code discussed above 
- If $H$ is the parity check matrix of the Linear Code $C$, then $\Delta(C)$ is the minimum number of columns of $H$ that are Linearly Dependent

## Hamming Codes Revisited 
- Hamming Codes can be understood by the structure of its parity check matrix which allows us to generalize them to codes of larger lengths
- $C_\text{Ham}$ = $[7,4,3]_2$ is a Hamming Code using the Generator Matrix $G$, and a parity matrix $H$

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

and see that $HG = \mathbf 0$.  

### Correcting single errors with Hamming codes
- Suppose that $y$ is a corrupted version of some unknown codeword $c \in C$ with a single error (bit flip)
- We know that by the distance property of $C_\text{Ham}$, $c$ is uniquely determined by $y$.  We could determine $c$ by flipping each bit of $y$ and check if the resulting vector is in the null space of $H$, 
	- Recall that the nullspace of a matrix $A$ is the set of all n-dimensional column vectors $x$ such that $Ax = \mathbf 0$ 
- However, a more efficient correction can be performed.  We know that $y = c + e_i$, where $e_i$ is the column vector of all zeros except for a single 1 in the $i$th position.  Note that $Hy = H(c+ e_i) = Hc + He_i =$ the $i$th column of $H$ which is the binary representation of $i$, and thus this recovers the location $i$ of the error
- **Syndrome**: We  say that $Hy$ is the _syndrome_ of $y$ 

### Generalized Haming Codes
We define $H_r$ to be the $r \times 2^r - 1$ matrix  where column $i$ of $H_r$ is the binary representation of $i$.  This matrix must contain $e_1$ through $e_r$, which are binary representations of all powers of 2 from $1, 2^{r-1}$ and thus has full row rank
- The $r$th generalized Hamming Code then is given by 

$$
C^{(r)}_\text{Ham} = \{ c \in \mathbb F^{2^r-1}_2 | H_rc = \mathbf 0\}
$$
and is the binary code with the parity check matrix $H_r$
- Note that  $C^{(r)}_\text{Ham}$ is an $[2^r -1, 2^r - 1 - r, 3]_2$ code
- Proof:
	- Since $H_r$ has rank $r, \text{dim}(C^{(r)}_\text{Ham})=r$, and we must simply check that no two columns of $Hr$ are linearly dependent, and that there are three linearly dependent columns in $H_r$
	- The former follows since all the columns are distinct, and the latter since the first three columns of $H$ are the binary representations of 1,2,3 add up to 0.

If $C$ is a binary code of block length $n$, and has a minimum distance of 3, then 

$$
\tag{1} |C| \leq \frac{2^n}{n+1}
$$
and it follows that the Hamming Code $C^{(r)}_\text{Ham}$ has the maximum possible number of code words (and thus, an optimal rate) amongst all binary codes of block length $2^r -1$ and a minimum distance of at least 3.
- Proof:
	- For each $c \in C$, define its neighbordhood $N(c) = \{y \in \{0,1\}^n | \Delta(y,c) \leq 1 \}$ of all strings that differ in at most one bit from $c$.  
	- Since $C$ has distance 3, by the triangle inequality we have 

$$
N(c) \cap N(c’) = \emptyset \; \text{for} \; c \neq c’ \in C \therefore  
$$
$$
2^n \geq \Big|\bigcup_{c \in C} N(c) \Big| = \sum_{c \in C} |N(c)| = |C| \cdot (n+1)
$$
yielding the desired upper bound on $|C|$ per this “Hamming Volume” upper bound on size of codes.
- Note that $C^{(r)}_\text{Ham}$ has a dimension of $2^r-1-r$ and therefore a size $2^{2^r -1}/2^r$ which meets the upper bound for block length $n = 2^r - 1$
- The general definition of a **Hamming** or **Volume Bound** for binary codes $C$ of block length $n$, and distance $d$ is given by 

$$
\tag{2} |C| \leq \frac{2^n}{\sum_{i=0}^{\lfloor \frac{d-1}{2} \rfloor}{n \choose i}} 
$$
for equality to hold in (2), Hamming Balls of radius $\lfloor \frac{d-1}{2} \rfloor$ around the code words must cover each point in $\{0,1\}^n$ exactly once, giving a _perfect packing_ of non-overlapping Hamming spheres that cover the full space.  
- Codes which meet the bound in (2) are therefore called **perfect codes**

#### Perfect Codes
There are few perfect binary codes:
- The Hamming Code $C^{(r)}_\text{Ham}$ 
- The Golay Code
- The trivial codes consistng of just 1 codeword, or the whole space, or the repetition code $\{0^n, 1^n\}$ for odd $n$

### The Golay Code

Like other Hamming Codes, the Golay Code can be constructed in a number of ways.  $\text{Gol}_{23}$ consists of $(c_0, c_1, ..., c_{22}) \in \{0,1\}^{23}$ when  the polynomial $c(X) = c_0X^0 + c_1X^1 + ... +c_{22}X^{22}$ is divisible by 

$$
g(X) = 1 + X + X^5 + X^6 + X^7 + X^9 + X^11
$$ 

in the ring $\mathbb F[X]/(X^{23}-1)$.

## 3.3 Dual of a Code 
Since a Linear Code is a subspace of $\mathbb F_q^n$, we can define its dual in orthogonal space – a co-code, if you will
- **Dual Code**: If $C \subseteq \mathbb F_q^n$ is a linear code, then its dual $C^\perp$ is a linear code over over $\mathbb F_q$ given by 

$$
C^\perp = \{ z \in \mathbb F_q^n | \langle z \cdot c \rangle = 0 \; \forall c \in C \}
$$
where $\langle z, c \rangle = \sum^n_{i=1} z_ic_i$ is the dot product over $\mathbb F_q$ of vectors $z,c$ 
- Unlike vector spaces over $\mathbb R$, where the dial (or orthogonal complement) vector $W^\perp$ of a subspace $w \subseteq \mathbb R^n$  satisfies $W \cap W^\perp = \{ \mathbf 0 \}$ and ($W + W^\perp + \mathbb R^n$), for subspaces of $\mathbb F^n_q$, $C$ and $C^\perp$ can intersect non-trivially
- In fact, we can devise $C^\perp \subseteq C$ (a **self-orthogonal** code) or even just $C = C^\perp$, a **self-dual**

## 3.4 Dual of the Hamming Code  
The Dual of the Hamming Code $C^{(r)}_\text{Ham}$ has a generator matrix $G_r = (H_r)^T$ which is a $(2^r-1)\times r$ matrix whose rows are all non-zero bit vectors of length $r$.  This yields a $[2^r-1, r]_2$ code and is called a **simplex code**

The **Hadamard Code**, the Hamming Code’s dual, is obtained by adding an all-zeros row to $G_r$

$\text{Had}_r$ is a $[2^r, r]_2$ linear code whose $2^r \times r$ generator matrix has all $r$-bit vecotrs as its rows.
- Its encoding map encodes $x \in \mathbb F_2^r$ by a string in $F_2^{2^r}$ consisting of the dot product $\langle x,a \rangle$ for every $a \in \mathbb F^k_q$ 
- The hadamard code can also be dinfed over $\mathbb F_q$, buby encoding a message in $\mathbb F_q^k$ with its dot product with ever other vector in that field
- The Hadamard Code is the most redundant linear code in which no two codeword symbols are equal in every codeword, implying a robust distance property:
	- The Hadamard Code and simplex codes have a minimum distance of $2^{r-1}$.  The $q$-ary Hadamard Code of dimension $r$ has a distance $(1-\frac{1}{q})q^r$ 
	- Proof: For $x\neq0, \langle z, a \rangle \neq 0$ for exactly $2^{r-1}$ (i.e. half) of the elemtns of $a \in \mathbb F_2^r$. 
	- Assume for definiteness that $x_1=1$. 
	- Then, for every $a, \langle x, a \rangle + \langle x, a+e_1 \rangle = x_1 = 1$, and therefore exactly one of $\langle x, a \rangle$ and $\langle x, a + e_i\rangle$ equals 1. The proof for the $q$-ary case$ is similar.
- Binary codes cannot have a relative distance $\delta(c)$ of more than $\frac{1}{2}$, unless they only have a fixed number of code words.  This the relative distance of Hadamard Codes is optimal, but their rate is necessarily poor

## Code Families and Asymptotically Good Codes
- The Hamming and Hadamard codes exhibit two extreme trade-offs between _rate_ and _distance_
	- Hamming Code’s _rates_ appraochs 1 (optimal), but their _distance_ is only 3
	- Conversely, Hadamard Code’s have an optimal relative _distance_ of $\frac{1}{2}$, but their _rate_ approaces 0
- The natural question that follows is _is there a class of codes which have good rate and good relative distance_ such that neither approach 0 for large block lengths?
- To answer this question, we consider asymptotic behavior of code families:
	- Define a code family $\mathcal C$ to be an infinite collection $\{ C_i | i \in N \}$, where $C_i$ is a $q_i$-ary code of block length $n_i$, with $n_i > n_{i-1}$ and $q_i > q_{i-1}$
	- Many constructions of codes will belong to an infinite family of codes that share general structure and properties whoe asymptotic behavior guides their construction
	- We also need extend the notion of relative rate and distance to these inifinite families:

$$
\mathcal {R(C)} = \lim_{i \rightarrow \infty } \frac{k_i}{n_i} 
$$

$$
\delta\mathcal {(C)} = \lim_{i \rightarrow \infty } \frac{\Delta(C_i)}{n_i} 
$$

- A $q$-ary family of codes is said to be asymptotically _good_ if its rate and relative distance are bounded away from zero such that there exist constant $\mathcal{R_0> 0, \delta_0 >0 \; s.t. R(C) > R_0, \delta(C) > \delta_0}$ 

> While a good deal is known about the existence or even explicit construction of good codes as well as their limitations, the best _possible_ asymptotic trade-off between rate and relative distance for binary codes remains a fundamental open question which has seen no improvement since the late 70s in part due to the the fundamental trade off between large rate and large relative distance

# <a name="wiley" class="n"></a> Error Correction Coding: Mathematical Methods and Algorithms - Todd Moon

## <a name="wiley-1" class="n"></a> 1 | A context for Error Correction Coding

### 1.2 - Where Are Codes

- **Error Control Codes** are comprised of error correction _and_ error detection

#### Da heck is an ISBN

- For a valid ISBN, the sum-of-the-sum of the digits must be equal to $0 \mod 11$

$$
\underbrace{0}_{\text{country}} - \underbrace{20}_{\text{publisher}} - \underbrace{1 - 36186}_{\text{book \#}} - \underbrace{8}_{check}
$$

| digit | cum. sum | cum. sum of sum |
|-------|----------|-----------------|
| 0     | 0        | 0               |
| 2     | 2        | 2               |
| 0     | 2        | 4               |
| 1     | 3        | 7               |
| 3     | 6        | 13              |
| 6     | 12       | 25              |
| 1     | 13       | 38              |
| 8     | 21       | 59              |
| 6     | 27       | 86              |
| 8     | 35       | 121             |

The final sum is $121 = 0 \mod 11$ 

### 1.3 - The Communication System

> Information theory treats _information_ as a pseudo-physical quantity which can be measured, transformed, stored, and moved from place to place.
> A fundemental concept of information theory is that information is conveyed by the resolution of uncertainty.

- Probabilities are used to described uncertainty.  For a discrete random variable $X \in \{0, 1\}$, the information conveyed by observing an outcome $x$ is $-\log_2 P(X=x)$ bits.
  - If $P(X=1)=1$, outcome of 1 is certain, then observing $X=1$ yields $- \log_2(1) = 0$ bits of information.
  - Conversely, observing $X=0$ in this case yields $- \log_2(0) = \infty$; a total surprise at observing an impossible outcome

- **Entropy** is the _average information_.  For our above example with a discrete, binary, random variable $X$, we have either $H_2(X)$ (entropy of the source) or $H_2(p)$ (a function of the outcome probabilities) given by

$$
    H_2(X) = H_2(p) = \mathbb E[- \log_2 P(X)] = -p \log_2(p) - (1-p) \log_2(1 -p) \text{ bits}
$$

- For a source $X$ having $N$ outcomes $x_1, x_2, ..., x_N$ with probabilities $P(X=x_i) = p_i, i = 1, 2, ..., N$, the entropy is 

$$
H(x) = \mathbb E [-\log_2 P(X)] = \sum_{i=1}^N p_i \log_2 p_i \text{ bits}
$$

- **Source-Channel Separation Theorem**: Treating the problems of data compression and error correction separately, rather than seeking a jointly optimal source/channel coding solution, is asymptotically optimal in block sizes

- Because of redundancy introduced by the channel coder, there must bee more symbols at the output of the coder than at the input.  A channel coder operates by accepting a block of $k$ input symbols and outputting a block of $n > k$ symbols.  
- The **Rate** of a channel coder is $R = k/n < 1$
- **Channel Coding Theorem**: Provided that the rate $R$ of transmission is less than the channel capacity $C$, there exists a code such that the probability of error can be made arbitrarily small

### 1.4 - Binary Phase-Shift Keying

- Process of mapping a binary sequence to a waveform for transmission over a channel
- Given a binary sequence $\{..., b_{-2}, b_{-1}, b_{0}, b_{1}, b_{2}, ... \}$, we map the set $\{0, 1\} \rarr \{-1, 1\}$ via 

$$
\tilde{b}_i = (2b_i - 1) \text{ or }\tilde{b}_i = -(2b_i - 1)
$$

- We also have $a_i = \sqrt{E_b}(2b_i -1) = -\sqrt{E_b}(-1)^{b_i} = \sqrt{E_b}\tilde{b}_i$, a mapping of a bit $b_i$ or ($\tilde{b}_i$) to a signal amplitude which multiplies a waveform $\varphi_1(t)$ which is a unit-energy signal

$$
\int^\infty_{-\infty} \varphi_1(t)^2dt = 1
$$

over $[0, T)$.  A bit $b_i$ arriving at $iT$ can be represented as the signal $a_i\varphi_1(t - iT)$ where the energy required to transmit the bit $b_i$ is given by

$$
\int^\infty_{-\infty} (a_i \varphi_1(t))^2 dt = E_b
$$

- The transmitted signal $\pm \sqrt{E_b}\varphi_1(t)$ are points $\pm \sqrt{E_b}$ in a (for our purposes: one-) dimensional signal space on the unit-energy $\varphi_1$ axis

![](/images/it-1.png)

such that a sequence of bits $[1,1,0,1,0]$ can be expressed as a waveform:

![](/images/it-2.png)

We can expand this representation to two dimensions by introducing another signal $\varphi_2(t)$ and modulating the two to establish a signal constellation.  Let $M = 2^m$, for some inteeger $m$, be the number of points in a constellation.  $M$-ary transmission is obtained by placing $M$ points $\mathcal{S} = \{(a_{1k}, a_{2k}), k = 0, 1, ..., M-1 \}$ in this signal space and assigning each point a unique pattern of $m$ bits.

![](/images/it-3.png)

- Note that the assignment of the bits to constellation points is such that adjacent points differ by only 1 bit.  Such an assignment is called **Gray code order**.  Since it is most probably that errors will move from a point to an adjacent point, this reduces the probability of _bit_ error

Associated with each signal (stream of $k$ bits) $s_k(t) = a_{1k}\varphi_1(t) + a_{2k}\varphi_2(t)$ and signal constellation point $(a_{1k},a_{2k}) \in \mathcal S$ is a signal energy

$$
E_k = \int^\infty_{-\infty} (s_k(t))^2 dt = a_{1k}^2 + a_{2k}^2
$$

The average signal energy $E_s$ is the average of all signal energies, assuming that each point is used with equal probability 

$$
E_s = \frac{1}{M} \sum_{k=0}^{M-1} \int^\infty_{-\infty} (s_k(t))^2 dt = \sum_{k=0}^{M-1} (a_{1k}^2 + a_{2k}^2)
$$

and ca be related to the average energy per bit 

$$
E_b = \frac{\text{energy per signal}}{\text{bits per signal}} = \frac{E_s}{m}
$$