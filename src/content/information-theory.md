---
title: "39 | Notes on Information Theory"
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
  - [1 | A Context for Error Correction Coding](wiley-1)
  - [2 | Groups and Vector Space](wiley-2)
  - [3 | Linear Block Codes](wiley-3)
  - [4 | Cyclic Codes, Rings, and Polynomials](wiley-4)

# <a name="lectures" class="n"></a> Lectures

## <a name="lectures-1" class="n"></a> 1 | Introduction to Coding Theory

- Shannon’s seminal book “A Mathematical theory of communication” (1948) measured information content in the output of a random source in terms of its **entropy**  
- In his book, he presented the **Noiseless Coding Theorem**: given $n$ independent and identically distributed random variables, each with entropy $H(x)$... 
  - $H(x)$ can be compressed into $n(H(x) + \epsilon)$ bits with negligible loss
  - or alternatively compressed into  $n(H(x) - \epsilon)$ bits entailing certain loss
  - Given a noisy communication channel whose behavior is given by a stochastic channel law and considering a message of $k$ bits output by a source coder, the theorem states that every such channel has a precisely defined real numbered **capacity** that quantifies the maximum rate of reliable communication
  - Given a noisy channel with a capacity $C$, if information is transmitted at rate $R$ (meaning $k=nR$ message bits are transmitted in $n$ uses of the channel), then if $R < C$, there exist coding schemes (encoding and decoding pairs) that guarantee negligible probability of miscommunication, whereas if $R > C$, then –regardless of a coding scheme– the probability of an error at the receiver is bounded below some constant (which increases with $R$)
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

- The **distance** of an error correcting code is the measurement of error resilience quantified in terms of how many errors need to be introduced to cofuse one codeword with another
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

### Hamming 

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

- The **distance** of an error correcting code is the measurement of error resilience quantified in terms of how many errors need to be introduced to confuse one codeword with another
- The minimum distance of a code $C$ denoted $\Delta(C)$ is the minimum Hamming distance between two distinct codewords of $C$: 

$$
    \Delta(C) = \min\limits_{{c_1, c_2 \in C \atop c_1 \neq c_2}} \Delta(c_1, c_2) \\
    
$$

- For every pair of distinct codewords in $C$, the Hamming distance is at least $\Delta(C)$
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

## <a name="wiley-1" class="n"></a> 1 | A Context for Error Correction Coding

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

- Because of redundancy introduced by the channel coder, there must be more symbols at the output of the coder than at the input.  A channel coder operates by accepting a block of $k$ input symbols and outputting a block of $n > k$ symbols.  
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

## <a name="wiley-2" class="n"></a> 2 | Groups and Vector Space

### 2.1 - Introduction

Linear block codes form a group and a vector space, which is useful

### 2.2 - Groups

A **Group** formalizes some basic rules of arithmetic necessary for cancellation and solution of simple equations

A **binary operation** $*$ on a set is a rule that assigns to each ordered pair of elements of a set $a,b$ some element of the set
- Since the operation is deinfed to return an element of the set, this operation is _closed_
- We can further assume that all binary operations are closed

- Examples include: $\min(a, b), \; fst(a,b), \; a + b$

A **Group** $\langle G, * \rangle$ is a set $G$ with a binary operation $*$ on $G$ such that 
- The operator is associative: for any $a, b, c \in G\; (a * b) * c = a * (b * c)$
- For all $a\in G$ there exists $b \in G$ which is the inverse of $a$ such that $a * b = e$, where $e$ is called the **identity** of the group.  The inverse can be denoted $a^{-1}, -a$ for multiplication-like and addition-like operations, respectively

When $*$ is obvious from context, the group may be referred to as _just_ the set $G$. 

If $G$ has a finite number of elements, it is said to be a finite group with order $|G|$, the number of elements.  

A group $G$ is **commutative** if $a * b = b * a; \; \forall a, b \in G$.

- $\langle \Z, + \rangle$, the integers under addition, forms a group with the identity $0$ since $a + 0 = 0 + a; \; \forall a \in \Z$
  - The invert of $a \in \Z = -a$.  Thus the group is commutative.
  - Groups with an addition-like operator are called **Abelian**

- $\langle \Z, \cdot \rangle$, the integers under multiplication, _does not_ form a group since there does not exist a multiplicative inverse for every element of the integers.

- $\langle \mathbb Q \backslash \{0\}, \cdot \rangle$, the rationals without zero under multiplication with the identity of $1$ and the inverse $a^{-1} = \frac{1}{a}$ forms a group

These rules are strong enough to introduce the notion of **cancellation**.  In a group $G$, if $a * b = a * c$, then $b = c$ by left cancellation via 

$$
\begin{aligned}
& a^{-1} * (a * b) = a^{-1} (b * c)\\
\implies & (a^{-1} * a) * c = e * c\\
\implies &= c \\
\end{aligned}
$$

and similarly for right hand cancellation via properties of associativity and identity.

We can also identify that solution to linear equations of the form $a *x = b$ are unique.
- Immediately, we get $a = a^{-1} b$.  If $x_1, x_2$ are the two solutions such that 

$$
a * x_1 = b = a * x_2
$$

then by cancellation, we get $x_1 = x_2$.

For example, let $\langle \Z_5, + \rangle$ be addition $\mod 5$ on the set $\{0, 1, 2, 3, 4, 5 \}$ with the identity $0$.  

| $+$ | $\mathbf 0$ | $\mathbf 1$ | $\mathbf 2$ | $\mathbf 3$ | $\mathbf 4$ | 
|-|-|-|-|-|-|-|
| $\mathbf 0$ | $0$ | $1$ | $2$ | $3$ | $4$ | 
| $\mathbf 1$ | $1$ | $2$ | $3$ | $4$ | $0$ | 
| $\mathbf 2$ | $2$ | $3$ | $4$ | $0$ | $1$ | 
| $\mathbf 3$ | $3$ | $4$ | $0$ | $1$ | $2$ | 
| $\mathbf 4$ | $4$ | $0$ | $1$ | $2$ | $3$ | 

- Since $0$ appears in each row and column, every element has an inverse.  
- By uniqueness of solution, we must have every element appearing in every row and column, which we do.  So $\langle \Z_5, + \rangle$ is a Abelian group.

One way to form groups is via the Cartesian production.  Given groups $\langle G_1, * \rangle, \langle G_2, * \rangle, \langle G_3, * \rangle, .. \langle G_r, * \rangle$, the direct product group $G_1 \times G_2 \times ... \times G_r$ has elements $(a_1, a_2, ..., a_r)$ where $a_i \in G_i$.   The operation is performed elementwise such that if 

$$
(a_1, a_2, ..., a_r) \in G 
$$

and 

$$
(b_1, b_2, ..., b_r) \in G 
$$

then 

$$
(a_1, a_2, ..., a_r) * (b_1, b_2, ..., b_r) = (a_1 * b_1, a_2 * b_2, ..., a_r * b_r)
$$

#### Example

The group $\langle \Z_2 \times Z_2, + \rangle$ consists of the tuplies and addition $\mod 2$.

| $+$ | $(\mathbf {0, 0})$ | $(\mathbf {0, 1})$ | $(\mathbf {1, 0})$ | $(\mathbf {1, 1})$ |
|-|-|-|-|-|-|-|
| $(\mathbf {0, 0})$ | $(0, 0)$ | $(0, 1)$ | $(1, 0)$ | $(1, 1)$ | 
| $(\mathbf {0, 1})$ | $(0, 1)$ | $(0, 0)$ | $(1, 1)$ | $(1, 0)$ | 
| $(\mathbf {1, 0})$ | $(1, 0)$ | $(1, 1)$ | $(0, 0)$ | $(0, 1)$ | 
| $(\mathbf {1, 1})$ | $(1, 1)$ | $(1, 0)$ | $(0, 1)$ | $(0, 0)$ | 

This is called the **Klein 4-group**, and intorduces the concept of permutations as elements of a group, and is a composable function as our operation as opposed to simple arithmetic groups.

#### Example

A permutation of set $A$ is a bijection (one to one, and onto) of $A$ onto itself.  Let 

$$
A = \{ 1,2,3,4 \}
$$

then a permutation 

$$
p_1 = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  3 & 4 & 1 & 3
\end{pmatrix}
$$

meaning 

$$
p_1 = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  \downarrow & \downarrow & \downarrow & \downarrow \\
  3 & 4 & 2 & 1
\end{pmatrix}
$$

There are $n!$ different permutations on $n$ distinct elements.  We can think of $p_1$ as a prefix operation: $p_1 \circ 1 = 3$ or $p_1 \circ 4 = 1$. If

$$
p_2 = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  4 & 3 & 1 & 2
\end{pmatrix}
$$

then 

$$
p_2 \circ p_1 = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  3 & 4 & 2 & 1
\end{pmatrix} \circ
\begin{pmatrix}
  1 & 2 & 3 & 4 \\
  4 & 3 & 1 & 2
\end{pmatrix} = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  1 & 2 & 3 & 4 
\end{pmatrix} = e
$$

is the construction of permutations which is closed under the set of permutations with the identity $e$ and the inverse 

$$
p_1^{-1} = \begin{pmatrix}
  1 & 2 & 3 & 4 \\
  3 & 4 & 1 & 2
\end{pmatrix} = p_2
$$

Composition of permutations is associative: for 

$$
p_1, p_2, p_3; \\ 

(p_1 \circ p_2) \circ p_3 = p_1 \circ (p_2 \circ p_3)
$$ 

and thus the set of all $n!$ permutations on $n$ elements forms a group under composition.

- This is known as a symmetric group on $n$ letters $S_n$.
- Note that composition is not commutative since $p_1 \circ p_2 \neq p_2 \circ p_1$, so $S_4$ is a non-commutative group

### 2.2.1 Subgroups

A subgroup $\langle H, * \rangle$ of $G$ is a group formed from a subset of elements of $G$ where $H < G$ indicates the relation between the two sets where $H \subset G$ is said to be a **proper**  subgroup.

The subgroups $H \backslash \{e\} \subset G$ and $H = G$ are the trivial subgroups.

#### Example

Let $G = \langle \Z_6, + \rangle, H = \langle \{ 0, 2, 4\}, +\rangle$, both $\mod 6$.  We can show that $H \subset G$ is a group: $K = \langle \{0, 3\}, + \rangle$. 

Similarly, $\langle \Z, + \rangle < \langle \mathbb Q, + \rangle < \langle \mathbb R, + \rangle < \langle \mathbb C, + \rangle$

#### Example

Consider the group of permutations on $S_4$, which has a subgroup formed by the closed compositions:

$$
p_0 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      1 & 2 & 3 & 4 
      \end{pmatrix}, \;
p_1 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      2 & 3 & 4 & 1 
      \end{pmatrix},
      \\

p_2 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      3 & 4 & 1 & 2
      \end{pmatrix}, \;
p_3 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      4 & 1 & 2 & 3
      \end{pmatrix},
      \\

p_4 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      2 & 1 & 4 & 3
      \end{pmatrix}, \;
p_5 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      4 & 3 & 2 & 1
      \end{pmatrix},
      \\

p_6 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      3 & 2 & 1 & 4
      \end{pmatrix}, \;
p_7 = \begin{pmatrix}
      1 & 2 & 3 & 4 \\
      1 & 4 & 3 & 2
      \end{pmatrix}
      \\
$$

### 2.2.2 Cyrclic Groups and the Order of an Element

In a group $G$ with a multiplication-like operation, we use $a^n$ to indicate 

$$
\underbrace{a * a * ... * a}_{n \text{ times}}
$$

with $a^0=e$ being the identity element for $G$.

For a group with additive operations $na$ is used to indicate

$$
\underbrace{a + a + ... + a}_{n \text{ times}}
$$

If $a \in G$, any subgroup containing $a$ must also include $a^2, a^3$, etc.

It must also adhere to $e = aa^{-1}, a^{-n} = (a^{-1})^n$. 

