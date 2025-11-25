import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';

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

export default function Map({ markers, addMarker, deleteMarker, showMarkerDetails, onError, onMapReady } : MapProps) {

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

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
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
            </MapView>
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
});