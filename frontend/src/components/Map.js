import React, { useState, useEffect, Fragment } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import LogEntryForm from './LogEntryForm';

import { listLogEntries } from '../API';

function Map() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 39.0119,
    longitude: -98.4842,
    zoom: 4,
  });

  const getEntries = async () => setLogEntries(await listLogEntries());;

  useEffect(() => {
    const fetchData = async () => {
      getEntries();
    };
    fetchData();
  }, []);

  const showAddPopupMarker = (event) => {
    console.log(event);
    const [ longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={'pk.eyJ1Ijoia2lzaG9yZS0xNSIsImEiOiJja2lraXh1dnowOHF6MnZwZGRoN3c0NGFlIn0.F1zoElF44rG93ax7jEAQ5Q'}
      onDblClick={showAddPopupMarker}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {logEntries.map(logEntry => (
        <Fragment key={logEntry._id}>
          <Marker 
            latitude={logEntry.latitude}
            longitude={logEntry.longitude}>
              <div onClick={() => setShowPopup({
                [logEntry._id]: true
              })}>
                <img className="marker" 
                    src="https://pngimage.net/wp-content/uploads/2019/05/google-map-symbol-png-1.png" 
                    alt="marker"
                />
              </div>
          </Marker>
          {showPopup[logEntry._id] ? (
            <Popup
              latitude={logEntry.latitude}
              longitude={logEntry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top" >
              <div className="popup">
                <h3>{logEntry.title}</h3>
                <p>{logEntry.comments}</p>
                <p>{logEntry.rating ? logEntry.rating : null}</p>
                <small>Visited on: { new Date(logEntry.visitDate).toLocaleDateString() }</small>
                {logEntry.image && <img src={logEntry.image} alt="Error loading" />}
              </div>
            </Popup>
          ) : null}
        </Fragment>
      ))}
      {
        addEntryLocation ? (
          <>
            <Marker 
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}>
                <div>
                  <img className="marker" 
                      src="https://pngimage.net/wp-content/uploads/2019/05/google-map-symbol-png-1.png" 
                      alt="marker"
                  />
                </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div className="popup">
                <LogEntryForm 
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                  location={addEntryLocation} />
              </div>
            </Popup>
          </>
        ) : null
      }
    </ReactMapGL>
  );
};

export default Map;