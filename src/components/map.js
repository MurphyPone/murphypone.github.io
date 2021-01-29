import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'

// places traveled

const hackathons = [
    {
        name: "HackTJ 2015, 2016, 2019",
        coords: { lat: 38.818479, lng: -77.168743 },
        icon: "https://pbs.twimg.com/profile_images/1223088247661891584/cxGkpgEs_400x400.jpg",
        website: "https://hacktj.org/",
    },
    {
        name: "CodeDay DC 2016",
        coords: { lat: 38.910916, lng: -77.032496 },
        icon: "https://f2.codeday.org/d5pti1xheuyu/3sj2Pkfslu94gSXGY6juRh/cbbac0294ee2fe02d4d6e16102e07f0d/codecup-notext-color.svg",
        website: "https://www.codeday.org/",
    },
    {
        name: "Hackital 2017",
        coords: { lat: 38.899547, lng: -77.048685 },
        icon: "https://pbs.twimg.com/profile_images/843331021928062980/DnYMuDWh_400x400.jpg",
        website: "https://hackital.io/",
    },
    {
        name: "Big Parser Summer Hackathon 2017",
        coords: { lat: 38.960857, lng: -77.086600 },
        icon: "https://pbs.twimg.com/profile_images/771527585985617920/LNNs2Rj8_400x400.jpg",
        website: "https://www.bigparser.com/summer/"
    },
    {
        name: "HackBI 2018, 2019, 2020, 2021",
        coords: { lat: 38.808963, lng: -77.080795 },
        icon: "https://pbs.twimg.com/profile_images/905214606683115520/OLLOcQRb_400x400.jpg",
        website: "https://hackbi.org/"
    },
    {
        name: "uOttaHack 2020",
        coords: { lat: 45.422353, lng: -75.683348 },
        icon: "https://2020.uottahack.ca/static/media/logo.2b4b5b80.png",
        website: "https://2020.uottahack.ca/"
    },
    {
        name: "*SBUHacks 2020",
        coords: { lat: 40.911467, lng: -73.123732 },
        icon: "https://pbs.twimg.com/profile_images/1309144499508187145/Vl-38KOs_400x400.jpg",
        website: "https://sbuhacks.org/"
    },
    {
        name: "*MakeSPP 2020",
        coords: { lat: 40.715432, lng: -74.039755 },
        icon: "https://pbs.twimg.com/profile_images/1212937562395987968/OC4iqN76_400x400.jpg",
        website: "https://makespp.com/"
    },
    {
        name: "KleinHacks 2019",
        coords: { lat: 30.019341, lng: -95.524648 },
        icon: "https://pbs.twimg.com/profile_images/1216501979091959808/YDruoDy__400x400.jpg",
        website: "https://kleinhacks.com/"
    },
    {
        name: "Hoya Hacks 2019",
        coords: { lat: 38.909846, lng: -77.074318 },
        icon: "https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-1/cp0/p50x50/50516733_2130091477052750_8265979429499437056_n.png?_nc_cat=108&ccb=2&_nc_sid=dbb9e7&_nc_ohc=kQwE66hxrNIAX-6gv-Y&_nc_ht=scontent-iad3-1.xx&oh=2a83cac1f4a915a62bd3b12b0749ea60&oe=5FBB993E",
        website: "https://hoyahacks.georgetown.domains/"
    },
    {
        name: "HopHacks 2020",
        coords: { lat: 39.329768, lng: -76.620518 },
        icon: "https://hophacks.com/images/f19/hoplogo.png",
        website: "https://hophacks.com/"
    },
    {
        name: "HooHacks 2019",
        coords: { lat: 38.033501, lng: -78.507967 },
        icon: "https://pbs.twimg.com/profile_images/1088591718885273600/KwurrX1K_400x400.jpg",
        website: "https://www.hoohacks.io/"
    },
    {
        name: "EarthHacks 2019, HealthHacks 2019",
        coords: { lat: 37.545632, lng: -77.455039 },
        icon: "https://pbs.twimg.com/profile_images/1117542630198599682/JIM8yHwz_400x400.jpg",
        website: "https://www.earthhacks.io/"
    },
    {
        name: "HackCU 2019",
        coords: { lat: 40.009453, lng: -105.242941 },
        icon: "https://pbs.twimg.com/profile_images/1203528692795723778/a5Ztlyvh_400x400.jpg",
        website: "https://hackcu.org/"
    },
    {
        name: "HackUTD 2019",
        coords: { lat: 32.985919, lng: -96.751813 },
        icon: "https://pbs.twimg.com/profile_images/1326689061176811524/QmntFALg_400x400.jpg",
        website: "https://www.hackutd.co/"
    },
    {
        name: "*HackKosice 2020",
        coords: { lat: 48.730308, lng: 21.245566 },
        icon: "https://pbs.twimg.com/profile_images/1063501382446125057/AH79Idpk_400x400.jpg",
        website: "https://hackkosice.com/"
    },
    {
        name: "ElleHacks 2020",
        coords: { lat: 43.772171, lng: -79.506732 },
        icon: "https://pbs.twimg.com/profile_images/1199103149908332544/aghb1Vhe_400x400.jpg",
        website: "https://ellehacks.com/"
    },
    {
        name: "*DemonHacks 2020",
        coords: { lat: 41.924624, lng: -87.656698 },
        icon: "https://pbs.twimg.com/profile_images/1303408719191998471/_4AbXhWr_400x400.jpg",
        website: "https://demonhacks.com/"
    },
    {
        name: "VTHacks 2019, 2020",
        coords: { lat: 37.232949, lng: -80.423037 },
        icon: "https://pbs.twimg.com/profile_images/1317273341900869635/NeUriJIJ_400x400.jpg",
        website: "https://vthacks.com/"
    },
    {
        name: "*HackPSU 2020",
        coords: { lat: 40.797998, lng: -77.860136 },
        icon: "https://pbs.twimg.com/profile_images/1314315545832034307/s84a5IHn_400x400.jpg",
        website: "https://hackpsu.org"
    },
    {
        name: "*TAMUhack 2021", 
        coords: { lat: 30.616629, lng: -96.339483 },
        icon: "https://pbs.twimg.com/profile_images/1151692346209128448/27tlbWO5_400x400.png",
        website: "https://tamuhack.com/"
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