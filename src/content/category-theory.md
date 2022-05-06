---
title: "37 | Notes on Category Theory"
date: "2022-05-05"
description: "monad"
path: "/blog/category-theory"
---

<style> 
  .n { visibility: hidden; } 
  
  img {
    align: center;
  }
</style>



# Preface 

This is a collection notes on Category Theory for personal reference. 

# Index

## [Glossary](#glossary)

## [Quick Definitions](#quick)

## [Category Theory for Programmers](#category-theory-programmers)

- ### [1 | Category: The Essence of Composition](#prog-ch1)
- ### [2 | Types and Functions](#prog-ch2)
- ### [3 | Categories, Great and Small](#prog-ch3)
- ### [4 | Kleisli Categories](#prog-ch4)
- ### [5 | Products and Coproducts](#prog-ch5)
- ### [6 | Simple Algebraic Data Types](#prog-ch6)
- ### [7 | Functors](#prog-ch7)

## <a name="glossary" class="n"></a> Glossary 

| Term | Definition |
|------|------------|
| Monad |            |
| Monoid |            |
| Functor |            |
| Endofunctor |            |
| Category | | 

# <a name="quick" class="n"></a> Quick Definitions

- A **Category** $\mathbf{C}$ consists of 
  - A **class** $ob(\mathbf{C})$ called the class of object of $\mathbf{C}$
      - A class is a collection of things which would yield a paradox if we called it a set
  - For all $A, B \in \mathbf{C}$, a class $\mathbf{C}(A,B)$ called the **hom-set** of morphisms (or maps, arrows) from $A$ to $B$ 
      - The homset is literally the collection of morphisms
  - For all $A, B, C \in ob(\mathbf{C})$, a function $\circ: \mathbf{C}(B, C) \times \mathbf{C}(A,B) \rarr \mathbf{C}(A,C)$, such that $(g,f) \mapsto g \circ f$ called composition
  - For all $A \in ob(\mathbf{C})$, a morphism $\mathbf{id}_A \in \mathbf{C}(A,A)$ called the identity on $A$
  - Where composition is subject to the following conditions for all $A, B, C,D \in ob(\mathbf{C})$:
      - For all morphisms $f \in \mathbf{C}(A,B), g \in \mathbf{C}(B,C)$, and $h \in \mathbf{C}(C,D)$, we have associativity: $\\(h \circ g) \circ f = h \circ (g \circ f)$
      - For all morphisms $f \in \mathbf{C}(A,B)$, we have $f \circ \mathbf{id}_A = f = \mathbf{id}_B \circ f$
