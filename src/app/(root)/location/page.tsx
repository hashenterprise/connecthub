'use client';

import  LocationCard  from "@/components/location/location-card";
import { LocationMap } from "@/components/location/location-map";
import { PlaceSearch } from "@/components/location/place-search";
import { useState } from "react";

export default function LocationPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <PlaceSearch onLocationSelect={setSelectedLocation} />
        <LocationCard location={selectedLocation} />
      </div>
      <div className="lg:col-span-2">
        <LocationMap selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}