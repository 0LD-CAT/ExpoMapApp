import React, { createContext, ReactNode, useContext, useState } from 'react';

import { CustomMarker } from '../types';

interface MarkerContextType {
  markers: CustomMarker[];
  addMarker: (marker: CustomMarker) => void;
  deleteMarker: (marker: CustomMarker) => void;
  updateMarker: (markerId: string, updatedMarker: CustomMarker) => void;
  addImageToMarker: (markerId: string, image: any) => void;
  deleteImageFromMarker: (markerId: string, imageId: string) => void;
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

interface MarkerProviderProps {
  children: ReactNode;
}

export const MarkerProvider: React.FC<MarkerProviderProps> = ({ children }) => {
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  const addMarker = (marker: CustomMarker) => {
    setMarkers(prev => [...prev, marker]);
  };

  const deleteMarker = (marker: CustomMarker) => {
    setMarkers(prev => prev.filter(m => m.id !== marker.id));
  };

  const updateMarker = (markerId: string, updatedMarker: CustomMarker) => {
    setMarkers(prev => prev.map(m => 
      m.id === markerId ? updatedMarker : m
    ));
  };

  const addImageToMarker = (markerId: string, image: any) => {
    setMarkers(prev => prev.map(m => 
      m.id === markerId 
        ? { ...m, images: [...(m.images || []), image] }
        : m
    ));
  };

  const deleteImageFromMarker = (markerId: string, imageId: string) => {
    setMarkers(prev => prev.map(m => 
      m.id === markerId 
        ? { ...m, images: m.images?.filter(img => img.id !== imageId) || [] }
        : m
    ));
  };

  return (
    <MarkerContext.Provider value={{
      markers,
      addMarker,
      deleteMarker,
      updateMarker,
      addImageToMarker,
      deleteImageFromMarker
    }}>
      {children}
    </MarkerContext.Provider>
  );
};
// Хук для доступа к данным
// Проверяет, что контекст существует (что компонент обернут в MarkerProvider)
export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (context === undefined) {
    throw new Error('useMarkers must be used within a MarkerProvider');
  }
  return context;
};
