import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { MarkerImage } from '../types';

interface ImageListProps {
  images: MarkerImage[];
  onAddImage: () => void;
  onDeleteImage: (imageId: number) => void;
}

export default function ImageList({ images, onAddImage, onDeleteImage }: ImageListProps) {
  const handleDeleteImage = (imageId: number) => {
    Alert.alert(
      'Удаление фото',
      'Вы уверены, что хотите удалить это фото?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => onDeleteImage(imageId)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>📷 Изображения ({images.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddImage}>
          <Text style={styles.addButtonText}>+ Добавить</Text>
        </TouchableOpacity>
      </View>

      {images.length === 0 ? (
        <View style={styles.emptyImages}>
          <Text style={styles.emptyImagesText}>Изображений пока нет</Text>
          <TouchableOpacity style={styles.addImageButton} onPress={onAddImage}>
            <Text style={styles.addImageButtonText}>Добавить первое фото</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imagesScrollContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesScrollContent}
          >
            {images.map((image) => (
              <View key={image.id} style={styles.imageContainer}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.deleteImageButton}
                  onPress={() => handleDeleteImage(image.id!)}
                >
                  <Text style={styles.deleteImageButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyImages: {
    alignItems: 'center',
    padding: 20,
  },
  emptyImagesText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  addImageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addImageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imagesScrollContainer: {
    marginTop: 12,
  },
  imagesScrollContent: {
    paddingVertical: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
    marginTop: 15,
  },
  image: {
    width: 200,
    height: 200,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
