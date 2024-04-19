import React, { useState } from 'react';
import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader"
import { Button, Form,Alert } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Marker, GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import MarkerNames from './MarkerNames';
import ContactListButton from './ContactListButton';

function TestApp() {
  const [zipCode, setZipCode] = useState('');
  // const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  // const [addresses,setAddresses] = useState([])
  const [markersData,setMarkersData]=useState([]);
  const [error,setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/clients/search?zipCode=${zipCode}`);
      if (response.data.length ===0){
        setError("No results with given Zipcode.")
        return;
      }
      const jobs = response.data;

      const jobAddresses = response.data.map(job => job.address);
      const jobCoordinates = await getCoordinates(jobAddresses);
      // setMarkers(jobCoordinates);
      //fetching names with each job
      const jobNames = await Promise.all(jobs.map(job => axios.get(`/clients/${job.id}`)));

      //combine coordinates and names
      const markersData = jobCoordinates.map((coordinate,index)=> ({
        ...coordinate,
        name: jobNames[index].data.name,
        address: jobAddresses[index] // Associate each marker with its address
      }));
      setMarkersData(markersData); // array of objects contains marker data
      // console.log(selectedMarker)
      setError(null);
      
    } catch (error) {
      console.error('Error fetching job markers:', error);
    }
  };
  
  const getCoordinates = async (addresses) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API
    const coordinates = [];
    const actualAdresses =[];
    console.log(actualAdresses);
    
    for (const address of addresses) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const { results } = response.data;
          actualAdresses.push(results[0].formatted_address);
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          coordinates.push({ lat, lng });
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }
    //storing adresses in state
    // setAddresses(actualAdresses) 
    return coordinates;
  };

  return (
    
    <div>
      
      <Form inline onSubmit={handleSubmit}>
        <Row>
          <Col xs="auto">
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
      {error && <Alert variant="danger">{error}</Alert>}
      <div style={{ height: '50vh', width: '50vw'}}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API}
        >
          <GoogleMap
            center={{ lat:38.621639, lng:-90.364988 }} // Initial center of the map
            zoom={10} // Initial zoom level
            mapContainerStyle={{ height: '100%', width: '100%' }}
          >
            {markersData.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                <h3>{selectedMarker.name}</h3>
                <p>Address: {selectedMarker.address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      
      <ContactListButton markers={markersData}/>
    </div>
  );
}

export default TestApp;
