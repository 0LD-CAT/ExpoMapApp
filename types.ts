export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface CustomMarker {
    id: string;
    coordinate: Coordinate;
    title: string;
    description?: string;
    createdAt: string;
    images: MarkerImage[];
}

export interface Region extends Coordinate {
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MarkerImage {
    id?: string;
    marker_id: string;
    uri: string;
}
