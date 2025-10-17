import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CustomMarker } from '../types';

import Map from '../components/Map';


export default function App() {
    const [markers, setMarkers] = useState<CustomMarker[]>([]);
    const [mapError, setMapError] = useState<string | null>(null);
    const router = useRouter();

    // Добавление маркера на карту
    const handleAddMarker = async (marker: CustomMarker) => {
        try {
            setMarkers(prevMarkers => [...prevMarkers, marker]);
            console.log("Дабавлен маркер:", marker)
        }
        catch (error) {
        console.error('Ошибка при добавлении маркера:', error);
        }
    };

    // Удаление маркера с карты
    const handleDeleteMarker = async (marker: CustomMarker) => {
        try {
            setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
            console.log("Удалён маркер:", marker)
        }
        catch (error) {
        console.error('Ошибка при удалении маркера:', error);
        }
    };
    
    // Сбрасываем ошибку при успешной загрузке
    const handleMapReady = () => {
        setMapError(null); 
    };

    const showMarkerDetails = async (marker: CustomMarker) => {
        // Навигация на страницу с деталями
        router.push({
            pathname: '/marker/[id]',
            params: { 
                id: marker.id,
                title: marker.title,
                description: marker.description,
                latitude: marker.coordinate.latitude.toString(),
                longitude: marker.coordinate.longitude.toString(),
                createdAt: marker.createdAt,
                images: JSON.stringify(marker.images || [])
            }
            
        });
        console.log("Данные маркера переданы:", marker)
    }

    return (
        <View style={styles.container}>
            <Map
                markers={markers}
                addMarker={handleAddMarker}
                deleteMarker={handleDeleteMarker}
                showMarkerDetails={showMarkerDetails}
                onMapReady={handleMapReady}
                onError={setMapError}
            />
            {mapError && ( // Отображение ошибки загрузки карты
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
