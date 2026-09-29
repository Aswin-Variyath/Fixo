import { inject, injectable } from "inversify";
import {
    ITaskerAvailabilityService,
    TaskerAvailabilityResult,
    TaskerAvailabilityWindow,
} from "../interfaces/tasker-availability-service.interface";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { TYPES } from "../../../di";

@injectable()
export class TaskerAvailabilityService
    implements ITaskerAvailabilityService
{
    constructor(
        @inject(TYPES.TaskerRepository)
        private readonly taskerRepository: ITaskerRepositoy
    ) {}

    async getNextAvailableStartTime(
        taskerProfileId: string,
        bookingDate: Date,
        requestedTime: string
    ): Promise<TaskerAvailabilityResult> {
        return this.calculateAvailabilityForDate(
            taskerProfileId,
            bookingDate,
            requestedTime
        );
    }

    async getWeeklyAvailability(
        taskerProfileId: string,
        startDate: Date
    ): Promise<{
        available: boolean;
        nextAvailableStartTime: string | null;
        days: {
            date: string;
            windows: TaskerAvailabilityWindow[];
        }[];
    }> {
        const days: {
            date: string;
            windows: TaskerAvailabilityWindow[];
        }[] = [];

        for (let index = 0; index < 7; index++) {
            const date = new Date(startDate);

            date.setDate(
                date.getDate() + index
            );

            const requestedTime =
                index === 0
                    ? this.getCurrentTime()
                    : "00:00";

            const result =
                await this.calculateAvailabilityForDate(
                    taskerProfileId,
                    date,
                    requestedTime
                );

            if (result.windows.length > 0) {
                days.push({
                    date: this.formatDate(date),
                    windows: result.windows,
                });
            }
        }

        const firstAvailableDay = days[0];

        return {
            available: days.length > 0,
            nextAvailableStartTime:
                firstAvailableDay?.windows[0]?.startTime ?? null,
            days,
        };
    }

    private async calculateAvailabilityForDate(
        taskerProfileId: string,
        bookingDate: Date,
        requestedTime: string
    ): Promise<TaskerAvailabilityResult> {
        const availabilities =
            await this.taskerRepository.findTaskerAvailability(
                taskerProfileId,
                bookingDate
            );

        if (availabilities.length === 0) {
            return {
                available: false,
                nextAvailableStartTime: null,
                windows: [],
            };
        }

        const blackouts =
            await this.taskerRepository.findTaskerBlackouts(
                taskerProfileId,
                bookingDate
            );

        const bookings =
            await this.taskerRepository.findTaskerBookings(
                taskerProfileId,
                bookingDate
            );

        const windows: TaskerAvailabilityWindow[] = [];

        for (const availability of availabilities) {
            const availabilityStart =
                availability.startTime > requestedTime
                    ? availability.startTime
                    : requestedTime;

            if (availabilityStart >= availability.endTime) {
                continue;
            }

            const availabilityWindows =
                this.subtractBlackouts(
                    availabilityStart,
                    availability.endTime,
                    blackouts
                );

            for (const availabilityWindow of availabilityWindows) {
                this.subtractBookings(
                    availabilityWindow.startTime,
                    availabilityWindow.endTime,
                    bookings,
                    windows
                );
            }
        }

        return {
            available: windows.length > 0,
            nextAvailableStartTime:
                windows.length > 0
                    ? windows[0].startTime
                    : null,
            windows,
        };
    }

    private subtractBlackouts(
        startTime: string,
        endTime: string,
        blackouts: {
            startTime: string;
            endTime: string;
        }[]
    ): TaskerAvailabilityWindow[] {
        const windows: TaskerAvailabilityWindow[] = [];

        let currentStartTime = startTime;

        for (const blackout of blackouts) {
            if (blackout.endTime <= currentStartTime) {
                continue;
            }

            if (blackout.startTime >= endTime) {
                break;
            }

            if (blackout.startTime > currentStartTime) {
                windows.push({
                    startTime: currentStartTime,
                    endTime:
                        blackout.startTime < endTime
                            ? blackout.startTime
                            : endTime,
                });
            }

            if (blackout.endTime > currentStartTime) {
                currentStartTime = blackout.endTime;
            }

            if (currentStartTime >= endTime) {
                break;
            }
        }

        if (currentStartTime < endTime) {
            windows.push({
                startTime: currentStartTime,
                endTime,
            });
        }

        return windows;
    }

private subtractBookings(
    startTime: string,
    endTime: string,
    bookings: {
        requestedStartTime: string;
        actualStartTime: Date | null;
        actualEndTime: Date | null;
        status: string;
    }[],
    windows: TaskerAvailabilityWindow[]
): void {
    let currentStartTime = startTime;

    for (const booking of bookings) {
        const bookingStartTime =
            booking.requestedStartTime;

        if (bookingStartTime >= endTime) {
            break;
        }

        /*
         * Booking has an actual end time.
         * The tasker becomes available again after that time.
         */
        if (booking.actualEndTime) {
            const actualEndTime =
                this.formatTime(booking.actualEndTime);

            if (actualEndTime <= currentStartTime) {
                continue;
            }

            if (bookingStartTime > currentStartTime) {
                const freeWindowEnd =
                    bookingStartTime < endTime
                        ? bookingStartTime
                        : endTime;

                if (currentStartTime < freeWindowEnd) {
                    windows.push({
                        startTime: currentStartTime,
                        endTime: freeWindowEnd,
                    });
                }
            }

            if (actualEndTime > currentStartTime) {
                currentStartTime = actualEndTime;
            }

            if (currentStartTime >= endTime) {
                break;
            }

            continue;
        }

        /*
         * No actual end time means the job is still unresolved.
         * Do NOT predict when the tasker will become available.
         */
        if (bookingStartTime <= currentStartTime) {
            currentStartTime = endTime;
            break;
        }

        /*
         * Free time before the unresolved booking.
         */
        windows.push({
            startTime: currentStartTime,
            endTime: bookingStartTime,
        });

        currentStartTime = endTime;
        break;
    }

    /*
     * Add remaining availability only when there is no
     * unresolved booking blocking the rest of the window.
     */
    if (currentStartTime < endTime) {
        windows.push({
            startTime: currentStartTime,
            endTime,
        });
    }
}

    private getCurrentTime(): string {
        const now = new Date();

        const hours = now
            .getHours()
            .toString()
            .padStart(2, "0");

        const minutes = now
            .getMinutes()
            .toString()
            .padStart(2, "0");

        return `${hours}:${minutes}`;
    }

    private formatDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    private formatTime(date: Date): string {
        const hours = date
            .getHours()
            .toString()
            .padStart(2, "0");

        const minutes = date
            .getMinutes()
            .toString()
            .padStart(2, "0");

        return `${hours}:${minutes}`;
    }
}