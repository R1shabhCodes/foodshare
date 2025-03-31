import React, { useRef } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 18.990434269078005, 
    lng: 73.12760569730315, // Coordinates for panvel
};

const GoogleMaps = ({ selectedLocationLat, selectedLocationLng }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const mapRef = useRef(null);
    const handleMapLoad = (map) => {
        mapRef.current = map;
    };

    const mapComponent = isLoaded ? (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={{
            lat: selectedLocationLat ? parseFloat(selectedLocationLat) : center.lat,
            lng: selectedLocationLng ? parseFloat(selectedLocationLng) : center.lng,
        }}
        zoom={selectedLocationLat && selectedLocationLng ? 15 : 12}
        onLoad={handleMapLoad}
    >
        {/* Ensure markers only appear when valid coordinates exist */}
        {selectedLocationLat !== null && selectedLocationLng !== null && !isNaN(selectedLocationLat) && !isNaN(selectedLocationLng) && (
            <MarkerF position={{ lat: selectedLocationLat, lng: selectedLocationLng }} />
        )}
    </GoogleMap>
    
    ) : (
        <></>
    );

    return (
        <div className="row">
            <div className="col-12">
                <h4 className="title mt-3 mb-3 text-secondary">Google Maps</h4>
                {mapComponent}
            </div>
        </div>
    );
};

export default GoogleMaps;
