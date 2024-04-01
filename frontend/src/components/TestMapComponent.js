import React, { useState } from 'react';
import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader"
import { Button, Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Marker ,GoogleMap,LoadScript} from '@react-google-maps/api';
import {APIProvider, AdvancedMarker,InfoWindow,Map} from '@vis.gl/react-google-maps'
import { MarkerWithInfowindow } from './InfoWindowComponent';

function TestApp() {
  const [zipCode, setZipCode] = useState('');
  const [markers, setMarkers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/clients/search?zipCode=${zipCode}`);
      const jobAddresses = response.data.map(job => job.address);
      const jobCoordinates = await getCoordinates(jobAddresses);
      setMarkers(jobCoordinates);
      
    } catch (error) {
      console.error('Error fetching job markers:', error);
    }
  };
  
  const getCoordinates = async (addresses) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API
    const coordinates = [];
    // const testAddress = '533 Sarah ln,Saint Louis,MO 63141'
    console.log(coordinates);
    
    for (const address of addresses) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const { results } = response.data;
        console.log(response.data)
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          coordinates.push({ lat, lng });
        }

      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }
   
    return coordinates;
  };

  return (
    <div>
      <Form inline onSubmit={handleSubmit}>
        <Row>
          <Col xs ="auto">
        <Form.Control
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="Enter ZIP code"
        className="mr-sm-2"
        />    
        </Col>
        <Col xs="auto">
        <Button type="submit" variant="outline-secondary">Search</Button>
        </Col>
        </Row>
      </Form>
      
         <div style={{ height: '50vh', width: '50vw'}}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API}
        >
          <GoogleMap
            center={{ lat:38.621639, lng:-90.364988 }} // Initial center of the map
            zoom={10} // Initial zoom level
            mapContainerStyle={{ height: '100%', width: '100%' }}
            >
                          
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                
              /> 
              
            ))}
            
          </GoogleMap>
          
        </LoadScript>
      </div>
    </div>
  );
}

export default TestApp;
