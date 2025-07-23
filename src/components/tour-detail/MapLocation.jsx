import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker màu đỏ
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Marker màu xanh
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapLocation = ({ locations, selectedLocation }) => {
  const markerRefs = useRef([]);

  const locationToFocus = selectedLocation || locations[0];
  const center = locationToFocus
    ? [locationToFocus.coordinates[1], locationToFocus.coordinates[0]]
    : [21.0285, 105.8542];

  // 👉 Focus và mở popup cho selectedLocation
  useEffect(() => {
    if (!selectedLocation || !markerRefs.current) return;
    const idx = locations.findIndex(
      (loc) =>
        loc.coordinates[0] === selectedLocation.coordinates[0] &&
        loc.coordinates[1] === selectedLocation.coordinates[1]
    );
    if (idx !== -1 && markerRefs.current[idx]) {
      markerRefs.current[idx].openPopup();
    }
  }, [selectedLocation, locations]);

  return (
    <section id="tour-map" className="mt-10 container max-w-5xl p-6 mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
        Bản đồ vị trí
      </h1>
      <div className="h-96 rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          key={center.toString()}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline nối các điểm */}
          <Polyline
            positions={locations
              .slice()
              .sort((a, b) => a.day - b.day)
              .map((loc) => [loc.coordinates[1], loc.coordinates[0]])}
            color="cyan"
            weight={4}
            opacity={0.7}
          />

          {/* Marker cho từng vị trí */}
          {locations.map((loc, index) => {
            const isSelected =
              selectedLocation &&
              selectedLocation.coordinates[0] === loc.coordinates[0] &&
              selectedLocation.coordinates[1] === loc.coordinates[1];

            return (
              <Marker
                key={index}
                position={[loc.coordinates[1], loc.coordinates[0]]}
                icon={isSelected ? redIcon : blueIcon}
                ref={(ref) => {
                  markerRefs.current[index] = ref;

                  // 👉 Nếu là selected marker, mở popup ngay khi mounted
                  if (ref && isSelected) {
                    setTimeout(() => {
                      ref.openPopup();
                    }, 0); // delay để đảm bảo marker đã render xong
                  }
                }}
              >
                <Popup autoPan={true} closeButton={false}>
                  <strong>{loc.address}</strong>
                  <br />
                  {loc.description}
                </Popup>
              </Marker>
            );
          })}

          {selectedLocation && <MapFocus location={selectedLocation} />}
        </MapContainer>
      </div>
    </section>
  );
};

// Tự động focus camera khi selectedLocation thay đổi
const MapFocus = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    const { coordinates } = location;
    map.setView([coordinates[1], coordinates[0]], 13, {
      animate: true,
    });
  }, [location, map]);

  return null;
};

export default MapLocation;
