import { useState } from "react";

import MapLocation from "../components/tour-detail/MapLocation";
import TourBanner from "../components/tour-detail/TourBanner";
import TourHeader from "../components/tour-detail/TourHeader";
import TourInfo from "../components/tour-detail/TourInfo";
import { TOUR_SAMPLE } from "../data/tour";

const TourDetailPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="bg-white text-black py-4 px-12">
      <TourHeader tour={TOUR_SAMPLE} />

      <TourBanner images={TOUR_SAMPLE.images} />

      <TourInfo
        tour={TOUR_SAMPLE}
        onSelectLocation={(location) => setSelectedLocation(location)}
      />

      <MapLocation
        locations={TOUR_SAMPLE.locations}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default TourDetailPage;
