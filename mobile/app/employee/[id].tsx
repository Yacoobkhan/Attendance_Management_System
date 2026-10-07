import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Employee } from "@/types/employee";
import { useEffect, useState } from "react";
import { getEmployee } from "@/api/employee";
import { View,Text,ActivityIndicator, ScrollView , StyleSheet, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function EmployeeDetail(){
    const {id} = useLocalSearchParams<{id:string}>();

    const {accessToken} = useAuth();

    const router = useRouter();

    const [employee,setEmployee] = useState<Employee | null>();

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async() => {
            if(!accessToken){
                return;
            }

            try{

                setLoading(true);
                setError("");

                const data = await getEmployee(accessToken,Number(id));

                setEmployee(data);

            }catch(error){
                console.error("Failed to fetch a employee: ",error);

                setError("Failed to load employee");
            }finally{
                setLoading(false);
            }


        }

        fetchEmployee();
    },[accessToken,id])


    if(loading){
        return(
            <View>
                <ActivityIndicator size='large'/>
                <Text>Loading Employee..</Text>
            </View>
        )
    }


    if(error){
        return(
            <View>
                <Text>{error}</Text>
            </View>
        )
    }

    if(!employee){
        return(
            <View>
                <Text> No Employees Found </Text>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
        <ScrollView>

            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>

            <View style={styles.card}>

                  <Text style={styles.name}>
                    {employee.employee_name}
                </Text>

                <Text style={styles.id}>
                    Employee ID: {employee.employee_id}
                </Text>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Role
                    </Text>

                    <Text style={styles.value}>
                        {employee.role}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Phone
                    </Text>

                    <Text style={styles.value}>
                        {employee.phone}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Email
                    </Text>

                    <Text style={styles.value}>
                        {employee.mail}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Date of Birth
                    </Text>

                    <Text style={styles.value}>
                        {employee.dob}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Joining Date
                    </Text>

                    <Text style={styles.value}>
                        {employee.joining_date}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Employee Type
                    </Text>

                    <Text style={styles.value}>
                        {employee.employee_type}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Reporting Person
                    </Text>

                    <Text style={styles.value}>
                        {employee.reporting_person_name ?? "N/A"}
                    </Text>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>
                        Status
                    </Text>

                    <Text style={styles.value}>
                        {employee.is_active
                            ? "Active"
                            : "Inactive"}
                    </Text>
                </View>


            </View>


        </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 16,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    error: {
        color: "red",
    },

    backButton: {
        marginBottom: 16,
    },

    backText: {
        fontSize: 16,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        elevation: 3,
    },

    name: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },

    id: {
        color: "#64748b",
        marginBottom: 20,
    },

    row: {
        marginBottom: 16,
    },

    label: {
        fontSize: 13,
        color: "#64748b",
        marginBottom: 4,
    },

    value: {
        fontSize: 16,
        fontWeight: "500",
    },
})