- A **Functor** between categories $\mathbf{C, D}$ consists of $F : \mathbf{C} \rarr \mathbf{D}$ where 
  - A function $ob(\mathbf{C}) \rarr ob(\mathbf{D}$, such that $F \mapsto F(A)$
  - For all $A, B, C \in \mathbf{C}$, a function $\mathbf{C}(A,B) \rarr \mathbf{D}(F(A), F(B))$ such that $f \mapsto F(f)$
  - The function on morphisms is subject to the following conditions $\forall A,B,C \in \mathbf{C}$:
    - If $f \in \mathbf{C}(A,B)$ and $g \in \mathbf{C}(B,C)$, then $F(g \circ f) =  F(g) \circ F(f)$.  That is, $F$ preserves compositions
    - Similarly, $F(\mathbf{id}_A) = \mathbf{id}_{F(A)}$, so $F$ preserves identities as well
  - Functors take objects to objects and morphisms to morphisms subject to sensible composition laws
      - Forgetful functors take objects to a _superclass_ of themself by dropping some properties of the initial subclass

Classes of sameness

| class | | 
|-------|-|
| Equality | the same |
| Isomorphic | basically the same |
| Equivalence |  basically basically the same |
| Naturally Isomorphic | Basically the same, but spicy | 
| Adjunction | TODO |

# <a name="category-theory-programmers" class="n"></a> Category Theory for Programmers

## <a name="prog-ch1" class="n"></a> 1 | Category: The Essence of Composition 

- A **category** consists of **objects** and **arrows** that go between them
- The essence of a composition is a category, and vice versa (_the essence of a category is composition_)

TODO illustration 

### 1.1 Arrows as Functions

- Arrows are **morphisms**, which, for the time being, can be thought of as functions (functions are a subset of morphisms).

- If we have two functions $f: A \rarr B$ and $g: B \rarr C$, then we can compose them to have a function $h: A \rarr C$ given by $h = g \circ f$ where $\circ := | $, unix pipe operator, and can be read as "$g$ of $f$" or "$g$ after $f$." 

### 1.2 Properties of Composition

1. Composition is **associative**: it can be expressed without parentheses

$$
\begin{aligned}
  h \circ (g \circ f) = (h \circ g) \circ f
\end{aligned}
$$

2. For every object $A$, there exists and arrow which is a unit of composition.  This arrow goes from the object back into itself.  "Unit of composition" means that, when composed with any arrow that either starts or ends at $A$, it will give back the same arrow.  The unit for $A$ is the identity operation on $A$ given by $\mathbf{id}_A$, which is useful for higher order functions and establishing other properties of categories.  Given a function $f: A \rarr B$, 

$$
  f \circ \mathbf{id}_A = f \\
  \mathbf{id}_B \circ f = f 
$$

### 1.3 Composition is the Essence of Programming

- Programming naturally follows the technique of de-_composing_ a large problem into smaller, digestible problems for efficient solutions.

## <a name="prog-ch2" class="n"></a> 2 | Types and Function

### 2.1 Who needs Types?

- Higher level languages' compilers protect from lexical and grammatical errors that might arise from arbitrary sequences of machine code
  - Type checking is one mechanism to prevent non-sense programs
  - **Dynamically-typed** languages resolve mismatches at runtime
  - **Statically-typed** languages resolve mismatches at compile time

### 2.2 Types Are About Composability

- Category Theory is about composing arrows, but not just any combination of arrows, typically they have to compose between arrows of similar **type** 
  - Target object must be the same as the source of the next arrow

### 2.3 What are Types?

- Intuitively, we can think of types as sets of values e.g., 

$$
Bool = \{True, False\}
$$

- Types can be finite, like the set of allowable characters in a programming language:

$$
  char = \{c | c \in Unicode\}
$$

- Types can be infinite:

$$
  String = \{ c_1[c_2c_3...] | c_i \in char \}
$$

- **Set** is itself a category where objects are sets, and morphisms or arrows are functions

- A conflict which arises between the mathematical and programming understandings of the term "functions"
  - A mathematical function _is_ and answer
  - A programming function is a sequence of executable steps _to compute_ an answer.  This is fine as long as there are finite steps, but recursive functions may never terminate
      - Well-defined recursive definitions are fine, but determining whether a recursive functioning terminates is [undecidable](https://en.wikipedia.org/wiki/Halting_problem) and has [several neat implications](/blog/mtg-turing-complete).
- Programming languages circumvent this by having all types extend a special value known as the **bottom**: $\perp$ which means non-terminating computation

For example, take the following Haskell function: 

```haskell
f :: Bool -> Bool
```

It might return `True`, `False`, or `bottom`.  It's convenient to treat every runtime error as a bottom:

```haskell
f x = undefined
```

which is acceptable to the type checker since `undefined` evaluates to bottom which is a member of _any_ type including `Bool`.

- Functions that may return bottom are called **partial**, as opposed to _**total**_ which returns valid values for all input arguments.

Because of this definition, the category of Haskell types and functions used above are called  **Hask**, rather than Set.  There's a theoretical distinction, but pragmatically speaking, they're equivalent

### 2.4 Why Do We Need a Mathematical Model?

- It's hard to nail down precise semantic standards for programming languages
- **Operational Semantics** represent a formal tool of describing behavior, but it's complex and academic
  - Relies on / defines an idealized program interpreter
  - It's rather difficult to prove program behavior this way since you have to run a program through your idealized interpreter to document a property which is only a minor improvement over how humans do it in our heads. And we all know how great we are at writing sound programs!

- Semantics of industrial languages are usually described with informal operational reasoning in terms of an "abstract machine"

- **Denotational Semantics** - a formalization under which every programming construct is given a mathematical interpretation.  Languages which lend themselves to denotational semantics are "good" and those that don't are "bad" (I'm _heavily_ paraphrasing here lol):

Consider the following programs

```haskell
factorial n = product[1..n]
```

```c
int factorial(int n) {
  int i;
  int res = 1;
  for (i = 2; i <= n; ++i)
    res *= i;
  return res;
}
```

This is something of a cheap shot since we could just as easily ask for a mathematical model of reading characters from stdin, or sending a packet across the wire, or any other program which doesn't intuitively lend itself to notation like that of computing the factorial of a number.  GG Haskell. 

The solution: Category Theory.  Eugenio Moggi found that computational effect can be mapped to **Monads** which helps ?

### 2.5 Pure and Dirty Function

- Recall that a mathematical function is just a mapping of values.  Mathematical functions can easily be implemented as programming functions e.g. we can expect that a `square` function will produce the same output every time, regardless of outside factors
  - Squaring a number should not have the side effect of dispensing a dog treat, else it cannot be easily modeled as a mathematical function

- A **Pure Function** always produces the same output when given the same input
  - All functions in Haskell are pure, which contributes to why it's easier to describe the language's behavior with denotational semantics

- A **Dirty Function** is one which produces side effects like dog treats by creating or relying upon external, (global) state


### 2.6 Examples of Types

#### 2.6.1 Empty

- Is there a type that corresponds to the empty set?
- Not the C/C++ `void`, but yes the Haskell `Void` since it's a type that is not inhabited by any values, which nicely corresponds to the mathematical notion of $\empty$.  
- Thus, you can define a function which accepts `Void` as an argument, but you can never invoke it since, by definition, no values satisfy the argument signature!
- This function can happily return _any type_ since it will never be called

```haskell
absurd :: Void -> a
```

- Void represents falsity, `absurd` corresponds to the statement that from falsity follows anything

> _Ex falso sequitur quodlibet_.

#### 2.6.2 Singleton

- This _is_ the C/C++ `void` construct, holding only 1 possible value
- A function from `void` can always be called, and if it is pure, it will always return the same result

```c
int f42() { return 42; }
```

- The above example isn't _quite_ taking "nothing" as the argument since "nothing" is Haskell's `Void`, but since there's only one instance of `void` in C/C++, it's implied in the function signature

- Haskell's singleton is `()` –the "unit"– which coincidentally results in a very similar signature:

```haskell
f44 :: () -> Integer
f44 () = 44 
```

- We can think of `f44` is a substitute for the primitive Integer `44` which helps us express specific elements as functions or morphisms

#### 2.6.3 void/Unit as a Return Type

- This is normally used for side-effecting functions, but these are not mathematical functions
- Formally, a function from set $A$ to Singleton set maps every element of $A$ to the single element of the Singleton.  For all sets there exists one such function:

```haskell
fInt :: Integer -> ()
fInt x = ()
fInt _ = ()
```

- Note that it doesn't even depend on the type of argument

- Functions that can be implemented with the same formula for any type like this are called **parametrically polymorphic**

```haskell
unit :: a -> ()
unit _ = ()
```

#### 2.6.4 Two-element Set

- In Haskell, the notion of `Bool` is defined as 

```haskell
data Bool = True | False
```

- In libc it's a primitive (or if you're willing to suspend your [pedantry](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/stdbool.h.html), that is)
- Functions to the Boolean type are called **predicates**:
  - `isEven`, `isNumeric`, `isTerminal`, etc.


