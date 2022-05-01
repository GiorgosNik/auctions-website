import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultMarker = new L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [13, 0],
});

export default function OpenStreetMap({ address, city }) {
  const [position, setPosition] = useState([]);
  if (address) {
    const addressArray = address.split(" ");
    var addressString = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (index === 0) {
        addressString += addressArray[index];
      } else {
        addressString += "+";
        addressString += addressArray[index];
      }
    }
  }

  const fetchCoordinates = async () => {
    const { data } = await Axios.get(
      "https://nominatim.openstreetmap.org/search?q=" +
        addressString +
        ",+" +
        city +
        "&format=json&polygon=1&addressdetails=1"
    );
    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);
    setPosition([latitude, longitude]);
  };
  useEffect(() => {
    fetchCoordinates();
  }, []);

  useEffect(() => {
    console.log(position);
  }, [position]);

  if (position.length !== 0) {
    return (
      <MapContainer
        style={{ width: "100%", height: "100vh" }}
        center={position}
        zoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={defaultMarker}></Marker>
      </MapContainer>
    );
  }
}
