---
title: "What is a Turing Machine?"
date: "2019-06-17"
draft: false
path: "/blog/peter-t"
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

# The Man

The British mathematician and father of modern computing Alan Turing was born in 1912.  Popularly lauded as the brains behind cracking the Nazi's code used in the second World War through the use of his Enigma machine, Alan Touring dedicated is life to computation.  In 1936, he published an essay ["On Computable Numbers, With an Application to the Entscheidungs Problem"](https://history-computer.com/Library/turing_Oncomputablenumbers.pdf) which hinted at the ultimate focus of this series of blog posts: Turing Machines.

![Alan turing](https://regmedia.co.uk/2015/05/15/alan_turing.jpg?x=442&y=293&crop=1)

# The Machine

In the aforementioned article, Turing describes a machine which would supersede human computational capabilities:

>_We may compare a man in the process of computing a real number to a machine
which is only capable of a finite number of conditions q1, q2, ..., qR which will be
called “m-configurations”. The machine is supplied with a “tape”, (the analogue of
paper) running through it, and divided into sections (called “squares”) each capable
of bearing a “symbol”. At any moment there is just one square, say the r-th, bearing
the symbol S(r) which is “in the machine”. We may call this square the “scanned
square”. The symbol on the scanned square may be called the “scanned symbol”.
The “scanned symbol” is the only one of which the machine is, so to speak,
“directly aware”. However, by altering its m-configuration the machine can
effectively remember some of the symbols which it has “seen” (scanned)
previously. The possible behaviour of the machine at any moment is determined by
the m-configuration qn and the scanned symbol S(r). This pair qn, S(r) will be
called the “configuration”: thus the configuration determines the possible behaviour
of the machine. In some of the configurations in which the scanned square is blank
(i.e. bears no symbol) the machine writes down a new symbol on the scanned
square: in other configurations it erases the scanned symbol. The machine may also
change the square which is being scanned, but only by shifting it one place to right
or 1eft. In addition to any of these operations the m-configuration may be changed.
Some of the symbols written down {232} will form the sequence of figures which is
the decimal of the real number which is being computed. The others are just rough
notes to “assist the memory”. It will only be these rough notes which will be liable
to erasure._

Turing goes on to elaborate on the exact specifications of the theoretical machine which I strongly encourage readers to pursue themselves.  But for the sake of the musings of this series, the layman's definition of a Turing machine can be understood as an infinitely-long tape (memory) with initially blank squares that can be written to.

The operational aspect of the machine has 3 functions:
1. Read the symbol at the current square (memory address),
2. Write/overwrite the symbol at the current square,
3. Move the tape left or right by one square.

![Turing Machine](https://3c1703fe8d.site.internapcdn.net/newman/csz/news/800/2013/artificialmusclecomputer1.jpg)

The last piece of vocabulary we need to embark on our Terrible Turing Journey is "Turing Complete."  Something is said to be Turing Complete if it can simulate a Turing Machine.  If something is Turing Complete, it could theoretically solve any computational problem it was given, provided sufficient run time. Real world scenarios are limited by their lack of an "infinite memory tape" alluded to in Turing's paper - hence the thought experiment remains in the realm of goofs, gaffs, blog posts, and academic shit posts (commonly referred to as mathematical papers).    

Tom Wildenhain has an excellent [shit post](https://www.andrew.cmu.edu/user/twildenh/PowerPointTM/Paper.pdf) and accompanying [hilarious presentation](https://www.andrew.cmu.edu/user/twildenh/PowerPointTM/Paper.pdf) on the Turing Completeness of MS PowerPoint.

# The Plan
Now that the groundwork has been established, we can have some fun.  The purpose of this blog, from my perspective, is to house a series of _Terrible Turing Machines_.  

Enjoy  
