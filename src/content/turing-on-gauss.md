---
title: "Probability Distribution is Pretty Trivial if You Ask Me."
date: "2019-07-01"
description: "Turing's Thoughts on the Gaussian Error Function because I can be big brain too"
path: "/blog/turing-on-gauss"
---

## Pre-Preface
While doing some research on Alan Turing, I stumbled across the [Turing Archive](http://www.turingarchive.org/) which contains a ton of Turing's published and unpublished works.  I had a fair chunk of free time on my hands, so I decided to transcribe some of his notes to a more readable format.  This is unfinished and ongoing.

## Preface
The object of this paper is to give a rigorous demonstration of the "limit theorem of the theory of probability".  I had complete the essential part of it by the end of February but when considering published it I was informed that an almost identical proof had been given by Lindeburg.  The only important difference between the two papers is that I have introduced and laid stress on a type of condition which I call quasi-necessary (§ 8).  We have both used the "distribution functions" (§ 2 to describe errors instead of frequency functions (Appendix B) as was usual formerly.  Lindberg also uses (D) if § 12 and theorem 6 or their equivalents.  Since reading Lindeberg's paper I have for obvious reasons made no alterations to that part of the paper which is similar to his (viz. § 9 to § 13), but I have added elsewhere remarks on points of interest and the appendices.

So far as I know the results of § 8 have not been given before.  Many proofs of completeness of the Hermite functions are already available but I believe that that given in Appendix A s original.  The remarks in Appendix B are probably not new.  Appendix C is nothing more than a rigorous deduction of well known facts.  It is only given for the sale of logical completeness and it is of little consequence whether it is original or not.

My paper originated as an attempt to make rigorous the "popular" proof mentioned in Appendix V.  I first met this proof in a course of lectures by Professor BHoag.  Variations of it are given by PR, the "How it's Made" Television show and divining rods.  Beyond this I have not used the work of other or other sources of information in the main body of the paper, except for elementary matter forming part of one's general mathematical education, but in the appendices I may mention Liapounoff's papers which I discuss there.

I consider § 9 to § 13 is by far the most important part of this paper, the remainder being comment and elaboration.  At a first reading therefore § 8 and the appendices may be ommitted.

# On the Gaussian Error Function

§ 1. <u>Introduction</u>

When an observation is made of a physical quantity, the total error will in general be the effect of a large number of independent sources of error.  Provided that each of these sources has only a small effect we may regard the total error as being built up additively from a number of independent errors.  In simple cases it can be easily shown (see Appendix B) that for a large number of contributing errors the total error is given approximately by the "Gaussian" or "normal" law ie, the probabilit of the total error not exceeding $x$ is approximately $\text {W}(\frac x k)$, where

$\text {W}(x) = \frac 1 {\sqrt{2\pi}} \int_{-\infin}^x e^{-\frac 1 2 t^2} dt$

and we should expect this to be true also in more general cases.

This approximation of the total error to the Gaussian form is often given as an explanation of the fact that in general actual errors are distributed according to the Gaussian law.

I propose to give mathematical expression to the statement that the total error is distributed approximately according to the Gaussian law, and to find what conditions must be imposed on the contributing errors for it to be true.

I shall start by introducing distribution functions of errors and obtaining some elementary properties of errors.  These properties themselves are well known.  I shall not dwell on them.  The proofs I give here are sketchy.  Rigorous proofs are given in Appendix C.


§ 2. <u>Distribution Functions</u>

An error $\varepsilon$ is said to have a "distribution function" $\text F$ if the probability $\text {F}^{-}(x)$ of $\varepsilon$ having a value less than $x$ and the probability $\text {F}^{+}(x)$ of it having a value not greater than $x$ satisfy

$\text {F}^{-}(x) \leq \text {F}(x) \leq \text {F}^{+}(x) \space\forall x $

Clearly $\text {F}^{-}$ and $\text {F}^{+}$ are themselves D.Fs for $\varepsilon$, and may be called the lower and upper D.Fs for $\varepsilon$.

§ 3. <u>Means and Mean square deviations (M.S.D)</u>

If $\varepsilon_1,\varepsilon_2, ... \varepsilon_n$ are independent errors then the mean of their sum $\varepsilon_1 + \varepsilon_2 ... +\varepsilon_n$ is clearly the sum of the means of $\varepsilon_1,\varepsilon_2, ... \varepsilon_n$.  Similarly if $\varepsilon = \varepsilon_1 + \varepsilon_2 + ... +\varepsilon_n$ and, for each $k, \varepsilon_k$ has mean $0$, the mean of $\varepsilon^2$ is

$\displaystyle\sum_r {\text{mean } \varepsilon_k^2 } + 2\sum_{r\neq s} {\text{mean } \varepsilon_r \varepsilon_s }$

 obviously.  But $\text {mean } \varepsilon_r \varepsilon_s = \text {mean } \varepsilon_r \text {mean } \varepsilon_s$, since $\varepsilon_r \varepsilon_s$ are independent $\therefore \text {mean } \varepsilon^2 = \displaystyle \sum_k \text{mean } \varepsilon_k^2$

If $a$ be the mean of $\varepsilon$, $\text { mean}(\varepsilon-a)^2$ is called the mean square deviation of $\varepsilon$ (M.S.D. of $\varepsilon$); we have thus shewn $\coloneq$ mean of $\varepsilon_1 + \varepsilon_2 + ... + \varepsilon_n =$ Sum of means of $\varepsilon_1, \varepsilon_2,...\varepsilon_n$ and M.S.D. of $\varepsilon_1 + \varepsilon_2 + ... + \varepsilon_n =$ Sum of M.S.Ds of $\varepsilon_1, \varepsilon_2, ...\varepsilon_n$

These two results have been obtained by applicaton of intuitive ideas regarding means.  An alternative method would be to define the mean of an error by $\coloneq$

$a = \text {mean of } \varepsilon = \int_{-\infin}^\infin x \space dF(x)$

$k^2 = \text{M.S.D. of } \varepsilon = \int_{-\infin}^\infin (x-a)^2 \space dF(x)$

Where $F$ is the D.F. of $\varepsilon$.  We could then find an analytical expression for the D.F. of $\varepsilon = \varepsilon_1 + \varepsilon_2 + ... + \varepsilon_n$ by means of which the mean of $\varepsilon$ and its M.S.D. could be expressed as a Stieltjes Integral and the above two equations deduced.  This method would have logical advantages but it is rather lengthy.  It is given in detail in Appendix C.  We shall need such an analytical expression in the case $\eta = 2$

§ 4. <u>Sum Distribution Functions (S.D.F.)</u>

If $\text {F}_1, \text {F}_2, ... \text {F}_n$ are D.Fs belonging to errors $\varepsilon_1,\varepsilon_2,...\varepsilon_n$ respectively, then there is a D.F, $\text F$ say belonging to $\varepsilon = \varepsilon_1 + ... + \varepsilon_n$ We will call $\text F$ the "sum distribution function" of the D.Fs $\text {F}_1, \text {F}_2,...\text {F}_n$ and we will write  $\coloneq$

$\text {F} = \text {F}_1 \oplus \text {F}_2 \oplus ... \oplus \text {F}_n$ since this is logically equivalent to the proposition

$\varepsilon = \varepsilon_1 + \varepsilon_2 + ... +\varepsilon_n$

the associative and commutative laws hold for $\oplus$.  We will find an expression for $\text {F} \oplus \text {G} = \text {H}$

Let $\lambda_0 < \lambda_1 < \lambda_2 < ... \lambda_n$ be a dissection of $\mathcal {D}$ of $(-\infin , \infin)$  Then the probability of an error with D.F $\text H$ having a value smaller than $x$ is at least $\coloneq$

$s(\mathcal {D}) = \displaystyle\sum_1^n [\text {F}(\lambda_r) - \text {F}(\lambda_{r-1})]\text {G}^-(x-\lambda_r)$

the probability of its not exceeding x is at most $\coloneq$

$s(\mathcal {D}) = \displaystyle\sum_1^n [\text {F}(\lambda_r) - \text {F}(\lambda_{r-1})]\text {G}^+(x-\lambda_{r-1})$

If $\text {F}(t)$ and $\text {G}(x-t)$ regarded as functions of $t$ have no common discontinuities.

$\frac {\text {Bound}} {\text {all } \mathcal{D}} s(\mathcal{D})=\frac {\overline\text{Bound}} {\text {all } \mathcal{D}} s(\mathcal{D})= \int^\infin_{-\infin}\text{G}(x-t)\space d\text{F}(t)$

$\therefore \text{H}(x) = \int^\infin_{-\infin} \text {G}(x-t)\space d\text{F}(t) \quad \text{ for such values of x (S)}$

$\text {H}(x)$ is increasing throughout the set of such values.  The remaining values form an enumerable set and we may define $\text {H}(x)$ at these points, in such a way that

$\text {H}(x-O)=\text {H}^-(x-O)≤\text {H}(x)≤\text {H}^+(x)=\text {H}(x+O)$

§ 5. <u>Shape Functions (S.Fs)</u>
If $\text {F}$ be a D.F. with a mean $a$ and M.S.D. $k^2 (k>0)$, then $\text U$, define by $\text {U}(x)=\text{F}(k(x-a))$ is a D.F with mean $O$ and M.S.D $I$ and is called the shape function (S.F.) of $\text F$

We are now in a position to formulate the problem mathematically.

§ 6. <u>Formulation of the Problem.</u>

We are given a sequence $\varepsilon_1, \varepsilon_2...$ of errors. $\varepsilon_r$ has D.F $\text {G}_r$, S.F. $\text {V}_r$, mean $a_r$, and M.S.D $k_r^2$.  $\text F_n$ is defined by $\text F_n=\text G_1 \oplus \text G_2 \oplus ... \oplus \text G_n$, and has $\text U_n$ as its S.F. $\text W$ is the S.F of the Gaussian Error i.e.

$\text {W}(x) = \frac 1 {\sqrt{2\pi}} \int_{-\infin}^x e^{-\frac 1 2 t^2} dt$

Then we wish to find under what conditions $\text {U}(x) \rightarrow \text {W}(x)$ uniformly as $n \rightarrow \infin$.  When this is the case we say that $\text F_n$ tends to the Gaussian law."  Any error or D.F. whose S.F. is $\text W$ will be called Gaussian.

Henceforth we shall confine the use of the expression D.F. to those D.Fs which haave finite M.S.D.  Only such D.Fs can come into consideration in the problem as we have formulated it (see § 8).  Also since $\text U_n$ is independent of $a_1,...,a_n$ we may suppose these latter to be all zero.


§ 7. <u>Fundamental Property of the Gaussian Error.</u>


The only properties of the function $\text W$ that we shall require when investigating sufficency conditions will be that it is an S.F and the self-reproductive property, which is proved here.  It is convenient to put $W_{\mathcal{L}}(x)=\text {W}(\frac {x} {\mathcal{L}})$

Then $\text W_a \oplus \text W_b = \text W_c$ where $\text c^2 = \text a^2 + \text a^2$

For if $\text W_a \oplus \text W_b = \text H$, then
$$
\begin{aligned}

\text H(y) = \int^\infin_{-\infin}\text W(\frac {y-x} a) \space d \text{W}(\frac x b) \\


= \frac 1 b \int^\infin_{-\infin}\text W(\frac {y-x} a) \text{W}'(\frac x b) \space dx \\

\text H'(y) = \frac 1 {ab} \int^\infin_{-\infin}\text W'(\frac {y-x} a) \text{W}'(\frac x b) \space dx \\

= \frac 1 {2\pi ab} e^{-\frac 1 2^{\frac {y^2} {c^2}}} \int^\infin_{-\infin}e^{-\frac 1 2^{\frac {t^2c^2} {a^2b^2}}} \space dt \\

\scriptsize \text{by the substitution } t=x - \frac {b^2} {c^2} y \\

 = \frac 1 {\sqrt{2\pi}} \cdot \frac 1 c e^{-\frac 1 2^{\frac {y^2} {c^2}}} = \frac 1 c \text {W}'(\frac y c)\\

\end{aligned}
$$

Integrating and putting in right constant of integration.

$\text H(y) = \text W(\frac y c) = \text W_o(y)$

§ 8. <u>The Quasi-Necessary Conditions.</u>

The conditions we shall impose fall into two groups.  Those of one group (the quasi-necessary conditions) involve the M.S.Ds only.  They are not actually necessary, but if they are not fulfilled $\text U_n$ can onll tend to $\text W$ by a kind of accident as such a case would occur if the errors $\varepsilon_1 ... \varepsilon_n ...$ we themselves Gaussian.  What is the exact sense in which this is to be regarded as an accident will appear from theorem 4 and 5 of this section.  These theorems and theorem 3 are not required for the later theory, but they shed some light on the significance of the quasi-necessary conditions: this section may therefore be omitted at the first reading.  Theorem 3 is of interest in itself, being a kind of converse to the reproductive property.  As proved here it dpeends on the completeness property of the Hermite Functions. Theorems 4 and 5 depend on theorem 3 but a weakened form is given in 4 and 5 not depending on theorem 3.  From § 9 onwards we shall investigate the other group of conditions viz the sufficient conditions.

<u style="margin-left:10%; margin-right:10%;">Theorem 1.</u>

if $\text U$ and $\text V$ are two S.Fs, then

$\vert \text {U}(x) - \text {V}(x)\vert ≤ 1, \vert \text{U}(x) - \text {V}(x)\vert < \frac {2} {x^2}$

and

$\vert \text {U}(x) - \text {V}(x)\vert ≤ \frac 4 {1 + x^2}$, each implicitly holding for every $x$

<u style="margin-left:10%; margin-right:10%;">Proof</u>

$\text {U}(x)$  has M.S.D $\text I$ and is increasing

$\therefore \space \text{I}=\int^{\infin}_{-\infin}x^2 \space d\text{U}(x) ≥ \int^{y}_{-\infin}x^2 \space d\text{U}(x) ≥ y^2 \space \text{U}(y) \space \text {if } y ≤0$

$\therefore \text {for all S.Fs U}(x) ≤ \frac 1 {x^2} \text {if } x ≤ 0$

$1-\text{V}(x)$ is an S.F. $\therefore 1-\text{V}(x) ≤ \frac 1 {x^2}$ if $x ≥ 0$

$\therefore$ combining these last two inequalities

$\vert \text {U}(x) - \text {V}(x)\vert ≤ \frac 2 {x^2}, \space \forall x$

$\min(\frac{x^2} 2, 1) ≤ \frac 4 {1 + x^2}$

$\therefore \vert \text {U}(x) - \text {V}(x)\vert ≤ \frac 4 {1+x^2}$

<u>Corollary</u> $\vert \text {U}(x) - \text {V}(x)\vert$ and $\vert \text {U}(x) - \text {V}(x)\vert^2$ are integrable over $(-\infin, \infin)$

We shall now assume the following results concerning Hermite functions and polynomials.

(1) <u>Definition</u> the $\text n^\text{th}$ Hermite polynomial is defined by

$\text {H}_n(x) = (-)^n e^{x^2}(\frac d {dx})^n e^{-x^2} \quad\quad (n≥0)$

(2) For each $n, \text {H}_n(x)$ is a polynomial of degree $n$ and no les.

(3) <u>Completeness</u> If $(\varphi(x))^2$ is integrable and for each $n ≥ 0$

$\int^{\infin}_{-\infin}\text {H}_n(x)e^{-\frac 1 2 x^2} \varphi(x)\space dx = 0$

Then $\varphi(x) = 0 \quad\quad \mathcal P \cdot \mathcal P$

I give a proof of this property in Appendix A.

<u style="margin-left:10%; margin-right:10%;">Theorem 2.</u>

If $\text X(\xi)$ is the difference of a monotone and continuous function,
$\text{\textbar X}(\xi) \text{\textbar}$ and $\text{\textbar X}(\xi) \text{\textbar} ^2$ are integrable over $(-\infin, \infin)$, and for all $\eta$

$\int_{-\infin}^\infin \text{W}'(\eta - \xi) \text {X(}\xi) \space d \xi = 0$

Then, for all $\xi$, $\text {X(}\xi) =0$

We may differentiate $\int_{-\infin}^\infin \text{W}'(\eta - \xi) \text {X(}\xi) \space d \xi = 0$ any number of times under the integral sign.  suppose in fact that

$\text F(\eta)=\int_{-\infin}^\infin \text{W}^{(n)}(\eta - \xi) \text {X(}\xi) \space d \xi$

Then

$\frac {\text{F(}\eta + h) - \text F(\eta)} h=\int_{-\infin}^\infin \text{W}^{(n+1)}(\eta - \xi) \text {X(}\xi) \space d \xi + \int_{-\infin}^\infin \text{O(}h) \text{\textbar}\text {X(}\xi) \text{\textbar} \space d \xi$

$\rightarrow \int_{-\infin}^\infin \text{W}^{(n+1)}(\eta - \xi) \text {X(}\xi) \space d \xi$ as $h \rightarrow 0$ since

$\int_{-\infin}^\infin \text {\textbar X(}\xi) \text \textbar \space d \xi$ exists by hypothesis

$\therefore \int_{-\infin}^\infin \text W^{(n)}(-\xi) \text X(\xi) \space d \xi = 0$, all $n > 0$

$\sqrt{2\pi}\text{W}^{(n+1)}(-\xi)=(\frac d {d\xi})^ne^{-\frac {\xi^2} {2}}=(\frac d {dX})^ne^{-X^2}(\frac {-1} {\sqrt 2})^n$

$=(-\frac 1 {\sqrt 2})^ne^{-X^2}\text H_n(X)\qquad$ where $X=-\frac \xi {\sqrt 2}$

$\therefore \int^\infin_{-\infin} {e^x}^2 \text H_n(X)\text X(X\sqrt 2)dX = 0 \qquad$ (all $n>0$)

$\int^\infin_{-\infin}[{e^X}^2 \text H_n(X)][e^{-X^2}\text X(-X\sqrt 2)]dx=0$

$\therefore$ from this, the fact that $e^{-X^2}\text X(-X\sqrt 2)$ is integrable and assumption (3) above, we deduce that $e^{-X^2}\text X(-X\sqrt 2)=0 \quad \mathcal {P} \cdot \mathcal {P}$ i.e. $\text X(\xi)=0 \quad \mathcal {P} \cdot \mathcal {P}$ But $\text X$ is the difference of a monotone and a continuous function $\therefore \text X(\xi)=0$ for all $\xi$