For any $a \in G$, the set $\{a^n | n \in \Z\}$ generates a subgroup of $G$ called the **cyclic subgroup**.  $a$ is said to be the **generator** of the subgroup and the resultant group is denote $\langle a \rangle$. 

If every element of a group can be gneerated from a single element, the group is said to be **cyclic**.  

#### Example

$\langle \Z_5, + \rangle$ is cyclice since every element can be generated by $a = 2$.

$$
\begin{aligned}
2 &= 2 \\ 
2 + 2 &= 4 \\
2 + 2 + 2 &= 1 \\  
2 + 2 + 2 + 2 &= 3 \\  
2 + 2 + 2 + 2 + 2 &= 0 \\  
\end{aligned}
$$

In a group $G$ with $a \in G$, the smallest $n$ such that $a^n$ is equal to the identity in $G$ is said to be the **order** of _the element_ $a$. 
- If no such $n$ exists, $a$ is of **infinite order**.
- In $\Z_5$, 2 is of order $5$, as are all non-zero elements of the set.

#### Example

If $G = \langle \Z_6, + \rangle$, then 

$$
\begin{aligned}
\langle 2 \rangle &= \{ 0, 2, 4\}, \\ 
\langle 3 \rangle &= \{ 0, 3\}, \\ 
\langle 5 \rangle &= \{ 0, 1, 2, 3, 4, 5 \}
\end{aligned}
$$ 

Therefore $a \in \Z_6$ is a generator for the group if and only if $a$ and $6$ are relatively prime

[IMAGE Of the planes]

### 2.3 - Cosets

The **left coset** of $H, H < G$ ($G$ not necessarily being commutative), $a * H$ is the set 

$$
\{a * h | h \in H \}
$$

and the right coset $H * a$ is given by the symmetric relation.  In a commutative group, they are obviously equal.

Let $G$ be a group, $H$ a subgroup of $G$, and the left coset $a * H \in G$.  Then, $b \in a *H$ if and only f $b = a * h, h \in H$.  By cancellation, we have $a^{-1}*b \in H$.

To determine if $a,b$ are in the same (left) coset, we simply check the above condition.

#### Exmaple

Let $G = \langle \Z, + \rangle$ and $S_0 = 3 \Z = \{ ..., -6, -3, 0, 3, 6, ...\}$ such that $S_0 < G$.  Now, form the cosets:

$$
\begin{aligned}
S_1 &= S_0 + 1 = \{ ..., -5, -2, 1, 4, 7, ...\} \\ 
S_2 &= S_0 + 2 = \{ ..., -4, -1, 3, 5, 8, ...\} \\ 
\end{aligned}
$$

and observe that neither $S_1, S_2$ are subgroups as they do not have an identity, but the union of all three cover the original group: $G = S_0 \cup S_1 \cup S_2$.

We can determine whether or not two numbers $a =4, b =6$ are in the same coset of $S_0$ by checking whether 

$$
(-a) + b \in S_0 \\
-a + b = 2 \notin S_0
$$

### 2.2.4 - Lagrange's Theorem

Basically, it's a prescription of subgroup size relative to its group.
- Every coset of $H$ in a group $G$ has the same number of elements
- Let $(a * h_1), (a * h_2 )\in a * H$ be two elements ub tge ciset $a * H$.  If they are equal, then we have $h_1 = h_2$, and thereform the elements of a coset are uniquely identified by elements in $H$

It follows, then, that we have the following properties of cosets:
- **reflecivity**: An element $a$ is in the same coset of itself
- **symmetry**: If $a,b$ are in the same coset, then $b,a$ are in the same coset
- **transitivity**: If $a,b$ are in the same coset, and $b,c$ are in the same coset, then $a, c$ are in the same coset as well

Therefore, the relation of "being in the same coset" is an **equivalence relation**, and thus, every equivalence relation _partitions_ its elements into **disjoint sets**.
- It follows then that the distinct coets of $H$ in a group $G$ are disjoint

With these properties and lemmas, **Lagrange's Theorem** states that: If $G$ is a group of finite order, and $H$ a subgroup of $G$, then the order of $H$ _divides_ the order of $G$ such that $|G| \mod |H| = 0$.  We say $a | b$ "$a$ divides $b$" without remainder
- If $|G| < \infty$ and $H < G$, then $|H| \big| |G|$

Lagrange's Theorem implies that every group of prime order is cyclic.
- Let $G$ be of prime order, with $a \in G$ and $e = \mathbf {id}_G$.  Let $ H = \langle a \rangle$, the cyclic subgroup generated by $a$.  Then $a,e \in H$.  But by Lagrange's Theorem, the order of $H$ must ("cleanly") divide the order of $G$.  Since $|G|$ is prime, we must have $|H| = |G|$, thus $a$ generates $G$, so $G$ must be cyclic.

### 2.2.5 - Induced Operations; Isomorphism

Returning to the three sentence cosets we defined earlier, we have $S = \{S_0, S_1, S_2 \}$ and define addition on $S$ as follows: for 

$$
A, B, C \in S; \\

A + B = C
$$

if and only if $a + b = c; \; \forall a, b, c \in A, B, C$.  That is, addition of the sets is defined by **representatives** in the sets.  The operation is said to be the **induced operations** on the coset: $S_1 + S_2 = S_0$.

Taking $1 \in S_1, 2 \in S_2$ and noting that $1 + 2 = 3 \in S_0$.   Similarly, $S_1 + S_1 = S_2$ via $1 + 1 = 2$, taking the representatives to be $1 \in S_1$.  Based on this induced operation, we can obtain the following table 


| $+$   | $S_0$ | $S_1$ | $S_2$ |
|-------|-------|-------|-------|
| $S_0$ | $S_0$ | $S_1$ | $S_2$ |
| $S_1$ | $S_1$ | $S_2$ | $S_0$ |
| $S_2$ | $S_2$ | $S_0$ | $S_1$ |

which we say is $\cong$ to the table for $\langle \Z_3, + \rangle$: 

| $+$   | $0$ | $1$ | $2$ |
|-------|-------|-------|-------|
| $0$ | $0$ | $1$ | $2$ |
| $1$ | $1$ | $2$ | $0$ |
| $2$ | $2$ | $0$ | $1$ |

Two groups $\langle G, * \rangle, \langle \mathcal G, \diamond \rangle$ are said to be (group) **isomorphic** if there exists a one-to-one, onto function $\phi: G \rarr \mathcal G$ called the isomorphism such that 

$$
\forall a, b \in G, \; \underbrace{\phi(a * b)}_{\text{operation in }  G} = \underbrace{\phi(a) \diamond \phi(b)}_{\text{operation in } \mathcal G}
$$

We denote isomorphism via $G \cong \mathcal G$. Isomorphic groups are essentially "the same thing"

Let $\langle G, * \rangle$ be a group, $H$ a subgroup, and $S = \{ H_0 = H, H_1, H_2, ..., H_m\}$ the set of cosets in $G$.  The induced operation between cosets $A,B \in S$ is defined by $A * B = C$ if and only if $a * b = c$ for any $a, b, c \in A,B,C$ provided that the operation is **well-defined** (no ambiguity for those operands).  

For any commutative group, the induced operation is always well-defined, otherwise only for **normal** groups 
- A subgroup $H$ of $G$ is **normal** if $g^{-1}Hg = H \; \forall g \in G$.  All Abelian groups are normal.

If $H$ is a subgroup of a commutative group $\langle, G, * \rangle$ the induced operation $*$ on the set of cosets of $H$ satisfies 

$$
(a * b) * H = (a * H) * (b * H)
$$

The group formed by the cosets of $H$ in a commutative (or normal subgroup) group $G$ with the induced operation is said to be the **factor group**  of $G \mod H$, denoted $G / H$ and the cosets are called the **residue classes** of $G \mod H$
- We could express $\Z_3 \cong \Z_6/H_0, \; Z/3\Z \cong Z_3$ and in general $\Z / n\Z \cong \Z_n$.

A **Lattice** is formed by taking all the possible linear combination of a set of basis vectors. That is $[\mathbf{v_1}, \mathbf{v_1}, ..., \mathbf{v_1}]$ are a set of linearly independent vectors. A lattive is then formed from the basis by 

$$
\varLambda = \{ v\mathbf{z} : \mathbf{z} \in \Z^n \}
$$

e.g. the lattice formed by $V = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ is the set of points with the integer coorinates in the plane denoted $\Z^2$.

For the lattice $\varLambda = \Z^2$, let $\varLambda' = 2\Z^2$ be a subgroup with the cosets 

$$
\begin{aligned}
S_0 = \varLambda (\cdot), \; &S_1 = (1, 0) + \varLambda' (\circ) \\
S_2 = (0, 1) + \varLambda' (\diamond), \; &S_3 = (1, 1) + \varLambda' (\star) \\
\end{aligned}
$$

and $\varLambda / \varLambda' \cong \Z_2 \times \Z_2$

![](/images/it-10.png)

### 2.2.6 - Homomorphism

A **homomorphism** is a weaker condition than the structural and relational equivalence defined by an isomorphism. A **homorphism** exists when sets have when sets have the same algebraic structure, but they might have a different number of elements.

The groups $\langle G, * \rangle, \langle \mathcal G, \diamond \rangle$ are said to be **homomorphic** if there exists a function. (not necessarily one to one) $\phi: G \rarr \mathcal G$ called the homomorphism such that:

$$
\phi(a * b) = \phi(a) \diamond \phi(b)
$$

#### Example

Let $G = \langle \Z, + \rangle, \mathcal G = \langle \Z_n, + \rangle$, and $\phi(a) = a \mod n$.  For $a, b \in \Z$, we have 

$$
\phi(a + b) = \phi(a) + \phi(b)
$$

This $\Z, \Z_n$ are homomorphic though they clearly have different orders.

Let $\langle G, * \rangle$ be a commutative group, $H$ a subgroup, so that $G / H$ is the factor group.  Let $\phi: G \rarr G/H$ be defined by $\phi(a) = a * H$, then $\phi$ is a homomorph known as the **natural** or **canonical** homomorphism.

The **kernel** of a homomorphism $\phi$ of a group $G$ into a group $\mathcal G$ is the set of all elements of $G$ which mapped to $\mathbf{id}_\mathcal{G}$ by $\phi$.

### 2.3 - Fields

A **Field** $\langle \mathbb F, + , \cdot \rangle$ is a set of of objects $\mathbb F$ on which addition, multiplication, and their inverse operations apply arithmetically (analagously to their behavior on the reals).  The operations of a field must satisfy the following conditions:

1. Closure under addition: $\forall a, b, \in \mathbb F, \; a + b \in \mathbb F$
2. There is an additive identity: $\forall a \in \mathbb F,  \; \exist e \in \mathbb F \; \text{s.t.} \; a + e = a + e = a$ which we denote $0$ 
3. There is an additive inverse (subtraction): $\forall a \in \mathbb F, \; \exist b \in \mathbb F \text{ s.t. } a + b = b + a = 0$ denoted $-a = b$
4. Additive associativity: $\forall a,b,c \in \mathbb F, \; (a + b) + c = a + (b + c)$
5. Additive Commutativity: $\forall a,b \in \mathbb F\, ; a + b = b + a$
6. Closure under multiplication: $\forall a, b \in \mathbb F, \; a \cdot b \in \mathbb F$
7. There is a multiplicative identity: $\forall a \in \mathbb F \backslash \{0\} \;\exist e \in \mathbb F$ denoted $1$ such that $a \cdot 1 = a$
8. Multiplicative inverse: $\forall a \in \mathbb F \backslash \{0\}, \exist b \in \mathbb F \text{ s.t. } a \cdot b = b \cdot a = 1$ denoted $a^{-1} = b$ and called the reciprocal of $a$
9. Multiplicative associativity: $\forall a,b,c \in \mathbb F, \; (a \cdot b) \cdot c = a \cdot (b \cdot c)$
10. Multiplicative commutativity: $\forall a, b \in \mathbb F, \; a \cdot b = b\cdot a$
11. Multiplicative distribution: $\forall a,b,c \in \mathbb F, \; a\cdot(a + b) = a\cdot b + a\cdot c$

