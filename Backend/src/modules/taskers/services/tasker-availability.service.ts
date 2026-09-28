import { inject, injectable } from "inversify";
import {
    ITaskerAvailabilityService,
    TaskerAvailabilityResult,
} from "../interfaces/tasker-availability-service.interface";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { TYPES } from "../../../di";
import { DayOfWeek } from "../../../database/generated/prisma/enums";

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
        const dayOfWeek = this.getDayOfWeek(bookingDate);

        const availabilities =
            await this.taskerRepository.findTaskerAvailability(
                taskerProfileId,
                dayOfWeek
            );

        if (availabilities.length === 0) {
            return {
                available: false,
                nextAvailableStartTime: null,
            };
        }

        const bookings =
            await this.taskerRepository.findTaskerBookings(
                taskerProfileId,
                bookingDate
            );

        for (const availability of availabilities) {
            if (availability.endTime < requestedTime) {
                continue;
            }

            let currentStartTime =
                availability.startTime > requestedTime
                    ? availability.startTime
                    : requestedTime;

            for (const booking of bookings) {
                const bookingStartTime =
                    booking.requestedStartTime;

                /*
                 * If the booking has actually ended,
                 * availability can reopen after actualEndTime.
                 */
                if (booking.actualEndTime) {
                    const actualEndTime =
                        this.formatTime(booking.actualEndTime);

                    if (actualEndTime <= currentStartTime) {
                        continue;
                    }

                    if (bookingStartTime >= availability.endTime) {
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
                 * No actual end time means the tasker is
                 * occupied from the requested start onward.
                 *
                 * We must not invent a future end time.
                 */
                if (bookingStartTime <= currentStartTime) {
                    return {
                        available: false,
                        nextAvailableStartTime: null,
                    };
                }

                /*
                 * A future booking does not block the current
                 * available window.
                 */
                if (bookingStartTime > currentStartTime) {
                    break;
                }
            }

            if (currentStartTime <= availability.endTime) {
                return {
                    available: true,
                    nextAvailableStartTime: currentStartTime,
                };
            }
        }

        return {
            available: false,
            nextAvailableStartTime: null,
        };
    }

    private formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${hours}:${minutes}`;
    }

    private getDayOfWeek(date: Date): DayOfWeek {
        const days: DayOfWeek[] = [
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY,
        ];

        return days[date.getDay()];
    }
}