import { Schedule } from "Schedule";

export class ScheduleCategory {
    checked: boolean;
    name: string;
    color: string;
    schedules: Schedule[];

    constructor(name: string, color: string, checked: boolean, schedules?: Schedule[]) {
        this.checked = true;
        this.name = name;
        this.color = color;
        this.checked = checked;

        if(schedules != null)
            this.schedules = schedules;
        else
            this.schedules = [];
    }

    addSchedule(schedule: Schedule) : void {
        this.schedules.push(schedule);
    }

    removeSchedule(schedule: Schedule) :void {
        this.schedules = this.schedules.filter(c => c.id !== schedule.id);
    }
}