The first four requirements imply that elements of $\mathbb F$ form a group under addition and, with the fifth requirement, commmutativity is obtained. The latter conditions imply that the non-zero elements form a commutative group under multiplication.

Like the shorthand for groups, a field $\langle \mathbb F, + , \cdot \rangle$ may be referred to as just $\mathbb F$, and the order of the field may be subscripted as well: a field with $q$ elements may be denoted $\mathbb F_q$.

#### Example 

The field $\mathbb F_2 = \Z_2$ and has the following operation tables which are of particular importance for binary codes:


|XOR|AND|
|--|--|
|<table><tr><th>+</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>0</td></tr> </table> | <table><tr><th>x</th><th>0</th><th>1</th></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>1</td></tr> </table> |

The notion of isomorphism and homomorphism also exist for fields.  

Two fields $F, \mathcal F$ are (field) isomorphic if there exists a bijection $\phi: F \rarr \mathcal F$ such that $\forall a, b \in F$:

$$
\phi(a + b) = \phi(a) + \phi (b)
$$
$$
\phi(ab) = \phi(a)\phi (b)
$$

For example, the field $\langle \{-1, 1 \}, +, \cdot \rangle$ is isomorphic to $GF(2)$ ddefined above via 

$$
\phi = \begin{cases}
  0 \rarr -1 \\
  1 \rarr 1
\end{cases}
$$

Lastly, fields $F, \mathcal F$ are homomorphic if such a structure-preserving map $phi$ exists which is not necessarily bijective.

### 2.4 - Linear 👏 Algebra 👏 Review 

Let $V$ be a set of elements called **vectors** and $\mathbb F$ be a field of element called scalars.  The additive operator is defined element-wise between vectors, and scala multiplication is defined such that for a scalar $a$ and a vector $\mathbf v$

$$
\mathbf v \in V, \; a \cdot \mathbf v \in V
$$

Then, $V$ is a **vector space** over $\mathbb F$ if the additive and multiplicative operators satisfy the following conditions:

1. $V$ forms a commutative group under addition
2. For any elements $a \in \mathbb F, \mathbf v \in V, \; a \cdot \mathbf v \in V$.  This also implies by (1) that we must have $a \cdot \mathbf v + b \cdot \mathbf u \in V$ for all $\mathbf{u, v} \in V, a,b \in \mathbb F$
3. Addition and multiplication are distributive: $(a + b)\cdot \mathbf v = a \cdot \mathbf v + b \cdot \mathbf v$ and $a \cdot (\mathbf {u +v }) = a \cdot \mathbf u + a \cdot \mathbf v$
4. The multiplicative operation is associative: $(a \cdot b) \cdot \mathbf v = a\cdot (b \cdot \mathbf v)$

Then, $\mathbb F$ is called the scalar field of the vector space $V$.

#### Examples

1. The set of $n$-tuples $(v_0, v_1, ..., v_{n-1})$ together with the elements $u_i \in \Reals$ denoted $\Reals^n$ with element-wise addition: 

$$
(v_0, v_1, ..., v_{n-1}) + (u_0, u_1, ..., u_{n-1}) = (v_0 + u_0, v_1 + u_1, ..., v_{n-1} + u_{n-1}) 
$$

and scalar multiplication: 

$$
a \cdot (v_0, v_1, ..., v_{n-1}) = (av_0, av_1, ..., av_{n-1})
$$

2.  The set of $n$-tuples with elements $v_i \in \mathbb F_2$ forms a vector space denoted $\mathbb F^n_2$ with $2^n$ elements.  For $n =3$, the space is completely defined: 

$$
\begin{aligned}
(0,0,0) \quad (0,0,1) \quad (0, 1, 0) \quad (0, 1, 1) \\
(1,0,0) \quad (1,0,1) \quad (1, 1, 0) \quad (1, 1, 1) 
\end{aligned}
$$

3. And, in general, the set $V = \mathbb F^n_q$ of tuples with the field $\mathbb F_q$, element-wise addition, and scalar multiplication constitutes a vector space.

A **Linear Combination** is just the application of these operations in a vector space:

$$
a_1\mathbf{v_1} + a_2\mathbf{v_2} + \cdots + a_k\mathbf{v_k}, \; a_i \in \mathbb F,  \mathbf{v_i} \in V
$$

We observe that the linear combination can be obtained by stacking the vectors as columns:

$$
G = [\mathbf{v_1 v_2 \cdots v_k}]
$$

and taking the prdouct with the column vector of scalar coefficients:

$$
a_1\mathbf{v_1} + a_2\mathbf{v_2} + \cdots + a_k\mathbf{v_k} = G 

\begin{bmatrix}
a_1 \\ a_2 \\ \vdots \\ a_k
\end{bmatrix}
$$

**Spanning Set**: Let $V$ be a vector space.  A set of vectors $G = \{\mathbf{v_1, v_2, ..., v_k} \} \in V$ is said to be a spanning set if every vector $\mathbf{v} \in V$ can be expressed as a linear combination of vectors in $G$.  That is, $\forall \mathbf{v} \in V$, there exists a set of scalars $a_1, a_2, ..., a_k$ such that $a_1\mathbf{v_1} + ... + a_k \mathbf{v_k}$.  The set of vectors obtained from _every possible_ linear combinations of such vectors in $G$ is called the **span** of $G$, aptly denoted $span(G)$. 

If we treat $G$ as a matrix whose columns are the vectors $\mathbf v_i$, 
- $span(G)$ is the set of linear combinations of the columns of $G$
- the **column space** of $G$ is the space obtained by the linear combinations of $G$'s columns
- and similarly, the **row space** of of $G$ is the space obtained by the linear combinations of $G$'s rows

If there are redundant vectors in the spanning set, not all are needed to span the space as they can be expressed in terms of other vectors in the spanning set – the vectors of the spanning set are not linearly independent.

A set of vectors $\mathbf v_1, v_2, ..., v_k$ is said to be **linearly dependent** if a set of scalars $a_1, a_2, ..., a_k$ exists with _not all_ $a_i = 0$ such that their linear combination


$$
a_1\mathbf{v_1} + a_2\mathbf{v_2} + \cdots + a_k\mathbf{v_k} = \mathbf 0 
$$

Conversely, a set of vectors $\mathbf v_1, v_2, ..., v_k$ is said to be **linearly independent** if a set of scalars $a_1, a_2, ..., a_k$ exists such that 

$$
a_1\mathbf{v_1} + a_2\mathbf{v_2} + \cdots + a_k\mathbf{v_k} = \mathbf 0
$$

then it _must be the case_ that $a_1 = a_2 = ... = a_k = 0$.

The spanning set for a vector space that has the minimum possible number of vectors is caleld the **basis** for $V$.  The number of vectors in a basis for $V$ is said to be the **dimension** of $V$.

It follows that the vectors in a basis must be linearly independent, else it would be possible to form a smaller set of vectors.

#### example

Let $V = \mathbb F_2^4$, the set of binary 4-tuples and let $G$ be a set of set of vectors with $W = span(G)$

$$
G = \begin{bmatrix}
      \begin{bmatrix}
        1 \\
        0 \\
        1 \\
        0 
      \end{bmatrix}, 
      \begin{bmatrix}
        0 \\
        1 \\
        1 \\
        0 
      \end{bmatrix},
      \begin{bmatrix}
        1 \\
        1 \\
        0 \\
        0 
      \end{bmatrix}
    \end{bmatrix}, 

W =  \left\{\begin{array}{lr}
       \begin{bmatrix}
        0 \\
        0 \\
        0 \\
        0 
      \end{bmatrix}, 
      \begin{bmatrix}
        1 \\
        0 \\
        1 \\
        0 
      \end{bmatrix},
      \begin{bmatrix}
        0 \\
        1 \\
        1 \\
        0 
      \end{bmatrix},
      \begin{bmatrix}
        1 \\
        1 \\
        0 \\
        0 
      \end{bmatrix}
    \end{array}\right\}
$$

Observe that $G$ is a spanning set for $W$, but not for all of $V$.  $G$ is not a basis for $W$ as it has some redundancy in it since the third vector is a linear combination of the first two:

$$
\begin{bmatrix}
        1 \\
        1 \\
        0 \\
        0 
      \end{bmatrix} =
      \begin{bmatrix}
        1 \\
        0 \\
        1 \\
        0 
      \end{bmatrix} + 
      \begin{bmatrix}
        0 \\
        1 \\
        1 \\
        0 
      \end{bmatrix}
$$

and the vectors in $G$ are not linearly independent, so the third vector in $G$ can be removed, resulting in the set:


$$
G' = \begin{bmatrix}
      \begin{bmatrix}
        1 \\
        0 \\
        1 \\
        0 
      \end{bmatrix}, 
      \begin{bmatrix}
        1 \\
        1 \\
        0 \\
        0 
      \end{bmatrix}
    \end{bmatrix}
$$

