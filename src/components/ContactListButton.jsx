import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ContactListButton = ({markers}) => {
    const navigate =useNavigate(); 
    const handleContactClick = (name) => {
        console.log(`clicked for${name}`);
        navigate('/chatroom');
    };
    return (
        <div>
            <h2>Available pet-sitters in your area</h2>
            <ul className="list-group">
            {markers.map((marker,index)=>(
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {marker.name}
                    <Button onClick={() => handleContactClick(marker.name)} variant="primary">Contact sitter</Button>
                </li>
            ))}
            </ul>
        </div>
    );
};
export default ContactListButton;