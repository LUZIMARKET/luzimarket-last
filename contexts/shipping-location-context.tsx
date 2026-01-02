"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShippingLocation {
  city: string;
  state: string;
  country: string;
  displayName: string;
}

interface ShippingLocationContextType {
  location: ShippingLocation;
  setLocation: (location: ShippingLocation) => void;
  availableLocations: ShippingLocation[];
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (isOpen: boolean) => void;
  hasUserSelected: boolean;
  confirmLocation: () => void;
}

const defaultLocation: ShippingLocation = {
  city: 'MONTERREY',
  state: 'NL',
  country: 'MX',
  displayName: 'MONTERREY, NL'
};

const availableLocations: ShippingLocation[] = [
  { city: 'MONTERREY', state: 'Nuevo León', country: 'MX', displayName: 'MONTERREY, NL' },
  { city: 'CDMX', state: 'CDMX', country: 'MX', displayName: 'CDMX' },
  { city: 'GUADALAJARA', state: 'Jalisco', country: 'MX', displayName: 'GUADALAJARA, JAL' },
  { city: 'QUERETARO', state: 'Querétaro', country: 'MX', displayName: 'QUERETARO, QRO' },
  { city: 'PUEBLA', state: 'Puebla', country: 'MX', displayName: 'PUEBLA, PUE' },
  { city: 'CANCUN', state: 'Quintana Roo', country: 'MX', displayName: 'CANCUN, QROO' },
  { city: 'MERIDA', state: 'Yucatán', country: 'MX', displayName: 'MERIDA, YUC' },
  { city: 'TIJUANA', state: 'Baja California', country: 'MX', displayName: 'TIJUANA, BC' },
  { city: 'TOLUCA', state: 'Estado de México', country: 'MX', displayName: 'TOLUCA, EDOMEX' },
];

const ShippingLocationContext = createContext<ShippingLocationContextType | undefined>(undefined);

const STORAGE_KEY = 'luzimarket_shipping_location_v3';
const USER_SELECTED_KEY = 'luzimarket_location_confirmed_v3';

export function ShippingLocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<ShippingLocation>(defaultLocation);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  // Default to CLOSED to prevent flash
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Load saved location from localStorage on mount
  // Load saved location from localStorage on mount
  useEffect(() => {
    // specific check with timeout to ensure hydration/mounting is complete
    const checkLocation = () => {
      try {
        const savedLocation = localStorage.getItem(STORAGE_KEY);
        const userConfirmed = localStorage.getItem(USER_SELECTED_KEY);

        console.log('[ShippingContext] Checking storage:', { savedLocation, userConfirmed });

        if (userConfirmed === 'true') {
          console.log('[ShippingContext] User confirmed, staying closed');
          setHasUserSelected(true);
        } else {
          console.log('[ShippingContext] No confirmation, OPENING modal');
          setIsLocationModalOpen(true);
        }

        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          // Validate the saved location is still in our available locations
          const isValid = availableLocations.some(
            loc => loc.city === parsed.city && loc.state === parsed.state
          );
          if (isValid) {
            setLocationState(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading shipping location:', error);
      }
    };

    // Small delay to ensure initial render is done
    const timer = setTimeout(checkLocation, 100);
    return () => clearTimeout(timer);
  }, []);

  const setLocation = (newLocation: ShippingLocation) => {
    setLocationState(newLocation);
    // Save to localStorage for persistence
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
    } catch (error) {
      console.error('Error saving shipping location:', error);
    }
  };

  const confirmLocation = () => {
    setHasUserSelected(true);
    try {
      localStorage.setItem(USER_SELECTED_KEY, 'true');
    } catch (error) {
      console.error('Error saving location confirmation:', error);
    }
  };

  return (
    <ShippingLocationContext.Provider value={{
      location,
      setLocation,
      availableLocations,
      hasUserSelected,
      confirmLocation,
      isLocationModalOpen,
      setIsLocationModalOpen
    }}>
      {children}
    </ShippingLocationContext.Provider>
  );
}

export function useShippingLocation() {
  const context = useContext(ShippingLocationContext);
  if (!context) {
    throw new Error('useShippingLocation must be used within a ShippingLocationProvider');
  }
  return context;
}