which does have $span(G') = W$.

Notice that no spanning set for $W$ has fewer vectors in it than $G'$, so $dim(W)=2$.

- Let $V$ be a $k$-dimensional vector space defined over a finite scalar field.  The number of elements in $V$, denoted $|V|= q^k$.  Since every vector $\mathbf v \in V$ can be written as 

$$
\mathbf v = a_1 \mathbf v_1 + ... + a_k\mathbf v_k
$$

the number of elements in $V$ is the number of distinct $k$-tuples $(a_1, a_2, ..., a_k)$ that can be formed, which is $q^k$.

- Let $V$ be a vector space over a scalar field $\mathbb F$, and let $W \subset V$ be a vector space.  For any $\mathbf{w_1,w_2} \in W$ 

$$
a \mathbf{w_1} + b \mathbf{w_2} \in W
$$

for any $a,b \in \mathbb F$.  Then, $W$ is said to be a **vector subspace** of $\mathbb F$.

- Let $\mathbf u = (u_0, u_1, ..., u_{n-1}), \mathbf v = (v_0, v_1, ..., v_{n-1})$ be vectors in a vector space $V$ where $u_i, v_i \in \mathbb F$.  The **inner product** is a function of two such vectors which returns a scalar, expressed as $\langle \mathbf u, \mathbf v \rangle$ and defined:

$$
\langle \mathbf u, \mathbf v \rangle = \mathbf u \cdot \mathbf v = \sum_{i=0}^{n-1} u_i \cdot v_i
$$

from which we can verify the following properties:

1. Commutativity: $\mathbf u \cdot \mathbf v = \mathbf v \cdot \mathbf u$
2. Associativity: $a \cdot (\mathbf u \cdot \mathbf v) = (a \cdot \mathbf u) \cdot \mathbf v$
3. Distributivity: $\mathbf u \cdot (\mathbf v + \mathbf w) = \mathbf u \cdot \mathbf v + \mathbf u \cdot \mathbf w$

The inner or **dot product** is used to describe the notion of orthogonality: two vectors are said to be **orthogonal** if 

$$
\mathbf u \cdot \mathbf v = 0,
$$ 

indicated $\mathbf u \perp \mathbf v$.

Combined with the notion of vector spaces, we get the concept of a **dual space**.  If $W$ is a $k$-dimensional subspace of a vector space $V$, the set of all vectors $\mathbf u \in V$ which are orthogonal to all vectors of $W$ is the orthogonal complement, dual space, or **null space** denoted $W^\perp$, given by 

$$
W^\perp = \{ \mathbf u | \mathbf u \cdot \mathbf w = 0; \; \mathbf{u, w} \in V, W\}
$$

#### Example

Let $V = \mathbb F_2^4$ and 

$$
W =  \left\{\begin{array}{lr}
       \begin{bmatrix}
        0 \\
        0 \\
        0 \\
        0 
      \end{bmatrix}, 
      \begin{bmatrix}
        1 \\
        0 \\
        1 \\
        0 
      \end{bmatrix},
      \begin{bmatrix}
        0 \\
        1 \\
        1 \\
        0 
      \end{bmatrix},
      \begin{bmatrix}
        1 \\
        1 \\
        0 \\
        0 
      \end{bmatrix}
    \end{array}\right\} 
    = span  \left( \left\{ \begin{array}{lr}
       \begin{bmatrix}
        0 \\
        0 \\
        0 \\
        1
      \end{bmatrix}, 
      \begin{bmatrix}
        1 \\
        1 \\
        1 \\
        0 
      \end{bmatrix}
    \end{array}\right\} \right)
$$

and $dim(W^\perp) = 2$.  This example gives way to the following theorem:

Let $V$ be a finite-dimensional vector space of $n$-tuples, $\mathbb F^n$, with a subspace $W$ of dimension $k$.  Let $U = W^\perp$ be the dual of $W$, then 

$$
dim(W^\perp) = dim(V) - dim(W) = n - k
$$

#### Proof

Let $g_1, g_2, ..., g_k$ be a basis for $W$ such that $G = [g_1 \; g_2 \; \cdots \; g_k]$, a rank $k$ matrix such that the dimension of the row and column spaces are both $k$.  Any vector $\mathbb w \in W$ is of the form $\mathbf w = G\mathbf x, \mathbf x\in \mathbb F^k$.  

Any vector $\mathbf u \in U$ must satisfy $\mathbf u^\perp G \mathbf x =0; \; \forall \mathbf x \in \mathbb F^k$.

Let $\{ \mathbf h_1, \mathbf h_2, ..., \mathbf h_r, \mathbf f_1, \mathbf f_2, ..., \mathbf f_{n-r} \}$ be a basis for $\mathbf w^\perp$ extended to the whole $n$-dimensional space.  Every vector $\mathbf v$ in the row space of $G$ is expressed as $\mathbf v = \mathbf b^\perp G$ for some $\mathbf b \in V$.  

But since $\{ \mathbf h_1, \mathbf h_2, ..., \mathbf h_r, \mathbf f_1, \mathbf f_2, ..., \mathbf f_{n-r} \}$ spans $V$, $\mathbf b$ must be a linear combination of these vectors:

$$
\mathbf b = a_1\mathbf h_1 + a_2\mathbf h_2 + ... + a_r\mathbf h_r + a_{r+1}\mathbf h_{r+1} + ... + a_n\mathbf h_{n-r}
$$

so a vector $\mathbf v$ in the row space of $G$ can be written 

$$
\mathbf v = a_1 \mathbf h_1^T G + ... + a_n \mathbf f_{n-r}^T G
$$

from which we observe that the row space of $G$ is spanned by the vectors 

$$
\{ \mathbf h_1^T G, \mathbf h_2^T G, ..., \mathbf h_r^T G, \mathbf f_1^T G, ..., \mathbf f_{n-r}^T G \}
$$

The vectors $\{ \mathbf h_1, \mathbf h_2, ..., \mathbf h_r, \}$ are in $W^\perp$, so $\mathbf h_i^TG = \mathbf 0$ for $i = 1,2, ..., r$.  The remaining vectors $\{\mathbf f_1^TG, ..., \mathbf f_{n-r}^TG \}$ remain to span the $k$-dimensional row space of $G$. Hence we must have $n -r \geq k$.

Furthermore, these vectors are linearly independent because if there is a set of coefficients $\{ a_i \}$ then 

$$
a_1 (\mathbf f_1^T G ) + ... + a_{n-r} (\mathbf f_{n-r}^T G ) = \mathbf 0 
$$

but the vectors $\mathbf f_i$ are not in $W^\perp$, so we must have 

$$
a_1 \mathbf f_1^T + ... + a_{n-r} \mathbf f_{n-r}^T = 0
$$

and since $\{ \mathbf f_i \}$ are linearly independent, we must have $a_1 = a_2 = ... = a_{n-r}$ therefore it must be the case that 

$$
dim \; span(\{ \mathbf f_1^TG, ..., \mathbf f_{n-r}^TG = k \})
$$

so $n - r \geq k$.

## <a name="wiley-3" class="n"></a> 3 | Linearly Block Codes

### 3.1 - Basic Definitions

A $[n, k]$ **Block Code** $\mathcal C$ over an alphabet of $q$ symbols is a set of $q^k$ $n$-vectors called **codewords** or **code vectors**
- An $n$-tuple is: $(c_0, c_1, ..., c_{n-1}) \mathcal A^n$ with $n$ elements

Associated with the code is an encoder which maps a **message**, a $k$-tuple $\mathbf m \in \mathcal A^k$, to its associated word.  To be _correctively_ useful, we desire a one-to-one correspondence between a message $\mathbf m$ and its codeword $\mathbf c$ for a given code $\mathcal C$, and there might be several such mappings.

Block codes can be exhaustively represented, but for large $k$, this would be prohibitively complex to store and decode. This complexity can be reduced by imposing structure on the code, the most common such structure being _linearity_.

A block code $\mathcal C$ over a field $\mathbb F_q$ of $q$ symbols with length $n$ and $q^k$ codewords is a $q$-ary $[n, k]$ **Linear Block Code** if and only if its $q^k$ codewords form a $k$-dimensional vector subspace of the vector space of _all_ the $n$-tuples $\mathbb F_q^n$.
- $n$ is said to be the **length** of the code
- $k$ is the **dimension** of the code
- $R$ is the proportional **rate** of the code $R = k/n$


For a linear code, the sum of any two codewords is _also_ a codeword.  Furthermore, and linear combination of codewords is a codeword.

The **Hamming Weight** $wt(\mathbf c)$ of a  codeword $\mathbf c$ is the number of non-zero components (usually _bits_) of the codeword. 
- The minimum weight $w_{min}$ of a code $\mathcal C$ is the smallest Hamming weight of any non-zero codeword:

$$
w_{min} = \min_{{\mathbf c \in \mathcal C \atop \mathbf c \neq \mathbf 0}} wt(\mathbf c)
$$

For any linear code $\mathcal C$, the minimum distance $d_{min}$ satisfies $d_{min} = w_{min}$.  That is, the minimum distance of a linear block code is equal to the minimum weight of its non-zero codewords.

This can be proved by translating the difference of two codewords (a linear combination, and thus another codeword) "to the origin":

$$
d_{min} = \min_{{\mathbf c_i, \mathbf c_j \in \mathcal C \atop \mathbf c_i \neq \mathbf c_j}} d_H (\mathbf c_i, \mathbf c_j) = \min_{{\mathbf c_i, \mathbf c_j \in \mathcal C \atop \mathbf c_i \neq \mathbf c_j}} d_H(\mathbf c_i - \mathbf c_j, \mathbf c_j - \mathbf c_j) = \min_{{\mathbf c \in \mathcal C \atop \mathbf c \neq \mathbf 0}} w(\mathbf c)
$$

- As an aside, I don't love the degeneracy of the notation here, so I'm just going to scrap it and use $w(\mathbf c)$ to denote weight from here on out

An $[n, k]$ code with minimum distace $d_{min}$ is denoted $[n, k, d]$.  The random error correcting capability of a code with $d_{min}$ is 

$$
t = \lfloor (d_{min}-1)/2 \rfloor
$$

### 3.2 - Generator Matrix Description of Linear Block Codes

Since a linear block code $\mathcal C$ is a $k$-dimensional vector space, there exist $k$ linearly independent vectors which are designated $\mathbf g_0, \mathbf g_1, ..., \mathbf g_{k-1}$ such that every codeword $\mathbf c \in \mathcal C$ can be represented as a linear combination of these vectors:

$$
\mathbf c = m_0\mathbf g_0 + m_1 \mathbf g_1 + ... + m_{k-1}\mathbf g_{k-1}, \; m_i \in \mathbb F_q
$$

Considering \mathbf g_i as row vectors and stacking them, form a $k \times n$ matrix $G$:

$$
G = 
\begin{bmatrix}
  \mathbf g_0 \\
  \mathbf g_1 \\
  \vdots \\
  \mathbf g_{k-1}
\end{bmatrix}
$$

and let $\mathbf m = [m_0, m_1, ..., m_{k-1}]$ such that $\mathbf c = \mathbf mG$.  Thus, every codeword $\mathbf c \in \mathcal C$ has a representation for some vector $\mathbf m$.  Since the rows of $G$ (generate) span the $[n, k]$ linear code $\mathcal C$, $G$ gets its name as a **Generator Matrix** for the code $\mathcal C$.

$\mathbf c = \mathbf mG$ can be understood as the **encoding** operation for the code $\mathcal C$ and thus only requires storing $k$ vectors of length $n$ (rather than the $q^k$ vectors that would be required to store all the codewords of a non-linear code).

Note that the representation provided by $G$ is not unique, as we can devise another $G'$ via row operations consisting of non-zero linear combinations such that an encoding $\mathbf c = \mathbf mG'$ maps $\mathbf m$ to a codeword in $\mathcal C$ which is not necessarily the same one obtained by $G$.

For the $[7,4]$ Hamming code (used as an example for the rest of this section), we have the following generator matrix:

$$
G = 
\begin{bmatrix}
1 & 1 & 0 & 1 & 0 & 0 & 0 \\
0 & 1 & 1 & 0 & 1 & 0 & 0 \\
0 & 0 & 1 & 1 & 0 & 1 & 0 \\
0 & 0 & 0 & 1 & 1 & 0 & 1
\end{bmatrix}
$$

such that to encode a message $\mathbf m = [1 \; 0 \; 0 \; 1]$, we add the first and fourth rows of $G (\mod 2)$ to obtain $\mathbf c = [1 \; 1 \; 0 \; 0 \; 1 \; 0 \; 1]$.

Another generator $G'$ can be used by replacing $R_1 \larr R_1 + R_2$ such that $\mathbf c' = \mathbf m G' = [1 \; 0 \; 1 \; 0 \; 0 \; 0 \; 1]$ which is a different codeword than the original $\mathbf c \in \mathcal C$.

Let $\mathcal C$ be an $[n, k]$ be a (not-necessarily linear) block code.  An encoder is **systematic** if message symbols $m_0, m_1, ..., m_{k-1}$ may be found explicitly and unchanged in the codeword such that for coordinates $i_0, i_1, ..., i_{k-1}$. (which are typically sequentially defined: $i_0, i_0 + 1, ..., i_0 + k -1$) such that $c_{i_0} = m_0, c_{i_1} = m_1, ..., c_{i_{k-1}} = m_{k-1}$.

Note that the systematicism is a property of the _encoder_, not the code itself.  For a linear block code, the encoding operation defined by $G$ is systematic if an **identity matrix** can be identified among the rows of $G$.  (Neither $G, G'$ in the example above are systematic).

A systematic generator is often expressed:

$$
G = [P \; I_k] = 
\begin{bmatrix}
p_{0,0} & p_{0,1} & \cdots & p_{0, n - k -1} & & 1 & 0 & 0 & \cdots & 0 \\  
p_{1,0} & p_{1,1} & \cdots & p_{1, n - k -1} & & 0 & 1 & 0 & \cdots & 0 \\  
p_{2,0} & p_{2,1} & \cdots & p_{2, n - k -1} & & 0 & 0 & 1 & \cdots & 0 \\ 
\vdots &  \vdots  & \vdots & \vdots          & & \;& \;& \;& \vdots & \vdots \\   
p_{k-1,0} & p_{k-1,1} & \cdots & p_{k-1, n - k -1} & & 0 & 0 & 0 & \cdots & 1 \\
\end{bmatrix}
$$

where $I_k$ is the $k \times k$ identity matrix and $p$ is an $k \times (n-k)$ matrix which generates **parity** symbols. The encoding operation is then $\mathbf c = \mathbf m[P \; I_k] = [\mathbf m P \; \mathbf m]$.

The codeword is divided into two components:
- The part $\mathbf m$ which consists of the message symbols
- The part $\mathbf mP$ which consists of **parity check symbols**

Elementary row operations do not change the rowspan, so the same code is produced.  However, interchanging the columns corresponds to a change in the positions of the message symbols, so the resultant code bits are also swapped, but the distance structure of the code on the whole is preserved.

Two linear codes which are the same except for some permutation of the components of the code are said to be _equivalent_.  Let $G$ and $G'$ be generator matrices of equivalent codes.  Then $G, G'$ are related by:
- Columnal permutation
- Elementary row operations

Given any arbitrary $G$, it is possible to put it into the form $[P \; I_k]$ above via Gaussian elimination and pivoting.

#### Example 

For $G$ of the $[7,4]$ Hamming code used before, an equivalent generator matrix in systematic form is :

$$
G'' = \begin{bmatrix}
1 & 1 & 0 & \; & 1 & 0 & 0 & 0 \\
0 & 1 & 1 & \; & 0 & 1 & 0 & 0 \\
1 & 1 & 1 & \; & 0 & 0 & 1 & 0 \\
1 & 0 & 1 & \; & 0 & 0 & 0 & 1 \\
\end{bmatrix}
$$

and for the Hamming code with this generator, let the message $\mathbf m = [m_0, m_1, m_2, m_3]$ with the corresponding codeword $\mathbf c = [c_0, c_1, ..., c_6]$.  Then, the parity bits are obtained via:

$$
\begin{aligned}
c_0 = m_0 + m_1 + m_3 \\
c_1 = m_0 + m_1 + m_2 \\
c_2 = m_1 + m_1 + m_3 \\
\end{aligned}
$$

And the systematically encoded bits are:

$$
\begin{aligned}
c_3 = m_0 \\
c_4 = m_1 \\
c_5 = m_2 \\
c_6 = m_3
\end{aligned}
$$

### 3.3 - Parity Check Matrix for Dual Codes

Since a linear code $\mathcal C$ is a $k$-dimensional vector subspace of $\mathbb F_q^n$, then there must be a dual space to $\mathcal C$ of dimension $n-k$.  The dial space to an $[n-k]$ code $\mathcal C$ of $dim \; k$ is the $[n, n-k]$ **dual code** of $\mathcal C$, denoted $\mathcal C^\perp$.
- It is possible for a code $\mathcal C = \mathcal C^\perp$ to exist

As a vector space, $\mathcal C^\perp$ has a basis which can be denoted by $\{\mathbf h_0, \mathbf h_1, ..., \mathbf h_{n - k -1}\}$, with a matrix using these basis vectors as rows:

$$
H = \begin{bmatrix}
\mathbf h_0 \\
\mathbf h_1\\ 
\vdots \\
\mathbf h_{n - k -1}
\end{bmatrix}
$$

which is known as the **parity check matrix** for $\mathcal C$.  This parity check matric and generator matrix for a code satisfy $GH^T = \mathbf 0$.  The parity check matrix also has the following important property:

Let $\mathcal C$ be a $[n, k]$ linear code over $\mathbb F_q$ and $H$ be a parity check matrix for $\mathcal C$.  A vector $\mathbf v \in \mathbb F_q^n$ is a codeword if and only if $\mathbf vH^T = 0$.  That is, the codewords in $\mathcal C$ lie in the (left) nullspace of $H$.

#### Example

For the systematic generator $G''$ above, the parity check matrix is 

$$
H = \begin{bmatrix}
1 & 0 & 0 & \; & 1 & 0 & 1 & 1 \\
0 & 1 & 0 & \; & 1 & 1 & 1 & 0 \\
0 & 0 & 1 & \; & 0 & 1 & 1 & 1 \\
\end{bmatrix}
$$

and it can be verified that $G''H^T = \mathbf 0$.  Fruthermore, even though $G$ is not in systematic form, it still generates the same code such that $GH^T = \mathbf 0$.  $H$ is a generator matrix for a $[7, 3]$ code, the dual to the $[7, 4]$ Hamming Code.

This condition $\mathbf cH^T = \mathbf 0$ imposes linear constraints among the bits of $\mathbf c$ called the **Parity Check Equations**.

The parity check matrix $H$ above yields 

$$
\begin{aligned}
c_0 + c_3 + c_5 + c_6 = 0 \implies c_0 = c_3 + c_5 + c_6 \\
c_1 + c_3 + c_4 + c_5 = 0 \implies c_1 = c_3 + c_4 + c_5 \\
c_2 + c_4 + c_5 + c_6 = 0 \implies c_2 = c_4 + c_5 + c_6 \\
\end{aligned}
$$

The parity check matrix for a code (systematic or not) provides information about the minimum distance of the code.

Let a linear block code $\mathcal C$ have a parity check matrix $H$.  The minimum distant $d_{min}$ of $\mathcal C$ is equal to the smallest positive number of columns of $H$ which are linearly dependent.  That is, all combinations of $d_{min}-1$ columns are linearly independent, so there is some set of $d_{min}$ columns which are linearly dependent. 

#### Example 

For the parity check matrix $H$ of $G''$, the parity check condition is:

$$
\begin{aligned}
\mathbf cH^T &= [c_0, c_1, ..., c_6] 
  \begin{bmatrix}
    1 & 0 & 0 \\
    0 & 1 & 0 \\
    0 & 0 & 1 \\
    0 & 1 & 1 \\
    1 & 1 & 1 \\
    1 & 0 & 1 \\
  \end{bmatrix} \\
  &= c_0[1, 0, 0] + c_1[0, 1, 0] + c_2[0, 0, 1]  \\ 
  & + c_3[1, 1, 0] + c_4[0, 1, 1] + c_5[1, 1, 1] + c_6[1, 0, 1]
\end{aligned}
$$

The first, second, and fourth rows of $H^T$ are linearly dependent, and no fewer rows of $H^T$ are linearly dependent. 

### 3.3.1 - Simple Bounds on Block Codes

The **Singleston Bound**: the minimum distance for an $[n, k]$ linear code is bounded by $d_{min} \leq n - k + 1$.

Proof: An $[n, k]$ linear code has a parity check matrix with $n - k$ linearly idnependent rows.  Since the row rank of a matrix is equal to its column rank, $rank(H) = n - k$.  Any collection of $n - k + 1$ columns must therefore be linearly dependent.  Thus, the minimum distance cannot be larger than $n - k + 1$.

- A code for which the minimum distance is $n - k -1$ is called a **Maximum Distance Separable** code.

#### Hamming Spheres

A roud each code "point" is a cloud of points corresponding to _non-codewords_.  For a $q$-ary code, there are $(q - 1)n$ vectors at Hamming distance of 1 away from the codeword, 

$$
(q-1)^2 {n \choose 2}
$$ 

vectors at Hamming distance 2, and 

$$
(q - 1)^\ell {n \choose \ell}
$$

vectors at distance $\ell$ from the codeword.

Let $\mathcal C$ be a code of length $n = 4$ over $GF(3)$, so $q = 3$.  Then the vectors at a Hamming distance of 1 from the codeword $[0, 0, 0, 0]$ are:

$$
\begin{aligned}
[1, 0, 0, 0], \; [0, 1, 0, 0], \; [0, 0, 1, 0], \; [0, 0, 0, 1], \\ 
[2, 0, 0, 0], \; [0, 2, 0, 0], \; [0, 0, 2, 0], \; [0, 0, 0, 2]
\end{aligned}
$$

The vectors are Hamming distance less than or equal to $t$ away from a codeword from a sphere "sphere" called the Hamming Sphere of radius $t$.  The number of codewords in a Hamming sphere up to radius $t$ for a code length $n$ over alphabet of $q$ symbols is denoted $V_q(n, t)$.

$$
V_q(n, t) = \sum_{j = 0}^t {n \choose j}(q - 1)^j
$$

The bounded distance decoding sphere of a codeword is the Hamming sphere of radius 

$$
t = \lfloor (d_{min} - 1) / 2 \rfloor
$$

around that codeword.  Equivalently, a code whose random error correction capability is $t$ must have a minimum distance between codewords satisfying $d_{min} \geq 2t + 1$.

The **redundancy** of a code is the number of parity symbols in a codeword: $r = n - \log_q M$ where $M$ is the number of codewords.  For a linear code, we have 

$$
M = q^k \implies r = n - k
$$

#### Hamming Bound

A $t$-random error correcting $q$-ary code $\mathcal C$ must have redundancy $r$ satisfying $r \geq \log_q V_q(n, t)$. 

Proof: Each of $M$ spheres in $\mathcal C$ has radius $t$ with no overlap, esle it would not be possible to decode $t$ errors.  The total number of points enclosed by the spheres must be less than or equal to $q^n$, thus 

$$
MV_q(n, t) \leq q^n \implies q^n/M \geq V_q(n, t)
$$

from which the result follows from taking $\log_q$ from both sides.

A code satisfying this bound with equality is said said to be a **perfect code**, a designation of how the points fall into the spheres rather than the performance of the code.  The entire set of perfect codes is:

1. The set of all $n$-tuples with minimum distance of 1, with $t = 0$
2. Odd-length binary repetition codes
3. Linear Binary Hamming codes or other non-linear codes with equivalent parameters
4. The Golay code $[23, 12, 7]$

### 3.4 - Error Detection and Correction Over Hard-Input Channels

Let $\mathbf r$ be an $n$-vector over $\mathbb F_q$ and let $H$ be a parity check matric for a code $\mathcal C$.  The vector $\mathbf s = \mathbf r H^T$ is called the **Syndrome** of $\mathbf r$.  $\mathbf{s = 0}$ if an only if $\mathbf r$ is a codeword of $\mathcal C$, otherwise it indicates the presence of error in the intended codeword $\mathbf r$.

### 3.4.1 - Error Detection

Suppose codeword $\mathbf c$ in a binary linear block code $\mathcal C$ over $\mathbb F_q$ is transmitted through a channel and that the $n$-vector $\mathbf r$ is received.  We write $\mathbf{r = c + e}$, where $\mathbf e$ is the error vector hopefully equal to the zero vector.  However, the received vector $\mathbf r$ could be any vector in $\mathbb F^n_q$, since any error pattern is possible.  If $H$ is the parity check matrix for $\mathcal C$, then the syndrome is given by 

$$
\mathbf{s = r}H^T = (\mathbf{c + e})H^T = \mathbf E H^T
$$

and $\mathbf{s = 0}$ if $\mathbf r$ is a codeword.  If $\mathbf{s \neq 0}$, then an error has been detected.

### 3.4.1 - Error Detection: the Standard Array

Using Maximum Likelihood Detection, decoding a vector $\mathbf r$ consists of selecting the codeword $\mathbf c \in \mathcal C$ closest to $\mathbf r$ in terms of Hamming distance:

$$
\hat{\mathbf c} = \arg \min \limits_{\mathbf c \in \mathcal C} d_H(\mathbf{c, r})
$$

Let the set of codewords in the code be ${\mathbf{c_0, c_1, ..., c}_{M-1}}$, where $M = q^k$, with $\mathbf{c_0 = 0}$, and $V_i$ denote the set of $n$-vectors  closer to $\mathbf c_i$ than any other codeword (with ties broken arbitrarily).  The set $\{V_i | i \in [0, M-1] \}$ partitions the space of $n$-vectors into $M$ disjoint subsets.  If $\mathbf r$ falls into $V_i$, then being closer to $\mathbf c_i$ than any other codeword, $\mathbf r$ is decoded to $\mathbf c_i$, so we simply must define all $V_i$.

The **Standard Array** is a representation of the partition $\{V_i\}$; a two-dimensional array with columns being the $V_i$. It is constructed by taking every codeword $\mathbf c_i$ belonging to its own set $V_i$.  Writing down the set of codewords thus gives the first row of the array.  From the remaining vectors in $\mathbb F_q^2$, find $\mathbf e_1$ of smallest weight which must lie in the set $V_0$ since it is closest to $\mathbf{c_0 = 0}$.  But 

$$
d_H(\mathbf{e_1 + c_i, c_i}) = d_H(\mathbf{e_1, 0}); \forall i
$$

so the vector $\mathbf e_1 + \mathbf c_i$ must also lie in $V_1$ for each $i$, so $\mathbf e_1 + \mathbf c_i$ is placed into each $V_i$.  The vectors are included in their respective columns of the standard array to form the second row.  We continue this proecdure, selecting an unused vector of minimum weight and addint it to each codeword to form the next row, until all $q^n$ possible vectors have been used.

In summary:
1. Write down all codewords of $\mathcal C$
2. Select from remaining unused vectors of $\mathbb F_q^n$ one of minimal weight $\mathbf e$.  Write $\mathbf e$ in the column under the all-zero codeword, then add $\mathbf e$ to each codeword in turn, writing the sum in the column under the corresponing codeword
3. Repeat (2) until all $q^n$ vectors in $\mathbb F_q^n$ have been placed in the array.

#### Example 

For $[7, 3]$, with 

$$
G = 
\begin{bmatrix}
 0 & 1 & 1 & \; & 1 & 1 & 0 & 0 \\
 1 & 0 & 1 & \; & 1 & 0 & 1 & 0 \\
 1 & 1 & 0 & \; & 1 & 0 & 0 & 1 \\
\end{bmatrix}
$$

the codewords are:

$$
\begin{array}{cc:cccccc}
R_1 & 0000000 & 0111100 & 1011010 & 1100110 & 1101001 & 1010101 & 0110011 & 0001111
\end{array}
$$

from the remaining $7$-tuples, one of minimum weight is selected (e.g. $1000000$), the second row is obtained by adding this to each codeword:

$$
\begin{array}{cc:cccccc}
R_2 & 1000000 & 1111100 & 0011010 & 0100110 & 0101001 & 0010101 & 1110011 & 1001111
\end{array}
$$

and proceed until all $2^n$ vectors are used, selecting an unused vector of minimum weight and adding it to all codewords:

#### The Complete Standard Array for [7, 3]
$$
\begin{array}{cc:ccccccc}
1  & 0000000 & 0111100 & 1011010 & 1100110 & 1101001 & 1010101 & \mathbf{0110011} & 0001111\\ \hline
2  & 1000000 & 1111100 & 0011010 & 0100110 & 0101001 & 0010101 & 1110011 & 1001111 \\  
3  & 0100000 & 0011100 & 1111010 & 1000110 & 1001001 & 1110101 & 0010011 & 0101111 \\
4  & 0010000 & 1011000 & 1001010 & 1110110 & 1111001 & 1000101 & 0100011 & 0011111 \\
5  & 0001000 & 0110100 & 1010010 & 1101110 & 1100001 & 1011101 & 0111011 & 0000111 \\
6  & 0000100 & 0111000 & 1011110 & 1100010 & 1101101 & 1010001 & 0110111 & 0001011 \\
7  & 0000010 & 0111110 & 1011000 & 1100100 & 1101011 & 1010111 & 0110001 & 0001101 \\
8  & 0000001 & 0111101 & 1011011 & 1100111 & 1101000 & 1010100 & 0110010 & 0001110 \\ \hline 
9  & 1100000 & 1011100 & 0111010 & 0000110 & 0001001 & 0110101 & 1010011 & 1101111 \\
10 & 1010000 & 1101100 & 0001010 & 0110110 & 0111001 & 0000101 & 1100011 & 1011111 \\
11 & 0110000 & 0001100 & 1101010 & 1010110 & 1011001 & 1100101 & 0000011 & 0111111 \\
12 & 1001000 & 1110100 & 0010010 & 0101110 & 0100001 & 0011101 & 1111011 & 1000111 \\
13 & \mathbf{0101000}  & 0010100 & 1110010 & 1001110 & 1000001 & 1111101 & \mathbf{0011011} & 0100111 \\
14 & 0011000 & 0100100 & 1000010 & 1111110 & 1110001 & 1001101 & 0101011 & 0010111 \\
15 & 1000100 & 1111000 & 0011110 & 0100010 & 0101101 & 0010001 & 1110111 & 1001011 \\ \hline 
16 & 1110000 & 1001100 & 0101010 & 0010110 & 0011001 & 0100101 & 1000011 & 1111111 \\

\end{array}

$$

From which we can draw the following observations:
1. There are $q^k$ codeword columns and $q^n$ possible vectors, so there are $q^{n-k}$ rows in the standard array.  Therefore, an $[n, k]$ code is capable of correcting $q^{n-k}$ different error patterns

2. The difference (sum over $GF(2)$) of any two vectors in the same row is a code vector.  In a row, vectors are $\mathbf c_i + \mathbf e$ and $\mathbf c_j + \mathbf e$, which is a codeword since linear spaces form a subspace.

3. No two vectors in the same row are identical, otherwise $\mathbf c_i + \mathbf e = \mathbf c_j + \mathbf e$ with $i \neq j$, which is impossible.

4. Every vector appears exactly once in the standard array.  we know every vector must appear at least once, by construction.  If a vector appears in both the $ell$-th and $m$-th row, we must have

$$
\mathbf c_i + \mathbf e_\ell = \mathbf c_j + \mathbf e_m
$$

and for $\ell < m$, we have $\mathbf e_m = \mathbf e_\ell + \mathbf c_i - \mathbf c_j = \mathbf e_\ell + \mathbf c_k$ for some $k$ meaning $\mathbf e_m$ is on the $\ell$-th row of the array, which is a contradiction.

Rows of the standard array are **cosets** of the form $\mathbf e + \mathcal C = \{ \mathbf{e + c} | \mathbf c \in \mathcal C \}$ that is, rowas are translations of the code
- Vectors in the first column are called **coset leaders** representing the error patterns that can be corrected by the code under this decoding strategy.  The decoder in the example which the table corresponds to can correct:
  - all errors of weight 1, 
  - seven errors of weight 2,
  - and 1 error pattern of weight 3


To actually _use_ the standard array, we locate the received error vector $\mathbf r$, the identify $\mathbf{r = e + c}$ for some error $\mathbf e$ which is a coset leader (left column) and a codeword $\mathbf c$ in the top row.  Since our standard array cosntruction fills the table in order of increasing error weight, the error codeword _is_ the ML decision.

#### Example

Let $\mathbf r = [0,0,1,1,0,1,1]$.  It's coset leader is $\mathbf e = [0, 1, 0, 1, 0, 0, 0]$ (shown in bold in the table) which corresponds to $\mathbf m = [0, 1, 1]$ since the generator is systematic.

#### Example 

Not all ${7 \choose 2} = 21 $ patterns of two errors are correctable under this example code and standard array.  Only seven patterns of 2, and one error of 3.  Thus, the minimum distance is 4 since the weight of non-zero codewords is 4.  Thus, the code is only guaranteed to be correct for $\lfloor (4-1)/2 \rfloor = 1$ error, but it _does_ correct all of these.

A **Complete Error Correcting Decoder** is a decoder that, given a received word $\mathbf r$, selects codeword $\mathbf c$ which minimizes $d_H(\mathbf{r, c})$.  If a standard array is used as the decoding mechanism, then compelte decoding is achieved.  On the other hand, if it is filled out such that up to $t$ instances of errors appear in the table, and all further rows are ommitted, the a bounded distance decoder is obtained.

A $t$-error correcting **Bounded Distance Decoder** selects the codeword $\mathbf c$ given the recieved vector $\mathbf r$ if $d_H(\mathbf {r, c}) \leq t$.  If no such $\mathbf c$ exists, a **decoder failure** occurs.
- E.g., if only rows 1 through 8 in the example standard array above were used, a $\mathbf r$ in rows 9-16 would result in failure since those rows correspond to error patterns of weight 2 and 3.

A perfect code is one for which there are no "leftover" rows in its standard array; all $n \choose t$ error patterns of weight $t$ and all lighter patterns appear as coset leaders.  Thus the bounded distance decoder _is_ the ML decoder.

The obvious drawback of the standard array decoder is the memory required to express the error patterns.  For a not-unreasonable $[256, 200]$ binary code $\mathcal C$, the standard array would require $2^{256}$ vectors of length 256 bits to be stored, and every decoding operation would be $O(n)$.

The first step towards reducing storage and search complexity  (still insufficient to be practical) is **Syndrome Decoding**.  For a vector $\mathbf {e + c}$ in the standard array, the syndrome is $\mathbf{s = (e + c)}H^T = \mathbf eH^T$.  In fact, every vector in the coset has the same syndrome, so we need only store syndromes and their associated patterns: a lookup table with $q^{n-k}$ rows, but only two columns, necessarily smaller than all but the trivial standard array; but still largely impractical!

Nonetheless, with such a table, we could decode:
1. Compute the syndrome $\mathbf{s = (e + c)}H^T$
2. Lookup the corresponding error pattern $\mathbf e$
3. Then $\mathbf{c = r + e}$

#### Example

For the $[7, 4]$ code with parity check matrix 

$$
H = \begin{bmatrix}
1 & 0 & 0 & 0 & 0 & 1 & 1 \\
0 & 1 & 0 & 0 & 1 & 0 & 1 \\
0 & 0 & 1 & 0 & 1 & 1 & 0 \\
0 & 0 & 0 & 1 & 1 & 1 & 1
\end{bmatrix}
$$

The syndrome decoding table is :

| Error  | Syndrome |
|--------|-----------|
| $0000000$ | $0000$ |
| $1000000$ | $1000$ |
| $0100000$ | $0100$ |
| $0010000$ | $0010$ |
| $0001000$ | $0001$ |
| $0000100$ | $0111$ |
| $0000010$ | $1011$ |
| $0000001$ | $1101$ |
| $1100000$ | $1100$ |
| $1010000$ | $1010$ |
| $0110000$ | $0110$ |
| $1001000$ | $1001$ |
| $\mathbf{0101000}$ | $\mathbf{0101}$ |
| $0011000$ | $0011$ |
| $1000100$ | $1111$ |
| $1110000$ | $1110$ |

And for $\mathbf r = [0011011]$, we have $\mathbf{s = r}H^T = [0101]$, so $\mathbf e = [0101000]$.  The decoded codeword is then $\hat{\mathbf c} = [0011011] + [0101000] = [0110011]$.

Nevertheless, additional algebraic structure must be imposed to reduce the and resource consumption of decoding techniques, as syndrome arrays still fail to sufficiently reduce the overall complexity.

### 3.5 - Weight Distribution of Codes and Their Duals

Let $\mathcal C$ be an $[n ,k]$ code, and $A_i$ denote the number of codewords of weight $i$ in $\mathcal C$, then the set of coefficients $\{ A_0, A_1, ..., A_{n-1}\}$ is called the weight distribution for the code, which is conveniently represented as a polynomial:

$$
A(z) = A_0 + A_1z + A_2z^2 + \cdots + A_{n-1}z^n
$$

called the **weight enumerator**, which is basically the $z$-transform of the weight distribution sequence.

#### Example

For the $[7, 4]$ Hamming code, there is one codeword of weight 0, and the rest have weight 4, so $A_0 =1, A_4 = 7$: $A(z) = 1 + 7z^4$.

The **MacWilliams Identity** states that, for an $[n, k]$ linear block code $\mathcal C$ over $\mathbb F_q$ with weight enumerator $A(z)$, and $B(z)$ being the weight enumerator of $\mathcal C^\perp$, then: 

$$
B(z) = q^{-k}(1+(q-1)z)^n A\Bigg(\frac{1 - z}{1 + (q-1)z}\Bigg)
$$

which allows us to characterize the dual of the code, or rearrange to characterize $A$:

$$
A(z) = q^{-(n-k)}(1+(q-1)z)^n B\Bigg(\frac{1 - z}{1 + (q-1)z}\Bigg)
$$

The proof of this theorem is ugly and so I left it out, but it relies on the **Hadamard Transform**.  For a function $f$ defined on $\mathbb F_2^n$, the Hadamard Transfrom $\hat f$ of $f$ is:

$$
\hat f (\mathbf u) = \sum_{\mathbf v \in \mathbb F_2^n} (-1)^{\langle \mathbf{u, v} \rangle} f(\mathbf v) = \sum_{\mathbf v \in \mathbb F_2^n} (-1)^{\sum_{i=0}^{n-1}u_iv_i} f(\mathbf v), \; \mathbf u \in \mathbb F_2^n
$$

where the sum is taken over all $2^n$ tuples $\mathbf v = (v_0 v_1, ..., v_{n-1}), v_i \in \mathbb F_2^n$, but can be generalized to larger fields.

This gives way to the following lemma: if $\mathcal C$ is an $[n, k]$ binary linear code, and $f$ is a function defined over $\mathbb F_2^n$, then 

$$
\sum_{\mathbf u \in \mathcal C} f(\mathbf u) = \frac{1}{|\mathcal C|} \sum_{\mathbf u \in \mathcal C} \hat f(\mathbf u)
$$

### 3.6 - Hamming Codes and Their Duals

For any integer $m \geq 2$, a $(2^m -1, 2^m - m - 1, 3)$ binary code may be defined by its $m \times n$ parity check matrix $H$, which is obtained by enumerating all possible binary representations of $1, ..., n$ in order. Codes which follow this structure are called Hamming Codes.

#### Example

For $m = 4$, we get 

$$
H = \begin{bmatrix}
1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\
0 & 1 & 1 & 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\
0 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\ 
\end{bmatrix}
$$

as the parity matrix for a $[15, 11]$ Haming code, but the columns can be reordered to be an equivalent code such that the identity matrix is interspersed through $H$ as the first $m$ columns:

$$
H = \begin{bmatrix}
1 & 0 & 0 & 0 & \; & 1 & 1 & 0 & 1 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\
0 & 1 & 0 & 0 & \; & 1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\ 
0 & 0 & 1 & 0 & \; & 0 & 1 & 1 & 1 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \\ 
0 & 0 & 0 & 1 & \; & 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 
\end{bmatrix}
$$

and it is clear from this form that for any $m$, there exist three columns which add to $0$ e.g., 

$$
\begin{bmatrix}
1 \\
0 \\ 
0 \\ 
0 
\end{bmatrix}, 
\begin{bmatrix}
0 \\
1 \\ 
0 \\ 
0 
\end{bmatrix},
\begin{bmatrix}
1 \\
1 \\ 
0 \\ 
0 
\end{bmatrix}
$$
 
so the minimum distance is $3$, implying that Hamming codes are capable of correcting one bit error in a block and/or detecting two bit errors.

The dual of an $[2^m -1, 2^m - m -1]$ Hamming code is a $[2^m-1, m]$ code called a **simplex code**, or **Maxmimal-Length Feedback Shift Register** code.

#### Example

The parity check matrix for the $[7, 4]$ code can be used as the generator for the $[7, 3]$ simplex code with code words:

$$
\begin{aligned}
0000000 \; 1001011\\
0101110 \; 0010111 \\
1100101 \; 1011100 \\
0111001 \; 1110010 \\
\end{aligned}
$$

which all, exlcuding the zero-tuple, have weight 4.  In general, all codewords of the $[2^m -1, m]$ simplex code have weight $2^m -1$, and every pair of codewords is at a distance of $2^m-1$ apart.

#### Example

For $m=2$, the codewords $\{000, 101, 011, 110\}$ form a tetrahedron, this the weight enumerator of that dual code is 

$$
B(z) = 1 + (2^m -1)z^{2^{m-1}}
$$

and using the inverse relation, we find that the weight distribution of the original Hamming code is:

$$
A(z) = \frac{1}{n+1}[(1 + z)^n + n(1-z)(1-z^2)^{(n-1)/2}]
$$

![](/images/it-11.png)

### 3.7 - Performance of Hamming Codes

There are many axes of measurements for the error detecting and correcting capabilities of codes at the output of the channel decoder:

- $P(E)$: **probability of decoder error** or **word error rate** - the probability that the _codeword_ at the output of the decoder is not equal to the codeword at the input encoder

- $P_b(E)$: **probability of bit error** or **bit error rate** - the probability that the decoded message bits (extracted from a decoded codeword of a binary code) are no the same as the encoded message bits

- $P_u(E)$: **probability of undetected codeword error**
- 
- $P_d(E)$: **probability of detected codeword error** - one or more errors detected

- $P_{u_b}$: **probability of undetected bit error rate** - the probability that a decoded message bit is in error and is contained within a codeword corrupted by an undetected error

- $P_{d_b}$: **probability of detected bit error rate** - probability that a received message bit is in error _and_ contained within a codeword corrupted by a detected error

- $P(F)$: **probability of decoder failute** - the probability that the decoder is unable to decode the received vector but able to determine that it is unable to decode

### 3.7.1 - Error Detection Performance

All errors of weight up to $d_{min} -1$ can be detected, so for computing the above probabilities, we consider patterns of weight $d_{min}$ and above.

If a codeword $\mathbf c$ of a linear code is transmitted and error pattern happens to be a codeword, $\mathbf{e = c'}$, then the received vector $\mathbf{r = c + c'}$ is also a codeword, hence the error pattern would be undetected.  Thus the probability of undetected error is the probability that the error itself is a codeword.

to quantify this possibility, we consider only errors in transmission of binary codes over a BSC with a crossover possibility $p$.  The probability of any particular pattern of $j$ errors in a codeword is $p^j(1-p)^{n-j}$.  Recalling that $A_j$ is the number of codewords in a code $\mathcal C$ of weight $j$, the probability that $j$ errors forms a codeword is $A_jp^j(1-p)^{n-j}$, and the probability of undetectable error in a codewrod is then 

$$
P_u(E) = \sum_{j = d_{min}}^n A_jp^j(1-p)^{n-j}
$$

The probability of a detected codeword is the probability that one more error occurs minus the probability that the error is _undetected_

$$
P_d(E) = \sum_{j = 1}^n {n \choose j} p^j(1-p)^{n-j} - P_u(E) = 1 - (1 - p)^n - P_u(E)
$$

Since these probabilities rely on knowledge of the weight distribution of the codes, which is not always available, it is common therefore to provide _bounds_ on performance instead. For example, the upper bound on the probability of undetected error is the probability of occurrences of _any_ patterns of weight meeting or exceeding $d_{min}$.  Since there are $n \choose j$ different ways that $j$ of $n$ positions can be changed, we have:

$$
P_u(E) \leq \sum_{j = d_{in}}^n {n \choose j} p^j(1-p)^{n-j}
$$

A bound on $P_d(E)$ is simply $P_d(E) \leq 1 - (1 - p)^n$

#### Example

For a $[7, 4]$ code with $A(z) = 1 + 7z^3 + 7z^4 + z^7$, we have 

$$
P_u(E) = 7p^3(1-p)^4 + 7p^4(1-p)^3 + p^7
$$

If $p =0.01$, then $P_u(E) \approx 6.79 \times 10^{-5}$.

The correspondning bit error rates can be bounded as well. (Imagine being a naughty lil bit error rate uWu 🥵). $P_{u_b}$ can be lower bounded by the assumption that undetected codeword error corresponds to only a single message bit error, and upper bounded by the worst possible case that undetected codeword error corresponds to _all_ $k$ message bits being in error:

$$
\frac{1}{k} P_u(E) \leq P_{u_b} \leq P_u(E)
$$

### 3.7.2 - Error Correction Performance

Recall that an error pattern is _correctable_ if and only if it is a coset leader in the standard array for the code, thus the probability of correction is the probability that the error is a coset leader.  Let $\alpha_i$ denote the number of coset leaders of weight $i$.  The set $\{ \alpha_0, \alpha_1, ..., \alpha_{n-1}\}$ is then the **coset leader weight distribtuion**.  Over a BSC with crossover probability $p$, the probability of $j$ errors forming one of the coset leaders is 

$$
\alpha_jp^j(1-p)^{n-j}
$$

and the probability of a decoding error is thus the probability that the error is _not_ one of the coset leaders:

$$
P(E) = 1- \sum_{j=0}^n \alpha_j p^j(1-p)^{n-j}
$$

which applies to any linear code with a _complete decoder_.

For a binary $[n, k]$ code with weight distribution $\{A_i\}$, the probability of decoding error for a bounded distribution decoder is

$$
P(E) = \sum_{j = d_{min}}^n A_j \sum_{\ell = 0}^{\lfloor (d_{min} - )/2 \rfloor} P_\ell^j
$$

The probability of decoder error can be bounded by the probability of _any_error patterns of weight greater than $\lfloor (d_{min} - 1)/2 \rfloor$:

$$
P(E) = \leq \sum_{j \lfloor \bullet \rfloor}^n {n \choose j}p^j(1-p)^{n-j}
$$

### 3.9 - Modifications to Linear Codes

An $[n, k, d]$ code is **extended** by adding an additional redundant coordinate, producing an $[n + 1, k, d+1]$ code.

#### Example

The parity check matrix for a $[7, 4, 3]$ hamming code is extended with an additional row of check bits that check the parity of all the bits

$$
H = 
\begin{bmatrix}
1 & 0 & 0 & 1 & 0 & 1 & 1 & 0 \\
0 & 1 & 0 & 1 & 1 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 & 1 & 1 & 1 & 0 \\
1 & 1 & 1 & 1 & 1 & 1 & 1 & 1
\end{bmatrix}
$$

The last row is the overall check bit row, and we can put the whole matrix into systematic form via linear operations yielding:

$$
H = 
\begin{bmatrix}
1 & 0 & 0 & 0 & 1 & 1 & 0 & 1 \\
0 & 1 & 0 & 0 & 0 & 1 & 1 & 1 \\
0 & 0 & 1 & 0 & 1 & 1 & 1 & 0 \\
0 & 0 & 0 & 1 & 1 & 0 & 1 & 1
\end{bmatrix}, 

G = 
\begin{bmatrix}
1 & 0 & 1 & 1 & 1 & 0 & 0 & 0 \\
1 & 1 & 1 & 0 & 0 & 1 & 0 & 0 \\
0 & 1 & 1 & 1 & 0 & 0 & 1 & 0 \\
1 & 1 & 0 & 1 & 0 & 0 & 0 & 1 
\end{bmatrix}, 
$$

conversely, a code is **punctured** by deleting one of its parity symbols such that on $[n, k]$ code becomes an $[n -1, k]$ code.

Puncturing an extended code _may_ return it to the original code (if the extension symbols are the ones being punctured).  Puncturing can reduce to the weight of each codeword by its weight in the punctured positions.  The $d_{min}$ of a code is reduced by punctring if the minimum weight codeword is punctured in a non-zero position.  Puncturing an $[n, k, d]$ code $p$ times can result in a code with $d_{min}$ as small as $d - p$.

A code is **expurgated** by deleting some of its codewords.  It is possible to expurgate a linear code in such a way that it remains a linear code, but them inimum distance may increase.  For example, deleting all odd-weight codewords

A code is **augmented** by adding new codewords.  Addition of new codewordss may make a code non-linear, but the $d_{min}$ may decrease as well.

A code is **shortened** by deleting a message symbol, meaning a row is removed from the generator matrix (corresponding to the removed symbol), and a column is also removed, corresponding to the encoded message symbol such that an $[n, k]$ code becomes an $[n-1, k-1]$ code.

Finally, a code is **lengthened** by adding a message symbol, meaning a row and column are added to the generator matrix such that an $[n,k]$ code becomes an $[n+1, k+1]$ code.

![](/images/it-12.png)

## <a name="wiley-4" class="n"></a> 4 | Cyclic Codes, Rings, and Polynomials

### 4.1 - Introduction

In which we introduce methods for deisgning generator matrices which have specific characteristics like minimum distance, and also reducing the prohibitive aspects of long codes and their corresponding standard arrays.

Cyclic codes rely on polynomial operations which allow use to incorporate design specifications.  These operations leverage the algebraic structure known as a _ring_.

### 4.2 - Basic Definitions

Given a vector $\mathbf c = (c_0, c_1, ..., c_{n-1}) \in GF(q)^n$, the vector

$$
\mathbf c' = (c_{n-1}, c_0, c_1, ..., c_{n-2}) 
$$

is said to be the cyclic **shift** of $\mathbf c$ to thr right.  A right shift by $r$ produces 

$$
(c_{n-r}, c_{n-r+1}, ..., c_{n-1}, c_0, ..., c_{n-r - 1}) 
$$

An $[n,k]$ block code $\mathcal C$ is said to be **cyclic** if it is linear and if, for each $\mathbf c = (c_0, c_1, ..., c_{n-1}) \in \mathcal C$, its right cyclic shift shift $\mathbf c'$ is also in $\mathcal C$.

Shifting operations can be convenienctly represented using polynomials.  For example, the code $\mathbf c = (c_0, c_1, ..., c_{n-1})$ can be represented by the polynomial:

$$
c(x) = c_0 + c_1x + c_2x^2 + \cdots + c_{n-1}x^{n-1}
$$

---

#### The Division Algorithm

Let $p(x)$ be a polymnomial of degree $n$ and $d(x)$ be a polynomial of degree $m$:

$$
deg(p(x)) = n, \; deg(d(x)) = m
$$

The division algorithm for polynomials assets that there exist polynomials $q(x)$ (q for quotient) and $r(x)$ (r for remainder) where $0 \leq deg(r(x)) \leq m$ and $p(x) = q(x)d(x) + r(x)$.  The algorithm itself consists of polynomial long division.  We say that $p(x)$ is equivalent to $r(x) \text{ modulo } d(x)$:

$$
p(x) \equiv r(x) \mod d(x); \quad p(x) (\mod d(x)) = r(x)
$$

If $r(x) = 0$, then $d(x)$ divides $p(x)$: $d(x) \big| p(x)$, else $d(x) \nmid p(x)$.

---

A non-cyclic shift is represented by polynomial multiplication: $xc(c) = c_0x + c_1x + \cdots + c_{n-1}x^{n-1}$.  for a cyclic shift, we move the coefficient of $x^n$ to the constant coefficient position by taking this product modulo $x^n - 1$.  Dividing $xc(x)$ by $x^n - 1$ using the above "algorithm" we get: 

$$
xc(c)= \underbrace{c_{n-1}}_{\text{quotient}}(x^n - 1) + \underbrace{(c_0x + c_1x^2 + \cdots + c_{n-2}x^{n-1} + c_{n-1})}_{\text{remainder}}
$$

s.t. the remainder upon dividing by $x^n - 1$ is 

$$
xc(x) (\mod x^n -1) = c_{n-1} + c_0x + \cdots + c_{n-2}x^{n-1}
$$

### 4.3 - Rings

Rings exceed the usefulness of groups which are limited to their single operation; rings have _two_ (count em) operations!  A ring $\langle R, +, \cdot \rangle$ is a set $R$ with two binary operations $+$ addition, and $\cdot$ multiplication, defined on $R$ s.t.:

- $\langle R, + \rangle$ is an Abelian (commutative) group with the additive identity as 0.
- The multiplicative operation $\cdot$ is associative 
- Left and Right laws of distributivity hold:

$$
a(b + c) = ab + ac
$$

$$
(a + b)c = ac + bc
$$

- A ring is said to be **commutative** if $a \cdot b = b \cdot a \; \forall a, b \in R$
- Like groups, the collective ring may be referred to as just the representative set $R$
- A **ring with identity** has a multiplication like identity on $\cdot$, typically defined $1$.

Note, however, that the multiplicative operation need not form a group, as there may not be a multiplicative inverse in a ring, even if it has an identity.  Some elements over a ring _may_ have a multiplicative inverse, such elements are said to be **units**.

#### Example

- The set of $2 \times 2$ matrices under usual definitions of addition and multiplication form a ring, though not commutative nor with comprehensive inverses as elements
- $\langle, +, \cdot \rangle$ forms a rung, but not a group

Let $R$ be a ring and $a \in R$.  For an integer $n$, let $na$ denote $a + a + \cdot + a$ with $n$ arguments.  If a positive integer exists s.t. $na = 0 \forall a \in R$, then the _smallest_ such positive integer is the **characteristic of the ring** $R$.  If no such positive integer exists, then $R$ is said to be a ring of characteristic $0$. 

#### Example

In the ring $\mathbb Z_6$, the characteristic is 6.  In the ring $\langle \mathbb Z_n, +, \cdot \rangle$, the characteristic is $n$.  In the ring $\mathbb Q$, the characteristic is 0.

### 4.3.1 Rings of Polynomials

Let $R$ be a ring.  A polynomial $f(x)$ of degree $n$ with coefficients in $R$ is 

$$
f(x) = \sum_{i=0}^n a_i x^i
$$

where $a_n = 0$.  The symbol $x$ is said to be an **indeterminate**.

The set of all polynomials with an indeterminate $x$ with coefficients in a ring $R$, using the usual operations for polynomial additions and multiplications, forms a ring called the **polynomial ring**: $R[x]$.

#### Example

Let $R = \langle \mathbb Z_6, +, \cdot \rangle$ and let $S = R[x] = \mathbb Z_6[x]$, then some elements in $S$ are: $0, 1, x, 1 + x, 4 + 2x, 5 + 4x, etc.$ with example operations:

$$
\begin{aligned}
(4 + 2x) + (5 + 4x) &= 3 \\
(4 + 2x) + (5 + 4x) &= 2 + 2x + 2x^2
\end{aligned}
$$

#### Example

$\mathbb Z_2[x]$ is the ring of polynomials with coefficients that are either 0 or 1 with operations modeulo 2.  An example of arithmetic in this ring is:

$$
(1 + x)(1 + x) = 1 + x + x + x^2 = 1 + x^2
$$

since $x + x = 0$ in this ring.

It is clear that polynomial multiplication does not have an inverse in general, e.g., in the ring of polynomials with coefficients $\Reals[x]$, there is no polynomial solution $f(x)$ to $f(x)(x^2 + 3x + 1)$

Polynomials can represent a sequence of numbers in a single object.  One reason polynomials are of interest is that their multiplication is equivalent to **convolution** of the sequence $\mathbf a = \{a_0, a_1, ..., a_n \}$ with $\mathbb b = \{b_0, b_1, ..., b_n \}$

via the following polynomials:

$$
\begin{aligned}
a(x) &= a_0 + a_1x + a_2x^2 + \cdots + a_nx^n \\
b(x) &= b_0 + b_1x + b_2x^2 + \cdots + b_nx^n 
\end{aligned}
$$

and multiplying them: $c(x) = a(x)b(x)$ s.t. the coefficients of $c(x)$ are

$$
c(x) = c_0 + c_1x + c_2x^2 + \cdots + c_{n+m}x^{n+m}
$$

are equal to the values obtained by **convolving** $\mathbf{a,b}$.

### 4.4 - Quotient Rings

Returning to the idea of factor groups: given a group and a subgroup, a set of cosets is formed by "translating" the subgroup.  We perform a similar construction over a ring of polynomials, assuming the underlying ring is commutative.

Consider the ring of polynomials $GF(2)[x]$ (polynomials with binary coefficients) and the polynomial $x^3 -1$ .  In a ring of characteristic 2, $x^n-1 = x^n + 1$.  However, in other rhings, the poly should be of the form $x^n - 1$ only.  We divide polynomials up into equivalence classes depending on their remainder modulo $x^3 +1$.

E.g., the polynomials in $S_0 = \{ 0, x^3 + 1, x^4 + x, x^5 + x^2, x^6 + x^3, ... \}$ all have remainder zero when divided by $x^3 + 1$, so we write $\langle, x^3 + 1 \rangle$ as the set generated by $x^3 + 1$.  The polynomials in $S_1 = \{1, x^3, x^4 + x + 1, x^5 + x^2 + 1, ... \}$ all have remainder 1 when divided by $x^3 + 1$, so we write it $S_1 = 1 + S_0 = \langle x^3 + 1 \rangle$ and so on:


$$
\begin{aligned}
S_1 &= \{1, x^3, x^4 + x + 1, x^5 + x^2 + 1, x^6 + x^3 + 1, ... \} \\
    &= 1 + S_0 \\ 

S_2 &= \{ x, x^3 + x + 1, x^4, x^5 + x^2 + x, x^6 + x^3 + x , ... \}\\
    &= x + S_0 \\ 

S_3 &= \{ x + 1, x^3 + x, x^4 + 1, x^5 + x^2 + x + 1, x^6 + x^3 + x + 1, ...\}\\
    &= x + 1 + S_0 \\  

S_4 &= \{ x^2 ,x^3 + x^2 + 1, x^4 + x^2 + x, x^5, x^6 + x^3 + x^2,... \}\\
    &= x^2 + 1 + S_0 \\  

\vdots \\

S_7 &= \{ x^2 + x + 1, x^3 + x^2 + x, x^4 + x^2 + 1, x^5 + x + 1, x^6 + x^3 + 2 + x + 1,.. \}\\
    &= x^2 + x + 1 + S_0
\end{aligned}
$$

Thus $S_0, S_1, ..., S_7$ form the coset of $\langle GF(2)[x] \rangle$ module the subgroup $x^3 + 1$ which exhausts all possible remainders after dividing by $x^3 + 1$.  So every polynomial in $GF(2)[x]$ falls into one of these sets.

We can define induced ring operations for both addition and multiplication which give some large tables similar to those we've seen for other groups modulo their order.

Let $R = \{ S_0, S_1, ..., S_7 \}$ with such an addition table s.t. $\langle R, + \rangle$ form an Abelian group with $S_0$ as the identity.  However, not every element has a multiplicative inverse, so even $\langle R \text{\textbackslash} S_0, \cdot \rangle$ does not form a group, but $\langle R, +, \cdot \rangle$ does form a ring denoted $GF(2)[x]/\langle x^3 + 1 \rangle$, the ring of polynomials in $GF(2)[x]$ modulo $x^3 + 1$.  The general denotion of a ring $GF(2)[x]/\langle x^n - 1 \rangle$ be $R_n$, and $\mathbb F_q[x]/\langle x^n - 1\rangle$ be $R_{n,q}$.

Each equivalence class can be identified by its element of lowest degree:

$$
\begin{aligned}
&S_0 \iff 0, \quad &S_1 \iff 1, \quad &S_2 \iff x \\
&S_3 \iff x+1, \quad &S_4 \iff x^2, \quad &S_5 \iff x^2+1 \\
&S_6 \iff x^2 + x, \quad &S_7 \iff x^2 + x + 1, &\;

\end{aligned}
$$

Let $\mathcal R$  be the set of these elements of lowest degree with addition and multiplication defined on polynomials modulo $\newline x^3 +1$, the $\langle \mathcal R, +, \cdot \rangle$ forms a ring.

Two rings $\langle R, +, \cdot \rangle, \langle \mathcal R, +, \cdot \rangle$ are isomorphic if there exists a bijective function function $\phi: G \rarr \mathcal G$ called the isomorphism such that $\forall a, b \in \mathcal R$ 

$$
\begin{aligned}
\phi(a + b) &= \phi(a) + \phi(b)\\
\phi(ab) &= \phi(a)\phi(b)
\end{aligned}
$$

Similarly, a ring is homomorphic if there exists a function that need not be a complete bijection preserving the above structural behavior.

### 4.5 - Ideals in Rings
