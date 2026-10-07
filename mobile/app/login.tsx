import React from "react";
import {View,Text, TextInput, Alert,Button,StyleSheet} from 'react-native';
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {saveTokens} from'../src/utils/tokenStorage';
import { useRouter } from "expo-router";

export default function Login(){

    const router = useRouter();

    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {login} = useAuth();

    const handleLogin = async() =>{
        try{
           await login(username,password)
           router.replace('/daily-attendance')

           console.log("LOGIN SUCCESS");

           
        }catch(error){
            console.error("Login Failed: ",error)

            Alert.alert("Error", "Invalid Credentials")
        }
    }
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Employee Attendance</Text>

            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />

            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>

            <Button title='Login' onPress={handleLogin} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20,
    },
    text:{
        fontSize:24,
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:30,
    },
    input:{
        borderWidth:1,
        borderColor:'#ccc',
        padding:12,
        marginBottom:15,
        borderRadius:8,
    },
})