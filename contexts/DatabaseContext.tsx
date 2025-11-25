import React, { createContext, useContext, useEffect, useState } from 'react';

import { initDatabase } from '@/database/schema';
import { addImage, addMarker, deleteImage, deleteMarker, getMarkerById, getMarkerImages, getMarkers } from '../database/operations';
import { CustomMarker, MarkerImage } from '../types';

interface DatabaseContextType {
  // Операции с базой данных
  addMarker: (marker: Omit<CustomMarker, 'id'>) => Promise<CustomMarker | undefined>;
  deleteMarker: (markerId: number) => Promise<void>;
  getMarkers: () => Promise<CustomMarker[]>;
  addImage: (image: Omit<MarkerImage, 'id'>) => Promise<MarkerImage | undefined>;
  deleteImage: (imageId: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
  getMarkerById: (id: number) => Promise<CustomMarker | undefined>;

  // Статусы
  isLoading: boolean;
  error: Error | null;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await initDatabase();
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializeDb();
  }, []);

  return (
    <DatabaseContext.Provider value={{
        addMarker,
        deleteMarker,
        getMarkers,
        addImage,
        deleteImage,
        getMarkerImages,
        getMarkerById,
        isLoading,
        error,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
// Хук для доступа к данным
// Проверяет, что контекст существует (что компонент обернут в DatabaseProvider)
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};