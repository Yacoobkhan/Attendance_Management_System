import API_BASE_URL from "./api";

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