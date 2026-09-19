import React, { useState } from "react";
import api from '../services/api'
import {useNavigate} from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()

    const [username,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    const handleLogin = async(event) =>{
        event.preventDefault()

        setError("")
        setLoading(true)

        try{
            const response = await api.post('/login/',{
                    username,
                    password,
            })

            localStorage.setItem('access_token',response.data.access)
            localStorage.setItem('refresh_token',response.data.refresh)


            navigate('/')

        }catch(error){
            console.error("Failed to Login: ", error)
            setError("Invalid username or password.")

        }finally{
            setLoading(false)
        }
    }
    
    return(

    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4"> 

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

            <div className="mb-8 text-center">
                 
                 <h1 className="text-2xl font-bold text-slate-800">Employee Attendance</h1>

                 <p className="mt-2 text-sm text-slate-500">Login to your account</p>

            </div>

            <form onSubmit={handleLogin}   className="space-y-5">

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>

                    <input type='text' value={username} onChange={(event) => setUserName(event.target.value)} placeholder='Enter Your Name' className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" required/>

                </div>

                <div>

                    <label>Password</label>


                    <input type='password' value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" placeholder='Enter Your Password' required/>

                </div>

                {error && (
                    <p className='text-sm text-red-600'>error</p>
                )}

                <button type='submit' disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Logging in...." : "Login"}</button>

            </form>

        </div>

    </div>

    )

}


export default Login;