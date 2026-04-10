import React, { useState } from "react";
import api from "@/api/client";
import { paths } from "@/api/paths";
import { Button, Form, Alert } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ContactListButton from "./ContactListButton";

function TestApp() {
  const [zipCode, setZipCode] = useState("");
  const [markersData, setMarkersData] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(paths.clients.searchZip(zipCode));
      if (response.data.length === 0) {
        setError("No results with given Zipcode.");
        setMarkersData([]);
        return;
      }
      const jobs = response.data;
      const jobAddresses = response.data.map((job) => job.address);
      const jobNames = await Promise.all(
        jobs.map((job) => api.get(paths.clients.byId(job.id)))
      );

      const combined = jobAddresses.map((address, index) => ({
        name: jobNames[index].data.name,
        address,
      }));
      setMarkersData(combined);
      setError(null);
    } catch (err) {
      console.error("Error fetching job markers:", err);
    }
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
            <Button type="submit" variant="outline-secondary">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {markersData.length > 0 && (
        <div className="mt-3">
          <h5>Results</h5>
          <ul className="list-group mb-3">
            {markersData.map((m, index) => (
              <li key={index} className="list-group-item">
                <strong>{m.name}</strong>
                <span className="text-muted ms-2">{m.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ContactListButton markers={markersData} />
    </div>
  );
}

export default TestApp;
