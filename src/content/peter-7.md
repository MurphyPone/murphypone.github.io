---
title: "Probability Distribution is Pretty Trivial if You Ask Me."
date: "2019-07-01"
description: "On Turing's Thoughts on the Gaussian Error Function because I can be big brain too"
path: "/blog/peter-7"
author: "Peter M."
---
<style type='text/css'>
  a {
    border-bottom: 1px solid hsla(131, 75%, 40%, 0.8);
    color: black;
    text-decoration: none;
    -webkit-transition: background-color .25s;
    transition: background-color .25s;
  }
  a:hover {
    background-color: hsla(131, 75%, 40%, 0.8);

  }
</style>

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
