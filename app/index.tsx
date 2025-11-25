import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Map from '../components/Map';
import { useDatabase } from '../contexts/DatabaseContext';
import { CustomMarker } from '../types';

export default function App() {
    const { addMarker, deleteMarker, getMarkers } = useDatabase();
    const [mapError, setMapError] = useState<string | null>(null);
    const [localMarkers, setLocalMarkers] = useState<CustomMarker[]>([]);
    const router = useRouter();
    
    // Сбрасываем ошибку при успешной загрузке карты
    const handleMapReady = () => {
        setMapError(null); 
    };

    // Загружаем маркеры из БД
    useEffect(() => {
        loadMarkers();
    }, []);
    // и загружаем их в локальное состояние
    const loadMarkers = async () => {
        try {
            const dbMarkers = await getMarkers();
            setLocalMarkers(dbMarkers);
        } catch (error) {
            console.error('Ошибка загрузки маркеров:', error);
        }
    };
    
    // Обработчик добавления маркера
    const handleAddMarker = async (marker: Omit<CustomMarker, 'id'>) => {
        try {
            const newMarker = await addMarker(marker);
            if (newMarker) {
                // Обновляем список маркеров
                loadMarkers();
            }
        } catch (error) {
            console.error('Ошибка добавления маркера:', error);
        }
    };

    // Обработчик удаления маркера
    const handleDeleteMarker = async (marker: CustomMarker) => {
        try {
            await deleteMarker(marker.id);
            // Обновляем список маркеров
            loadMarkers();
        } catch (error) {
            console.error('Ошибка удаления маркера:', error);
        }
    };

    // Подробности маркера
    const showMarkerDetails = async (marker: CustomMarker) => {
        router.push({
            pathname: '/marker/[id]',
            params: { 
                id: marker.id,
            }
        });
    }

    return (
        <View style={styles.container}>
            <Map
                markers={localMarkers}
                addMarker={handleAddMarker}
                deleteMarker={handleDeleteMarker}
                showMarkerDetails={showMarkerDetails}
                onMapReady={handleMapReady}
                onError={setMapError}
            />
            {mapError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{mapError}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'red',
        padding: 15,
        zIndex: 1,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
});