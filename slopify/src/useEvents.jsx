import { useEffect, useState } from 'react';

const useEvents = () => {
    const [events, setEvents] = useState([]);
    
      useEffect(() => {
        const fetchEvents = async () => {
          try {
            console.log('Calling:', `${import.meta.env.VITE_SERVER_URL}/events`);
    
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/events`, {
              credentials: 'include',
            });
            const data = await response.json();
            setEvents(data);
          } catch (error) {
            console.error('Erreur lors de la récupération des événements :', error);
          }
        };
        
        fetchEvents();
      }, []);
    return {events};
}

export default useEvents;