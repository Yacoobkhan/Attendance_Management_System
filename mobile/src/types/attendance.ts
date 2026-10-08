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

export type MonthlyDayAttendance = |string | {
    id:number;
    status:string;
};

export type MonthlyAttendance = {
    employee: number;
    employee_name: string;
    employee_type: string;
    reporting_person: string | null;
    team: string | null;
    location: string | null;

    attendance: Record<string,MonthlyDayAttendance>;

    working_days: number;
    paid_holidays: number;
    absent_days: number;
    total_days: number;
    holidays: number;
    half_absent_days: number;
    na_days: number;
    extra_days: number;
    wfh: number;

    remarks: string;
};