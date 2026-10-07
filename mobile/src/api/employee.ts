import API_BASE_URL from './api';

export const getEmployees = async(accessToken:string) =>{
    
        const url = `${API_BASE_URL}/employees/`

        const response = await fetch(url,{
            method:'GET',
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type": 'application/json,'
            },
        })

        if(!response.ok){
            throw new Error(`GET Employees ERROR: ${response.status}`)
        }

        return await response.json();

}

export const createEmployees = async(accessToken:string, 
            employeeData:{
                  employee_name:string,
                  dob:string,
                  role:string,
                  team:number,
                  location:number,
                  phone:string,
                  mail:string,
                  joining_date:string,
                  employee_type:string,
                  reporting_person_name:string,
                  is_active:boolean,
            },
)  => {
    const url = `${API_BASE_URL}/employees/`;

    const response = await fetch(url, {
        method:'POST',
        headers:{
            Authorization:`Bearer ${accessToken}`,
            "Content-Type":"application/json",
        },
        body: JSON.stringify(employeeData),
    })

    if (!response.ok) {
        const errorData = await response.json();

        console.error("CREATE EMPLOYEE ERROR:", errorData);

        throw new Error(
            `CREATE EMPLOYEE ERROR ${response.status}: ${JSON.stringify(errorData)}`
        );
    }

    return await response.json();
}


export const getEmployee = async(accessToken:string,employeeId:number) => {
    const url = `${API_BASE_URL}/employees/${employeeId}/detail/`

    const response = await fetch(url,{
        method:'GET',
        headers:{
            Authorization:`Bearer ${accessToken}`,
            "Content-Type":"application/json",
        },
    })

    if(!response.ok){
        throw new Error(`Employee Get By ID ERROR:  ${response.status}`)
    }

    return await response.json();
}



export const updateEmployees = async(accessToken:string,employeeId:number,
    employeeData:{
        employee_name: string;
        dob: string;
        role: string;
        team: number;
        location: number;
        phone: string;
        mail: string;
        joining_date: string;
        employee_type: string;
        is_active: boolean;
    },
) => {
    const url = `${API_BASE_URL}/employees/${employeeId}/update/`

    const response = await fetch(url,{
        method:'PUT',
        headers:{
            Authorization:`Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData)
    })

    if(!response.ok){

        const errorData = await response.text()

        console.error("Update Employee Error: ",errorData);

        throw new Error(`Update Employee Error: ${response.status}`)
    }

    return await response.json();
}


export const deleteEmployee = async(accessToken:string, employeeId:number) => {
        const url = `${API_BASE_URL}/employees/${employeeId}/destroy/`

        const response = await fetch(url,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
            },
        })

        if(!response.ok){
            const errorData = await response.text();
            
            console.error("Delete Employee Error: ", errorData);

            throw new Error(`DELETE EMPLOYEE ERROR ${response.status}: ${errorData}`)
        }

        return true;
}