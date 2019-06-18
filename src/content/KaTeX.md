---
title: "How to Use Katex"
date: "2019-06-18"
draft: false
path: "/blog/KaTeX"
author: "???"
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

# Simple Formatting
```
$a^2 + b^2 = c^2$
```
$a^2 + b^2 = c^2$

## Multiline Formatting
```
$$
\lim_{x\to 0}{\frac{e^x-1}{2x}}
\overset{\left[\frac{0}{0}\right]}{\underset{\mathrm{H}}{=}}
\lim_{x\to 0}{\frac{e^x}{2}}={\frac{1}{2}}
$$
```
$$
\lim_{x\to 0}{\frac{e^x-1}{2x}}
\overset{\left[\frac{0}{0}\right]}{\underset{\mathrm{H}}{=}}
\lim_{x\to 0}{\frac{e^x}{2}}={\frac{1}{2}}
$$

$$
\def\arraystretch{1.5}
   \begin{array}{c:c:c}
   brady & peter & patrick \\ \hline
   andrew & critter & matt \\
   \hdashline
   fun! & productivity! & graphs!
\end{array}
$$

$\overbrace{gm-sense}^{\text{Child's Play}}$

$\underbrace{Katacoda}_{\text{Galaxy Brain}}$
$\text {BHoag's Bar and Grill Received a D- by the Health Inspection Agency}$

Sadly, I do not think conventional typesetting needs (like just using a darn line-wrapping paragraph) are possible via KaTeX.    
# Additional Resources
- [LaTeX Wiki](https://en.wikibooks.org/wiki/LaTeX)
- [Supported KaTeX Notation](https://katex.org/docs/supported.html)
