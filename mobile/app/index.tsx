import { useEffect } from "react"
import { loginUser } from "@/api/auth"

export default function App(){

  useEffect(() => {
    const testLogin = async() =>{

      try{
        const data = await loginUser("admin","12345")

        console.log("LOGIN SUCCESS: ",data)

      }catch(error){
        console.error("Login Error: ",error)
      }

      testLogin();

    }
  },[])

  return null;
 
}