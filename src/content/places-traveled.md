---
title: "26 | 'Places Traveled' React Component"
date: "2020-10-26"
description: "Google Maps API, react"
path: "/blog/places-traveled"
---


# What / Why?

I was recently reminded of a map in my Uncle's office which was peppered with small colored pins and string to indicate all the places he had traveled, either for work or leisure.  Kind of like Charlie's Pepe Silvia Board, but more wholesome!  Nostalgic of the days when traveling was a luxury of envy rather than a mark of negligence, I was inspired to create my own map of places traveled!  An example of the product of this post can be found on my [about page](/about).  

![](https://i.imgur.com/0ZnWnAS.gif?noredirect)


# Setup

To recreate the React component depicted, we'll use the Google Maps API to embed a Static JavaScript map which we can decorate with Markers to indicate places we've traveled. 

I'm going to _assume_ that you have a react project already in place that you're looking to drop this component into, but in case you don't the [React Docs](https://reactjs.org/docs/create-a-new-react-app.html) have some good examples about how to get started with `create-react-app` if you just want a sandbox to experiment with.

In order for the component to play nicely with the rest of the React JSX on the site I used it in, I installed the `google-maps-react` node package via which is a wrapper for the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/markers).

```bash 
$ npm install google-maps-react
```

You'll also need to claim an [API key](https://developers.google.com/maps/documentation/javascript/get-api-key) which is conveniently available under the free tier of the Google Cloud suite.

# Code!

If you're starting with the default `create-react-app` folder structure, you'll likely only have an `App.js`; if you're working in a more-developed project, you may have a directory dedicated to components.  Regardless, you can create a new file, separate from `App.js` (or the analogous "main" file for your website), and call it `map.js`.  For starters, we're going to want some boilerplate code to render our map embed which can be found in the docs:

```JavaScript
import React, { Component } from 'react';

import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
const MAPS_KEY = "YOUR_GOOGLE_MAPS_API_KEY_GOES_HERE";

// an object we can pass to the map to define custom styling
const mapStyles = {
  padding: '0 1.0875rem 1rem',
  border: '0',
  height: '100vh', 
};       

// an object we can pass to the container for the map to define custom styling
const containerStyle = {
  position: 'relative',  
  width: '100%',
  height: '100%',
  paddingBottom: '100vh', // makes sure nothing gets rendered behind the map, might need to tweak this number depending on your desired height
};  

// the definition of our component
export class MapContainer extends Component {
  render() {
    return (
        // the MapContainer component returns a Map component with some initial values being set
      <Map
        google={this.props.google}
        containerStyle={containerStyle}
        zoom={4}                                                // this is zoomed out enough to see all of the United States
        style={mapStyles}
        initialCenter={{ lat: 39.365741, lng: -93.957218 }}>    // coordinates for roughly the center of the country
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: MAPS_KEY
  
})(MapContainer);
```

The above code should give us a blank map that we can interact with using the same, native controls as any other Google Map. 

Next, we want to define a list of `Markers` to indicate places we've traveled (or in my specific example, hackathons I've traveled to).  We can drop this code right underneath our declaration of our `MAPS_KEY`:

```JavaScript 
const hackathons = [
  {
    name: "HackBI 2018, 2019, 2020",
    coords: { lat: 38.808963, lng: -77.080795 },
    icon: "https://pbs.twimg.com/profile_images/905214606683115520/OLLOcQRb_400x400.jpg",
    website: "https://hackbi.org/"
  },
  {
    name: "uOttaHack 2020",
    coords: { lat: 45.422353, lng: -75.683348 },
    icon: "https://2020.uottahack.ca/static/media/logo.2b4b5b80.png",
    website: "https://2020.uottahack.ca/"
  }
]
```

The specific coordinates of any location can by found by right clicking within Google Maps and selecting the "What's Here?" option. 

You can add as many places as you like.  Each "place" is really a JavaScript object containing fields for the `name`, `coordinates` of the location, a custom `icon` to render the location on the map, and a `website` associated with the location/event.  You can add more information as well if you'd like!

The next step is to iterate over each "place" object in our list, and create an HTML element that contains the information associated with each place.  We can do this right before the `return` statement of our class declaration:

