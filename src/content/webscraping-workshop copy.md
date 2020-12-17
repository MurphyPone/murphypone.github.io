---
title: "Webscraping Workshop"
date: "2020-11-19"
description: "Python, BeautifulSoup, Pandas"
path: "/blog/webscraping-workshop"
---


# What / Why?
This post is intended to be a supplement for my hackathon workshop about how to do Webscraping in Python. The slides can be found [here]() and the full source code can be found [here]().  

The premise of this project is that we're going to scrape iMDb for movie reviews and review usefulness scores for the top 250 or so movies on their list.  With this information we can then perform some naive sentiment analysis to gain some insight into other metricsabout movies (other than the average star rating) which might be indicative of the quality of a movie.

# Setup
For this project we're going to use [Python 3.8+](https://www.python.org/downloads/) as well as two libraries: pandas (to neatly store our scraped data) and BeautifulSoup (to handle the webscraping itself). They can be installed via pip with the following commmand:

`pip install beautifulsoup4 pandas`

Additionally, I like to do this kind of explorative data science project within a [jupyter notebook](https://jupyter.org/install).

# Code!

The first step (or cell, if working in a jupyter notebook) will be the import statements of all the libraries we're going to use:

```python
import bs4              # to scrape our data
import pandas as pd     # to store our scraped data
import requests         # to fetch the contents of our target website
import numpy as np      # to handle Not a Number values
import csv              # to save our pandas DataFrame to a file
```

Notice that when working within a notebook, the values in a cell are cached/saved, so we only have to run this cell once at the beginning of our development session.  We can modify, rearrange, or delete any cells after this first one, and we'll still be able to reference all those imported libraries!

## Process

The webscraping process follows the general approach along these lines:
1. identify your target data source,
2. examine the page layout and patterns
3. write and test your code!


### Idenitfying the Target Data Source
we want to query the iMDb [top 1,000 list]("https://www.imdb.com/search/title/?groups=top_1000&view=simple&sort=user_rating,desc&count=250&start=0") for movie reviews, star ratings, and usefulness scores.

### Examining Page Layout and Patterns

There's two pages that we're primarily concerned with. The first is the top 1,000 page itself, and the second is the generic page for each individual movie.

Notice we can display up to 250 movies per page and that other useful arguments gets stored in the above hyperlinked URL.

```
https://www.imdb.com/search/title/  <-- the base url
?groups=top_1000                    <-- which list we want to view
&view=simple                        <-- compact or full view of each movie listing
&sort=user_rating,desc              <-- how we want to sort the list 
&count=250                          <-- show 250 (max) movies per page
&start=0                            <-- start at the 0th (first) movie in the list
```

We could easily change the url arguments to view the next 250 movies by changing the url like so: 

```
https://www.imdb.com/search/title/
?groups=top_1000
&view=simple
&sort=user_rating,desc
&count=250
&start=251                          <-- start at the 251st movie in the list
```

but for the sake of this workshop, we should have more than enough data from just the top 250 movies.

Opening you browser's developer console, we can inspect the elements on the page to figure out _what_ type of element each of our desired components is, as well as their possible names, IDs, or any othe unique information that might help us isolate the info we want.

For our first page of interest, we can see that the links to each specific movie page is stored within a `<span>` element with class `lister-item-header`.

We can use the `<a>` tag nested within this span to get each specific movie's page, from which we can also extract the reviews!

![](/images/webscraping-1.png)

Now take a look at the #1 rated movie, [The Shawshank Redemption](https://www.imdb.com/title/tt0111161/?ref_=adv_li_tt), we can navigate to the user reviews page by clicking the link at the bottom, and once again inspect the structure of the URL to find that its (and all other individual generic movie pages) URL takes the following structure:

`https://www.imdb.com/title/<MOVIE_ID>/reviews?ref_=tt_ov_rt`

If we navigate to that user reviews page, and once again inspect the composition of the page via the developer console, we can see that each movie's review page follows the structure: 
- each user review is contained within a `div` element with the class `imdb-user-review`
- reviews _may_ have a star rating, 
- a date posted, 
- the username of the author, 
- the text of the review itself, 
- and a usefulness score based on how helpful other users found the review. 

Each of these datapoints are stored in various `<span>`, `<div>`, and `<a>` tags within the parent div with specific class names that we can use to easily identify which peices of information we want to fetch on a page.

![](/images/webscraping-2.png)

### Writing and Testing Code

Now that we have a good handle on the layout and patterns of the page, we can start to write some code to systematically extract the above data points on the review page for each of the 250 movies listed on our main page.

First, in a new cell, let's define an empty pandas DataFrame with column headings for each datapoint we want to collect for a movie review:

```python
df = pd.DataFrame(columns=["name", "stars", "date", "author", "review_text", "url", "usefulness"])

```

Next let's define a function which takes in the url for a movie review page, and the DataFrame to append the relevant datapoints to:

```python
def get_movie_info(the_url, frame):
    response = request.get(the_url) # make a request to the url
    if response.status_code != 200: # anything other than to success code 200 should halt the program
        print(f"GET failed with response code: {response.status_code}")
        raise
    
    # create a BS4 element tree that we can traverse based on the response test according to the html5 library
    m_soup = bs4.NeautifuSoup(response.text, 'html5lib')
    
    # exract the name of the movie by identifying it by the h3 tag with an itemprop attribute that has the value 'name' by getting the text contents of the element
    name = m_soup.find('h3', {'itemprop': 'name'}).contents[1].text

    # find all the divs containing reviews 
    reviews = m_soup.find_all('div', {'class': 'imdb-user-review' })

    # iterate over all the review divs
    for rev in reviews:

        # 1. attempt to extract a star rating if one is provided in the review
        try:
            # find the span containing the score out of 10 that the user gave the movie and extract the text value of that element
            stars = int(rev.find('span', {'class': 'rating-other-user-rating'}).contents[3].get_text())
        except: # not all reviews have stars, so if the span does not exist, we'll just enter a NaN value
            stars = np.NaN
        
        # 2. Store the date that the review was posted
        date = rev.find('span', {'class': 'review-date'}).text.encode('ascii','ignore').decode()
        
        # 3. Store the username of the author of the review 
        # note that we encode and decode the following text fields to ensure that they're in a tractable format 
        author = rev.find('span', {'class': 'display-name-link'}).contents[0].text.encod ('ascii','ignore').decode()

        # 3. Store the text of the review itself
        review_text = rev.find('div', {'class': 'content'}).contents[1].text.encode('ascii','ignore').decode()
        
        # 4. Store the url of the review itself
        url = f"imdb.com{rev.find('a', {'class': 'title'}).attrs['href']}"
        
        # 4. Store usefulness rating 
        usefulness = rev.find('div', {'class': 'actions'}).text.split('.')[0].strip()
        usefulness = usefulness.split(' ')
        usefulness = f"{usefulness[0]}/{usefulness[3]}".encode('ascii','ignore').decode()

        # append the above variables to the DataFrame we passed into the function
        frame = frame.append({'name': name, 'stars': stars, 'date': date, 'author': author, 'review_text': review_text, 'url': url, 'usefulness':usefulness}, ignore_index=True)
    
    # repeat that process for the first 25 reviews for the movie (if that many exist)
    return frame
```

Hopefully you can match all the `.find()` function calls and their arguments to the anotomy of the main `imdb-user-review` on the review page. 

Note that there is unfortunately no way to adjust the URL for a review page to show _more_ than 25 reviews by default.  In order to reveal more, if available, we'd need to click the "Load More" button near the bottom of the page which is a bit outside the scope of both this workshop and BeautifulSoup.  (Checkout [Selenium](imdb-user-review) for a more powerful automated tool).

Regardless, we should now be able to pass in the url of each movie from the main top 1,000 list to the above helper function and get at most 25 rows of reviews for each movie.

In another cell, we can write the code to get the links to the top 250 movies:

```python
URL_MOVIES_100 = "https://www.imdb.com/search/title/?groups=top_1000&view=simple&sort=user_rating,desc&count=250&start=0"

# instantiate a new BS4 element tree from the top 1,000 list
response = requests.get(URL_MOVIES_100)
if response.status_code != 200:
    print(f"GET failed with response code: {response.status_code}")
    raise
        
soup = bs4.BeautifulSoup(response.text, 'html5lib')

# fetch the URLS for all the movies and store them in a list
movie_links = [m.find('a').attrs['href'] for m in soup.find_all('span', {'class': 'lister-item-header'})]

# For each movie, grab as many reviews as possibles
for link in movie_links:
    print(".", end='') # rough loading bar to show progress 
    # modify the review url to sort the reviews by the total number of votes for usefulness
    m_url = f"https://www.imdb.com{link}reviews?sort=totalVotes&dir=desc&ratingFilter=0"
    df = get_movie_info(m_url, df) # for each movie, get the top 25 most voted on reviews
    time.sleep(1) # set a timeout so that we don't overwhelm iMBDb 

df # display our resultant DataFrame
```

This will take some time as we're iterating over 250 movies, and for each movie we're trying to iterate over 25 reviews, and for each review, we're extracting 7 columns worth of information.

Lastly, we'll want to save this DataFrame to a csv file so that we can skip this step in the future:

```python 
# save the dataframe to a csv file
df_csv = df.to_csv()
with open('Top_250_iMDb.csv', 'w') as f:
    f.write(df_csv)
```