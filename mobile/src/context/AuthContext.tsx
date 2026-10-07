import { loginUser } from "@/api/auth";
import { saveTokens, getAccessToken, removeToken } from "@/utils/tokenStorage";
import { Children, createContext, useState,useEffect, useContext } from "react";



type AuthContextType = {
    isAuthenticated:boolean,
    accessToken: string | null,
    login: (username: string, password:string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({
    children,
}:{
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken,setAccessToken] = useState<string | null>(null);


    useEffect(() => {
        checkAuthentication();
    },[]);  

    const checkAuthentication = async() => {
        const token = await getAccessToken();

        if(token){
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }

    const login = async(
        username:string,
        password:string,
    ) => {
        const data = await loginUser(username,password);

        await saveTokens(data.access,data.refresh)

        setAccessToken(data.access)
        setIsAuthenticated(true)
    };

    const logout = async() =>{
        await removeToken();

        setAccessToken(null);
        setIsAuthenticated(false);

    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                accessToken,
                login,
                logout,
            }}>

                {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error(
            "UseAuth must be used inside AuthProvider"
        );
    }

    return context;
};