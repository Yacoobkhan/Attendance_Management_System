import React, { useEffect, useState } from "react";

import {View,Text,StyleSheet,FlatList, ActivityIndicator,TouchableOpacity,ScrollView,} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { getMonthlyAttendance } from "@/api/attendance";

import { MonthlyAttendance,MonthlyDayAttendance} from "@/types/attendance";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function MonthlyAttendanceScreen() {

    const { accessToken } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showDatePicker, setShowDatePicker] =
        useState(false);

    const [attendance, setAttendance] = useState<MonthlyAttendance[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const year = selectedDate.getFullYear();

    const month = selectedDate.getMonth() + 1;

    const formatMonthForDisplay = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "long",  year: "numeric",
        });
    };

    const handleDateChange = (
        event: any,
        date?: Date
    ) => {

        setShowDatePicker(false);

        if (date) {
            setSelectedDate(date);
        }

    };

    useFocusEffect(
        useCallback(() => {

        if (!accessToken) {
            return;
        }

        const fetchMonthlyAttendance = async () => {

            try {

                setLoading(true);

                setError(null);


                console.log("MONTHLY REPORT:", year, month);


                const data =  await getMonthlyAttendance( accessToken, year, month);


                console.log("MONTHLY ATTENDANCE:", JSON.stringify( data, null, 2));


                setAttendance(data);


            } catch (error) {

                console.error(
                    "MONTHLY ATTENDANCE ERROR:",
                    error
                );


                setError(
                    "Failed to load monthly attendance."
                );


            } finally {

                setLoading(false);

            }

        };

        fetchMonthlyAttendance();

    }, [accessToken, year,month])
)


    const daysInMonth = new Date(year, month, 0).getDate();


    const days = Array.from( { length: daysInMonth }, (_, index) => index + 1);


    // --------------------------------
    // GET ATTENDANCE FOR DAY
    // --------------------------------

    const getAttendanceForDay = (item: MonthlyAttendance,day: number): MonthlyDayAttendance => {

        return item.attendance[String(day)] ?? "";

    };


    // --------------------------------
    // STATUS LABEL
    // --------------------------------

    const getStatusLabel = (status?: string) => {

        switch (status) {

            case "X":
                return "P";

            case "WFH":
                return "WFH";

            case "SL":
                return "SL";

            case "CL":
                return "CL";

            case "L":
                return "L";

            case "NA":
                return "NA";

            case "0.5SL":
                return "0.5SL";

            case "0.5CL":
                return "0.5CL";

            case "Not Marked":
            case "":
            case undefined:
                return "-";

            default:
                return "-";
        }
    };

    // --------------------------------
    // STATUS STYLE
    // --------------------------------

    const getStatusStyle = (status?: string) => {

    switch (status) {

        case "X":
            return styles.present;

        case "WFH":
            return styles.wfh;

        case "SL":
            return styles.sickLeave;

        case "CL":
            return styles.casualLeave;

        case "L":
            return styles.paidHoliday;

        case "NA":
            return styles.notApplicable;

        case "0.5SL":
            return styles.halfSickLeave;

        case "0.5CL":
            return styles.halfCasualLeave;

        default:
            return styles.empty;
    }
};


    // --------------------------------
    // LOADING
    // --------------------------------

    if (loading) {

        return (
            <SafeAreaView style={styles.center}>

                <ActivityIndicator
                    size="large"
                />

                <Text style={styles.loadingText}>
                    Loading monthly attendance...
                </Text>

            </SafeAreaView>
        );

    }


    // --------------------------------
    // ERROR
    // --------------------------------

    if (error) {

        return (
            <SafeAreaView style={styles.center}>

                <Text style={styles.error}>
                    {error}
                </Text>

            </SafeAreaView>
        );

    }


    // --------------------------------
    // SCREEN
    // --------------------------------

    return (

        <SafeAreaView style={styles.container}>

            <FlatList
                data={attendance}

                keyExtractor={(item) =>
                    item.employee.toString()
                }

                showsVerticalScrollIndicator={false}

                contentContainerStyle={
                    styles.listContent
                }


                // --------------------------------
                // HEADER
                // --------------------------------

                ListHeaderComponent={

                    <View>

                        <Text style={styles.title}>
                            Monthly Attendance
                        </Text>


                        {/* MONTH SELECTOR */}

                        <Text style={styles.dateLabel}>
                            Attendance Month
                        </Text>


                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() =>
                                setShowDatePicker(true)
                            }
                        >

                            <Text style={ styles.dateButtonText}>
                                {formatMonthForDisplay(
                                    selectedDate
                                )}
                            </Text>


                            <Text style={styles.calendarIcon}>
                                📅
                            </Text>

                        </TouchableOpacity>


                        {/* DATE PICKER */}

                        {showDatePicker && (

                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={
                                    handleDateChange
                                }
                            />

                        )}


                        {/* REPORT INFO */}

                        <View
                            style={
                                styles.reportInfo
                            }
                        >

                            <Text
                                style={
                                    styles.reportText
                                }
                            >
                                {attendance.length} Employees
                            </Text>

                            <Text
                                style={
                                    styles.reportPeriod
                                }
                            >
                                {formatMonthForDisplay(
                                    selectedDate
                                )}
                            </Text>

                        </View>

                    </View>

                }


                // --------------------------------
                // EMPLOYEE CARD
                // --------------------------------

                renderItem={({ item }) => (

                    <View
                        style={styles.employeeCard}
                    >

                        {/* EMPLOYEE HEADER */}

                        <View
                            style={
                                styles.employeeHeader
                            }
                        >

                            <View
                                style={
                                    styles.employeeHeaderInfo
                                }
                            >

                                <Text
                                    style={
                                        styles.employeeName
                                    }
                                >
                                    {item.employee_name}
                                </Text>


                                <Text
                                    style={
                                        styles.employeeType
                                    }
                                >
                                    {item.employee_type}
                                </Text>

                            </View>


                            <Text
                                style={
                                    styles.employeeId
                                }
                            >
                                ID: {item.employee}
                            </Text>

                        </View>


                        {/* EMPLOYEE INFORMATION */}

                        <View style={styles.infoRow}>

                            <View
                                style={styles.infoItem}
                            >

                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    REPORTING
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {item.reporting_person ??
                                        "N/A"}
                                </Text>

                            </View>


                            <View
                                style={styles.infoItem}
                            >

                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    TEAM
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {item.team ?? "N/A"}
                                </Text>

                            </View>

                        </View>


                        <View style={styles.infoRow}>

                            <View
                                style={styles.infoItem}
                            >

                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    LOCATION
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {item.location ?? "N/A"}
                                </Text>

                            </View>

                        </View>


                        {/* DAYS */}

                        <Text
                            style={styles.attendanceTitle}
                        >
                            Daily Attendance
                        </Text>


                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                true
                            }
                        >

                            <View>

                                {/* DAY NUMBERS */}

                                <View
                                    style={
                                        styles.daysRow
                                    }
                                >

                                    {days.map(
                                        (day) => (

                                            <View
                                                key={day}
                                                style={
                                                    styles.dayCell
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.dayNumber
                                                    }
                                                >
                                                    {day}
                                                </Text>

                                            </View>

                                        )
                                    )}

                                </View>


                                {/* STATUS */}

                                <View
                                    style={
                                        styles.daysRow
                                    }
                                >

                                    {days.map(
                                        (day) => {

                                            const record =
                                                getAttendanceForDay(
                                                    item,
                                                    day
                                                );


                                            return (

                                                <View
                                                    key={day}
                                                    style={
                                                        styles.dayCell
                                                    }
                                                >

                                                    <View
                                                        style={[
                                                            styles.statusBox,
                                                            getStatusStyle(
                                                                typeof record === "string" ? record:record.status
                                                            ),
                                                        ]}
                                                    >

                                                        <Text
                                                            style={
                                                                styles.statusText
                                                            }
                                                        >
                                                            {getStatusLabel(
                                                                typeof record==="string" ? record:record.status
                                                            )}
                                                        </Text>

                                                    </View>

                                                </View>

                                            );

                                        }
                                    )}

                                </View>

                            </View>

                        </ScrollView>


                        {/* MONTHLY SUMMARY */}

                        <Text
                            style={
                                styles.summaryTitle
                            }
                        >
                            Monthly Summary
                        </Text>


                        <View
                            style={
                                styles.summaryGrid
                            }
                        >

                            <SummaryItem
                                label="Working"
                                value={item.working_days}
                            />

                            <SummaryItem
                                label="Absent"
                                value={item.absent_days}
                            />

                            <SummaryItem
                                label="Paid Holiday"
                                value={
                                    item.paid_holidays
                                }
                            />

                            <SummaryItem
                                label="WFH"
                                value={item.wfh}
                            />

                            <SummaryItem
                                label="Half Absent"
                                value={
                                    item.half_absent_days
                                }
                            />

                            <SummaryItem
                                label="Not Applicable"
                                value={item.na_days}
                            />

                            <SummaryItem
                                label="Extra Days"
                                value={item.extra_days}
                            />

                            <SummaryItem
                                label="Total Days"
                                value={item.total_days}
                            />

                        </View>


                        {/* REMARKS */}

                        {item.remarks ? (

                            <View
                                style={
                                    styles.remarksSection
                                }
                            >

                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    REMARKS
                                </Text>

                                <Text
                                    style={
                                        styles.remarksText
                                    }
                                >
                                    {item.remarks}
                                </Text>

                            </View>

                        ) : null}

                    </View>

                )}

            />

        </SafeAreaView>

    );

}


