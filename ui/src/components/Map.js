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
  const [addressDetails, setAddress] = useState([]);
  const [cityDetails, setCity] = useState([]);

  const fixFormat = async () => {
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
      setAddress(addressString);
      setCity(city);
    }
  };
  const fetchCoordinates = async () => {
    const { data } = await Axios.get(
      "https://nominatim.openstreetmap.org/search?q=" +
        addressDetails +
        ",+" +
        cityDetails +
        "&format=json&polygon=1&addressdetails=1"
    );
    if (data[0] !== undefined) {
      const latitude = parseFloat(data[0]?.lat);
      const longitude = parseFloat(data[0]?.lon);
      setPosition([latitude, longitude]);
    }
  };

  useEffect(() => {
    fixFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, city]);

  useEffect(() => {
    if (addressDetails.length === 0 || cityDetails.length === 0) {
      return;
    }

    fetchCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressDetails, cityDetails]);

  useEffect(() => {
    if (position.length === 0) {
      return;
    }
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
