---
title: "48 | Digest: Things that are things, but not other things"
date: "2023-03-26"
description: "Category Theory"
path: "/blog/category-theory-2"
---

<style>
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

I recently attended the Scalar Conf in Warsaw which featured several interesting speakers and presentations, many of which pertained to hot new features of Scala 3 (which I will probably never use due to overwhelming tech debt) as well as a 'surprise' presentation from Mr. Martin Odersky, where he discussed opportunities to shift away from reliance on monadic semantics in favor of direct styling allowed by the suspended continuation/boundary paradigms.  

<details>
  <summary><u class="my-link">I sheathed my sneakers at this remark.</u></summary>

![](/images/category-theory-2/odersky.PNG)

</details>

The goal of this post is to capture my learnings from Nicolas Rinaudo's wonderfully silly presentation titled _Things that are things, but not other things_[^1] which approached the daunting challenge of grokking category theory abstractions in my preferred format of counter example: ⚔️.


> The problem, of course, is that I now have to find something interesting to say about monads. And one thing that I often found frustrating when learning about that family of abstractions is how _just about everything is a monad_ - why even have all these intermediate abstractions if everything is all the things, all the time?

> This ties in to one of the ways I learn things: when given a definition of a thing, it helps me just as much to have examples of things that are *not* the thing as of things that are the thing. I really wished I'd had such examples of things that are things, but not other things, while learning abstractions.

# Taxonomy of the Typelevel Heirarchy

First of all – just look at this mess:[^2]

![](https://cdn.rawgit.com/tpolecat/cats-infographic/master/cats.svg)

A common issue I encounter is failure to lean on the minimum-necessary type class.  Implicit instances of $\sf Applicative$, $\sf Monad$, $\sf Apply$, etc. crop up in the codebase, and transient/impartial recollection of rote definitions of these terms flutter through my head as I fail to ~intuit~ why the author of any given method signature chose one type class and not the other.  Additionally, I know that I am not _alone_ in this confusion as I overwhelmingly see one of the stronger type classes (i.e. $\sf Monad$), implying that many of my fellow contributors also don't know what the tightest bound on their use case is, just that $\sf Applicative$ or $\sf Monad$ will _probably_ suffice.  (Certainly, my observations are biased since much of my work takes place at the level of abstraction where these are in fact the correct type classes to rely upon, but perhaps not all the time...)

Nicolas' presentation helped make at least a portion of the above diagram less scary by breaking each element of the following hierarchy down:

![Overview](/images/category-theory-2/tree.svg)

## Type Constructor

The first and lowliest category in the hierarchy is the Type Constructor. The narrowest "higher kinded type" –if you could even call it that– which encapsulates the behavior of parameterization e.g.

$$
\sf{\textcolor{blue}{List}[\textcolor{blue}{A}]}
$$

which alone is not worth breaking.


## $\sf Functor$

The $\sf Functor$ is the first category on the list we'll break by demonstrating what it is and _what it is not_.  A $\sf Functor$ is a mapping between categories, usually for us it's a mapping between the category of types. Referencing the overall hierarchy diagram above, we can see that all we need to transform our type constructor into a $\sf Functor$ is an implementation of $\sf\textcolor{maroon}{map}$:

<p align="center" >
  <img src="/images/category-theory-2/tree-before-functor.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} \implies \textcolor{blue}{B})
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}]
}
$$

We have some $\sf{\textcolor{blue}{F}[\textcolor{blue}{A}]}$:

<p align="center" >
  <img src="/images/category-theory-2/functor-fa.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} \implies \textcolor{blue}{B})
  (\colorbox{yellow}{fa: \textcolor{blue}{F}[\textcolor{blue}{A}]}): 
  \textcolor{blue}{F}[\textcolor{blue}{B}]
}
$$

which we want to map to an $\sf{\textcolor{blue}{F}[\textcolor{blue}{B}]}$:

<p align="center" >
  <img src="/images/category-theory-2/functor-fb.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} \implies \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \colorbox{yellow}{\textcolor{blue}{F}[\textcolor{blue}{B}]}
}
$$

which we achieve via the first argument of map which is a function $\sf \textcolor{maroon}f$ from $\sf\textcolor{blue}A$ to $\sf\textcolor{blue}B$:

<p align="center" >
  <img src="/images/category-theory-2/functor-f.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\colorbox{yellow}{
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B}
  }
  )
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}]
}
$$

which is then reinserted into our type constructor $\sf\textcolor{blue}F$ which is the definition of the $\sf\textcolor{maroon}{map}$ itself: 

<p align="center" >
  <img src="/images/category-theory-2/functor-map.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \colorbox{yellow}{\textcolor{maroon}{map}}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}]
}
$$

So, how can we break a $\sf Functor$?  

