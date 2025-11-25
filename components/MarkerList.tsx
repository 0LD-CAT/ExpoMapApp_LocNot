import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomMarker } from '../types';

interface MarkerListProps {
  marker: CustomMarker;
}

export default function MarkerList({ marker }: MarkerListProps) {

  return (
    <View style={styles.container}>
      {/* Заголовок и дата */}
      <View style={styles.header}>
        <Text style={styles.title}>{marker.title}</Text>
        <Text style={styles.date}>{marker.createdAt}(UTC)</Text>
      </View>

      {/* Координаты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Местоположение</Text>
        <View style={styles.coordinates}>
          <Text style={styles.coordinateText}>
            Широта: {marker.coordinate.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinateText}>
            Долгота: {marker.coordinate.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      {/* Описание */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Описание</Text>
          <Text style={styles.description}>{marker.description}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  coordinates: {
    gap: 6,
  },
  coordinateText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
