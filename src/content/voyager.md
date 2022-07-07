---
title: "40 | Voyager"
date: "2022-07-05"
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

> Less morose and more present
> 
> Dwell on my gifts for a second

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

## Forward Correction 

Luckily, with their backs against the wall, and Nixon's cronies looking for a reason to scuff the entire program (Nixon actually supported much of NASA's other efforts, obviously, he's just a fun villain), NASA did not have to also invent the wheel of Error Correcting Codes.  Much of the groundwork of this realm of information theory had already been laid by Claude Shannon, John Hamming, and other bright minds of Bell Research Laboratories.

### Information Theory

I have a few other ever-growing posts on Information Theory which house the supporting research for this post in particular, which go into more depth about what error correcting codes are and how they work, but some relevant bits have been included here, since that's kind of like the whole purpose.

#### Definitions

- Error Correcting Codes
- Theory?
- Rate
- Distance

### Naive Approaches

- Repetition Code
- Parity Check
- Transposition

### Better Approaches

- Hamming Codes
- Golay Code

### How to Actually Beam Them Up, Scotty?

### Performance of Error Correcting Codes


## Conclusion
Today Voyager 2 is 18.5B km away, and travelling almost over 840,000 miles per day.

## References
[^1]: Um, so yeah. I'm going to be using imperial measurements.  If only there were a convenient way to <a href="/blog/fibonacci-fun">quickly convert</a> between metric and imperial, say the 42nd and 43rd numbers of the Fibonacci sequence? Easily, we _remember_ that 433,494,437 precedes 701,408,733 in the sequence and thus, 440 million miles is roughly 700 million kilometers. 

- Your device has more computing power: https://www.nasa.gov/mission_pages/voyager/multimedia/vgrmemory.html
- Voyager timeline: https://voyager.jpl.nasa.gov/mission/timeline/#event-voyager-2-encounters-jupiter
- Voyager fast facts: https://voyager.jpl.nasa.gov/frequently-asked-questions/fast-facts/
- Voyager Gallery: https://voyager.jpl.nasa.gov/galleries/
- Nixon cuts funding: https://www.planetary.org/articles/20141003-how-richard-nixon-changed-nasa#:~:text=Nixon's%201971%20budget%20included%20a,the%20success%20of%20Apollo%2011.