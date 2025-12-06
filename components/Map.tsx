import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';

import * as Location from 'expo-location';
import userLocationIcon from '../assets/images/icon-user-location3.png';
import { CustomMarker, Region } from '../types';

const INITIAL_REGION: Region = {
    latitude: 58.00764917574915,
    longitude: 56.21847547049281,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

interface MapProps {
  markers: CustomMarker[];
  addMarker: (marker: Omit<CustomMarker, 'id'>) => void;
  deleteMarker: (marker: CustomMarker) => void;
  showMarkerDetails: (marker: CustomMarker) => void;
  onError: (error: string) => void;
  onMapReady: () => void;
}

export default function Map({ markers, addMarker, deleteMarker, showMarkerDetails, onError, onMapReady, userLocation } : MapProps
    & { userLocation: Location.LocationObject | null }) {
    const mapRef = useRef<MapView>(null);

    const handleMapReady = () => {
        onMapReady();
    };

    // Обработчик долгого удержания на карте (создание маркера)
    const handleMapLongPress = (event: LongPressEvent) => {
        const { coordinate } = event.nativeEvent;
            
        const newMarker: Omit<CustomMarker, 'id'> = {
            coordinate: {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude
            },
            title: `Маркер ${markers.length + 1}`,
            description: `Добавлен: ${new Date().toLocaleString()}`,
        };
        
        addMarker(newMarker);   
    };

    // Alert для всплывающего окна
    const onMarkerSelected = (marker: CustomMarker) => {
        Alert.alert(
            marker.title,
            marker.description,
            [
                {
                    text: '🗑️ Удалить',
                    style: 'destructive',
                    onPress: () => deleteMarker(marker)
                },
                {
                    text: '📋 Подробнее',
                    onPress: () => showMarkerDetails(marker)
                },
                {
                    text: '❌ Отмена',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        );
    };

    const handleFocusOnUserLocation = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            console.log(userLocation)
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                ref={mapRef}
                onLongPress={handleMapLongPress}
                onMapReady={handleMapReady}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                        onPress={() => onMarkerSelected(marker)}
                    >
                    </Marker>
                ))}
                {userLocation && (
                    <Marker
                    coordinate={{
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                    }}
                    icon={userLocationIcon}
                    title="Ваше местоположение"
                />
                )}
            </MapView>
            <TouchableOpacity style={styles.locationButton} onPress={handleFocusOnUserLocation}>
                <Ionicons name="locate" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    locationButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#df0606ff',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    },
});