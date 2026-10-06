import { getEmployees } from "@/api/employee";
import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";

export default function Index() {

  useEffect(() =>{
    const fetchEmployees = async() =>{
      try{
        const data = await getEmployees();
        console.log("Employee Data: ",data);
      }catch(error){
        console.error("API Error: ",error)
      }
    }
    fetchEmployees();
  },[]);

  return (
    <View style={styles.container}>
      <Text>Employee Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
