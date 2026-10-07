import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,FlatList,ActivityIndicator,TouchableOpacity, Pressable, Modal, TextInput} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';

import { useAuth } from "../../src/context/AuthContext";
import { getDailyAttendance, createAttendance, updateAttendance, } from "../../src/api/attendance";
import { DailyAttendance } from "../../src/types/attendance";

export default function DailyAttendanceScreen() {

    const { accessToken } = useAuth();

    const [attendance, setAttendance] = useState<DailyAttendance[]>([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedEmployees, setSelectedEmployees] = useState<DailyAttendance | null>(null);

    const [modalVisible, setModalVisible] = useState(false);

    const [status,setStatus] = useState("");

    const [remarks,setRemarks] = useState("");

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

    const statusMap: Record<string, string> = {
        "Present": "X",
        "Sick Leave": "SL",
        "Leave": "L",
        "Not Available": "NA",
        "Work From Home": "WFH",
        "Casual Leave": "CL",
        "Half day Sick Leave": "0.5SL",
        "Half day Casual Leave": "0.5CL",
    };

   const handleEmployeePress = (item: DailyAttendance) => {
        setSelectedEmployees(item);

        if (item.attendance_id === null) {
            setStatus("");
        } else {
            setStatus(statusMap[item.status] ?? "");
        }

        setRemarks(item.remarks ?? "");
        setModalVisible(true);
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

    const handleSaveAttendance = async () => {

        if (!selectedEmployees || !accessToken) {
            return;
        }

        if (!status) {
            setError("Please select a status");
            return;
        }

        try {

            const attendanceData = {
                employee: selectedEmployees.employee,
                date: formatDateForAPI(selectedDate),
                day: selectedDate.toLocaleDateString("en-US",{
                    weekday: "long",
                }),
                status: status,
                remarks: remarks,
            };

            if (selectedEmployees.attendance_id === null) {

                // CREATE
                await createAttendance(
                    accessToken,
                    attendanceData
                );

            } else {

                // UPDATE
                await updateAttendance(
                    accessToken,
                    selectedEmployees.attendance_id,
                    attendanceData
                );
            }

            setModalVisible(false);

            // Refresh Daily Attendance
            const data = await getDailyAttendance(
                accessToken,
                formatDateForAPI(selectedDate)
            );

            setAttendance(data);

        } catch (error) {

            console.error(
                "SAVE ATTENDANCE ERROR:",
                error
            );

            setError("Failed to save attendance");
        }
    };


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

                   <Pressable
    style={styles.employeeCard}
    onPress={() => handleEmployeePress(item)}
>
    {/* Header */}
    <View style={styles.employeeHeader}>
        <View>
            <Text style={styles.employeeName}>
                {item.employee_name}
            </Text>

            <Text style={styles.employeeId}>
                Employee ID: {item.employee_id}
            </Text>
        </View>

        <View
            style={[
                styles.statusBadge,
                item.status === "Not Marked"
                    ? styles.statusNotMarked
                    : styles.statusOther,
            ]}
        >
            <Text style={styles.statusBadgeText}>
                {item.status}
            </Text>
        </View>
    </View>

    {/* Employee Information */}
    <View style={styles.infoRow}>
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>TEAM</Text>
            <Text style={styles.infoValue}>
                {item.team ?? "N/A"}
            </Text>
        </View>

        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>
                {item.location ?? "N/A"}
            </Text>
        </View>
    </View>

    {/* Reporting Person */}
    <View style={styles.reportingSection}>
        <Text style={styles.infoLabel}>
            REPORTING PERSON
        </Text>

        <Text style={styles.infoValue}>
            {item.reporting_person ?? "N/A"}
        </Text>
    </View>

    {/* Remarks */}
    <View style={styles.remarksSection}>
        <Text style={styles.infoLabel}>
            REMARKS
        </Text>

        <Text style={styles.remarksText}>
            {item.remarks || "No remarks"}
        </Text>
    </View>
</Pressable>
                )}

            />

            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={()=>setModalVisible(false)}>

                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}> 
                        <Text style={styles.modalTitle}>Mark Attendance</Text>

                        <Text style={styles.employeeSubtitle}>{selectedEmployees?.employee_id} - {" "}{selectedEmployees?.employee_name}</Text>

                        <Text style={styles.label}>Attendance Date</Text>

                        <Text style={styles.dateField}>{formatDateForDisplay(selectedDate)}</Text>

                        <Text style={styles.label}>Status</Text>

                       <View style={styles.pickerContainer}>
                            <Picker selectedValue={status} onValueChange={(value) => setStatus(value)}>
                                <Picker.Item label="Select Status" value="" />
                                <Picker.Item label="Present" value="X" />
                                <Picker.Item label="Sick Leave" value="SL" />
                                <Picker.Item label="Leave" value="L" />
                                <Picker.Item label="Not Available" value="NA" />
                                <Picker.Item label="Work From Home" value="WFH" />
                                <Picker.Item label="Casual Leave" value="CL" />
                                <Picker.Item label="Half day Sick Leave" value="0.5SL" />
                                <Picker.Item label="Half day Casual Leave" value="0.5CL" />
                            </Picker>
                        </View>

                        <Text style={styles.label}>Remarks</Text>

                        <TextInput style={styles.remarksInput} value={remarks} placeholder="remarks" multiline onChangeText={setRemarks} />


                        <View style={styles.modalButtons}>
                            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>

                            <Pressable onPress={handleSaveAttendance} style={styles.saveButton} >
                                <Text style={styles.saveButtonText}>Save Attendance</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </Modal>

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

    // employeeCard: {
    //     backgroundColor: "#ffffff",
    //     borderWidth: 1,
    //     borderColor: "#e2e8f0",
    //     borderRadius: 12,
    //     padding: 16,
    //     marginBottom: 12,
    // },

    employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
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
    marginBottom: 16,
},

employeeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
},

employeeId: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
},

statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
},

statusNotMarked: {
    backgroundColor: "#fef3c7",
},

statusOther: {
    backgroundColor: "#dcfce7",
},

statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
},

infoRow: {
    flexDirection: "row",
    marginBottom: 14,
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

reportingSection: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
    marginBottom: 12,
},

remarksSection: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 10,
},

remarksText: {
    fontSize: 13,
    color: "#475569",
},

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: "90%",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 5,
    },

    employeeSubtitle: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
        marginBottom: 6,
        marginTop: 10,
    },

    dateField: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        color: "#475569",
    },

    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
    },

    remarksInput: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        height: 90,
        textAlignVertical: "top",
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
        gap: 10,
    },

    cancelButton: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },

    cancelButtonText: {
        color: "#475569",
        fontWeight: "600",
    },

    saveButton: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },

    saveButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#ffffff",
    },
});