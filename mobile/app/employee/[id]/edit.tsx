import { StyleSheet, Text, View , Alert} from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types/employee';
import { useState } from 'react';
import { Location, ReportingManager, Team } from '@/types/masterData';
import { getEmployee, updateEmployees } from '@/api/employee';
import { getLocations, getReportingManagers, getTeams } from '@/api/masterData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Pressable,ScrollView, TextInput, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function EditEmployee() {

    const {id} = useLocalSearchParams<{id:string}>();
    const {accessToken} = useAuth();
    const router = useRouter();

    const [employee,setEmployee] = useState<Employee | null>(null)
    const [teams,setTeams] = useState<Team[]>([]);
    const [locations,setLocations] = useState<Location[]>([])
    const [reportingManagers, setReportingManagers] = useState<ReportingManager[]>([]);

    const [employeeName,setEmployeeName] = useState("");
     const [dob, setDob] = useState("");
    const [role, setRole] = useState("");
    const [team, setTeam] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [employeeType, setEmployeeType] = useState("");
    const [reportingPerson, setReportingPerson] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [loading,setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error,setError] = useState("");

    useEffect(() => {
        const fetchData = async() => {
            if(!accessToken || !id){
                return;
            }

            try{
                setLoading(true);

                setError("");

                const [ employeeData, TeamData, LocationData, ReportingManagerData] = await Promise.all([
                    getEmployee(accessToken,Number(id)),
                    getTeams(accessToken),
                    getLocations(accessToken),
                    getReportingManagers(accessToken),
                ])

                setEmployee(employeeData);
                setTeams(TeamData);
                setLocations(LocationData);
                setReportingManagers(ReportingManagerData);

                setEmployeeName(employeeData.employee_name ?? "");
                setDob(employeeData.dob ?? "");
                setRole(employeeData.role ?? "");

                setTeam(
                    employeeData.team?.toString() ?? ""
                );

                setLocation(
                    employeeData.location?.toString() ?? ""
                );

                setPhone(
                    employeeData.phone ?? ""
                );

                setMail(
                    employeeData.mail ?? ""
                );

                setJoiningDate(
                    employeeData.joining_date ?? ""
                );

                setEmployeeType(
                    employeeData.employee_type ?? ""
                );

                setReportingPerson(
                    employeeData.reporting_person?.toString() ?? ""
                );

                setIsActive(
                    employeeData.is_active
                );
            }catch(error){
                console.error("Failed to load employees: ",error);

                setError("Failed to load employee data");
            }finally{
                setLoading(false);
            }
        }
        fetchData();

    },[accessToken,id]);

    const handleUpdate = async() =>{
        if(!accessToken || !id){
            return;
        }

        if (
            !employeeName ||
            !dob ||
            !role ||
            !team ||
            !location ||
            !phone ||
            !mail ||
            !joiningDate ||
            !employeeType ||
            !reportingPerson
        ) {
            Alert.alert(
                "Validation Error",
                "Please fill all required fields."
            );

            return;
        }

        try{
            const employeeData = {
                employee_name: employeeName,
                dob:dob,
                role:role,
                team:Number(team),
                location:Number(location),
                phone:phone,
                mail:mail,
                joining_date: joiningDate,
                employee_type: employeeType,
                reporting_person: Number(reportingPerson),
                is_active:isActive,
            };

            console.log("Update Employee Data: ",employeeData);
            await updateEmployees(accessToken,Number(id),employeeData);

            Alert.alert("success","Employee Updated Successfully",[
                {
                    text:"ok",
                    onPress:() => {
                        router.replace(`/employee/${id}`);
                    }
                }
            ])
        }catch(error){
             console.error(
                "UPDATE EMPLOYEE ERROR:",
                error
            );

            Alert.alert(
                "Update Failed",
                "Failed to update employee."
            );
        }finally{
            setSaving(false);
        }

    }

      if (loading) {

        return (
            <SafeAreaView style={styles.container}>

                <View style={styles.loadingContainer}>

                    <ActivityIndicator
                        size="large"
                    />

                    <Text style={styles.loadingText}>
                        Loading employee...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }

     if (error) {

        return (
            <SafeAreaView style={styles.container}>

                <View style={styles.errorContainer}>

                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>
                            Go Back
                        </Text>
                    </Pressable>

                </View>

            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >

                {/* Header */}

                <View style={styles.header}>

                    <Pressable
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backText}>
                            ← Back
                        </Text>
                    </Pressable>

                    <Text style={styles.title}>
                        Edit Employee
                    </Text>

                    <Text style={styles.subtitle}>
                        Update employee information
                    </Text>

                </View>


                {/* Employee Name */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Employee Name
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={employeeName}
                        onChangeText={setEmployeeName}
                        placeholder="Enter employee name"
                    />

                </View>


                {/* DOB */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Date of Birth
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={dob}
                        onChangeText={setDob}
                        placeholder="YYYY-MM-DD"
                    />

                </View>


                {/* Role */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Role
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={role}
                        onChangeText={setRole}
                        placeholder="Enter role"
                    />

                </View>


                {/* Team */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Team
                    </Text>

                    <View style={styles.pickerContainer}>

                        <Picker
                            selectedValue={team}
                            onValueChange={(value) =>
                                setTeam(value)
                            }
                        >

                            <Picker.Item
                                label="Select Team"
                                value=""
                            />

                            {teams.map((item) => (

                                <Picker.Item
                                    key={item.id}
                                    label={item.name}
                                    value={item.id.toString()}
                                />

                            ))}

                        </Picker>

                    </View>

                </View>


                {/* Location */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Location
                    </Text>

                    <View style={styles.pickerContainer}>

                        <Picker
                            selectedValue={location}
                            onValueChange={(value) =>
                                setLocation(value)
                            }
                        >

                            <Picker.Item
                                label="Select Location"
                                value=""
                            />

                            {locations.map((item) => (

                                <Picker.Item
                                    key={item.id}
                                    label={item.name}
                                    value={item.id.toString()}
                                />

                            ))}

                        </Picker>

                    </View>

                </View>


                {/* Phone */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Phone
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                </View>


                {/* Email */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Email
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={mail}
                        onChangeText={setMail}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                </View>


                {/* Joining Date */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Joining Date
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={joiningDate}
                        onChangeText={setJoiningDate}
                        placeholder="YYYY-MM-DD"
                    />

                </View>


                {/* Employee Type */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Employee Type
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={employeeType}
                        onChangeText={setEmployeeType}
                        placeholder="Enter employee type"
                    />

                </View>


                {/* Reporting Person */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Reporting Person
                    </Text>

                    <View style={styles.pickerContainer}>

                        <Picker
                            selectedValue={reportingPerson}
                            onValueChange={(value) =>
                                setReportingPerson(value)
                            }
                        >

                            <Picker.Item
                                label="Select Reporting Person"
                                value=""
                            />

                            {reportingManagers.map((item) => (

                                <Picker.Item
                                    key={item.id}
                                    label={item.name}
                                    value={item.id.toString()}
                                />

                            ))}

                        </Picker>

                    </View>

                </View>


                {/* Active Status */}

                <View style={styles.switchContainer}>

                    <View>

                        <Text style={styles.label}>
                            Active Employee
                        </Text>

                        <Text style={styles.switchDescription}>
                            Enable or disable this employee
                        </Text>

                    </View>

                    <Switch
                        value={isActive}
                        onValueChange={setIsActive}
                    />

                </View>


                {/* Update Button */}

                <Pressable
                    style={[
                        styles.updateButton,
                        saving && styles.disabledButton,
                    ]}
                    onPress={handleUpdate}
                    disabled={saving}
                >

                    {saving ? (

                        <ActivityIndicator
                            color="#ffffff"
                        />

                    ) : (

                        <Text style={styles.updateButtonText}>
                            Update Employee
                        </Text>

                    )}

                </Pressable>


                {/* Cancel Button */}

                <Pressable
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={saving}
                >

                    <Text style={styles.cancelButtonText}>
                        Cancel
                    </Text>

                </Pressable>

            </ScrollView>

        </SafeAreaView>
    );
}


// --------------------------------------------------
// Styles
// --------------------------------------------------

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#64748b",
    },

    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    errorText: {
        fontSize: 16,
        color: "#dc2626",
        marginBottom: 20,
        textAlign: "center",
    },

    header: {
        marginBottom: 25,
    },

    backText: {
        fontSize: 16,
        color: "#2563eb",
        marginBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0f172a",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 14,
        color: "#64748b",
    },

    fieldContainer: {
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 7,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        paddingHorizontal: 14,
        backgroundColor: "#ffffff",
        fontSize: 15,
        color: "#0f172a",
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        backgroundColor: "#ffffff",
        overflow: "hidden",
    },

    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 25,
    },

    switchDescription: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 3,
    },

    updateButton: {
        height: 50,
        borderRadius: 8,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },

    disabledButton: {
        opacity: 0.6,
    },

    updateButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

    cancelButton: {
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        backgroundColor: "#ffffff",
    },

    cancelButtonText: {
        color: "#334155",
        fontSize: 16,
        fontWeight: "600",
    },

    backButton: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },

    backButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },

});