## <a name="prog-ch3" class="n"></a> 3 | Categories, Great and Small

### 3.1 - No Objects

- The category with zero objects consequently has zero morphisms
- It's important in the same way that the empty set, empty type, and the number 0 are important 

### 3.2 - Simple Graphs

- Consider an arbitrary directed graph; we can make it into a category by adding a few more arrows:
  - Ensure that each object has an $\mathbf{id}$ arrow
  - For any two arrows such that the end of one coincides with the beginning of another, add a new arrow to serve as their composition

![](/images/category-theory-1.png)

- Here, we've created a category which has an object for all nodes in our graph, and _all possible_ chains of composable graph edges as morphisms ($\mathbf{id}$ are special chains of length 0).
- This is an example of a **free category** generated by a graph $G$ and completed by extending it with the minimal number of items to satisfy its laws.

### 3.3 - Orders

- An **Order** is a category where a morphism is a comparative relation between objects
- We can verify that Orders are categories as follows:
  - _What's the identity in an Order?_ Every object is less than or equal to itself
  - _Can we compose objects in an Order?_ Yes, if $a \leq b$ and $b \leq c$, then, transitively $a \leq c$
  - _Is the composition associative?_ Also yes
    - A set with this relation is called a **Preorder** which is a category
    - A stronger conditional relation where 

$$
a \leq b, b \leq c \iff a = b
$$

is known as a **Partial Order**

- Lastly, imposing the condition that any two objects are in relation with each other yields a **Linear Total Order**

