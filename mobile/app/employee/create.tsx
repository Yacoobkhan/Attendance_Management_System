import { useAuth } from "@/context/AuthContext";
import { createEmployees } from "@/api/employee";
import { getTeams, getLocations, getReportingManagers,} from "@/api/masterData";

import {Team,Location,ReportingManager} from "@/types/masterData";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {View,Text,TextInput, Pressable,   ScrollView,StyleSheet,ActivityIndicator, Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function CreateEmployee() {

    const { accessToken } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Master data
    const [teams, setTeams] = useState<Team[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [reportingManagers, setReportingManagers] = useState<ReportingManager[]>([]);

    // Employee form
    const [employeeName, setEmployeeName] = useState("");
    const [dob, setDob] = useState("");
    const [role, setRole] = useState("");
    const [team, setTeam] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [employeeType, setEmployeeType] = useState("");
    const [reportingPerson, setReportingPerson] = useState("");
    const [isActive, setIsActive] = useState<boolean>(true);


    // Fetch master data
    useEffect(() => {

        const fetchMasterData = async () => {

            if (!accessToken) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const [teamData,locationData,reportingData,] = await Promise.all([
                    getTeams(accessToken),
                    getLocations(accessToken),
                    getReportingManagers(accessToken),
                ]);

                setTeams(teamData);
                setLocations(locationData);
                setReportingManagers(reportingData);

            } catch (error) {

                console.error("MASTER DATA ERROR:",error);

                setError("Failed to load form data.");

            } finally {

                setLoading(false);
            }
        };

        fetchMasterData();

    }, [accessToken]);


    // Create employee
    const handleCreateEmployee = async () => {

        if (!accessToken) {
            return;
        }

        if ( !employeeName || !dob || !role || !team || !location || !phone || !mail || !joiningDate || !employeeType || !reportingPerson) {
            Alert.alert(
                "Validation",
                "Please fill all required fields."
            );

            return;
        }

        try {

            setSaving(true);

            const employeeData = {
                employee_name: employeeName,
                dob: dob,
                role: role,
                team: Number(team),
                location: Number(location),
                phone: phone,
                mail: mail,
                joining_date: joiningDate,
                employee_type: employeeType,
                reporting_person: Number(reportingPerson),
                reporting_person_name:reportingPerson,
                is_active: isActive,
            };

            await createEmployees(accessToken,employeeData);

            Alert.alert(
                "Success",
                "Employee created successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/employees");
                        },
                    },
                ]
            );

        } catch (error) {

            console.error(
                "CREATE EMPLOYEE ERROR:",
                error
            );

            Alert.alert(
                "Error",
                "Failed to create employee."
            );

        } finally {

            setSaving(false);
        }
    };


    // Loading
    if (loading) {

        return (
            <SafeAreaView style={styles.center}>

                <ActivityIndicator size="large" />

                <Text>
                    Loading form...
                </Text>

            </SafeAreaView>
        );
    }


    // Error
    if (error) {

        return (
            <SafeAreaView style={styles.center}>

                <Text style={styles.error}>
                    {error}
                </Text>

            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>

                {/* Back */}

                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        ← Back
                    </Text>
                </Pressable>


                <Text style={styles.title}>
                    Create Employee
                </Text>


                {/* Employee ID */}

                {/* <Text style={styles.label}>
                    Employee ID
                </Text>

                <TextInput
                    style={styles.input}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="Enter employee ID"
                    keyboardType="numeric"
                /> */}


                {/* Employee Name */}

                <Text style={styles.label}>
                    Employee Name
                </Text>

                <TextInput
                    style={styles.input}
                    value={employeeName}
                    onChangeText={setEmployeeName}
                    placeholder="Enter employee name"
                />


                {/* DOB */}

                <Text style={styles.label}>
                    Date of Birth
                </Text>

                <TextInput
                    style={styles.input}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="YYYY-MM-DD"
                />


                {/* Role */}

                <Text style={styles.label}>
                    Role
                </Text>

                <TextInput
                    style={styles.input}
                    value={role}
                    onChangeText={setRole}
                    placeholder="Enter role"
                />


                {/* Team */}

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


                {/* Location */}

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


                {/* Phone */}

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


                {/* Email */}

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


                {/* Joining Date */}

                <Text style={styles.label}>
                    Joining Date
                </Text>

                <TextInput
                    style={styles.input}
                    value={joiningDate}
                    onChangeText={setJoiningDate}
                    placeholder="YYYY-MM-DD"
                />


                {/* Employee Type */}

                <Text style={styles.label}>
                    Employee Type
                </Text>

                <View style={styles.pickerContainer}>

                    <Picker
                        selectedValue={employeeType}
                        onValueChange={(value) => setEmployeeType(value)}
                    >
                        <Picker.Item label="Select Employee Type" value="" />
                        <Picker.Item label="Employee" value="EMPLOYEE" />
                        <Picker.Item label="Intern" value="INTERN" />
                    </Picker>
                </View>


                {/* Reporting Person */}

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


                {/* Active */}

                <Text style={styles.label}>
                    Status
                </Text>

                <View style={styles.pickerContainer}>

                    <Picker
                        selectedValue={isActive}
                        onValueChange={(value) => setIsActive(value)}
                    >
                        <Picker.Item label="Select Status" value="" />
                        <Picker.Item label="Active" value={true} />
                        <Picker.Item label="Inactive" value={false} />
                    </Picker>
                </View>

                

                {/* Create */}

                <Pressable
                    style={styles.saveButton}
                    onPress={handleCreateEmployee}
                    disabled={saving}
                >

                    {saving ? (

                        <ActivityIndicator
                            color="#ffffff"
                        />

                    ) : (

                        <Text style={styles.saveText}>
                            Create Employee
                        </Text>

                    )}

                </Pressable>

            </ScrollView>

        </SafeAreaView>
    );
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

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 24,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#334155",
    },

    input: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
        fontSize: 16,
    },

    pickerContainer: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 10,
        marginBottom: 16,
        overflow: "hidden",
    },

    activeButton: {
        backgroundColor: "#e2e8f0",
        padding: 14,
        borderRadius: 10,
        marginBottom: 20,
    },

    saveButton: {
        backgroundColor: "#2563eb",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 30,
    },

    saveText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
});