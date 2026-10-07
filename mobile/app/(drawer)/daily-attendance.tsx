import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,FlatList,ActivityIndicator,TouchableOpacity} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../../src/context/AuthContext";
import { getDailyAttendance } from "../../src/api/attendance";
import { DailyAttendance } from "../../src/types/attendance";

export default function DailyAttendanceScreen() {

    const { accessToken } = useAuth();

    const [attendance, setAttendance] = useState<DailyAttendance[]>([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);


    // --------------------------------
    // FORMAT DATE FOR API
    // --------------------------------

    const formatDateForAPI = (date: Date) => {

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // --------------------------------
    // FORMAT DATE FOR DISPLAY
    // --------------------------------

    const formatDateForDisplay = (date: Date) => {

        const day = String(date.getDate()).padStart(2, "0");

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };


    // --------------------------------
    // FETCH ATTENDANCE
    // --------------------------------

    useEffect(() => {

        if (!accessToken) {
            return;
        }

        const fetchAttendance = async () => {

            try {

                setLoading(true);
                setError(null);

                const apiDate = formatDateForAPI(selectedDate);

                console.log("SELECTED DATE:",apiDate);

                const data = await getDailyAttendance(accessToken,apiDate);

                console.log("DAILY ATTENDANCE:",data);

                setAttendance(data);

            } catch (error) {

                console.error("DAILY ATTENDANCE ERROR:",error);

                setError("Failed to load attendance");

            } finally {

                setLoading(false);

            }
        };

        fetchAttendance();

    }, [accessToken, selectedDate]);


    // --------------------------------
    // DATE CHANGE
    // --------------------------------

    const handleDateChange = (event: any,date?: Date) => {

        setShowDatePicker(false);

        if (date) {
            setSelectedDate(date);
        }
    };


    // --------------------------------
    // SUMMARY COUNTS
    // --------------------------------

    const totalEmployees = attendance.length;

    const presentCount = attendance.filter( item => item.status === "Present").length;

    const wfhCount = attendance.filter( item => item.status === "Work From Home").length;

    const sickLeaveCount = attendance.filter( item => item.status === "Sick Leave" ).length;

    const casualLeaveCount = attendance.filter( item => item.status === "Casual Leave").length;

    const halfSickLeaveCount = attendance.filter(item => item.status === "Half Sick Leave").length;

    const halfCasualLeaveCount = attendance.filter(item => item.status === "Half Casual Leave").length;

    const notMarkedCount = attendance.filter(item => item.status === "Not Marked").length;

    const notApplicableCount = attendance.filter( item => item.status === "Not Applicable").length;

    const paidHolidayCount = attendance.filter( item => item.status === "Paid Holiday").length;


    // --------------------------------
    // LOADING
    // --------------------------------

    if (loading) {

        return (
            <View style={styles.center}>

                <ActivityIndicator size="large"/>

                <Text style={styles.loadingText}>
                    Loading attendance...
                </Text>

            </View>
        );
    }


    // --------------------------------
    // ERROR
    // --------------------------------

    if (error) {

        return (
            <View style={styles.center}>

                <Text style={styles.error}>
                    {error}
                </Text>

            </View>
        );
    }


    return (

        <View style={styles.container}>

            <FlatList data={attendance} keyExtractor={(item) =>
                    item.employee_id.toString()
                }

                showsVerticalScrollIndicator={false}

                contentContainerStyle={styles.listContent}


                // --------------------------------
                // HEADER
                // --------------------------------

                ListHeaderComponent={
                <View>
                    <Text style={styles.title}>
                        Daily Attendance Report
                    </Text>


                        {/* DATE SELECTOR */}

                    <Text style={styles.dateLabel}>
                        Attendance Date
                    </Text>

                    <TouchableOpacity style={styles.dateButton}
                            onPress={() =>
                                setShowDatePicker(true)
                            }
                    >
                            <Text
                                style={styles.dateButtonText}
                            >
                                {formatDateForDisplay(selectedDate)}
                            </Text>

                            <Text style={styles.calendarIcon}>
                                📅
                            </Text>

                        </TouchableOpacity>


                        {/* DATE PICKER */}

                        {showDatePicker && (
                            <DateTimePicker value={selectedDate} mode="date"
                                display="default"
                                onChange={
                                    handleDateChange
                                }
                            />

                        )}

                        {/* SUMMARY */}
                        <View style={styles.summaryGrid}>

                            <SummaryCard title="Total Employees" value={totalEmployees} type="total"/>

                            <SummaryCard title="Present" value={presentCount} type="present"/>

                            <SummaryCard
                                title="Work From Home"
                                value={wfhCount}
                                type="wfh"
                            />

                            <SummaryCard
                                title="Sick Leave"
                                value={sickLeaveCount}
                                type="sick"
                            />

                            <SummaryCard
                                title="Casual Leave"
                                value={casualLeaveCount}
                                type="casual"
                            />

                            <SummaryCard
                                title="Half Sick Leave"
                                value={
                                    halfSickLeaveCount
                                }
                                type="halfSick"
                            />

                            <SummaryCard
                                title="Half Casual Leave"
                                value={
                                    halfCasualLeaveCount
                                }
                                type="halfCasual"
                            />

                            <SummaryCard
                                title="Not Marked"
                                value={
                                    notMarkedCount
                                }
                                type="notMarked"
                            />

                            <SummaryCard
                                title="Not Applicable"
                                value={
                                    notApplicableCount
                                }
                                type="notApplicable"
                            />

                            <SummaryCard
                                title="Paid Holiday"
                                value={
                                    paidHolidayCount
                                }
                                type="holiday"
                            />

                        </View>


                        {/* EMPLOYEE SECTION */}

                        <Text
                            style={styles.sectionTitle}
                        >
                            Employee Attendance
                        </Text>

                    </View>
                }


                // --------------------------------
                // EMPLOYEE CARD
                // --------------------------------

                renderItem={({ item }) => (

                    <View
                        style={styles.employeeCard}
                    >

                        <Text style={styles.employeeName}>
                            {item.employee_name}
                        </Text>

                        <Text style={styles.info}>
                            Employee ID:{" "}
                            {item.employee_id}
                        </Text>

                        <Text style={styles.info}>
                            Team:{" "}
                            {item.team ?? "N/A"}
                        </Text>

                        <Text style={styles.info}>
                            Location:{" "}
                            {item.location ?? "N/A"}
                        </Text>

                        <Text style={styles.info}>
                            Reporting Person:{" "}
                            {item.reporting_person ??
                                "N/A"}
                        </Text>

                        <Text style={styles.info}>
                            Status:{" "}
                            {item.status}
                        </Text>

                        <Text style={styles.info}>
                            Remarks:{" "}
                            {item.remarks}
                        </Text>

                    </View>
                )}

            />

        </View>
    );
}


// =====================================
// SUMMARY CARD
// =====================================

type SummaryCardProps = {
    title: string;
    value: number;
    type: "total"
        | "present"
        | "wfh"
        | "sick"
        | "casual"
        | "halfSick"
        | "halfCasual"
        | "notMarked"
        | "notApplicable"
        | "holiday";
};


function SummaryCard({
    title,
    value,
    type,
}: SummaryCardProps) {

    return (

        <View
            style={[
                styles.summaryCard,
                styles[`card_${type}`],
            ]}
        >

            <Text style={styles.cardTitle}>
                {title}
            </Text>

            <Text
                style={[
                    styles.cardValue,
                    styles[`value_${type}`],
                ]}
            >
                {value}
            </Text>

        </View>
    );
}


// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    listContent: {
        padding: 16,
        paddingBottom: 30,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },

    error: {
        fontSize: 16,
        color: "#dc2626",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18,
    },

    // DATE

    dateLabel: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 6,
    },

    dateButton: {
        height: 48,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        marginBottom: 20,
    },

    dateButtonText: {
        fontSize: 16,
        color: "#1e293b",
    },

    calendarIcon: {
        fontSize: 20,
    },


    // SUMMARY

    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    summaryCard: {
        width: "48%",
        minHeight: 90,
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        backgroundColor: "#ffffff",
    },

    cardTitle: {
        fontSize: 13,
        color: "#64748b",
        marginBottom: 8,
    },

    cardValue: {
        fontSize: 26,
        fontWeight: "bold",
    },


    // CARD TYPES

    card_total: {
        borderColor: "#cbd5e1",
    },

    card_present: {
        borderColor: "#86efac",
        backgroundColor: "#f0fdf4",
    },

    card_wfh: {
        borderColor: "#93c5fd",
        backgroundColor: "#eff6ff",
    },

    card_sick: {
        borderColor: "#fca5a5",
        backgroundColor: "#fef2f2",
    },

    card_casual: {
        borderColor: "#fde68a",
        backgroundColor: "#fefce8",
    },

    card_halfSick: {
        borderColor: "#fdba74",
        backgroundColor: "#fff7ed",
    },

    card_halfCasual: {
        borderColor: "#fde68a",
        backgroundColor: "#fefce8",
    },

    card_notMarked: {
        borderColor: "#cbd5e1",
        backgroundColor: "#f8fafc",
    },

    card_notApplicable: {
        borderColor: "#cbd5e1",
        backgroundColor: "#f1f5f9",
    },

    card_holiday: {
        borderColor: "#d8b4fe",
        backgroundColor: "#faf5ff",
    },


    // VALUES

    value_total: {
        color: "#334155",
    },

    value_present: {
        color: "#16a34a",
    },

    value_wfh: {
        color: "#2563eb",
    },

    value_sick: {
        color: "#dc2626",
    },

    value_casual: {
        color: "#ca8a04",
    },

    value_halfSick: {
        color: "#ea580c",
    },

    value_halfCasual: {
        color: "#ca8a04",
    },

    value_notMarked: {
        color: "#334155",
    },

    value_notApplicable: {
        color: "#475569",
    },

    value_holiday: {
        color: "#9333ea",
    },


    // EMPLOYEE

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 12,
    },

    employeeCard: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },

    employeeName: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
    },

    info: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 5,
    },

});