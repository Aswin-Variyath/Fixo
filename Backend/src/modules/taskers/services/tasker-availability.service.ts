import { inject, injectable } from "inversify";
import { ITaskerAvailabilityService, TaskerAvailabilityResult } from "../interfaces/tasker-availability-service.interface";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { TYPES } from "../../../di";
import { DayOfWeek } from "../../../database/generated/prisma/enums";

@injectable()
export class TaskerAvailabilityService implements ITaskerAvailabilityService {
    constructor(
        @inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy
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
            if (booking.endTime <= currentStartTime) {
                continue;
            }

            if (booking.startTime >= availability.endTime) {
                break;
            }

            if (booking.startTime > currentStartTime) {
                break;
            }

            if (
                booking.startTime <= currentStartTime &&
                booking.endTime > currentStartTime
            ) {
                currentStartTime = booking.endTime;

                if (
                    currentStartTime >=
                    availability.endTime
                ) {
                    break;
                }
            }
        }

        if (
            currentStartTime <= availability.endTime
        ) {
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

    private getDayOfWeek(date:Date):DayOfWeek {
        const days: DayOfWeek[] =[
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY,
        ]
        return days[date.getDay()]
    }

}