import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ImageList from '../../components/ImageList';
import MarkerList from '../../components/MarkerList';
import { useMarkers } from '../../contexts/MarkerContext';

export default function MarkerDetailsScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { markers, addImageToMarker, deleteImageFromMarker } = useMarkers();

  // Находим маркер в глобальном состоянии
  const marker = markers.find(m => m.id === params.id);
  
  // Проверка на наличие маркера
  useEffect(() => {
    if (params.id) {
      if (marker) {
        setLoading(false);
      } else {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000); // через 3 секунды
        return () => clearTimeout(timer);
      }
    }
  }, [params.id, marker]);

  // Добавление изображения
  const handleAddImage = async () => {
    if (!marker) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const imageUri = result.assets[0].uri;
        const newImage = {
          id: `img-${Date.now()}`,
          marker_id: marker.id,
          uri: imageUri,
        };
        
        // Обновляем в глобальном состоянии
        addImageToMarker(marker.id, newImage);
      }
      catch (error) {
        Alert.alert('Ошибка', 'Не удалось добавить изображение');
        console.error('Ошибка при добавлении изображения:', error);
      }
    }
  };

  // Удаление изображения
  const handleDeleteImage = (imageId: string) => {
    if (!marker) return;
    
    // Обновляем только в глобальном состоянии
    deleteImageFromMarker(marker.id, imageId);
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
        images={marker.images || []}
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