## Function

Let's examine a practical example where our type constructor maps some $\sf\textcolor{blue}X$ to an $\sf\textcolor{blue}A$; this is the definition of a function

<p align="center" >
  <img src="/images/category-theory-2/function-no-fb.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \colorbox{yellow}{\textcolor{blue}{X} ⟹ \textcolor{blue}{A}}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad ???}
\end{aligned}
$$

We can verify that this fits the pattern we need to be a $\sf Functor$ by checking it has all the constituent parts including an $\sf fa$

<p align="center" >
  <img src="/images/category-theory-2/function-fa.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X} ⟹ \textcolor{blue}{A}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  (\colorbox{yellow}{ fa: \textcolor{blue}{F}[\textcolor{blue}{A}]}): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad ???}
\end{aligned}
$$

an $\sf\textcolor{maroon}{f}$:

<p align="center" >
  <img src="/images/category-theory-2/function-f.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X} ⟹ \textcolor{blue}{A}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\colorbox{yellow}{\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B}})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad ???}
\end{aligned}
$$

and the desired resultant $\sf{\textcolor{blue}{F}[\textcolor{blue}{B}]}$:

<p align="center" >
  <img src="/images/category-theory-2/function-fb.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X} ⟹ \textcolor{blue}{A}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \colorbox{yellow}{\textcolor{blue}{F}[\textcolor{blue}{B}]} = 
}
\\
&\sf{\quad ???}
\end{aligned}
$$

but we're missing the implementation of $\sf \textcolor{maroon}{map}$ to take us from $\sf\textcolor{blue}{X}$ to $\sf\textcolor{blue}{B}$:

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X} ⟹ \textcolor{blue}{A}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \colorbox{orange}{\quad ???}
  }
\end{aligned}
$$

well, $\sf\textcolor{maroon}{map}$ has all the pieces we need to just compose: 

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X} ⟹ \textcolor{blue}{A}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \colorbox{lime}{\quad \textcolor{maroon}{fa \; }andThen \textcolor{maroon}{\; f}}
  }
\end{aligned}
$$

yielding the correct result:

<p align="center" >
  <img src="/images/category-theory-2/function.svg">
</p>

## Breaking Function

To break a function so that it is no longer a $\sf Functor$, we can simply reverse the mapping of our type constructor:


<p align="center" >
  <img src="/images/category-theory-2/function-after-flip.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \colorbox{lime}{\textcolor{blue}{A} ⟹ \textcolor{blue}{X}}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \quad \textcolor{maroon}{fa \; }andThen \textcolor{maroon}{\; f}}
\end{aligned}
$$

which then breaks our implementation of $\sf\textcolor{maroon}{map}$: since $\sf  fa$ and $\sf \textcolor{maroon}{f}$ no longer compose.

<p align="center" >
  <img src="/images/category-theory-2/function-no-compose.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} ⟹ \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \colorbox{orange}{\quad \textcolor{maroon}{fa \; }andThen \textcolor{maroon}{\; f}}
  }
\end{aligned}
$$

Concretely, we might have a function that goes from $\sf\textcolor{blue}{A} ⟹ \textcolor{blue}{Boolean}$:

<p align="center" >
  <img src="/images/category-theory-2/predicate-boolean.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} ⟹ \textcolor{blue}{Boolean}

}
\end{aligned}
$$

such a function is called a $\sf\textcolor{blue}{Predicate}$

<p align="center" >
  <img src="/images/category-theory-2/predicate-predicate.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{Predicate}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} ⟹ \textcolor{blue}{Boolean}

}
\end{aligned}
$$

which is not a $\sf Functor$ :).

### Key takeaways

A function parameterised on its:
- output type is a $\sf Functor$
- input type is _not_ a $\sf Functor$ 


## Interlude: Product Types

To break the rest of the higher kinded types, we'll rely on the slightly-more-complex composite type called a $\sf\textcolor{blue}{Product}$.  Glossing over many tedious [laws of Category Theory](/blog/category-theory), a Product is simply when you cram two types into a box like so:

<p align="center" >
  <img src="/images/category-theory-2/product.svg">
</p>

$$
\begin{aligned}
&\sf{
  case \; class \;\textcolor{blue}{×}[\textcolor{blue}{A}, \textcolor{blue}{B}](fst: \textcolor{blue}{A}, snd: \textcolor{blue}{B})

}
\end{aligned}
$$

Given any combination of $\sf\textcolor{blue}{A}$ and $\sf\textcolor{blue}{B}$, we can get a Product via "Product Introduction":


<p align="center" >
  <img src="/images/category-theory-2/product-introduction-a-b.svg">
</p>

