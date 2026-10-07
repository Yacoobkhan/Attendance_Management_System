import API_BASE_URL from "./api";


// GET TEAMS
export const getTeams = async (
    accessToken: string
) => {
    const response = await fetch(
        `${API_BASE_URL}/employees/teams/`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `GET TEAMS ERROR: ${response.status}`
        );
    }

    return await response.json();
};


// GET LOCATIONS
export const getLocations = async (
    accessToken: string
) => {
    const response = await fetch(
        `${API_BASE_URL}/employees/locations/`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `GET LOCATIONS ERROR: ${response.status}`
        );
    }

    return await response.json();
};


// GET REPORTING MANAGERS
export const getReportingManagers = async (
    accessToken: string
) => {
    const response = await fetch(
        `${API_BASE_URL}/employees/reporting/`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `GET REPORTING MANAGERS ERROR: ${response.status}`
        );
    }

    return await response.json();
};