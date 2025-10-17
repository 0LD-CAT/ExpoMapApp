import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ImageList from '../../components/ImageList';
import MarkerList from '../../components/MarkerList';
import { CustomMarker, MarkerImage } from '../../types';

export default function MarkerDetailsScreen() {
  const params = useLocalSearchParams();
  const [marker, setMarker] = useState<CustomMarker | null>(null);
  const [images, setImages] = useState<MarkerImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Восстанавливаем объект маркера из параметров только один раз
  useEffect(() => {
    if (params.id && !marker) {
      const markerData: CustomMarker = {
        id: params.id as string,
        title: params.title as string,
        description: params.description as string,
        createdAt: params.createdAt as string,
        coordinate: {
          latitude: parseFloat(params.latitude as string),
          longitude: parseFloat(params.longitude as string),
        },
        images: params.images ? JSON.parse(params.images as string) : []
      };
      setMarker(markerData);
      setLoading(false);
    }
  }, [params, marker]);

  // Добавление изображения
  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
          const imageUri = result.assets[0].uri;
          // Создаем новый объект изображения
          const newImage: MarkerImage = {
            id: `img-${Date.now()}`,
            marker_id: marker!.id,
            uri: imageUri,
        };
        setMarker(prev => prev ? {
          ...prev,
          images: [...(prev.images || []), newImage]
        } : null);

        setImages(prev => [...prev, newImage]);
      }
      catch (error) {
        Alert.alert('Ошибка', 'Не удалось добавить изображение');
        console.error('Ошибка при добавлении изображения:', error);
      }
    }
    console.log("marker:", marker)
  };

  // Удаление изображения
  const handleDeleteImage = (imageId: string) => {
    setMarker(prev => prev ? {
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId) || []
    } : null);

    setImages(prev => prev.filter(img => img.id !== imageId));
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
      <MarkerList 
        marker={marker} 
      />

      <ImageList 
        images={images}
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