```JavaScript
export class MapContainer extends Component {
  render() {
    const markers = [];     // create a list of markers
    for (var i = 0; i < hackathons.length; i++) { // iterate over the list of hackathons/places 
        var curr = hackathons[i];
        /*  add a new <Marker> element to the end of the list and assign all 
            the information we defined in our object to the Marker
        */
        markers.push(<Marker        
            onClick={this.onMarkerClick}
            name={curr.name}  
            position={curr.coords}
            icon={{
                url: curr.icon,
                size: new window.google.maps.Size(32, 32),
                scaledSize: new window.google.maps.Size(24,24),
            }}
            website={curr.website} 
            key={i}
            />
        );
    }

    return (
      <Map
        google={this.props.google}
        containerStyle={containerStyle}
        google={this.props.google}
        zoom={4}
        style={mapStyles}
        initialCenter={{ lat: 39.365741, lng: -93.957218 }}>

          {markers} // This will render all of the Marker elements created above

      </Map>

    );
  }
}
      
```

Sweet!  Now, let's add an information window to the map so that when we click on a marker, we can see some of the meta-information associated with it like the name of the place, the website, and any other fields you decide to add you your "place" objects.  In order to dynamically render the `<InformationWindow>` object, we first need to instantiate some notion of state for this component to keep track of which `<Markers>` have been clicked.

Before we enter the `render()` call, let's define a state variable, and add some event handlers to the markers:

```JavaScript
state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
      };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        }
    );

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  render() {

    /* const markers = []; .... */

  return (
    <Map
      google={this.props.google}
      containerStyle={containerStyle}
      google={this.props.google}
      zoom={4}
      style={mapStyles}
      initialCenter={{ lat: 39.365741, lng: -93.957218 }}>
        
        {markers} 
        <InfoWindow // sets the fields of the state variable according to the active marker that has been clicked
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          // display the meta data for the "place"
            <div>
              <a href={this.state.selectedPlace.website} target="_blank">
                  <strong>{this.state.selectedPlace.name}</strong>
              </a>
          </div>
        </InfoWindow>
    </Map>
  );
}
```

Now, when we click on one of our markers, we should get a neat little information window with the information we associated with that place!

All together, map.js should resemble:

```JavaScript
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'

// places traveled

const hackathons = [
  {
    name: "HackBI 2018, 2019, 2020",
    coords: { lat: 38.808963, lng: -77.080795 },
    icon: "https://pbs.twimg.com/profile_images/905214606683115520/OLLOcQRb_400x400.jpg",
    website: "https://hackbi.org/"
  },
  {
    name: "uOttaHack 2020",
    coords: { lat: 45.422353, lng: -75.683348 },
    icon: "https://2020.uottahack.ca/static/media/logo.2b4b5b80.png",
    website: "https://2020.uottahack.ca/"
  }
]

const MAPS_KEY = "YOUR_GOOGLE_MAPS_API_KEY_GOES_HERE";
const mapStyles = {
    padding: '0 1.0875rem 1rem',
    border: '0',
    height: '100vh',
};

const containerStyle = {
    position: 'relative',  
    width: '100%',
    height: '100%',
    paddingBottom: '100vh',
  }

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
      };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        }
    );

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    // render all the hackathons attended
    const markers = [];
    for (var i = 0; i < hackathons.length; i++){
        var curr = hackathons[i];
        markers.push(<Marker
            onClick={this.onMarkerClick}
            name={curr.name}
            position={curr.coords}
            icon={{
                url: curr.icon,
                size: new window.google.maps.Size(32, 32),
                scaledSize: new window.google.maps.Size(24,24),
            }}
            website={curr.website} 
            key={i}
            />
        );
    }

    return (
      <Map
        google={this.props.google}
        containerStyle={containerStyle}
        google={this.props.google}
        zoom={4}
        style={mapStyles}
        initialCenter={{ lat: 39.365741, lng: -93.957218 }}>
          {markers}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
             <div>
                <a href={this.state.selectedPlace.website} target="_blank">
                    <strong>{this.state.selectedPlace.name}</strong>
                </a>
            </div>
         </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: MAPS_KEY
  
})(MapContainer);
```

You should be able to drop this component into any other js file you have e.g. my [about page](/about) file looks something like this:

```JavaScript
import React from "react"
import GoogleApiWrapper from "../components/map"

const IndexPage = () => (
  <div>
    <h1>About me</h1>
    <h3>Hackathons I've organized, Coached, attended, and mentored</h3>
    <GoogleApiWrapper/>                                                         
  <div>
)

export default IndexPage
```

# Additional Resources

The majority of this code is straight out of the documentation with some tidbits snagged from other tutorials:

- [Google Maps API: Markers](https://developers.google.com/maps/documentation/javascript/markers)
- [Digital Ocean: "How to Integrate the Google Maps API into React Applications"](https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications)