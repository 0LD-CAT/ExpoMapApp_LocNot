import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ImageList from '../../components/ImageList';
import MarkerList from '../../components/MarkerList';
import { useDatabase } from '../../contexts/DatabaseContext';
import { CustomMarker, MarkerImage } from '../../types';

export default function MarkerDetailsScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState<CustomMarker | null>(null);
  const [markerImages, setMarkerImages] = useState<MarkerImage[]>([]);
  
  const { getMarkerById, getMarkerImages, addImage, deleteImage } = useDatabase();

  // Загружаем данные маркера из БД
  useEffect(() => {
    loadMarkerData();
  }, [params.id]);

  const loadMarkerData = async () => {
    if (!params.id) return;

    try {
      const markerId = parseInt(params.id as string);
      const markerData = await getMarkerById(markerId);
      
      if (markerData) {
        setMarker(markerData);
        
        // Загружаем изображения маркера
        const images = await getMarkerImages(markerId);
        setMarkerImages(images);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных маркера:', error);
    } finally {
      setLoading(false);
    }
  };

  // Добавление изображения
  const handleAddImage = async () => {
    if (!marker || !marker.id) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const imageUri = result.assets[0].uri;
        const newImage: MarkerImage = {
          marker_id: marker.id,
          uri: imageUri,
        };
        
        // Сохраняем в БД
        await addImage(newImage);
        
        // Обновляем список изображений
        const updatedImages = await getMarkerImages(marker.id);
        setMarkerImages(updatedImages);
      }
      catch (error) {
        Alert.alert('Ошибка', 'Не удалось добавить изображение');
        console.error('Ошибка при добавлении изображения:', error);
      }
    }
  };

  // Удаление изображения
  const handleDeleteImage = async (imageId: number) => {
    if (!marker || !marker.id) return;
    
    try {
      // Удаляем из БД
      await deleteImage(imageId);
      
      // Обновляем список изображений
      const updatedImages = await getMarkerImages(marker.id);
      setMarkerImages(updatedImages);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить изображение');
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!marker) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Маркер не найден</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MarkerList marker={marker} />
      <ImageList 
        images={markerImages}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});