import React, { useState } from 'react';
import { getJson } from '../services/http';
import {
  Alert,
  Box,
  Button,
  TextField,
} from '@mui/material';
import { Marker, GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import ContactListButton from './ContactListButton';

function TestApp() {
  const [zipCode, setZipCode] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersData, setMarkersData] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobs = await getJson(`/clients/search?zipCode=${zipCode}`);
      if (!jobs || jobs.length === 0) {
        setError('No results with given Zipcode.');
        return;
      }

      const jobAddresses = jobs.map((job) => job.address);
      const jobCoordinates = await getCoordinates(jobAddresses);
      const jobNames = await Promise.all(jobs.map((job) => getJson(`/clients/${job.id}`)));

      const markersDataNext = jobCoordinates.map((coordinate, index) => ({
        ...coordinate,
        name: jobNames[index].name,
        address: jobAddresses[index],
      }));
      setMarkersData(markersDataNext);
      setError(null);
    } catch (err) {
      console.error('Error fetching job markers:', err);
    }
  };

  const getCoordinates = async (addresses) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API;
    const coordinates = [];

    for (const address of addresses) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = await response.json();
        const { results } = data;
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          coordinates.push({ lat, lng });
        }
      } catch (geocodeErr) {
        console.error('Error geocoding address:', geocodeErr);
      }
    }
    return coordinates;
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}
      >
        <TextField
          size="small"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
          label="ZIP code"
        />
        <Button type="submit" variant="outlined">
          Search
        </Button>
      </Box>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Box sx={{ height: '50vh', width: { xs: '100%', md: '50vw' } }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API}>
          <GoogleMap
            center={{ lat: 38.621639, lng: -90.364988 }}
            zoom={10}
            mapContainerStyle={{ height: '100%', width: '100%' }}
          >
            {markersData.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}
            {selectedMarker ? (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h3>{selectedMarker.name}</h3>
                  <p>Address: {selectedMarker.address}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </LoadScript>
      </Box>

      <ContactListButton markers={markersData} />
    </Box>
  );
}

export default TestApp;
