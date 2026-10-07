export type DailyAttendance = {
    attendance_id: number | null;
    date: string;
    day: string;
    employee: number;
    employee_id: number;
    employee_name: string;
    location: string | null;
    remarks: string;
    reporting_person: string | null;
    status: string;
    team: string | null;
};