$$
\begin{aligned}
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{build}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\colorbox{yellow}{a: \textcolor{blue}{A}}, \colorbox{yellow}{b: \textcolor{blue}{B}}): \textcolor{blue}{A} × \textcolor{blue}{B} = 
}
\\
&\sf{
  \quad a × b
  }
\end{aligned}
$$

Similarly, from any instance of a Product, we can extract the individual elements comprising it via "Product Elimination":

$$
\begin{aligned}
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{fst}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (ab: \textcolor{blue}{A} × \textcolor{blue}{B}): \textcolor{blue}{A} = 
}
\\
&\sf{
  \quad val \; a × b = ab
  }
\\ 
&\sf{
  \quad a
}
\end{aligned}
$$

### Products are $\sf Functor$s

Revisiting our previous diagram of $\sf\textcolor{maroon}{map}$:

<p align="center" >
  <img src="/images/category-theory-2/product-map-before.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \colorbox{yellow}{\textcolor{blue}{A} × \textcolor{blue}{X}}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad ???}
\end{aligned}
$$

we still have all the necessary parts to complete the mapping, we must simply perform product elimination in the implementation:

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \colorbox{lime}{
    \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
  }
}
\end{aligned}
$$

We can get the product $\sf{\textcolor{blue}{A} × \textcolor{blue}{X}}$ by definition of $\sf fa$

<p align="center" >
  <img src="/images/category-theory-2/product-map-elimination.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \colorbox{lime}{
    \quad val \; (a × x) =  fa
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

from which we can get a $\sf{\textcolor{blue}{B}}$ from the provided $\sf{\textcolor{maroon}{f}}$:

<p align="center" >
  <img src="/images/category-theory-2/product-map-a-b.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{
  \quad val \; (a×x) =  fa
}
\\
&\sf{
  \colorbox{lime}{
    \quad val \; b = \textcolor{maroon}{f}(a)
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

and now we have an $\sf \textcolor{blue}{X}$ and a $\sf \textcolor{blue}{B}$ with which we can construct our $\sf \textcolor{blue}{F}[\textcolor{blue}{B}]$


<p align="center" >
  <img src="/images/category-theory-2/product-map-introduction-before.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad val \; (a×\colorbox{yellow}{x}) =  fa}
\\
&\sf{\quad val \; \colorbox{yellow}{b} = \textcolor{maroon}{f}(a)}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

All we have to do is introduce the product between these two like so:

<p align="center" >
  <img src="/images/category-theory-2/product-map-introduction.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}

}
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (\textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{B})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
}
\\
&\sf{\quad val \; (a×\colorbox{yellow}{x}) =  fa}
\\
&\sf{\quad val \; \colorbox{yellow}{b} = \textcolor{maroon}{f}(a)}
\\
&\sf{
  \colorbox{lime}{
  \quad b × x
  }
}
\end{aligned}
$$

### Key takeaways

A binary parametric product type is:
- a $\sf Functor$

## $\sf Functor$ but not $\sf Apply$

Advancing along the hierarchy diagram, we can now use our knowledge of Product types to break the $\sf Apply$ type class. An $\sf Apply$.[^3]  An $\sf Apply$ is anything that lets us take the product of three types in any order isomorphically.  This necessitates another map which takes two arguments rather than three – $\sf\textcolor{maroon}{map2}$:

<p align="center" >
  <img src="/images/category-theory-2/tree-before-apply-map2.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (\textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C})
  ( fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
  \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] 
}
$$

Breaking the signature down, observe that we start with a product of two type constructors over $\sf \textcolor{blue}{A}$ and $\sf \textcolor{blue}{B}$:

<p align="center" >
  <img src="/images/category-theory-2/apply-fa-fb.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (\textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C})
  (\colorbox{yellow}{
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  }
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] 
}
$$

We want an $\sf \textcolor{blue}{F}[\textcolor{blue}{C}]$

<p align="center" >
  <img src="/images/category-theory-2/apply-fc.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (\textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C})
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \colorbox{yellow}{\textcolor{blue}{F}[\textcolor{blue}{C}]} 
}
$$

and we will produce this $\sf \textcolor{blue}{F}[\textcolor{blue}{C}]$ by way of the provided mapping $\sf \textcolor{maroon}{f}$:

<p align="center" >
  <img src="/images/category-theory-2/apply-map.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (\colorbox{yellow}{
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] 
}
$$

and all together this gives us the definition of $\sf\textcolor{maroon}{map2}$: 

<p align="center" >
  <img src="/images/category-theory-2/apply.svg">
</p>

### Implementing $\sf\textcolor{maroon}{map2}$ for $\sf Product$

Let's take a look at how we would go about implementing $\sf\textcolor{maroon}{map2}$.

For starters, we have our (for now) trusty $\sf Product$ and the method signature:

