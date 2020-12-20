---
title: "Visualizing the Josephus Problem"
date: "2020-12-17"
description: "p5.js"
path: "/blog/josephus-problem"
---

# What / Why?

The [Josephus Problem](https://en.wikipedia.org/wiki/Josephus_problem) is a famous mathematical puzzle attributed to a Jewish historian from the 1st century who escaped execution at the hands of Roman soldiers / / mutual suicide from his fellow men after they were captured by determining where he ought to stand in a circle to be the last man alive.

> 7. However, in this extreme distress, he was not destitute of his usual sagacity; but trusting himself to the providence of God, he put his life into hazard [in the manner following]: "And now," said he, "since it is resolved among you that you will die, come on, let us commit our mutual deaths to determination by lot. He whom the lot falls to first, let him be killed by him that hath the second lot, and thus fortune shall make its progress through us all; nor shall any of us perish by his own right hand, for it would be unfair if, when the rest are gone, somebody should repent and save himself." This proposal appeared to them to be very just; and when he had prevailed with them to determine this matter by lots, he drew one of the lots for himself also. He who had the first lot laid his neck bare to him that had the next, as supposing that the general would die among them immediately; for they thought death, if Josephus might but die with them, was sweeter than life; yet was he with another left to the last, whether we must say it happened so by chance, or whether by the providence of God. And as he was very desirous neither to be condemned by the lot, nor, if he had been left to the last, to imbrue his right hand in the blood of his countrymen, he persuaded him to trust his fidelity to him, and to live as well as himself.<sup>[[1]](http://www.gutenberg.org/files/2850/2850-h/2850-h.htm#link32HCH0008)</sup>

> 8. Thus Josephus escaped in the war with the Romans...

Colloquially, the problem is as follows: 

> People are standing in a circle waiting to be executed. Counting begins at a specified point in the circle and proceeds around the circle in a specified direction. After a specified number of people are skipped, the next person is executed. The procedure is repeated with the remaining people, starting with the next person, going in the same direction and skipping the same number of people, until only one person remains, and is freed.

> The problem — given the number of people, starting point, direction, and number to be skipped — is to choose the position in the initial circle to avoid execution.

Additionally, [Numberphile has a great video](https://www.youtube.com/watch?v=uCsD3ZGzMgE&t=0s&list=PLBn-BDqKNRN7UYUjpG4Mocz1HOl2BMhf0&index=2) explaining the solution to the problem.


The solution to the problem is given as follows:

$$
\begin{aligned}
    f(n) &= 2l + 1 \\ 
    &= s^m + l, \quad 0 ≤ l ≤ 2^m \\
    \text{where } n &= \text{the number of people} 
    
\end{aligned}
$$

meaning that the "safe" position $l$ is two times the remainder of the largest power of 2 that goes into $n$ plus one.

# Setup

We can use [p5.js](https://p5js.org/get-started/#settingUp) to visualize the iterative process of elimination, and you can easily include it from any of the download/CDN options listed on their website as follows:

```html
<!-- in our index.html -->
<script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
<script type="text/javascript" src="Node.js"></script>
<script type="text/javascript" src="DoublyLinkedCircularList.js"></script>
<script type="text/javascript" src="main.js"></script>
```

# Code!

We'll visualize the "circle" of soldiers using a Doubly Linked Circular List class which we'll can define in a file called `Node.js` as follows:

```javascript
class Node {
  constructor(val, next, prev) {
    this.value = val;
    this.next = next;
    this.prev = prev;
    this.isAlive = true;
  }

  getNext() { return this.next; }
  getPrev() { return this.prev; }
  getValue() { return this.value; }

  setNext(node) { this.next = node; }
  setPrev(node) { this.prev = node; }
  setValue(value) { this.value = node; }
}
```

We can add the circular functionality (as well as the other necessary logic) to another file we can call `DoublyLinkedCircularList.js` 

```javascript
class DoublyLinkedCircularList {
  //n is the # of nodes to add
  constructor(n) {
    this.n = n;
    this.head = new Node(1, null, null);
    this.head.setNext(this.head);
    this.head.setPrev(this.head);
    this.current = this.head;

    var i = 2;
    while(i <= n) {
      this.add( new Node(i++, this.head, this.head.getPrev() ) ); 
    }
  }
  
  add(node) {
    this.head.getPrev().setNext(node);
    this.head.setPrev(node);
  }

  removeNext(node) {
    var removeMe = node.getNext();
    removeMe.getNext().setPrev(node);
    removeMe.isAlive = false;
    node.setNext( removeMe.getNext() );
  }
}
```

Let's add some logic to this class to perform the "killing" mechanism by which each soldier kills the person to next to him in a clockwise fashion.

```javascript
josephus() {
    // if everyone is dead
    if( this.current.getValue() == toKill.getValue() ) { 
      console.log("no people left to kill, Josephus lives!");
      noLoop();
      return;
    } else { // else, find the next living node/soldier
      while(!toKill.isAlive) {
        toKill = toKill.getNext(); //find the adjacent & alive node
      }
      toKill.isAlive = false; // killem
      this.current = toKill.getNext(); // move marker to next person
      var stop = 0; // this is ugly !
      while(!this.current.isAlive) { 
        if(stop++ > this.n-2) { / /manual stoppage
          noLoop();
          return;
        }
        this.current = this.current.getNext();
        console.log("searching for next alive: " + this.current.getValue())
      }

      console.log("killed: " + toKill.getValue());
    }
}
```

Next, we can formalize the formula from above:

```javascript
formula() {
    let a = -1;
    while(Math.pow(2, a+1) < this.n) { a++; } // find the largest power that goes into n
    var l = this.n - ( Math.pow(2, a) ); // find the remainder
    return (2*l + 1); // return the formula
}
```

And we'll also add some neat animation to display our list of soldiers in a circle, color coded by mortality and safeness:

```javascript
show() {
    translate(width/2, height/2); // draw from center
    let node = this.head;
    let i = 0;
    while(i < this.n) { 
      //place dots
      let angle = (i++ * TWO_PI / this.n) - PI/2;
      let x = 5 * this.n * cos(angle);
      let y = 5 * this.n * sin(angle);

      // config
      color(255);
      fill(255);
      stroke(255);

      // if safe 
      if (i == this.formula() ) { 
        color(0, 255, 0);
        fill(0, 255, 0);
        stroke(0, 255, 0);
      }
      
      // if dead
      if(!node.isAlive) { 
        color(100);
        fill(100);
        stroke(100);
      }
      // display current
      if(node.getValue() == this.current.getValue()) { 
        color(255, 199, 0);
        fill(255, 199, 0);
        stroke(255, 199, 0);
      }

      text(i, x, y);
      node = node.getNext();
    }
  }
```

Putting it all together in a `main.js` file using the p5 parlens:

```javascript
let crowd;

function setup() {
  createCanvas(windowWidth, windowHeight);
  n = 60;  // play with this value for varied results
  crowd = new DoublyLinkedCircularList(n);
  console.log( crowd.formula() );
  frameRate(3);
}

function draw() {
  background(51);
  crowd.josephus();
  crowd.show();
}
```

## Conclusion

You can find the full source code [here](https://github.com/MurphyPone/JosephusProblem) a live demo [here](https://www.murphyandhislaw.com/JosephusProblem/)!
