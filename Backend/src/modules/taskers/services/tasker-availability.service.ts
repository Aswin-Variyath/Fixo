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

        const bookings =
            await this.taskerRepository.findTaskerBookings(
                taskerProfileId,
                bookingDate
            );

        const windows: TaskerAvailabilityWindow[] = [];

        for (const availability of availabilities) {
            const windowStart =
                availability.startTime > requestedTime
                    ? availability.startTime
                    : requestedTime;

            if (windowStart >= availability.endTime) {
                continue;
            }

            let currentStartTime = windowStart;

            for (const booking of bookings) {
                const bookingStartTime =
                    booking.requestedStartTime;

                /*
                 * Booking has already ended.
                 */
                if (booking.actualEndTime) {
                    const actualEndTime =
                        this.formatTime(booking.actualEndTime);

                    if (actualEndTime <= currentStartTime) {
                        continue;
                    }

                    if (
                        bookingStartTime >=
                        availability.endTime
                    ) {
                        break;
                    }

                    if (bookingStartTime > currentStartTime) {
                        break;
                    }

                    if (
                        bookingStartTime <= currentStartTime &&
                        actualEndTime > currentStartTime
                    ) {
                        currentStartTime = actualEndTime;

                        if (
                            currentStartTime >=
                            availability.endTime
                        ) {
                            break;
                        }
                    }

                    continue;
                }

                /*
                 * Booking has no actual end time.
                 *
                 * We cannot predict when the tasker
                 * will become available again.
                 */
                if (bookingStartTime <= currentStartTime) {
                    currentStartTime = availability.endTime;
                    break;
                }

                /*
                 * Future booking.
                 *
                 * Current availability ends when the
                 * booking starts.
                 */
                if (bookingStartTime > currentStartTime) {
                    const freeWindowEnd =
                        bookingStartTime < availability.endTime
                            ? bookingStartTime
                            : availability.endTime;

                    if (currentStartTime < freeWindowEnd) {
                        windows.push({
                            startTime: currentStartTime,
                            endTime: freeWindowEnd,
                        });
                    }

                    currentStartTime = bookingStartTime;

                    if (
                        currentStartTime >=
                        availability.endTime
                    ) {
                        break;
                    }
                }
            }

            /*
             * Add remaining availability after
             * the last booking.
             */
            if (
                currentStartTime <
                availability.endTime
            ) {
                windows.push({
                    startTime: currentStartTime,
                    endTime: availability.endTime,
                });
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