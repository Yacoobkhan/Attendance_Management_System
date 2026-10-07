import { useEffect } from "react"
import { loginUser } from "@/api/auth"
import { Redirect } from "expo-router"
import { useAuth } from "@/context/AuthContext"

export default function App(){

    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return <Redirect href='/daily-attendance' />
    }

    return <Redirect href='/login' />
 
}