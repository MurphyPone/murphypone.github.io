---
title: "Fibonacci Numbers as Conversion Heuristics"
date: "2019-10-11"
description: "Python, Visdom"
path: "/blog/fibonacci-fun"
---

# What / Why?
In this article we're going to take a look at a fascinating relationship between Fibonacci numbers and unit conversion while also learning some Python tools along the way.

# Setup
For this project we're going to use [Python 3.7](https://www.python.org/downloads/) as well as a powerful graphing library developed by Facebook called [visdom](https://github.com/facebookresearch/visdom).

The general workflow for this setup is to initialize a terminal window in your working directory and execute the command `visdom`.  On success, you should see something like :

```
$ visdom
Checking for scripts.
It's Alive!
INFO:root:Application Started
You can navigate to http://localhost:8097
```

We can leave this running in the background and occasionally check in on it if we're getting Visdom related errors.  Open another tab in your shell,  navigate back to the working directory of the project, and open your preferred editor!   

# Code!
Let's identify our goal: we want to generate fibonacci numbers and graph how sequential numbers in the sequence compare to mile --> kilometer conversions.  To do this, we first need to generate fibonacci numbers as well as create some methods to allow us to convert between our two units:

```Python
# Imports
    # none, for now

# Constants
km_per_mi = 1.60934
mi_per_km = 0.621371

# Fibonacci number generator
def fib(n):
    if n <= 0:
        print("Invalid input")
    elif n == 1:
        return 0
    elif n == 2:
        return 1
    else:
        return fib(n-1) + fib(n-2)

# Convert km to mi
def km_to_mi(km):
    return km * mi_per_km

# Convert mi to km
def mi_to_km(mi):
    return mi * km_per_mi

print(fib(6))
```

We can test our method by calling `print(fib(6))` at the bottom of our main.py which should output `5` which is correct according to our definition.

Now, in order to examine the relationship between Fibonacci numbers and miles-kilometers, let's set up a temporary example:

```Python
mi = fib(6)
km = mi_to_km(fib(6))
print(mi, km)
```
Executing our program now we should see `5 8.0467`, and validating our results with a quick Google, we can see that Fibonacci may have been on one.

![img1](https://i.imgur.com/LQ3njx8.png)

(This is because the a decimal approximation of the Golden Ratio is _very_ close to our `km_per_mi` constant: 1.60934)

So now let's write a method to calculate the error between the _actual_ conversion using the constant provided by Google and the Fibonacci sequence.

```Python
# calculate the %error between the  fib #
# and the actual conversion number using fib(n), fib(n+1)
def loss(n):
    mi = fib(n)
    fib_km = fib(n+1)
    actual_km = mi_to_km(mi)

    return abs((actual_km - fib_km) / actual_km) * 100
```
Let's test this: `print(loss(6)) --> 0.5803621360309136`

By hand: fib(6) = 5, fib(7) = 8, actual_km = 8.0467

$\vert \frac {8.0467-8}{8.0467} \vert \times 100 = 0.58\% $ off the mark.  Pretty good!

So now let's take a step back and figure out how we're going to visualize this.

Let's make a new file called `visualize.py` and explore what Visdom has to offer us.

Off the bat, we're going to need some imports and a simple method to build lines for us that we can send the Visdom local server that's been running in the background:

```Python
import sys
from visdom import Visdom

viz = Visdom()
d = {}  # holds all our graphs

def get_line(x, y, name, color='#000', isFilled=False, fillcolor='transparent', width=2, showlegend=False):
    if isFilled:
        fill = 'tonexty'
    else:
        fill = 'none'

    return dict(
        x=x,
        y=y,
        mode='lines',
        type='custom',
        line=dict(
            color=color,
            width=width),
        fill=fill,
        fillcolor=fillcolor,
        name=name,
        showlegend=showlegend
    )
```

This might look a bit intimidating at first, but if we break down this method, we can see that it simply builds a dictionary from all the arguments in the format that Visdom is expecting.  This will be useful when we write our method to display the % error of our heuristic loss function.

We want to plot the error of the the conversion heuristic the further the fibonacci sequence progresses.  With that in mind, let's dive in:

```python
def plot_error(index, error, name, xaxis, color='#000'):
    win = name
    title = name

    if name not in d:
        d[name] = []
    d[name].append((index, error))

    x, y = zip(*d[name])
    data = [get_line(x, y, name, color=color)]

    layout = dict(
        title=title,
        xaxis={'title': xaxis},
        yaxis={'title': title}
    )

    viz._send({'data': data, 'layout': layout, 'win': win})
```

This method simply accepts a few more arguments, fetches a line based on our input arguments, and once again packages them up into the dictionary format Visdom is expecting.  The final line actually _sends_ this dictionary to our local visdom server where it will be plotted.  

Let's jump pack into our main.py file to make this happen.

We need to link the visualize.py file, and add the time module while we're at it which will be useful in a moment.

```Python
import time
from visualize import *
```

Now, down at the bottom of our file, let's add a while loop that will continuously generate new Fibonacci numbers and graph the error as a function of the Fibonacci index.

```Python
i = 1
while(i < 1000):
  e = loss(i)
  plot_error(i, e, 'Error', 'fibonacci index')
  time.sleep(0.2)
  i += 1
```

Now, when we execute our program and visit the local Visdom page: `http://localhost:8097/` we should see a graph our graph develop in real time!.

![gif1](https://i.imgur.com/YHtrnSc.gif)

Cool.  But as you'll be able to tell, our recursive fib function isn't going to be able to keep up.  Let's save our self the compute power and modify our code to read a list of pre-generated Fibonacci numbers and use that instead:

```python
def load_fib():
    list = [0]
    with open('fib.csv') as fp:   
        line = fp.readline()
        cnt = 1
        while line and cnt < 1000:  # only grab the first 1000 digits from the file digits past that start to get to large to express
            line = fp.readline().strip()
            list.append(float(line))
            cnt += 1

    return list
```

This will read a file of Fibonacci numbers and add them to a list that we can iterate over much more quickly than recursively generating them would have taken.

I generated my own list, but several are available online.  The method above assumes the file is of the format (\n delimited):

```
0
1
1
2
3
5
8
13
21
34
55
89
144
233
377
610
987
1597
...
etc.
```

Now we need to modify our while loop and loss function to reference this list instead of our original fib(n) method:

```Python
def loss(n, list):
    mi = list[n]
    fib_km = list[n+1]
    actual_km = mi_to_km(mi)

    return abs((actual_km - fib_km) / actual_km) * 100

fib = load_fib()

i = 1
while(i < len(fib)):
    e = loss(i, fib)
    plot_error(i, e, 'Error', 'fibonacci index')
    time.sleep(0.2)
    i += 1
```  

There you have it!  The graph itself is a bit lackluster as the the Fibonacci sequence converges on the conversion factor after 8 terms or so, but that just goes to show how useful the heuristic is!

For the full source code to this project, checkout [this repo](https://github.com/MurphyPone/fibo-converter).
