import './App.module.css';
import {useState} from 'react'
import NATIONAL_PARK_DATA from './data.json'
import  styles from './App.module.css';
import * as Locations from './location';
import {Map} from "react-map-gl";
import DeckGL from '@deck.gl/react/typed';
import {GeoJsonLayer  } from '@deck.gl/layers';


const MAPBOX_ACESS_TOKEN:string = "pk.eyJ1Ijoicm9oYW4tdmVybWEiLCJhIjoiY2xza3FpZ3FhMDc2MDJpbjI2ZDV1Ynk4OSJ9.alzoy33ZI_fLrAQPidkCgQ";
  const MAP_STYLE:string = 'mapbox://styles/rohan-verma/clspsc3ex02dm01qy867idxy5'; 
  const INITIAL_VIEW_STATE:parameters = {  
      latitude: 39.8283,  
      longitude: -98.5795,
      zoom: 3.5,
      bearing: 0, 
      pitch: 30
    };
    interface parameters {
      latitude: number,  
      longitude: number,
      zoom: number,
      bearing: number, 
      pitch: number
    }
    
function App() {
  const [viewState, setViewState] = useState<parameters>(INITIAL_VIEW_STATE);
  const handleChangeViewState = ({ viewState}) => setViewState(viewState);
  // Transiting from one location to another
  const handleFlyto = (destination:any) =>{
  setViewState({...viewState , ...destination , transitionDuration:2000, })
  };

const onClick = (info:any) =>{
  if(info.object){
    alert(info.object.properties.Name )
  }
} 
 const onHover = ({ object, x, y }: { object: any; x: number; y: number }) => {
    const el = document.getElementById('tooltip');
    if (object) {
      const { properties } = object;
      if (el) {
        el.innerHTML = `<h1>${properties.Name}</h1>`;
        el.style.display = 'block';
        el.style.opacity = '0.8';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }
    } else {
      if (el) {
        el.style.opacity = '0.0';
      }
    }
  };


  const layers = [
    new GeoJsonLayer({
      id : "nationalparks",
      data:NATIONAL_PARK_DATA,
      // styles of the points
      filled:true,
      pointRadiusMinPixels : 5 , // minimum pixel of a point 
      pointRadiusMaxPixels: 15,  // maximum pixel of a point 
      pointRadiusScale : 2000,
      getPointRadius : () => 5,
      getFillColor: (data:any) => {
        if (data.properties.Name.includes("National Park")) {
            return [0, 0, 0, 250]; // Black color
        } 
        else if (data.properties.Name.includes("Monument")) {
          return [204 , 0 ,0]; // Red representing Monuments
        }
      else if (data.properties.Name.includes("Historic Site")) {
        return [102 , 0 ,204]; // Purple representing Monuments
        }
       else {
            return [86, 144, 58, 250];// Green Default color for other things
        }
       } ,
       autoHighlight:true, //for Hover colors 
       pickable:true, // needed for onclick function
       onClick,
       onHover
       
    }),
    
  ]
  return (
    <div>
    <DeckGL
    controller = {true}
    // injecting the layer on the map
    layers={layers}
    viewState={viewState}
    onViewStateChange={handleChangeViewState}
    >
    <Map mapStyle={MAP_STYLE} mapboxAccessToken = {MAPBOX_ACESS_TOKEN} />
    </DeckGL>
    <div className={styles.heading}>
    <div className={styles.leftControls}>
    <button className={styles.first}>National Park</button>
    <button className={styles.second}>Monument</button>
    <button className={styles.third}>Historic Site</button>
    <button className={styles.fourth}>Others</button>
    </div>
    </div>
    
    <div className={styles.controls}>
        {Object.keys(Locations).map(key => (
          <button key={key} onClick={()=>handleFlyto(Locations[key])} >
            {key}
          </button> 
        ))}
      </div>
      </div>
  );
}

export default App;
