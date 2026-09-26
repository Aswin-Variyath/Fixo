import { injectable } from "inversify";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";
import prisma from "../../../database/prisma/prisma";
import { TaskerAvailabilityRecord, TaskerBookingRecord } from "../types/tasker-availability.type";

@injectable()
export class TaskerRepository implements ITaskerRepositoy {
    async findNearbyTasker(
        serviceId: string,
        latitude: number,
        longitude: number,
        distanceKm: number
    ): Promise<NearbyTasker[]> {

        const distanceMeters = distanceKm * 1000;

        return prisma.$queryRaw<NearbyTasker[]>`
            SELECT
                tp.id AS "taskerProfileId",
                u.id AS "userId",
                u."firstName",
                u."lastName",
                tp."profileImageUrl",
                tp."averageRating",
                tp."totalReviews",

                tso."hourlyRate"::double precision AS "hourlyRate",
                tso."dailyRate"::double precision AS "dailyRate",

                tl."latitude"::double precision AS "latitude",
                tl."longitude"::double precision AS "longitude",

                tl."maximumRoadDistanceKm"::double precision
                    AS "maximumRoadDistanceKm",

                (
                    ST_Distance(
                        tl."location",
                        ST_SetSRID(
                            ST_MakePoint(
                                ${longitude},
                                ${latitude}
                            ),
                            4326
                        )::geography
                    ) / 1000
                )::double precision AS "distanceKm"

            FROM "TaskerLocation" tl

            INNER JOIN "TaskerProfile" tp
                ON tp.id = tl."taskerProfileId"

            INNER JOIN "users" u
                ON u.id = tp."userId"

            INNER JOIN "TaskerServiceOffering" tso
                ON tso."taskerProfileId" = tp.id

            WHERE
                tso."serviceId" = ${serviceId}

                AND tso.status = 'ACTIVE'

                AND tp."profileStatus" = 'COMPLETE'

                AND ST_DWithin(
                    tl."location",
                    ST_SetSRID(
                        ST_MakePoint(
                            ${longitude},
                            ${latitude}
                        ),
                        4326
                    )::geography,
                    ${distanceMeters}
                )

            ORDER BY "distanceKm" ASC
      
      `;
    }

    async findTaskerForDiscovery(latitude: number, longitude: number, distanceKm: number): Promise<NearbyTasker[]> {
        const distanceMeters = distanceKm * 1000;

    return prisma.$queryRaw<NearbyTasker[]>`
        SELECT
            tp.id AS "taskerProfileId",
            u.id AS "userId",
            u."firstName",
            u."lastName",
            tp."profileImageUrl",
            tp."averageRating",
            tp."totalReviews",

            MIN(tso."hourlyRate")::double precision AS "hourlyRate",
            MIN(tso."dailyRate")::double precision AS "dailyRate",

            tl."latitude"::double precision AS "latitude",
            tl."longitude"::double precision AS "longitude",

            tl."maximumRoadDistanceKm"::double precision
                AS "maximumRoadDistanceKm",

            (
                ST_Distance(
                    tl."location",
                    ST_SetSRID(
                        ST_MakePoint(
                            ${longitude},
                            ${latitude}
                        ),
                        4326
                    )::geography
                ) / 1000
            )::double precision AS "distanceKm"

        FROM "TaskerLocation" tl

        INNER JOIN "TaskerProfile" tp
            ON tp.id = tl."taskerProfileId"

        INNER JOIN "users" u
            ON u.id = tp."userId"

        INNER JOIN "TaskerServiceOffering" tso
            ON tso."taskerProfileId" = tp.id

        WHERE
            tso.status = 'ACTIVE'

            AND tp."profileStatus" = 'COMPLETE'

            AND ST_DWithin(
                tl."location",
                ST_SetSRID(
                    ST_MakePoint(
                        ${longitude},
                        ${latitude}
                    ),
                    4326
                )::geography,
                ${distanceMeters}
            )

        GROUP BY
            tp.id,
            u.id,
            u."firstName",
            u."lastName",
            tp."profileImageUrl",
            tp."averageRating",
            tp."totalReviews",
            tl."latitude",
            tl."longitude",
            tl."maximumRoadDistanceKm",
            tl."location"

        ORDER BY "distanceKm" ASC
    `;
    }

    async findTaskerAvailability(taskerProfileId: string, dayOfWeek: string): Promise<TaskerAvailabilityRecord[]> {
        return prisma.taskerAvailability.findMany({
            where:{
                taskerProfileId,
                dayOfWeek:dayOfWeek as any,
                status:'ACTIVE'
            },
            select:{
                startTime:true,
                endTime:true
            },
            orderBy:{
                startTime:'asc'
            }
        })
    }

    async findTaskerBookings(taskerProfileId: string, bookingDate: Date): Promise<TaskerBookingRecord[]> {
        return prisma.booking.findMany({
            where:{
                taskerProfileId,
                bookingDate,
                status:{
                    in:["PENDING","CONFIRMED", "IN_PROGRESS"]
                }
            },
            select:{
                startTime:true,
                endTime:true,
                status:true
            },
            orderBy:{
                startTime:'asc'
            }
        })
    }
    
}