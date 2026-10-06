import { injectable } from "inversify";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";
import prisma from "../../../database/prisma/prisma";
import {
    TaskerAvailabilityRecord,
    TaskerBlackoutRecord,
    TaskerBookingRecord,
} from "../types/tasker-availability.type";
import { TaskerSearchSuggestion } from "../types/tasker-search-suggestion.type";

@injectable()
export class TaskerRepository implements ITaskerRepositoy {
    async findNearbyTasker(
        serviceId: string,
        latitude: number,
        longitude: number,
        distanceKm: number,
        rating?: number,
        minHourlyRate?: number,
        maxHourlyRate?: number,
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

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', service_data."serviceId",
                                'name', service_data."name",
                                'hourlyRate', service_data."hourlyRate",
                                'dailyRate', service_data."dailyRate"
                            )
                            ORDER BY service_data."displayOrder", service_data."name"
                        )
                        FROM (
                            SELECT
                                tso2."serviceId",
                                s2."name",
                                tso2."hourlyRate"::double precision AS "hourlyRate",
                                tso2."dailyRate"::double precision AS "dailyRate",
                                s2."displayOrder"
                            FROM "TaskerServiceOffering" tso2
                            INNER JOIN "Service" s2
                                ON s2.id = tso2."serviceId"
                            WHERE
                                tso2."taskerProfileId" = tp.id
                                AND tso2.status = 'ACTIVE'
                                AND s2.status = 'ACTIVE'
                        ) service_data
                    ),
                    '[]'::json
                ) AS "services",

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

            INNER JOIN "Service" s
                ON s.id = tso."serviceId"

            WHERE
                tso."serviceId" = ${serviceId}
                AND tso.status = 'ACTIVE'
                AND s.status = 'ACTIVE'
                AND tp."profileStatus" = 'COMPLETE'

                AND (
                    ${rating === undefined}
                    OR tp."averageRating" >= ${rating}
                )

                AND (
                    ${minHourlyRate === undefined}
                    OR tso."hourlyRate" >= ${minHourlyRate}
                )

                AND (
                    ${maxHourlyRate === undefined}
                    OR tso."hourlyRate" <= ${maxHourlyRate}
                )

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

    async findTaskerForDiscovery(
        latitude: number,
        longitude: number,
        distanceKm: number,
        rating?: number,
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

                MIN(tso."hourlyRate")::double precision AS "hourlyRate",
                MIN(tso."dailyRate")::double precision AS "dailyRate",

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', service_data."serviceId",
                                'name', service_data."name",
                                'hourlyRate', service_data."hourlyRate",
                                'dailyRate', service_data."dailyRate"
                            )
                            ORDER BY service_data."displayOrder", service_data."name"
                        )
                        FROM (
                            SELECT
                                tso2."serviceId",
                                s2."name",
                                tso2."hourlyRate"::double precision AS "hourlyRate",
                                tso2."dailyRate"::double precision AS "dailyRate",
                                s2."displayOrder"
                            FROM "TaskerServiceOffering" tso2
                            INNER JOIN "Service" s2
                                ON s2.id = tso2."serviceId"
                            WHERE
                                tso2."taskerProfileId" = tp.id
                                AND tso2.status = 'ACTIVE'
                                AND s2.status = 'ACTIVE'
                        ) service_data
                    ),
                    '[]'::json
                ) AS "services",

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

            INNER JOIN "Service" s
                ON s.id = tso."serviceId"

            WHERE
                tso.status = 'ACTIVE'
                AND s.status = 'ACTIVE'
                AND tp."profileStatus" = 'COMPLETE'

                AND (
                    ${rating === undefined}
                    OR tp."averageRating" >= ${rating}
                )

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

    async findTaskerAvailability(
        taskerProfileId: string,
        bookingDate: Date,
    ): Promise<TaskerAvailabilityRecord[]> {
        return prisma.taskerAvailability.findMany({
            where: {
                schedule: {
                    taskerProfileId,
                    status: "ACTIVE",
                    validFrom: {
                        lte: bookingDate,
                    },
                    validUntil: {
                        gte: bookingDate,
                    },
                },
                date: bookingDate,
                status: "ACTIVE",
            },
            select: {
                date: true,
                startTime: true,
                endTime: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });
    }

    async findTaskerBookings(
        taskerProfileId: string,
        bookingDate: Date,
    ): Promise<TaskerBookingRecord[]> {
        return prisma.booking.findMany({
            where: {
                taskerProfileId,
                bookingDate,
                status: {
                    in: [
                        "PENDING",
                        "CONFIRMED",
                        "IN_PROGRESS",
                        "COMPLETION_PENDING",
                    ],
                },
            },
            select: {
                requestedStartTime: true,
                actualStartTime: true,
                actualEndTime: true,
                status: true,
            },
            orderBy: {
                requestedStartTime: "asc",
            },
        });
    }

    async findTaskerBlackouts(
        taskerProfileId: string,
        bookingDate: Date,
    ): Promise<TaskerBlackoutRecord[]> {
        return prisma.taskerBlackout.findMany({
            where: {
                taskerProfileId,
                date: bookingDate,
                status: "ACTIVE",
            },
            select: {
                startTime: true,
                endTime: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });
    }

    async findTaskerSearchSuggestions(
        search: string,
        limit?: number,
    ): Promise<TaskerSearchSuggestion[]> {
        const searchTerm = search.trim();

        if (!searchTerm) {
            return [];
        }

        return await prisma.$queryRaw<TaskerSearchSuggestion[]>`
            SELECT
                tp.id AS "id",
                CONCAT_WS(
                    ' ',
                    u."firstName",
                    u."lastName"
                ) AS "name"

            FROM "TaskerProfile" tp

            INNER JOIN "users" u
                ON u.id = tp."userId"

            WHERE
                tp."profileStatus" = 'COMPLETE'
                AND (
                    u."firstName" ILIKE ${`%${searchTerm}%`}
                    OR u."lastName" ILIKE ${`%${searchTerm}%`}
                    OR CONCAT_WS(
                        ' ',
                        u."firstName",
                        u."lastName"
                    ) ILIKE ${`%${searchTerm}%`}
                )

            ORDER BY
                u."firstName" ASC,
                u."lastName" ASC

            LIMIT ${limit};
        `;
    }

    async findTaskersBySearch(
        search: string,
        latitude: number,
        longitude: number,
        distanceKm: number,
        rating?: number,
        minHourlyRate?: number,
        maxHourlyRate?: number,
    ): Promise<NearbyTasker[]> {
        const distanceMeters = distanceKm * 1000;
        const searchTerm = search.trim();

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

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', service_data."serviceId",
                                'name', service_data."name",
                                'hourlyRate', service_data."hourlyRate",
                                'dailyRate', service_data."dailyRate"
                            )
                            ORDER BY service_data."displayOrder", service_data."name"
                        )
                        FROM (
                            SELECT
                                tso2."serviceId",
                                s2."name",
                                tso2."hourlyRate"::double precision AS "hourlyRate",
                                tso2."dailyRate"::double precision AS "dailyRate",
                                s2."displayOrder"
                            FROM "TaskerServiceOffering" tso2
                            INNER JOIN "Service" s2
                                ON s2.id = tso2."serviceId"
                            WHERE
                                tso2."taskerProfileId" = tp.id
                                AND tso2.status = 'ACTIVE'
                                AND s2.status = 'ACTIVE'
                        ) service_data
                    ),
                    '[]'::json
                ) AS "services",

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

            INNER JOIN "Service" s
                ON s.id = tso."serviceId"

            WHERE
                tso.status = 'ACTIVE'
                AND tp."profileStatus" = 'COMPLETE'
                AND s.status = 'ACTIVE'

                AND (
                    s.name ILIKE ${`%${searchTerm}%`}
                )

                AND (
                    ${rating === undefined}
                    OR tp."averageRating" >= ${rating}
                )

                AND (
                    ${minHourlyRate === undefined}
                    OR tso."hourlyRate" >= ${minHourlyRate}
                )

                AND (
                    ${maxHourlyRate === undefined}
                    OR tso."hourlyRate" <= ${maxHourlyRate}
                )

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

    async findTaskerById(
        taskerProfileId: string,
        latitude: number,
        longitude: number,
    ): Promise<NearbyTasker | null> {
        const taskers = await prisma.$queryRaw<NearbyTasker[]>`
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

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', service_data."serviceId",
                                'name', service_data."name",
                                'hourlyRate', service_data."hourlyRate",
                                'dailyRate', service_data."dailyRate"
                            )
                            ORDER BY service_data."displayOrder", service_data."name"
                        )
                        FROM (
                            SELECT
                                tso2."serviceId",
                                s2."name",
                                tso2."hourlyRate"::double precision AS "hourlyRate",
                                tso2."dailyRate"::double precision AS "dailyRate",
                                s2."displayOrder"
                            FROM "TaskerServiceOffering" tso2
                            INNER JOIN "Service" s2
                                ON s2.id = tso2."serviceId"
                            WHERE
                                tso2."taskerProfileId" = tp.id
                                AND tso2.status = 'ACTIVE'
                                AND s2.status = 'ACTIVE'
                        ) service_data
                    ),
                    '[]'::json
                ) AS "services",

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
                tp.id = ${taskerProfileId}
                AND tso.status = 'ACTIVE'
                AND EXISTS (
                    SELECT 1
                    FROM "Service" s
                    WHERE
                        s.id = tso."serviceId"
                        AND s.status = 'ACTIVE'
                )
                AND tp."profileStatus" = 'COMPLETE'

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

            LIMIT 1;
        `;

        return taskers[0] ?? null;
    }
}