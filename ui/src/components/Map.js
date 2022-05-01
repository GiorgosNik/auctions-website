/* global google */
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

export default function Map() {
  var address = "new york";
  var geocoder = new window.google.maps.Geocoder();
  //   geocoder.geocode({ address: address }, function (results, status) {
  // if (status == google.maps.GeocoderStatus.OK) {
  //   var latitude = results[0].geometry.location.lat();
  //   var longitude = results[0].geometry.location.lng();
  //   console.log(latitude);
  //   console.log(longitude);
  //   var myLatLng = { lat: latitude, lng: longitude };
  //   var map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 4,
  //     center: myLatLng,
  //   });
  //   var marker = new google.maps.Marker({
  //     position: myLatLng,
  //     map: map,
  //     title: "Hello World!",
  //   });
  // }
  //   });
}
