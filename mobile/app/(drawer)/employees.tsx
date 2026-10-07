import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/api/employee";
import { View, Text, ActivityIndicator,StyleSheet,FlatList,Pressable } from "react-native";

import { getTeams,getLocations,getReportingManagers } from "@/api/masterData";
import { Team,Location,ReportingManager } from "@/types/masterData";
import { router } from "expo-router";



export default function Employees(){

    const {accessToken} = useAuth();
    
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    const [teams,setTeams] = useState<Team[]>([]);

    const [locations,setLocations] = useState<Location[]>([])

    const [reportingManagers, setReportingManagers] = useState<ReportingManager[]>([])

    useEffect(() =>{
        const fetchData = async() =>{
            if(!accessToken){
                return;
            }

            try{
                setLoading(true);
                setError("");

                const [employeeData, teamData, locationData,reportingData,] = await Promise.all([
                    getEmployees(accessToken),
                    getTeams(accessToken),
                    getLocations(accessToken),
                    getReportingManagers(accessToken),
                ]);

                
                setEmployees(employeeData);
                setTeams(teamData);
                setLocations(locationData);
                setReportingManagers(reportingData);

            }catch(error){
                console.error("Fetch Employee Error: ",error)

                setError("Failed to load Employees.")

            }finally{
                setLoading(false);
            }
        }

        fetchData();
    },[accessToken]);

    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading employees....</Text>
            </View>
        )
    }

    if(error){
        return(
            <View style={styles.center}>

                <Text style={styles.errorText}>{error}</Text>

            </View>
        )
    }

    const getTeamName = (teamId: number | null) => {
        if (teamId === null) {
            return "N/A";
        }

        return (
            teams.find((team) => team.id === teamId)
                ?.name ?? "N/A"
        );
    };

    const getLocationName = (locationId: number | null) => {
        if (locationId === null) {
            return "N/A";
        }

        return (
            locations.find(
                (location) => location.id === locationId
            )?.name ?? "N/A"
        );
    };


    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>

                <View>
                    <Text style={styles.title}>
                        Employees
                    </Text>

                    <Text style={styles.subtitle}>
                        {employees.length} employees
                    </Text>
                </View>

                <Pressable
                    style={styles.addButton} onPress={() => router.push("/employee/create")}
                >
                    <Text style={styles.addButtonText}>
                        + Add
                    </Text>
                </Pressable>

            </View>


            {/* Employee List */}
            <FlatList
                data={employees}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.listContent
                }
                renderItem={({ item }) => (

                    <Pressable
                        style={styles.employeeCard} onPress={() => router.push(`/employee/${item.id}`)}
                    >

                        {/* Employee Header */}
                        <View
                            style={styles.employeeHeader}
                        >

                            <View>
                                <Text
                                    style={
                                        styles.employeeName
                                    }
                                >
                                    {item.employee_name}
                                </Text>

                                <Text
                                    style={
                                        styles.employeeId
                                    }
                                >
                                    ID: {item.employee_id}
                                </Text>
                            </View>


                            <View
                                style={[
                                    styles.statusBadge,
                                    item.is_active
                                        ? styles.activeBadge
                                        : styles.inactiveBadge,
                                ]}
                            >

                                <Text
                                    style={
                                        styles.statusText
                                    }
                                >
                                    {item.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </Text>

                            </View>

                        </View>


                        {/* Role */}
                        <Text style={styles.role}>
                            {item.role}
                        </Text>


                        {/* Employee Details */}
                        <View
                            style={styles.detailsRow}
                        >

                            <View
                                style={styles.detailItem}
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    TEAM
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {getTeamName(item.team)}
                                </Text>

                            </View>


                            <View
                                style={styles.detailItem}
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    LOCATION
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {getLocationName(item.location)}
                                </Text>

                            </View>

                        </View>


                        {/* Reporting Person */}
                        <View
                            style={styles.reportingSection}
                        >

                            <Text
                                style={styles.detailLabel}
                            >
                                REPORTING PERSON
                            </Text>

                            <Text
                                style={styles.detailValue}
                            >
                                {item.reporting_person_name ??
                                    "N/A"}
                            </Text>

                        </View>

                    </Pressable>

                )}
            />

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingHorizontal: 16,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        color: "#64748b",
    },

    errorText: {
        color: "#dc2626",
        fontSize: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 16,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#0f172a",
    },

    subtitle: {
        marginTop: 3,
        fontSize: 13,
        color: "#64748b",
    },

    addButton: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },

    addButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
    },

    listContent: {
        paddingBottom: 30,
    },

    employeeCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        elevation: 3,
    },

    employeeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    employeeName: {
        fontSize: 19,
        fontWeight: "700",
        color: "#0f172a",
    },

    employeeId: {
        marginTop: 4,
        fontSize: 13,
        color: "#64748b",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },

    activeBadge: {
        backgroundColor: "#dcfce7",
    },

    inactiveBadge: {
        backgroundColor: "#fee2e2",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#334155",
    },

    role: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: "600",
        color: "#475569",
    },

    detailsRow: {
        flexDirection: "row",
        marginTop: 16,
    },

    detailItem: {
        flex: 1,
    },

    detailLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#94a3b8",
        marginBottom: 4,
        letterSpacing: 0.5,
    },

    detailValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#334155",
    },

    reportingSection: {
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        marginTop: 14,
        paddingTop: 12,
    },

});

