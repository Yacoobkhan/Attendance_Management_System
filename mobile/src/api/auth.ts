import API_BASE_URL from "./api";

export const loginUser = async(username:string,password:string) =>{
    const url = `${API_BASE_URL}/login/`;

    console.log("LOGIN URL: ", url)

    const response = await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            password,
        }),
    });

    if(!response.ok){
        throw new Error(`Login Failed: ${response.status}`);
    }

    return await response.json();
}