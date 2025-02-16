import React from 'react';

interface LocationCardProps {
  location: {
    name: string;
    address: string;
    description: string;
  } | null;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  if (!location) {
    return <div>No location selected</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold">{location.name}</h2>
      <p className="text-gray-600">{location.address}</p>
      <p className="mt-2">{location.description}</p>
    </div>
  );
};

export default LocationCard;