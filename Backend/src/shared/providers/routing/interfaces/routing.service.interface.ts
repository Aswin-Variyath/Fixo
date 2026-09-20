export interface RoutingCoordinate {
    latitude:number
    longitude:number
}

export interface RoutingResult {
    distanceKm:number
    durationMinutes:number
}

export interface IRoutingService {
    getRoadDistances(source:RoutingCoordinate,destinations:RoutingCoordinate[]):Promise<RoutingResult[]>
}

export interface OsrmTableResponse {
    code: string;
    distances?: Array<Array<number | null>>;
    durations?: Array<Array<number | null>>;
}