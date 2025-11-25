export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface CustomMarker {
    id: number;
    coordinate: Coordinate;
    title: string;
    description: string;
    createdAt?: string;
    images?: MarkerImage[];
}

export interface Region extends Coordinate {
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MarkerImage {
    id?: number;
    marker_id: number;
    uri: string;
}
