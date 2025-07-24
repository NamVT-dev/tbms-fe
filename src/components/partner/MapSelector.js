import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ position }) => {
  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ onSelect }) => {
  const [position, setPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    const address = data?.display_name || "Không tìm thấy địa chỉ";

    onSelect({ lat, lng, address });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchTerm.trim()) return;

      setIsLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setPosition([lat, lng]);
    setResults([]);

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }

    onSelect({ lat, lng, address: place.display_name });
  };

  return (
    <div className="space-y-2 mb-4">
      {/* Tìm kiếm */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Tìm địa chỉ..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={isLoading}
        >
          Tìm
        </button>
      </div>

      {/* Gợi ý kết quả */}
      {results.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow">
          {results.map((place, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleResultClick(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Bản đồ */}
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
        <MapContainer
          center={[10.762622, 106.660172]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} />
          <MapClickHandler onClick={handleMapClick} />
          <MapFlyTo position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

function MapFlyTo({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15); // flyTo (hoặc setView)
    }
  }, [position, map]);

  return null;
}

export default MapSelector;
