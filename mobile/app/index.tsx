import { useEffect } from "react"
import { loginUser } from "@/api/auth"
import { Redirect } from "expo-router"

export default function App(){

    return <Redirect href='/login' />
 
}