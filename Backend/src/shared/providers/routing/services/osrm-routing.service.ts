import { injectable } from "inversify";
import { ENV } from "../../../../config/env.config";
import {
    IRoutingService,
    OsrmTableResponse,
    RoutingCoordinate,
    RoutingResult,
} from "../interfaces/routing.service.interface";
import { AppError } from "../../../errors/app.error";
import { StatusCodes } from "http-status-codes";



@injectable()
export class OsrmRoutingService implements IRoutingService {

    async getRoadDistances(source: RoutingCoordinate, destinations: RoutingCoordinate[]): Promise<RoutingResult[]> {

        if (destinations.length === 0) return []

        const coordinates = [
            `${source.longitude},${source.latitude}`,
            ...destinations.map(
                (destination) =>
                    `${destination.longitude},${destination.latitude}`
            ),
        ].join(";");

        const destinationIndexes = destinations.map((_, index) => index + 1).join(";");

        const url =
    `${ENV.OSRM.BASE_URL}/table/v1/driving/${coordinates}` +
    `?sources=0&destinations=${destinationIndexes}&annotations=distance,duration`;
        let response: Response
        try {
            response = await fetch(url);
            
        } catch (error) {
            throw new AppError(StatusCodes.SERVICE_UNAVAILABLE, "Routing service is currently unavailable")
        }

        if (!response.ok) throw new AppError(StatusCodes.BAD_GATEWAY, "Routing service request failed")

        const data = (await response.json()) as OsrmTableResponse;
        console.log("OSRM RESPONSE:", JSON.stringify(data, null, 2));
        if (data.code !== "Ok" || !data.distances || !data.durations || !data.distances[0] || !data.durations[0]) {
            throw new AppError(StatusCodes.BAD_GATEWAY,"Routing service could not calculate distances")
        }

        const distances = data.distances[0];
        const durations = data.durations[0];

        return destinations.map((_, index) => {

            const distanceMeters: number | null | undefined = distances[index];

            const durationSeconds: number | null | undefined = durations[index];

            if (distanceMeters == null || durationSeconds == null) {
                throw new AppError(StatusCodes.BAD_GATEWAY, "Routing service could not calculate a route")
            }

            const distanceKm = Number(distanceMeters) / 1000;
            const durationMinutes = Number(durationSeconds) / 60;

            return {distanceKm, durationMinutes,}
        })
    }
}