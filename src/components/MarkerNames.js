import React from "react";
const MarkerNames = ({markers}) => {
    return (
        <div>
            <h2>Available Pet-Sitters</h2>
            <ul>
                {markers.map((marker,index) => (
                    <li key={index}>{marker.name}</li>
                    ))} 
            </ul>
        </div>
    );
};
export default MarkerNames;