<p align="center" >
  <img src="/images/category-theory-2/product-map2-before.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \colorbox{yellow}{\textcolor{blue}{A} × \textcolor{blue}{X}}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad ???}

\end{aligned}
$$

We're also given $\sf fa$ and $\sf fb$ so by product elimination we get $\sf \textcolor{blue}{F}[\textcolor{blue}{A}]$ and $\sf \textcolor{blue}{F}[\textcolor{blue}{B}]$ individually from our initial product:

<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-fafb-elimination.svg">
</p>


We know we want an $\sf \textcolor{blue}{F}[\textcolor{blue}{C}]$, so we can pencil that in as our target type:

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{
  \colorbox{lime}{\quad (???: \textcolor{blue}{C}) × (???: \textcolor{blue}{X})}
}

\end{aligned}
$$

Next, we can perform product introduction via $\sf fa$ and $\sf fb$ to yield $\sf \textcolor{blue}{X} \times \textcolor{blue}{X}$ and $\sf \textcolor{blue}{A} \times \textcolor{blue}{B}$:

<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-fafb-elimination-2.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
  &\sf{
    \colorbox{lime}{
      \quad val \; (a × x1) = fa
    }
  }
  \\
  &\sf{
    \colorbox{lime}{
      \quad val \; (b × x2) = fb
    }
  }

\\
&\sf{
  \quad (???: \textcolor{blue}{C}) × (???: \textcolor{blue}{X})
}

\end{aligned}
$$

and we can use the provided $\sf \textcolor{maroon}{f}$ on our new product of $\sf \textcolor{blue}{A} \times \textcolor{blue}{B}$ to get a $\sf \textcolor{blue}{C}$:


<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-ab-f.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\

&\colorbox{lime}{\sf{\quad val \; c = f(a, b)}}

\\
&\sf{
  \quad (???: \textcolor{blue}{C}) × (???: \textcolor{blue}{X})
}

\end{aligned}
$$

Lastly, we just need to _combine_ our product of $\sf \textcolor{blue}{X}$s into a single $\sf \textcolor{blue}{X}$, and drop it into our type constructor to get an $\sf \textcolor{blue}{F}[\textcolor{blue}{C}]$:


<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-x.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \colorbox{yellow}{\textcolor{blue}{F}[\textcolor{blue}{C}]} = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\

&\sf{\quad val \; c = f(a, b)}

\\
&\sf{
  \quad (\colorbox{yellow}{???: \textcolor{blue}{C}}) × (\colorbox{yellow}{???: \textcolor{blue}{X}})
}

\end{aligned}
$$

To combine our $\sf x1$ and $\sf x2$ we do literally need a $\sf \textcolor{maroon}{combine}$ method, but its implementation is entirely arbitrary at this abstract level.  If the types are numeric it could arithmetically combine them, or perhaps concatenate them if they're strings or some binary bytestream, we could also just select the first, or just the second, flip a coin to pick which one to select, etc – it does not matter:


<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-combine.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\
&\sf{\quad val \; c = f(a, b)}
\\
&\sf{\colorbox{lime}{\quad val \; x3 = combine(x1, x2)}}
\\
&\sf{
  \quad (???: \textcolor{blue}{C}) × (???: \textcolor{blue}{X})
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{X}]
  (
    lhs: \textcolor{blue}{X}, rhs: \textcolor{blue}{X}
  ): \textcolor{blue}{X} = \; ???
}

\end{aligned}
$$

and now we have a single $\sf \textcolor{blue}{X}$ as well as a $\sf \textcolor{blue}{C}$ to yield our desired $\sf \textcolor{blue}{F}[\textcolor{blue}{C}]$, thus completing the implementation of $\sf \textcolor{maroon}{map2}$


<p align="center" >
  <img src="/images/category-theory-2/product-map2-before-x-c-fc.svg">
</p>


$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\
&\sf{\quad val \; c = f(a, b)}
\\
&\sf{\quad val \; x3 = combine(x1, x2)}
\\
&\sf{
  \quad \colorbox{lime}{c × x3}
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{X}]
  (
    lhs: \textcolor{blue}{X}, rhs: \textcolor{blue}{X}
  ): \textcolor{blue}{X} = \; ???
}

\end{aligned}
$$

## Breaking $\sf Product$

The simplest way for us to illustrate something that is a $\sf Product$ and therefore a $\sf Functor$ but is not an $\sf Apply$ is to semantically constrain our $\sf Product$. 

The humorous example Nicolas provided was working with Jira labels. We can define our $\sf Product$ to be an Enum which is perfectly valid:

$$
\begin{aligned}
&\sf enum \; \textcolor{blue}{Label}:
\\
&\sf \quad case \; \textcolor{blue}{FrontEnd} \\
&\sf \quad case \; \textcolor{blue}{BackEnd} \\
&\sf \quad case \; \textcolor{blue}{Bug} \\
&\sf \quad case \; \textcolor{blue}{Feature} \\
\end{aligned}
$$

