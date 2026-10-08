import API_BASE_URL from "./api";

export const createAttendance = async (accessToken: string,
    attendanceData: {
        employee: number;
        date: string;
        day:string;
        status: string;
        remarks: string;
    }
) => {

    const response = await fetch(`${API_BASE_URL}/attendance/create/`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify(attendanceData),
        }
    );

    if (!response.ok) {
        throw new Error(
            `CREATE ATTENDANCE ERROR: ${response.status}`
        );
    }

    return await response.json();
};

export const getDailyAttendance = async (accessToken: string,date: string) => {

    const url = `${API_BASE_URL}/attendance/report/daily/?date=${date}`;

    console.log("ATTENDANCE URL:", url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    // console.log("ATTENDANCE STATUS:", response.status );

    if (!response.ok) {
        throw new Error(
            `HTTP ERROR: ${response.status}`
        );
    }

    return await response.json();
};

export const updateAttendance = async (accessToken: string, attendanceId: number,
    attendanceData: {
        employee: number;
        date: string;
        day:string;
        status: string;
        remarks: string;
    }
) => {

    const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}/update/`,{
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify(attendanceData),
        }
    );

    if (!response.ok) {
        throw new Error(
            `UPDATE ATTENDANCE ERROR: ${response.status}`
        );
    }

    return await response.json();
};


export const getMonthlyAttendance = async(accessToken:string,year:number,month:number) => {
    const url = `${API_BASE_URL}/attendance/report/monthly/?year=${year}&month=${month}`;
    console.log("MONTHLY ATTENDANCE URL:", url);

    

    const response = await fetch(url,{
        method:'GET',
        headers:{
            Authorization:`Bearer ${accessToken}`,
            "Content-Type":'application/json',
        },
    })

    if(!response.ok){
        const errorData = await response.text();
        console.error("Monthly Attendance Error: ", errorData);
        throw new Error(`Monthly Attendance Error: ${response.status}`);
    }

    return await response.json();
};