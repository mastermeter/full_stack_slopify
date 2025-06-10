import React, { use, useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { parse, format } from 'date-fns';
import useEvents from './useEvents';

const formatDate = (dateString) => {
  const date = parse(dateString, 'yyyyMMdd', new Date());
  return format(date, 'dd MMM yyyy');
};

const EventMarkers = () => {
  const {events} = useEvents();

  return (
    <>
      {events.map((event, index) => (
        <Marker key={index} position={event.location}>
          <Popup>
            <div>
              <h3>{event.name}</h3>
              <p>
                {formatDate(event.dateFrom)} – {formatDate(event.dateTo)}
              </p>
              <p><strong>Artistes :</strong></p>
              <ul>
                {event.artists.map((artist, i) => (
                  <li key={i}>{artist.name}</li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default EventMarkers;
