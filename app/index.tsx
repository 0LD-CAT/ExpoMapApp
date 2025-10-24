import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Map from '../components/Map';

import { useMarkers } from '../contexts/MarkerContext';

import { CustomMarker } from '../types';

export default function App() {
    const { markers, addMarker, deleteMarker } = useMarkers();
    const [mapError, setMapError] = useState<string | null>(null);
    const router = useRouter();
    
    // Сбрасываем ошибку при успешной загрузке карты
    const handleMapReady = () => {
        setMapError(null); 
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
                markers={markers}
                addMarker={addMarker}
                deleteMarker={deleteMarker}
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
