import API_BASE_URL from "./api";

export const getEmployees = async () => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if(!response.ok){
        throw new Error(`HTTP ERROR: ${response.status}`);
    }

    const data = await response.json();
    return data;

}