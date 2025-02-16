import { create } from 'zustand';

interface LocationState {
  currentLocation: { lat: number; lng: number };
  nearbyPlaces: any[];
  isLoading: boolean;
  error: string | null;
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
  setNearbyPlaces: (places: any[]) => void;
  searchNearbyPlaces: (query: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: { lat: 0, lng: 0 },
  nearbyPlaces: [],
  isLoading: false,
  error: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setNearbyPlaces: (places) => set({ nearbyPlaces: places }),
  searchNearbyPlaces: async (query) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/location/search?q=${query}`);
      const data = await response.json();
      set({ nearbyPlaces: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search places', isLoading: false });
    }
  }
}));
