import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EventMarkers from './EventMarkers.jsx';


const position = [46.227252,7.362934]

const Map = () => {
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '1130px', width: '100%'}}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <EventMarkers />
        </MapContainer>
    );
};

export default Map;