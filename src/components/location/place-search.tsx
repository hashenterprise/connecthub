'use client'
import { useState } from 'react';
import  Input  from '../ui/input';
import  Button  from '../ui/button';
import { useLocationStore } from '@/store/location-store';
import { Search } from 'lucide-react';

export function PlaceSearch() {
  const [query, setQuery] = useState('');
  const { searchNearbyPlaces } = useLocationStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchNearbyPlaces(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 p-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search nearby places..."
        className="flex-1"
      />
      <Button type="submit">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
}