- A **Preorder** is a category where there is at most _one_ morphism from any object $a$ to object $b$
  - This is called a "**thin**" category
  - A set of morphisms from objects $a$ to $b$ in a category $C$ is called a **Hom-set** and is denoted: $\mathbf{C}(a,b)$ or $\mathbf{Hom}_C(a,b)$
  - Every Hom-set in a preorder is either empty or a singleton
      - This includes the Hom-set $\mathbf{C}(a,a)$, the set of morphisms from $a$ to $a$ which must be the singleton containing only the identity
      - There may be cycles in a preorder, but not a partial order
      - Sorting algorithms like quicksort, mergesort, selection sort, etc. can only work on total orders
      - Partial orders can be [topologically sorted](https://en.wikipedia.org/wiki/Topological_sorting)

### 3.4 - Monoid as Set

- A monoid is a set with an associative, binary operation and one special element that behaves like a unit with respect to this operation
- E.g., the natural numbers with zero form a monoid under addition. To verify:
  - Associativity: $(a + b) + c = a + (b + c)$
  - neutral element: $0 + a = a$ and $a + 0 = a$
      - The 2nd equation appears redundant because addition is commutative, but commutativity is not a requisite property of monoids, so it's included for thoroughness
- Another example, Strings form a monoid with the binary concatenation operation where the unit is the empty string which can be joined on either side of another string without modifying it


```haskell
class Monoid m where
  mempty  :: m
  mappend :: m -> m -> m
```

First, what does the `m -> m -> m` argument list mean? It can be interpreted as:

1. a function with multiple argument where the last, or rightmost, argument signifies the return type
2. or as a function with one argument (leftmost) that returns a function.  This can be hinted using parentheses e.g. `m -> (m -> m)` but is redundant since **arrows are right-associative**

We can instantiate a string as an instance of `Monoid` and define its behavior:

```haskell
instance Monoid String where
  mempty  = ""
  mappend = (++)
```

- Note that there are different paradigms for what equality means in programming languages:
  - **functional equality**: what we have here, `mappend = (++)`, which is the equality of morphisms in the Hask category 
      - Also known as **point-free equality**: equality without specifying arguments
  - **extensional equality**: `mappend s1 s2 = (++) s1 s2`, which is also known as point-wise equality, where the value of the function `mappend` at point `(s1, s2)` is equivalent to `(++) s1 s2`
  

### 3.5 - Monoid as Category

- Every monoid can be described as a single object with a set of morphisms that follow appropriate rules of composition
- We can always extract a set from a single object category.  This set is the set of morphisms. I.e., we have the Hom-set $\mathbf{M}(m, m)$ of the single object $m$ in the category $\mathbf{M}$
  - We can easily define a binary operator in this set: the monoidal product of two set-elements.  Given 2 elements of $\mathbf{M}(m, m)$ corresponding to $f$ and $g$, their product will be equivalent to $f \circ g$ and this composition always exists because the source and target of the morphism are the same object $m$.
  - It's associative, and the identity morphism is the neutral element of the product, so we can always recover a set monoid from a category monoid, they're effectively equivalent.
- Note that morphisms don't have to form a set; categories are broader than sets.  In fact, a category in which a morphism between any two objects forms a set is called "locally small"

- Elements of a Home-set can be seen as both 

  1. morphisms which follow the rules of composition
  2. points in a set

- Composition of morphisms in $\mathbf{M}$ translates into a monoidal product in the set $\mathbf{M}(m, m)$.

## <a name="prog-ch4" class="n"></a>  4 | Kleisli Categories

- How can we model non-pure functions or side effects in Category Theory?
  - Imperatively, this is achieved by modifying global state


```c
string logger;
bool negate(bool b) {
  logger += "Not so!";
  return !b;
}
```

- This function is not pure since its memoized version fails to produce a log. A more modern approach might resemble the following:


```cpp
Pair<bool, string> negate(bool b, string logger) {
  return make_pair(!b, logger + "Not so!");
}
```

- This still sucks from a design perspective. It would be better to aggregate the log message externally _between_ function calls:


```cpp
Pair<bool, string> negate(bool b) {
  return make_pair(!b, "Not so!");
}

res = negate(true);
negated = res.first;
logger += res.second;
```

- But, externally aggregating all logs is gross, and we can abstract this repetition further, but then we'd be abstracting the composition of functions 👻

### 4.1 - Writer Category

- Embellishing return types of functions is very useful. We start with a regular category of types and functions. We leave types as our objects, but we redefine our morphisms to be the _embellished_ functions
- E.g., We want to embellish `isEven` which goes from `int` to `bool` and turn it into a morphism that is represented by an embellished function
  - This morphism would still need to be considered an arrow between objects `int`, `bool`, even though the embellished function returns `Pair`


```cpp
Pair<bool, string> isEven(int n) { return make_pair(n % 2 ==0, "isEven"); }
```

- By laws of categories, wee should be able to compose this with another morphism that goes from object `bool` to whatever:

```cpp
Pair<bool, string> negate(bool b) { return make_pair(!b, "Not so!"); }
```

The literal composition would look like:


```cpp
Pair<bool, string> isOdd(int n) {
  Pair<bool, str> p1 = isEven(n);
  Pair<bool, str> p2 = negate(p1.first);
  return make_pair(p2.first, p1.second + p2.second);
}
```

The formula for composition, then, is:
1. Execute the embellished function corresponding to the first morphism
2. Extract the first component of the result and pass it to the second morphism
3. Concatenate the second component of the first result with the second component of the second result.
4. Return the new pair combining the first component of the final result with the concatenated result from (3)

- If we want to abstract this composition, we just need to parameterize the three object involved in our category: two embellished functions that are composable according to our rules, and return the third embellished function.

```cpp
template<class A, class B, class C> 
function<Writer<C>(A)> compose(function<Writer<B>(A)> m1, 
                               function<Writer<C>(B)> m2) {
  return [m1, m2](A x) {
    auto p1 = m1(x);
    auto p2 = m2(p1.first);
    return make_pair(p2.first, p1.second + p2.second);
  }
}
```

### 4.2 - Writer in Haskell

```haskell
type Writer a = (a, String) -- alias/typedef, parameterized by a
a -> Writer b -- morphisms
```

We declare the composition of `Writer`s using Haskell's "fish" operator which is a function of two arguments which are other functions and returns a function

```haskell
(>=>) :: (a -> Writer b) -> (b -> Writer c) -> (a Writer c)

m1 >=> m2 = \x ->
  let (y, s1) = m1 x
      (z, s2) = m2 y
  in (z, s1 ++ s2)
```

with the identity:

```haskell
return :: a -> Writer a
return x = (x, "")
```

Then, we can compose them:

```haskell
upCase :: String -> Writer String
upCase s = (map toUpper s, "upCase")

toWords :: String -> Writer [String]
toWords s = (words s, "toWords")

process :: String -> Writer [String]
process = upCase >=> toWords
```

### 4.3 - Kleisli Categories

- Based on Monad, where:
  - Objects are the types of the underlying programming language
  - Morphisms from types $A$ to $B$ are functions that go from $A$ to a type derived from $B$ using the particular embellishment
  - Later, we'll see that "embellishment" is an imprecise description of the notion of an **endofunctor** is a category

- The last degree of freedom is composition itself which is precisely what makes it possible to give denotational semantics to programs that, in imperative languages, are traditionally implemented with side effects.

## <a name="prog-ch5" class="n"></a> 5 | Products and Coproducts

- In Category Theory, there exists a common construction called the "Universal construction" for defining object in terms of their relationships (morphisms)
  - Pick a pattern or shape constructed from objects and arrows and look for all its occurrences in the category
  - For large enough categories and common enough shapes/patterns, we can find many instances. We can establish a ranking over them and pick what is considered to be the best fit, like a search engine.  The line to toe is
      - generality: large recall
      - specifcity: precision

### 5.1 - Initial Object

- This is the simplest shape.  There are as many instance of this shape as there are objects in a given category
- We need to rank them, and all we have are morphisms
  - It is possible that there is an "overall net flow" of arrows from one end of the category to the other, especially in (partially) ordered categories
- We can generalize the notion of object precedence by saying that "$a$ is more initial than $b$" if there is an arrow from $a$ to $b$:

$$
a \xrightarrow{\text{is more initial than}} b
$$

- "The" initial object is one that has arrows going to all other objects
  - There is no guarantee that such an object exists in an arbitrary category, but that's okay.  
      - The bigger problem is that there might be _too many_ objects matching this description (good recall, low precision)
  - Leveraging ordered categories which have implicit restrictions on morphisms between objects: there can be at most one arrow between objects since there is only one way of being less than or equal to another object, we get a definition of the initial object: The object that has one and only one morphism going to any object in the category
  - Even this doesn't guarantee uniqueness of the initial object though (if it exists), but it _does_ guarantee uniqueness _up to isomorphism_.

Examples:
- Within a partially ordered set (**poset**): initial object is the the _least_ object 
- Category of sets and function: empty set (Haskell's `Void`) and the unique polymorphic function: 

```haskell
absurd :: Void -> a
```

### 5.2 - Terminal Object

- Similarly, we can identify an object $a$ which is "more terminal" than $b$
- The **Terminal Object** is the object with exactly one incoming morphism from any other object in the category
  - The terminal object is also unique up to the point of isomorphism
  - In a poset, the terminal object is the "biggest" object
  - In the category of sets and functions, it's a singleton
  - In Haskell, it's the unit `()`, and in C/C++ it's `void`

- Earlier, we established that there is only one pure function from any type to the unit type:

```haskell
unit :: a -> ()
unit _ = ()
```

Here, uniqueness is critical, because there are other sets (all of them, actually, except for the Empty category) that have incoming morphisms from every set.
- There exists a boolean function (predicate) defined for every type:

```haskell 
yes :: a -> bool
yes _ = True
```

But this _isn't_ the/a terminal object, because there's _at least_ one more:

```haskell 
no :: a -> bool
no _ = False
```

- Insisting on uniqueness gives us just the right amount of precision to narrow down the definition of the terminal object to just one type

### 5.3 - Duality

- Observing the symmetry between definitions of initial and terminal objects, we can reason that: for any category, we can define the opposite category: $\mathbf{C}^{op}$, just by reversing all the arrows
  - This automatically satisfies all the requirements of a category as long as we simultaneously redefine composition. If the original morphisms 

```haskell
f :: a -> b
g :: b ->
-- composed to 
h :: a -> c
```

with $h = g \circ f$, then the reversed morphisms must be $f^{op} : b \rarr a$ and $g^{op} : c \rarr b$ and will compose to $h^{op} : c \rarr a$, $h^{op} : f^{op} \circ g^{op}$.

Reversing the identity morphisms is a no op: $\circlearrowleft, \circlearrowright$

- Duality doubles the "productivity" as, for all categories once concocts, there exists the dual category you get for free!

## 5.4 - Isomorphisms

- Intuitively it means, "they look the same."  That is, every part of $a$ corresponds to $b$
- Formally, it means that there exists a mapping from $a \rarr b$ and back, $b \rarr a$, _and_ they (the mappings) are the inverse of one another 
- **Inverse** here is defined in terms of composability and identity:
  - a morphism $g$ is the inverse of $f$ if their composition is the identity: $f \circ g = \mathbf{id}$ and $g \circ f = \mathbf{id}


- Recall that the initial and terminal objects are unique _up to isomorphism_. This is because any two initial or terminal objects _are_ isomorphic.

For example, take two initial object $i_1, i_2$. Since $i_1$ is initial, there exists a unique morphism $f$ from $i_1 \rarr i_2$.  By the same reasoning, we have $g: i_2 \rarr i_1$. 

![](/images/category-theory-2.png)

- Note that all morphisms here are unique.  
- The composition of $g \circ f$ must be a morphism from $i_1 \rarr i_2$, but $i_1$ is initial, so there can only be one morphism from $i_1 \rarr i_1$. 
  - Since we are in a category, we know there is an identity morphism from $i_1 \rarr i_1$, and since there can only be one, that must be it (the identity).  
  - Therefore, $g \circ f = \mathbf{id}$, similarly $f \circ g = \mathbf{id}$ since there exists only one morphism from $i_s \rarr i_2$.  
  - Therefore $f$ and $g$ must be inverses of one another, so two initial objects are isomorphic
- Not that $f$ and $g$ must be unique in this proof because not only is the initial object unique _up to_ isomorphism, but it is unique up to _unique_ isomorphism.
  - There _could_ be multiple isomorphisms between two objects

### 5.5 - Products

- Recall that the Cartesian product of two sets is the set of all pairwise combinations therein:

$$
 A \times B = \{ (a, b) | \forall a \in A, \forall b \in B\}
$$

- How can we generalize this pattern that connects the product set with its constituent sets?
  - In Haskell, we have two functions, the projections, from the product to each constituent:


```haskell
fst :: (a, b) -> a
fst (x, _) = x

snd :: (a, b) -> b
snd (_, y) = y
```

- With even this limited vocabulary, we can construct the product of two sets $a,b$ which consists of an object $c$ and two morphisms $p,q$ connecting it to $a$ and $b$ respectively:

```haskell
p :: c -> a 
q :: c -> b
```

![](/images/category-theory-3.png)

- All $c$'s which fit the pattern can be considered candidates for the product, there might be multiple:

![](/images/category-theory-4.png)

For example, we can define two Haskell types as our constituents, `Int, Bool`:

```haskell
p :: Int -> Int
p x = x

q :: Int -> Bool
q _ = True
```

Which, as it stands, is pretty lam, but matches our criteria.  Consider a denser, but also satisfactory pair of constituent types:

```haskell
p :: (Int, Int, Bool) -> Int
p (x, _, _) = x

q :: (Int, Int, Bool) -> Bool
q p (_, _, b) = b
```

Whereas the first set of projections was too small, only covering the `Int` dimension of the product, these candidates are _too broad_, with the unnecessary duplicate `Int` dimension.

Returning to the _universal ranking_, how do we compare two instances of our pattern?  That is, how do we evaluate

$$
\{c, p, q\} \gtreqless \{c', p', q' \}
$$

- We would like to say that $c$ is _"better"_ than $c'$ if there is a morphism $m$ from $c' \rarr c$, but that constraint alone is insufficient.  We also want its projections to be "better" or "more universal" than those of $c'$. 
  - We want to be able to reconstruct $p', q'$ from $m$ and $c'$'s projections:

$$
p' = p \circ m \\
q' = q \circ m
$$

![](/images/category-theory-5.png)

- This can be interpreted as "$m$ factorizes $p'$ and $q'$."
- Using the pair `(Int, Bool)`, with the two canonical projections / "vocabulary" introduced earlier: `fst, snd` are "better" than the other two candidates:

![](/images/category-theory-6.png)

```haskell
-- mapping for first, simple candidate
m :: Int -> (Int, Bool)
m x = (x, True)

-- reconstructions of projections
p x = fst (m x) = x
q x = snd (m x) = True
```

And in our second, more complex example, $m$ has a similar uniquely determined $m$:

```haskell
m (x, _, b) = (x,b)
```

Therefore, `(Int, Bool)` is better than either of the other two candidates.  Why isn't the opposite true?  That is, can we find some $m'$ that would help reconstruct `fst, snd` from $p, q$?

```haskell
fst = p . m'
snd = q . m'
```

- In our first example, $q$ always returns `True`, and we know that there exist pairs with second components that are `False`, which we can't reconstruct from $q$ as defined.

- In the second example, we return enough information after $p$ or $q$, but there's multiple factorization of `fst` and `snd` since both $p$ and $q$ ignore the second component of the triple.  Our `m'` can put _anything_ there:

```haskell
m' (x, b) = (x, x, b)

-- or 

m' (x, b) = (x, 42, b)
```

Thus, given any type $c$ with two projections $p, q$, there is a unique $m$ from $c$ to the Cartesian product $(a, b)$ that factorizes them:

```haskell
m :: c -> (a, b)
m x = (p x, q x)
```

which makes the Cartesian product $(a, b)$ our _best_ match, which implies that this universal construction works in the category of Sets.

Now, let's generalize that same universal construction to define the product of two objects in _any_ category.
  - Note that the product doesn't necessarily _always_ exist, but when it does, it is unique up to unique isomorphism

- A **product** of two objects $a$ and $b$ is the unique object $c$ equipped with two projections such that, for any other object $c'$ equipped with two projects, there is a unique morphism $m$ from $c'$ to $c$ that factorizes those projections

- A higher order function which produces that factorizing function $m$ from two candidates is sometimes called the **factorizer**:

```haskell
factorizer :: (c -> a) -> (c -> b) -> (c -> (a, b))
factorizer p q = \x -> (p x, q x)
-- \x is a lambda expression or anonymous function
```

- to summarize, products are ranked according to their ability to factorize the morphism of their competing product-candidate's projections

### 5.6 - Coproducts

- Like every construction in Category Theory, the product has a dual: the **coproduct**
- Reversing the arrows in the product pattern yields an object $c$ with two _**injections**_ $i,j$ which are morphisms from $a,b \rarr c$ respectively:

![](/images/category-theory-7.png)

- The ranking of possible coproducts is also inverted such that $c$ is "_better than_" $c'$ (also equipped with two injections $i', j'$) if there is a morphisms $m$ from $c$ to $c'$ which factorizes the injections:

$$
i' = m \circ i \\
j' = m \circ j
$$

![](/images/category-theory-8.png)

- A **coproduct** of two objects $a,b$ is the object $c$ equipped with two injections such that for any other object $c'$ equipped with two injections, there is a unique morphism $m$ from $c$ to $c'$ that factorizes those injections.
  - In the category of Sets, it is the _disjoint union_ of two sets: an element of the disjoint union of $a, b$ is either an element of $a$ or an element of $b$.  If $a$ and $b$ overlap, then the disjoint union contains two copies of the common part (somehow skirting the definition of a set??)
    - The skirting part happens by "tagging" the elements with an identifier that specifies the origin

In programming terms, it's represented as a union with the added field of a tag enum:

```c
struct Contact {
  enum { isPhone, isEmail} tag;
  union {int phoneNum; char const* emailAddr; };
}
// with injections as "constructors" or functions:

Contact PhoneNum(int n) {
  /** this example is straight from the book, 
      but this should be dynamically allocated 💅 **/
  Contact c; 
  c.tag = isPhone;
  c.phoneNum = n;
  return c;
}
```

- Tagger unions are sometimes called **_variants_**

In Haskell:

```haskell
data Contact = PhoneNum Int | EmailAddr String
helpdesk :: Contact 
helpdesk = PhoneNum 9118675309
```

- Unlike the canonical implementation of product which is the primitive `Pair`, Haskell's coproduct is a data type `Either`:

```haskell
data Either a b = Left a | Right b
```

- Just as we  defined a factorizer for a product, we can define one for coproduct.  Given a candidate type $c$ and two candidate injections $i,j$, the factorizer for `Either` produces the factorizing function:

```haskell
factorizer :: (a -> c) -> (b -> c) -> Either a b -> c
factorizer i j (Left a) = i a 
factorizer i j (Right b) = j b
``` 

### 5.7 - Asymmetry

- Despite the similarities between categories and their duals obtained by reversing morphisms, and similarity with initial / terminal objects  in the category of sets, there are important qualities of these elements which are _not_ symmetric:
  - Product behaves like multiplication, with the terminal object playing the role of the multiplicative identity of one
  - Coproduct behaves more like a sum, with the initial object playing the role of zero.

- For finite sets:
  - The size of the product is the product of the sizes of individual sets
  - The size of the coproduct is the sum of the sizes

- Therefore, the category of sets is not symmetric with respect to _just_ inversion of arrows.
- Other asymmetries include:
  - Empty set: has a unique morphism to any set (the absurd function), but has no incoming morphisms
  - Singleton set: has a unique morphism to it from every set, but it _also_ has outgoing morphisms to every set (excluding the empty set)
      - It is inherently tied to the product which is what sets it apart from the coproduct

Consider using this set, represented by the unit `()`, as yet another, _vastly inferior_ candidate for the product pattern, equipped with two projections $p, q$ from the singleton to each constituent set.  Because the product is universal, there is also a unique morphism $m$ from our unit candidate to the product. 

Recall that $m$ select an element from the product set and factorizes the two projections:

```haskell
p = fst . m
q = snd . m
```

When acting on the singleton value, the only element is `()`, so these become:

```haskell
p () = fst (m ())
q () = snd (m ())
```

Conversely, there is not an intuitive interpretation of how this behaves for the coproduct, since the unit `()` tells us nothing about the source of the injections.  

This is a property of functions, not sets.  Functions in general aree asymmetric.

- A function must be defined for every element in its domain.
  - In programming language, it's a total function.
  - But, it doesn't have to cover the whole **codomain** or range
- When the size of the domain is substantially less than that of the codomain, we think of such functions as _embedding_ the domain in the codomain.  
  - I.e. $f$ from a singleton is embedded in the codomain
  - Formally, these are referred to as **surjective/onto**: functions that tightly fill their codomains
  - A function $f$ that maps an element $x$ to every element $y$ that is, for every $y$, there is an $x$ such that $f(x) = y$
- Another source of asymmetry is that functions are allowed to map many elements of the domain set into one element of the codomain
  - I.e. the unit collapses a whole set into a singleton.  Collapsing in this way is composable, and the results of composing collapsing operations are compounded
  - These functions are called **injective** or one-to-one
- **Bijections** are the middle child of classes of functions in that they _are_ symmetric _because_ they are invertible.  Isomorphisms in category theory are equivalent to bijections

## <a name="prog-ch6" class="n"></a> 6 | Simple Algebraic Data Types 

- Many common data structures can be built using the two Algebraic Data Types covered so far: product, coproduct
  - For **composite types** (types construct from primitives), equality, comparison, conversion, and more can be derived from the properties of products and coproducts

### 6.1 - Product Types in Programming

- Canonically a a product in Haskell is a primitive `Pair`, in C++, it's a template from the stdlib
  - Pair's aren't strictly commutative, meaning that `(Int, Bool)` is not necessarily equivalent to `(Bool, Int)`, but they are commutative up to the isomorphism given by a `swap` function:


```haskell
swap :: (a, b) -> (b, a)
swap (x, y) = (y, x)
```

- We can generalize the swap function for nested types since the different ways of nesting `Pair`s are isomorphic to one another.  E.g., nesting a product triple of `a, b, c` can be achieved two ways:
  - `(a, (b, c))` and `((a, b), c)`
  - These are different types, but their elements are in 1:1 correspondence and we can map between them:


```haskell
alpha :: ((a, b), c) -> (a, (b, c))
alpha ((x, y), z) = (x, (y, z))
```

which, like `swap`, is also trivially invertible 

The creation of a product type can be interpreted as a binary operation on types.  Thus, the `alpha` isomorphism looks very similar to the associativity law for monoids: 

$$
(a * b) * c = a * (b * c)
$$

Except that in the monoid case, these two compositions were equal, whereas here they're only equal up to isomorphism

- If we're content with equality up to isomorphism (which we are), and don't need strict equality (which we don't), we can go even further and show that the unit type `()` is the unit of the product in the same way that $1$ is the unit of multiplication.
  - Pairing a value type with a unit doesn't add any information, e.g., `(a, ())` is isomorphic to `a` via:

```haskell
rho :: (a, ()) -> a
rho (x, ()) = x

-- inverted by 

rho :: a -> (a, ()) 
rho x = (x, ())
```

- Formally, the category of sets is a **monoidal category** because we can _multiply_ objects by taking their Cartesian product

### 6.2 - Record

Example: We want to design a representation for a chemical element, and be able to verify that a chemical's symbol corresponds to the prefix of its name:

```haskell
startwithsymbol :: (String, String, Int) -> Bool
startwithsymbol (name, symbol, _) = isPrefixOf symbol name
```

But this is bad, error prone, and reliant on contextual clues.  A better model might resemble:

```haskell
data Element = Element { 
                         name :: String,
                         symbol :: String,
                         atomicNo :: Int 
                        }
```

These two representations are isomorphic as evidenced by some conversion functions:

```haskell
tupleToElem :: (String, String, Int) - Element
tupleToElem (n, s, a) = Element { name = n, symbol = s, atomicNo = a }

elemToTuple :: Element -> (String, String, Int)
elemToTuple e = (name e, symbol e, atomicNo e)
-- names of data fields serve as getters to access those fields
```

We can clean up our initial attempt at modeling a chemical as follows

```haskell
startwithsymbol :: Element -> Bool
startwithsymbol e = isPrefixOf (symbol e) (name e) 
```

### 6.3 - Sum Types

- Just as the product in the category of sets gives way to product types, coproducts correspond to sum types, canonically expressed as `Either` types
  - They are also commutative up to the point of isomorphism and
  - nestable up to the point of isomorphism (e.g., we can have a triple as a sum)

```haskell
data oneOfThree a b c = Sinistral a | Medial b | Dextral`
```

- Set is also a symmetric monoidal category with respect to coproduct where 
  - the binary operation is disjoint sum: `Either` $\approx +$ 
  - the unit element is the initial object: `Void` $\approx 0$ 
  - Accordingly, `Either a Void` is equivalent to `a` since it's not possible to construct a value of type `Void`: $a + 0 = a$
  - Sums are common in Haskell / FP
      - Less so in imperative languages, though they can be represented as variant unions (tagged unions)
      - Enums usually suffice, or primitives like `stdbool.h`

- Sum types which communicate the presence or absence of value or represented in Haskell as 
  
```haskell
data Maybe a = Nothing | Just a
--             ()        encapsulates a
```

- Immutability in FP allows repeated use of constructors for pattern matching in the reverse language

### 6.4 - Algebra of Types

- While powerful alone, combining  the product and sum types via composition yields even richer types
- We have two commutative monoidal structures underlying our small type system so far:
  - Sum with `Void` as the neutral element representing $0, +$  
  - Product with `()` as the neutral element representing $1, \times$  
- Do these follow the expected rules of arithmetic like $0 * n = 0$?
  - Is a product with one component being `Void` isomorphic to `Void`?  Can we create a Pair of `(Int, Void)`?
  - We need two values; we can take any `Int` for the first component of the Pair, but there are _no_ values of type `Void`, so the type `(Int, Void)` is also uninhabited, which is equivalent to `Void`
  - $a \times 0 = 0$ ✅
  - Furthermore, the distributive property also follows from this:

```haskell
    a * (b + c) = a * b + a * c
(a, Either b c) = Either (a ,b) (a, c) 
```

given by 

```haskell
prodToSum :: (a Either b c) -> Either (a, b) (a, c)
prodToSum = (x, e) = case e of 
                      Left y  -> Left (x, y)
                      Right z -> Right (x, z)

sumToProd :: Either (a, b) (a, c) -> (a, Either b c)
sumToProd e = case e of 
                Left (x, y)  -> (x, Left y)
                Right (x, z) -> (x, Right z)
```

- Two such intertwined monoids are called **semi-rings** (semi because we can't/haven't defined subtraction or division on types)
- Interpreting semi-ring types as natural numbers yields the following correspondences

| Expression | Type |
|------------|------|
| $0$ | `Void` |
| $1$ | `()` |
| $a + b$ | `Either a b = Left a | Right b` |
| $a \times b$ | `(a, b)` or `Pair a b = Pair a b` |
| $2 = 1 + 1$ | `data Bool = True | False` |
| $1 + a$ | `data Maybe = Nothing | Just a` |

- `List` is defined as a recursive solution to an equation:

```haskell
data List a = Nil | Cons a (List a)
-- `Cons` is a historical holdover name from Lisp for Constructor
```

If we do some algebraic substitutions using the table above and replace `List a` with $x$, and we get:

$$
\begin{aligned}
x & = 1 + a * x
\end{aligned}
$$

But, because we're working with a semiring, we can't solve this equation with division or subtraction.  Instead, we'll keep replacing $x$ with $1 + a * x$:

$$
\begin{aligned}
  x &= 1 + a * x \\
    &= 1 + a * (1 + a * x) = 1 + a + a * a * x \\
    &= 1 + a + a * a * (1 + a * x) = 1 + a + a * a + a * a * a * x \\
    &\vdots \\
    &= 1 + a + a * a + a * a * a + ...
\end{aligned}
$$

An infinite sum of product tuples which can be:
  - an empty list,
  - a singleton
  - a pair of $(a * a)$
  - a triple of (a * a * a), etc.
- The product of two types $a, b$ must contain both a value of type $a$ and a value of type $b$; they both must be inhabited
- Sums can contain _either_ a value for type $a$ or type $b$, but both are not required

- Logical _and_ and _or_ also form a semiring and can be mapped to Type Theory:

| Expression | Type |
|------------|------|
| $false$ | `Void` |
| $true$ | `()` |
| $a \|  b$ | `Either a b = Left a | Right b` |
| $a \&\& b$ | `(a, b)`  |

- Logical types and natural numbers are isomorphic via types

## <a name="prog-ch7" class="n"></a> 7 | Functors

- A **Functor** is a mapping between categories
- Given two categories $\mathbf{C, D}$, a functor $F$ maps objects in $\mathbf{C}$ to objects in $\mathbf{D}$
- If $a$ is an object in $\mathbf{C}$, we write its image in $\mathbf{D}$ as $Fa$
- A functor also maps morphisms –it's  function on morphisms, but it doesn't just map morphisms willy nilly– it preserves connections
  - If A morphism $f$ in $\mathbf{C}$ connects $a \rarr b$, ($f :: a \rarr c$) then the image of $f$ in $\mathbf{D}, Ff$ will connect the image of $a$ to the image of $b$: $Ff :: Fa \rarr Fb$

![](/images/category-theory-9.png)

- Functors preserve the structure of a category: what's connected in one category is connected in another
  - We also need to preserve the composition of these morphisms.  E.g., if we have $h = g \circ f$, we want its image under $F$ to be a composition of the images of $f, g$

![](/images/category-theory-10.png)