and use this as our $\sf \textcolor{blue}{X}$:

<p align="center" >
  <img src="/images/category-theory-2/product-map2-all-str.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \colorbox{lime}{\textcolor{blue}{Label}}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\
&\sf{\quad val \; c = f(a, b)}
\\
&\sf{\quad val \; x3 = combine(x1, x2)}
\\
&\sf{
  \quad c × x3
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\colorbox{lime}{\textcolor{blue}{Label}}]
  (\colorbox{lime}{
    lhs: \textcolor{blue}{Label}, rhs: \textcolor{blue}{Label}
  }
  ): \colorbox{lime}{\textcolor{blue}{Label}} = \; ???
}

\end{aligned}
$$

However, there is no longer a valid abstract definition of $\sf \textcolor{maroon}{combine}$ since $\sf \textcolor{blue}{Label}$ is closed... That is – there is no valid definition of a ticket which pertains to both the $\sf \textcolor{blue}{FrontEnd}$ and the $\sf \textcolor{blue}{BackEnd}$ for example, and so we can no longer guarantee that this kind of product can be combined:
 
$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{Label}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\
&\sf{\quad val \; c = f(a, b)}
\\
&\sf{\quad val \; x3 = combine(x1, x2)}
\\
&\sf{
  \quad c × x3
}
\\
\\
&\sf{
  \colorbox{orange}{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{Label}]
  (
    lhs: \textcolor{blue}{Label}, rhs: \textcolor{blue}{Label}
  ): \textcolor{blue}{Label} = \; ???
}
}

\end{aligned}
$$

Thus, the whole implementation falls apart as we cannot introduce a product between our $\sf c$ and $\sf x3$ since we cannot get an $\sf x3$ without somehow combining somehow our $\sf x1$ and $\sf x2$

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{Label}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{map2}[\textcolor{blue}{A}, \textcolor{blue}{B}, \textcolor{blue}{C}]
  (
    \textcolor{maroon}{f}: (\textcolor{blue}{A}, \textcolor{blue}{B}) ⟹ \textcolor{blue}{C}
  )
  (
     fa: \textcolor{blue}{F}[\textcolor{blue}{A}],
    \ fb : \textcolor{blue}{F}[\textcolor{blue}{B}]
  ): 
  \textcolor{blue}{F}[\textcolor{blue}{C}] = 
}
\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{\quad val \; (b × x2) = fb}
\\
&\sf{\quad val \; c = f(a, b)}
\\
&\colorbox{orange}{\sf{\quad val \; x3 = combine(x1, x2)}}
\\
&\sf{
  \colorbox{orange}{
  \quad c × x3
  }
}
\\
\\
&\sf{
  \colorbox{orange}{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{Label}]
  (
    lhs: \textcolor{blue}{Label}, rhs: \textcolor{blue}{Label}
  ): \textcolor{blue}{Label} = \; ???
}
}

\end{aligned}
$$

### Key takeways 

A binary parametric product type:
- is a $\sf Functor$
- is not an $\sf Apply$ if the other member is not a $\sf Semigroup$
  - $\sf \textcolor{blue}{Label}$ is not a $\sf Semigroup$ because the $\sf \textcolor{maroon}{combine}$ operation is not closed on its members 


## $\sf Apply$ but not $\sf Applicative$

<p align="center" >
  <img src="/images/category-theory-2/tree-before-applicative-pure.svg">
</p>

![](/images/category-theory-2/grim-reaper.png)

For something to be $\sf Applicative$ it must already be an $\sf Apply$ and have an implementation of $\sf \textcolor{maroon}{pure}$.  All $\sf \textcolor{maroon}{pure}$ does is wrap a value into the given (higher kinded) type constructor:

$$
\begin{aligned}
\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{F}[\textcolor{blue}{A}]
}
\end{aligned}
$$

Let's take a look at how this might look for a $\sf \textcolor{blue}{Product}$:

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{F}[\textcolor{blue}{A}] = 
}
\\
&\sf{\quad (???: \textcolor{blue}{A}) × (???: \textcolor{blue}{X})}
\end{aligned}
$$

We can see that $pure$ only takes an $\sf \textcolor{blue}{A}$, so we need an aribtrary way to introduce an $\textcolor{blue}{X}$.  We do this by way of a method called $\sf \textcolor{maroon}{empty}$

<p align="center" >
  <img src="/images/category-theory-2/product-pure.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{F}[\textcolor{blue}{A}] = 
}
\\
&\sf{\quad a × empty}

\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{empty}: 
  \textcolor{blue}{X} = \; ???
}
\end{aligned}
$$

