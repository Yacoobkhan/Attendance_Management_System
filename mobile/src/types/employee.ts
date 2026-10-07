export type Employee ={
    id:number;
    employee_id:number,
    employee_name:string,
    dob:string,
    role:string,
    team:number | null,
    location:number | null,
    phone:string,
    mail:string,
    joining_date:string,
    employee_type:string,
    reporting_person:string | null,
    reporting_person_name: string | null,
    is_active:boolean,
}