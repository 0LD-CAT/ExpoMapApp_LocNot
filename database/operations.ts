import { initDatabase } from '../database/schema';
import { CustomMarker, MarkerImage } from '../types';

const dbPromise = initDatabase();

// Добавление нового маркера
export const addMarker = async (marker: Omit<CustomMarker, 'id'>): Promise<CustomMarker | undefined> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const result = await db.runAsync(
    `INSERT INTO markers (latitude, longitude, title, description) VALUES (?, ?, ?, ?)`,
    [marker.coordinate.latitude, marker.coordinate.longitude, marker.title, marker.description]
  );

  if (result && result.lastInsertRowId) {
    const newMarker: CustomMarker = {
      ...marker,
      id: result.lastInsertRowId
    };
    console.log(`Маркер ${result.lastInsertRowId} успешно создан`);
    return newMarker;
  }
  return undefined;
};

// Удаление маркера
export const deleteMarker = async (markerId: number): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(`DELETE FROM markers WHERE id = ?`, [markerId]);
  console.log(`Маркер c id: ${markerId} успешно удален`);
};

// Получение всех маркеров
export const getMarkers = async (): Promise<CustomMarker[]> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const results = await db.getAllAsync<any>(
    `SELECT 
      id, 
      latitude, 
      longitude, 
      title, 
      description, 
      created_at as createdAt 
     FROM markers 
     ORDER BY id`
  );

  if (results) {
    const markers: CustomMarker[] = results.map(row => ({
      id: row.id,
      coordinate: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      title: row.title,
      description: row.description,
      createdAt: row.createdAt
    }));
    
    console.log('Маркеры успешно прочитаны');
    return markers;
  }

  return [];
};

// Добавление изображения для маркера
export const addImage = async (image: Omit<MarkerImage, 'id'>): Promise<MarkerImage | undefined> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const result = await db.runAsync(
    `INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)`,
    [image.marker_id, image.uri]
  );

  if (result && result.lastInsertRowId) {
    const newImage: MarkerImage = {
      ...image,
      id: result.lastInsertRowId
    };
    console.log(`Изображение для маркера c id: ${image.marker_id} успешно сохранено`);
    return newImage;
  }
  
  return undefined;
};

// Удаление изображения
export const deleteImage = async (image_id: number): Promise<void> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  await db.runAsync(`DELETE FROM marker_images WHERE id = ?`, [image_id]);
  console.log(`Изображение с id: ${image_id} успешно удалено`);
};

// Получение изображений для маркера
export const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const results = await db.getAllAsync<any>(
    `SELECT 
      id, 
      marker_id, 
      uri, 
      created_at as createdAt 
     FROM marker_images 
     WHERE marker_id = ?`,
    [markerId]
  );

  if (results) {
    const images: MarkerImage[] = results.map(row => ({
      id: row.id,
      marker_id: row.marker_id,
      uri: row.uri,
      createdAt: row.createdAt
    }));
    
    return images;
  }
  return [];
};

// Получение маркера по ID
export const getMarkerById = async (id: number): Promise<CustomMarker | undefined> => {
  const db = await dbPromise;
  if (!db) {
    throw new Error('База данных не инициализирована');
  }

  const result = await db.getAllAsync<any>(
    `SELECT 
      id, 
      latitude, 
      longitude, 
      title, 
      description, 
      created_at as createdAt 
     FROM markers 
     WHERE id = ?`,
    [id]
  );

  if (result && result.length > 0) {
    const row = result[0];
    const marker: CustomMarker = {
      id: row.id,
      coordinate: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      title: row.title,
      description: row.description,
      createdAt: row.createdAt
    };
    
    console.log(`Маркер ${id} успешно прочитан`);
    return marker;
  }

  return undefined;
};