// =====================================
// SUMMARY ITEM
// =====================================

type SummaryItemProps = {
    label: string;
    value: number;
};


function SummaryItem({
    label,
    value,
}: SummaryItemProps) {

    return (

        <View
            style={styles.summaryItem}
        >

            <Text
                style={styles.summaryValue}
            >
                {value}
            </Text>

            <Text
                style={styles.summaryLabel}
            >
                {label}
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
        backgroundColor: "#f8fafc",
    },


    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#475569",
    },


    error: {
        fontSize: 16,
        color: "#dc2626",
    },


    // --------------------------------
    // HEADER
    // --------------------------------

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18,
    },


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
        marginBottom: 16,
    },


    dateButtonText: {
        fontSize: 16,
        color: "#1e293b",
    },


    calendarIcon: {
        fontSize: 20,
    },


    reportInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },


    reportText: {
        fontSize: 14,
        color: "#64748b",
    },


    reportPeriod: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2563eb",
    },


    // --------------------------------
    // EMPLOYEE CARD
    // --------------------------------

    employeeCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.08,
        shadowRadius: 5,

        elevation: 3,
    },


    employeeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
    },


    employeeHeaderInfo: {
        flex: 1,
    },


    employeeName: {
        fontSize: 19,
        fontWeight: "700",
        color: "#0f172a",
    },


    employeeType: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 3,
    },


    employeeId: {
        fontSize: 12,
        color: "#64748b",
    },


    // --------------------------------
    // EMPLOYEE INFO
    // --------------------------------

    infoRow: {
        flexDirection: "row",
        marginBottom: 12,
    },


    infoItem: {
        flex: 1,
    },


    infoLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#94a3b8",
        marginBottom: 4,
        letterSpacing: 0.5,
    },


    infoValue: {
        fontSize: 14,
        color: "#334155",
        fontWeight: "500",
    },


    // --------------------------------
    // ATTENDANCE
    // --------------------------------

    attendanceTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#334155",
        marginTop: 4,
        marginBottom: 8,
    },


    daysRow: {
        flexDirection: "row",
    },


    dayCell: {
        width: 42,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 3,
    },


    dayNumber: {
        fontSize: 11,
        fontWeight: "700",
        color: "#64748b",
        marginBottom: 5,
    },


    statusBox: {
        width: 34,
        height: 28,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },


    statusText: {
        fontSize: 9,
        fontWeight: "700",
        color: "#334155",
    },


    present: {
        backgroundColor: "#dcfce7",
    },


    wfh: {
        backgroundColor: "#dbeafe",
    },


    sickLeave: {
        backgroundColor: "#fee2e2",
    },


    casualLeave: {
        backgroundColor: "#fef3c7",
    },


    paidHoliday: {
        backgroundColor: "#f3e8ff",
    },


    notApplicable: {
        backgroundColor: "#e2e8f0",
    },


    halfSickLeave: {
        backgroundColor: "#ffedd5",
    },


    halfCasualLeave: {
        backgroundColor: "#fef3c7",
    },


    empty: {
        backgroundColor: "#f8fafc",
    },


    // --------------------------------
    // SUMMARY
    // --------------------------------

    summaryTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#334155",
        marginTop: 18,
        marginBottom: 10,
    },


    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },


    summaryItem: {
        width: "48%",
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },


    summaryValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2563eb",
    },


    summaryLabel: {
        fontSize: 11,
        color: "#64748b",
        marginTop: 2,
    },


    // --------------------------------
    // REMARKS
    // --------------------------------

    remarksSection: {
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        padding: 10,
        marginTop: 8,
    },


    remarksText: {
        fontSize: 13,
        color: "#475569",
    },

});