## Breaking Product

Once again, the easiest way to break $\sf Applicative$ is by way of $\sf Product$ by defining it in such a way that there is no valid implementation of $\sf \textcolor{maroon}{empty}$, e.g. replacing the arbitrary type $\sf \textcolor{blue}{X}$ with $\sf \textcolor{blue}{PosInt}$:

<p align="center" >
  <img src="/images/category-theory-2/weighted-before-positiveint.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \colorbox{lime}{\textcolor{blue}{PosInt}}
}
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{F}[\textcolor{blue}{A}] = 
}
\\
&\sf{\quad a × empty}

\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{empty}: 
  \colorbox{lime}{\textcolor{blue}{PosInt}} = \; ???
}
\end{aligned}
$$

There is no reasonable notion of emptiness for the set of positive integers, so we cannot implement $\sf \textcolor{maroon}{empty}$ – which in turn breaks the rest of our implementation:

<p align="center" >
  <img src="/images/category-theory-2/weighted-before-positiveint-rm.svg">
</p>

$$
\begin{aligned}
&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{PosInt}
}
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{F}[\textcolor{blue}{A}] = 
}
\\
&\sf{\quad a × empty}

\\
&\sf{
  \colorbox{orange}{
    \textcolor{magenta}{def} \; 
    \textcolor{maroon}{empty}: 
    \textcolor{blue}{PosInt} = \; ???
  }
}
\end{aligned}
$$

### Key takeways 

A binary parametric product type:
- is a $\sf Functor$
- is not an $\sf Apply$ if the other member is not a $\sf Semigroup$
- is not an $\sf Applicative$ if the other member is not a $\sf Monoid$
  - a $\sf Monoid$ has an associative operation _and an identity element_


## $\sf Apply$ but not $\sf Flatmap$

<p align="center" >
  <img src="/images/category-theory-2/tree-before-flatmap-flatmap.svg">
</p>


### $\sf FlatMap$

Given an $\sf \textcolor{blue}{F}[\textcolor{blue}{A}]$ and wanting an $\sf \textcolor{blue}{F}[\textcolor{blue}{B}]$, a $\sf FlatMap$ takes a function $\sf \textcolor{maroon}{f}$ from $\sf\textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}]$:

<p align="center" >
  <img src="/images/category-theory-2/flatmap.svg">
</p>

$$
\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] 
  }
$$

Deriving the implementation of $\sf \textcolor{maroon}{flatMap}$ for a $\sf \textcolor{blue}{Product}$ should be a familiar process by now. We start with our target product $\sf \textcolor{blue}{F}[\textcolor{blue}{B}]$ and work backwards:

<p align="center" >
  <img src="/images/category-theory-2/product-flatmap-before-fb.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{
  \colorbox{lime}{
    \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
  }
}
\end{aligned}
$$

First, leveraging our $\sf  fa$, we introduce an $\sf \textcolor{blue}{X}$:

<p align="center" >
  <img src="/images/category-theory-2/product-flatmap-before-fa-elimination.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{
  \colorbox{lime}{
    \quad val \; (a × x1) = fa
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

Then we map to our $\sf \textcolor{blue}{F}[\textcolor{blue}{B}]$ via $\sf \textcolor{maroon}{f}$ and perform product elimination to get a product of $\sf \textcolor{blue}{X}$s:


<p align="center" >
  <img src="/images/category-theory-2/product-flatmap-before-fake-fb.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \colorbox{lime}{
    \quad val \; fb = \textcolor{maroon}{f}(a)
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

<p align="center" >
  <img src="/images/category-theory-2/product-flatmap-real-fb-elimination.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \colorbox{lime}{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\end{aligned}
$$

We use a handy-dandy $\sf\textcolor{maroon}{combine}$ to go from our $\sf \textcolor{blue}{X} × \textcolor{blue}{X}$ product to a single $\sf \textcolor{blue}{X}$:

<p align="center" >
  <img src="/images/category-theory-2/product-flatmap-combine.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \colorbox{lime}{
  \quad val \; x3 = \textcolor{maroon}{combine}(x1, x2)
  }
}
\\
&\sf{
  \quad (???: \textcolor{blue}{B}) × (???: \textcolor{blue}{X})
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{X}]
  (
    lhs: \textcolor{blue}{X}, rhs: \textcolor{blue}{X}
  ): \textcolor{blue}{X} = \; ???
}
\end{aligned}
$$

And finally, complete the implemntation by returning the target product $\sf b × x3$:

<p align="center" >
  <img src="/images/category-theory-2/product-flatmap.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \quad val \; x3 = \textcolor{maroon}{combine}(x1, x2)
}
\\
&\sf{
  \quad b × x3
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{X}]
  (
    lhs: \textcolor{blue}{X}, rhs: \textcolor{blue}{X}
  ): \textcolor{blue}{X} = \; ???
}
\end{aligned}
$$

