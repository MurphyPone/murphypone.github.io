import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'

// places traveled

const hackathons = [
    {
        name: "HackTJ 2015, 2016, 2019, 2022",
        coords: { lat: 38.818479, lng: -77.168743 },
        icon: "/images/hackathon-icons/HackTJ.jpg",
        website: "https://hacktj.org/",
    },
    {
        name: "CodeDay DC 2016, 2017, CodeBreak 2018",
        coords: { lat: 38.910916, lng: -77.032496 },
        icon: "/images/hackathon-icons/CodeDayDC.jpg",
        website: "https://www.codeday.org/",
    },
    {
        name: "Hackital 2017",
        coords: { lat: 38.899547, lng: -77.048685 },
        icon: "/images/hackathon-icons/Hackital.jpg",
        website: "https://hackital.io/",
    },
    {
        name: "Big Parser Summer Hackathon 2017",
        coords: { lat: 38.960857, lng: -77.086600 },
        icon: "/images/hackathon-icons/BigParser.jpg",
        website: "https://www.bigparser.com/summer/"
    },
    {
        name: "HackBI 2018, 2019, 2020, 2021, 2022",
        coords: { lat: 38.808963, lng: -77.080795 },
        icon: "/images/hackathon-icons/HackBI.jpg",
        website: "https://hackbi.org/"
    },
    {
        name: "uOttaHack 2020",
        coords: { lat: 45.422353, lng: -75.683348 },
        icon: "/images/hackathon-icons/uOttaHack.png",
        website: "https://2020.uottahack.ca/"
    },
    {
        name: "*SBUHacks 2020",
        coords: { lat: 40.911467, lng: -73.123732 },
        icon: "/images/hackathon-icons/SBUHacks.png",
        website: "https://sbuhacks.org/"
    },
    {
        name: "*MakeSPP 2020",
        coords: { lat: 40.715432, lng: -74.039755 },
        icon: "/images/hackathon-icons/MakeSPP.png",
        website: "https://makespp.com/"
    },
    {
        name: "KleinHacks 2019",
        coords: { lat: 30.019341, lng: -95.524648 },
        icon: "/images/hackathon-icons/KleinHacks.png",
        website: "https://kleinhacks.com/"
    },
    {
        name: "Hoya Hacks 2019",
        coords: { lat: 38.909846, lng: -77.074318 },
        icon: "/images/hackathon-icons/HoyaHacks.png",
        website: "https://hoyahacks.georgetown.domains/"
    },
    {
        name: "HopHacks 2020",
        coords: { lat: 39.329768, lng: -76.620518 },
        icon: "/images/hackathon-icons/HopHacks.png",
        website: "https://hophacks.com/"
    },
    {
        name: "HooHacks 2019",
        coords: { lat: 38.033501, lng: -78.507967 },
        icon: "/images/hackathon-icons/HooHacks.jpg",
        website: "https://www.hoohacks.io/"
    },
    {
        name: "EarthHacks 2019, HealthHacks 2019",
        coords: { lat: 37.545632, lng: -77.455039 },
        icon: "/images/hackathon-icons/EarthHacks.png",
        website: "https://www.earthhacks.io/"
    },
    {
        name: "HackCU 2019",
        coords: { lat: 40.009453, lng: -105.242941 },
        icon: "/images/hackathon-icons/HackCU.png",
        website: "https://hackcu.org/"
    },
    {
        name: "HackUTD 2019",
        coords: { lat: 32.985919, lng: -96.751813 },
        icon: "/images/hackathon-icons/HackUTD.jpg",
        website: "https://www.hackutd.co/"
    },
    {
        name: "*HackKosice 2020",
        coords: { lat: 48.730308, lng: 21.245566 },
        icon: "/images/hackathon-icons/HackKosice.jpg",
        website: "https://hackkosice.com/"
    },
    {
        name: "ElleHacks 2020",
        coords: { lat: 43.772171, lng: -79.506732 },
        icon: "/images/hackathon-icons/ElleHacks.png",
        website: "https://ellehacks.com/"
    },
    {
        name: "*DemonHacks 2020",
        coords: { lat: 41.924624, lng: -87.656698 },
        icon: "/images/hackathon-icons/DemonHacks.jpg",
        website: "https://demonhacks.com/"
    },
    {
        name: "VTHacks 2019, 2020, 2021",
        coords: { lat: 37.232949, lng: -80.423037 },
        icon: "/images/hackathon-icons/VTHacks.png",
        website: "https://vthacks.com/"
    },
    {
        name: "*HackPSU 2020",
        coords: { lat: 40.797998, lng: -77.860136 },
        icon: "/images/hackathon-icons/HackPSU.jpg",
        website: "https://hackpsu.org"
    },
    {
        name: "*TAMUhack 2021", 
        coords: { lat: 30.616629, lng: -96.339483 },
        icon: "/images/hackathon-icons/TAMUhack.png",
        website: "https://tamuhack.com/"
    },
    {
        name: "*GunnHacks 7.0", 
        coords: { lat: 37.402345, lng: -122.133588 },
        icon: "/images/hackathon-icons/GunnHacks7.png",
        website: "https://www.gunnhacks.com/"
    },
    {
        name: "*PickHacks 2021", 
        coords: { lat: 37.953722, lng: -91.774834 },
        icon: "/images/hackathon-icons/PickHacks21.png",
        website: "https://pickhacks.io/"
    },
    {
        name: "*SharkHacks 3, *Backyard Hacks 2.0, *Data Day Grind 2.0", 
        coords: { lat: 40.746250, lng: -73.988077 },
        icon: "/images/hackathon-icons/mlh.png",
        website: "https://mlh.io/"
    },
    {
        name: "*Pitt Challenge 2021", 
        coords: { lat: 40.444279, lng: -79.960835 },
        icon: "/images/hackathon-icons/PittChallenge.png",
        website: "https://pittchallenge.com/"
    },
    {
        name: "*UniHacks 2022", 
        // 36.01891593323501, -78.91946794833676
        coords: { lat: 36.018915, lng: -78.919467 },
        icon: "/images/hackathon-icons/unihacks.png",
        website: "https://unihacks.ncssm.edu/"
    },
];

const MAPS_KEY = "AIzaSyDy6ZauygicYHQGfg43dm4kpvTCfyVqUj4";
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
                scaledSize: new window.google.maps.Size(32,32),
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