### Breaking Product

![](/images/category-theory-2/bernie.png)

Our point of entry here is the target type $\sf \textcolor{blue}{B}$

<p align="center" >
  <img src="/images/category-theory-2/weight-b.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{X}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{F}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{F}[\textcolor{blue}{A}]): 
  \textcolor{blue}{F}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \quad val \; x3 = \textcolor{maroon}{combine}(x1, x2)
}
\\
&\sf{
  \quad \colorbox{yellow}{b} × x3
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{X}]
  (
    lhs: \textcolor{blue}{X}, rhs: \textcolor{blue}{X}
  ): \textcolor{blue}{X} = \; ???
}
\end{aligned}
$$

Working backwards from here, we see that we derive $\sf b$ from $\sf fa$ and $\sf fa$ from our type $\sf \textcolor{blue}{F}[\textcolor{blue}{A}]$.  Well, what if we did something dastardly and decided that our type $\sf \textcolor{blue}{F}[\textcolor{blue}{A}]$ was no longer a product and instead just 

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{F}[\textcolor{blue}{A}] = 
  \textcolor{blue}{X}
}

\end{aligned}
$$

This feels like cheating, but such a type is legal and exists.  They're called "Phantom Types."  A practical example might again use the $\sf \textcolor{blue}{PosInt}$ in place of $\sf \textcolor{blue}{X}$ and thus our type $\sf \textcolor{blue}{F}[\textcolor{blue}{A}]$ might be thought of instead as $\sf \textcolor{blue}{Weight}$ causing the $\sf FlatMap$ to break down accordingly:

<p align="center" >
  <img src="/images/category-theory-2/weight.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Weight}[\textcolor{blue}{A}] = 
  \textcolor{blue}{PosInt}
}
\\

&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{combine}[\textcolor{blue}{PosInt}]
  (
    lhs: \textcolor{blue}{PosInt}, rhs: \textcolor{blue}{PosInt}
  ): \textcolor{blue}{PosInt} = \; ???
}
\end{aligned}
$$

### Key takeways 

A binary parametric product type:
- is a $\sf Functor$
- is not an $\sf Apply$ if the other member is not a $\sf Semigroup$
- is not an $\sf Applicative$ if the other member is not a $\sf Monoid$
- is not a $\sf FlatMap$ if the $\sf Apply$ is of a Phantom Type

## $\sf Applicative$ but not $\sf Monad$

<p align="center" >
  <img src="/images/category-theory-2/tree-before-monad-through-applicative-flatmap.svg">
</p>

We've introduced all the fundamental operations of a $\sf Monad$ at this point, so all that's left to do is devise clever scenarios for which these operations are invalid for our chosen type.  For an $\sf Applicative$ to be a $\sf Monad$, it must implement $\sf \textcolor{maroon}{flatMap}$, so let's make that impossible.

A perfectly valid and even common pattern we might encounter would be the product of some data as well as a boolean flag to indicate some state:

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{Boolean}
}

\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
}

\\
&\sf{
  \quad a × \colorbox{yellow}{false}
}

\end{aligned}
$$

Our implementation of $\sf \textcolor{maroon}{flatMap}$ then becomes:


<p align="center" >
  <img src="/images/category-theory-2/flagged-flatmap.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{Boolean}
}

\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
}

\\
&\sf{
  \quad a × false
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{Flagged}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{Flagged}[\textcolor{blue}{A}]): 
  \textcolor{blue}{Flagged}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (a × x1) = fa}
\\
&\sf{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \quad val \; x3 = \colorbox{yellow}{x1 || x2}
}
\\
&\sf{
  \quad b × x3
}
\\

\end{aligned}
$$

And once again abusing Phantom Types, suppose we stripped our type constructor of is Product nature, reducing it to just a $\sf \textcolor{blue}{Boolean}$:

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = \textcolor{blue}{Boolean}
}

\end{aligned}
$$

Backtracking from $\sf \textcolor{blue}{B}$ again, we get the following:

<p align="center" >
  <img src="/images/category-theory-2/flagged-flatmap-removing-a.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
  \colorbox{orange}{\textcolor{blue}{A} ×} \textcolor{blue}{Boolean}
}

\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{Flagged}[\textcolor{blue}{A}] = 
}

\\
&\sf{
  \quad \colorbox{orange}{a ×} false
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{Flagged}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{Flagged}[\textcolor{blue}{A}]): 
  \textcolor{blue}{Flagged}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (\colorbox{orange}{a} × x1) = fa}
\\
&\sf{
  \quad val \; (\colorbox{orange}{b} × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \quad val \; x3 = x1 \; || \; x2
}
\\
&\sf{
  \quad \colorbox{orange}{b} × x3
}
\\

\end{aligned}
$$

which breaks $\sf \textcolor{maroon}{flatMap}$ and leaves us with just our type which is now more of a $\sf \textcolor{blue}{Flag}$ rather than a $\sf \textcolor{blue}{Flagged}$ since it has nothing _to flag_ anymore.

<p align="center" >
  <img src="/images/category-theory-2/flag.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Flag}[\textcolor{blue}{A}] = \textcolor{blue}{Boolean}
}
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{Flag}[\textcolor{blue}{A}] = false
}

\end{aligned}
$$

### Key takeways 

A binary parametric product type:
- is a $\sf Functor$
- is not an $\sf Apply$ if the other member is not a $\sf Semigroup$
- is not an $\sf Applicative$ if the other member is not a $\sf Monoid$
- is not a $\sf FlatMap$ if the $\sf Apply$ is of a Phantom Type
- is not a $\sf Monad$ if the $\sf Applicative$ is of a Phantom Type

## $\sf FlatMap$ but not $\sf Monad$

And finally, the last leg of the journey requires illustrating how a thing which is pretty much everything else cannot be a $\sf Monad$.

<p align="center" >
  <img src="/images/category-theory-2/tree-before-monad-through-flatmap-pure.svg">
</p>

We've broken $\sf \textcolor{maroon}{pure}$ already, so we'll just do that again here by swapping out our $\sf \textcolor{blue}{Flagged}$ type with something we know cannot be $\sf \textcolor{maroon}{combine}$d since it has no $\sf \textcolor{maroon}{empty}$ such as $\sf \textcolor{blue}{Weighted}$:

<p align="center" >
  <img src="/images/category-theory-2/flagged-flatmap-plus-done.svg">
</p>

$$
\begin{aligned}

&\sf{
  type\; \textcolor{blue}{Weighted}[\textcolor{blue}{A}] = 
  \textcolor{blue}{A} × \textcolor{blue}{PosInt}
}
\\
\\
&\sf{
   \textcolor{magenta}{def} \; 
  \textcolor{maroon}{pure}[\textcolor{blue}{A}]
  (a: \textcolor{blue}{A}): 
  \textcolor{blue}{Weighted}[\textcolor{blue}{A}] =  a \colorbox{orange}{× \; ???}
}
\\
\\
&\sf{
  \textcolor{magenta}{def} \; 
  \textcolor{maroon}{flatMap}[\textcolor{blue}{A}, \textcolor{blue}{B}]
  (
    \textcolor{maroon}{f}: \textcolor{blue}{A} ⟹ \textcolor{blue}{Weighted}[\textcolor{blue}{B}] 
  )
  (fa: \textcolor{blue}{Weighted}[\textcolor{blue}{A}]): 
  \textcolor{blue}{Weighted}[\textcolor{blue}{B}] = 
  }

\\
&\sf{\quad val \; (b × x1) = fa}
\\
&\sf{
  \quad val \; (b × x2) = \textcolor{maroon}{f}(a)
}
\\
&\sf{
  \quad val \; x3 = x1 \; \colorbox{lime}{+} \; x2
}
\\
&\sf{
  \quad b × x3
}
\end{aligned}
$$

Right away, this breaks $\sf \textcolor{maroon}{pure}$ and we have no way to lift an $\sf \textcolor{blue}{A}$ into a Monoidal $\sf \textcolor{blue}{Weighted}$:

<p align="center" >
  <img src="/images/category-theory-2/weighted.svg">
</p>

### Key takeways 

A binary parametric product type:
- is a $\sf Functor$
- is not an $\sf Apply$ if the other member is not a $\sf Semigroup$
- is not an $\sf Applicative$ if the other member is not a $\sf Monoid$
- is not a $\sf FlatMap$ if the $\sf Apply$ is of a Phantom Type
- is not a $\sf Monad$ if the $\sf Applicative$ is of a Phantom Type
- is not a $\sf Monad$ if a $\sf FlatMap$ if the other member is not a $\sf Monoid$.

## Conclusion

And there we have it – a detailed breakdown of why some things are things but not other things – chock-full of hopefully-not-too-contrived counter examples! 

[^1]: [nrinaudo.github.io/things-that-are-things](https://nrinaudo.github.io/things-that-are-things)

[^2]: [typelevel.org](https://typelevel.org/cats/typeclasses.html)

[^3]: If it wasn't obvious how dreadful the documentation surrounding the cats abstractions are from the very first Typelevel diagram – they define $\sf Apply$ as a just "$\sf Applicative$ modulo pure."  This definition should make sense by the end of this post, but without that comprehensive knowledge just yet, it SUCKS.