import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";


const DailyAttendance = () => {

    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const {searchValue} = useOutletContext();

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showAttendanceForm, setShowAttendanceForm] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [attendanceForm, setAttendanceForm] = useState({
        status: "",
        remarks: "",
    });


    // -----------------------------------
    // Get status style
    // -----------------------------------

    const getStatusStyle = (status) => {

        switch (status) {

            case "Present":
                return "bg-green-100 text-green-700";

            case "Work From Home":
                return "bg-blue-100 text-blue-700";

            case "Sick Leave":
                return "bg-red-100 text-red-700";

            case "Casual Leave":
                return "bg-yellow-100 text-yellow-700";

            case "Half day Sick Leave":
                return "bg-orange-100 text-orange-700";

            case "Half day Casual Leave":
                return "bg-amber-100 text-amber-700";

            case "Paid Holiday":
                return "bg-purple-100 text-purple-700";

            case "Not Applicable":
                return "bg-slate-200 text-slate-600";

            case "Not Marked":
                return "bg-slate-200 text-slate-600";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };


    //get Status display

    const getStatusDisplay = (status) => {

        if (status === "Paid Holiday") {
            return "L";
        }

        if (status === "Not Applicable") {
            return "NA";
        }

        return status;
    };


    // -----------------------------------
    // Convert status label to status code
    // -----------------------------------

    const getStatusCode = (status) => {

        switch (status) {

            case "Present":
                return "X";

            case "Work From Home":
                return "WFH";

            case "Sick Leave":
                return "SL";

            case "Casual Leave":
                return "CL";

            case "Half day Sick Leave":
                return "0.5SL";

            case "Half day Casual Leave":
                return "0.5CL";

            case "Paid Holiday":
                return "L";

            case "Not Applicable":
                return "NA";

            default:
                return "";
        }
    };


    // -----------------------------------
    // Check whether selected date is Sunday
    // -----------------------------------

    const isSunday = () => {

        const date = new Date(`${selectedDate}T00:00:00`);

        return date.getDay() === 0;
    };


    // -----------------------------------
    // Fetch daily attendance
    // -----------------------------------

    const fetchDailyAttendance = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                `/attendance/report/daily/?date=${selectedDate}`
            );

            console.log(
                "Daily Attendance Record:",
                response.data
            );

            setAttendanceRecords(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch daily attendance:",
                error
            );

            setError("Failed to load daily attendance.");

        } finally {

            setLoading(false);
        }
    };


    // -----------------------------------
    // Fetch whenever date changes
    // -----------------------------------

    useEffect(() => {

        fetchDailyAttendance();

    }, [selectedDate]);


    // -----------------------------------
    // Get status count
    // -----------------------------------

    const getStatusCount = (status) => {

        return attendanceRecords.filter(
            (record) => record.status === status
        ).length;
    };

    // -----------------------------------
    // Filtered Attendance Record
    // -----------------------------------

    const filteredAttedanceRecords = attendanceRecords.filter(
        (record) => 
            record.employee_id.toString().toLowerCase().includes(searchValue.toLowerCase()) || record.employee_name.toLowerCase().includes(searchValue.toLowerCase())
    )


    // -----------------------------------
    // Open attendance popup
    // -----------------------------------

    const handleAttendanceClick = (record) => {

        // Do not open popup for Sunday
        if (record.status === "Paid Holiday") {
            return;
        }

        // Do not open popup for NA
        if (record.status === "Not Applicable") {
            return;
        }

        setSelectedEmployee(record);

        setAttendanceForm({
            status:
                record.status === "Not Marked"
                    ? ""
                    : getStatusCode(record.status),

            remarks:
                record.status === "Not Marked"
                    ? ""
                    : record.remarks || "",
        });

        setShowAttendanceForm(true);
    };


    // -----------------------------------
    // Close popup
    // -----------------------------------

    const handleCloseAttendanceForm = () => {

        setShowAttendanceForm(false);

        setSelectedEmployee(null);

        setAttendanceForm({
            status: "",
            remarks: "",
        });
    };


    // -----------------------------------
    // Save attendance
    // -----------------------------------

    const handleSaveAttendance = async () => {

        if (!attendanceForm.status) {

            setError("Please select an attendance status.");

            return;
        }

        try {

            setLoading(true);

            setError("");

            const data = {

                employee: selectedEmployee.employee,

                date: selectedDate,

                day: new Date(
                    `${selectedDate}T00:00:00`
                ).toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                    }
                ),

                status: attendanceForm.status,

                remarks: attendanceForm.remarks,
            };


            // Create attendance
            if (selectedEmployee.status === "Not Marked") {

                await api.post(
                    "/attendance/create/",
                    data
                );

            }

            // Update attendance
            else {

                await api.patch(
                    `/attendance/${selectedEmployee.attendance_id}/update/`,
                    data
                );
            }


            // Close popup
            handleCloseAttendanceForm();


            // Refresh table
            await fetchDailyAttendance();

        } catch (error) {

            console.error(
                "Failed to save attendance:",
                error.response?.data
            );

            setError(
                JSON.stringify(
                    error.response?.data
                )
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* ----------------------------------- */}
            {/* Date */}
            {/* ----------------------------------- */}

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                    Attendance Date

                </label>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) =>
                        setSelectedDate(
                            event.target.value
                        )
                    }
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />

            </div>


            {/* ----------------------------------- */}
            {/* Summary Cards */}
            {/* ----------------------------------- */}

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">

                {/* Total Employees */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                        Total Employees
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-slate-800">

                        {attendanceRecords.length}

                    </p>

                </div>


                {/* Present */}

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                    <p className="text-sm text-green-600">
                        Present
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-green-700">

                        {getStatusCount("Present")}

                    </p>

                </div>


                {/* WFH */}

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                    <p className="text-sm text-blue-600">
                        Work From Home
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-blue-700">

                        {getStatusCount("Work From Home")}

                    </p>

                </div>


                {/* Sick Leave */}

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm text-red-600">
                        Sick Leave
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-red-700">

                        {getStatusCount("Sick Leave")}

                    </p>

                </div>


                {/* Casual Leave */}

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                    <p className="text-sm text-yellow-600">
                        Casual Leave
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-yellow-700">

                        {getStatusCount("Casual Leave")}

                    </p>

                </div>


                {/* Half Sick Leave */}

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">

                    <p className="text-sm text-orange-600">
                        Half Sick Leave
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-orange-700">

                        {getStatusCount(
                            "Half day Sick Leave"
                        )}

                    </p>

                </div>


                {/* Half Casual Leave */}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                    <p className="text-sm text-amber-600">
                        Half Casual Leave
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-amber-700">

                        {getStatusCount(
                            "Half day Casual Leave"
                        )}

                    </p>

                </div>


                {/* Not Marked */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                        Not Marked
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-slate-700">

                        {getStatusCount(
                            "Not Marked"
                        )}

                    </p>

                </div>


                {/* NA */}

                <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">

                    <p className="text-sm text-slate-500">
                        Not Applicable
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-slate-600">

                        {getStatusCount(
                            "Not Applicable"
                        )}

                    </p>

                </div>


                {/* Paid Holiday */}

                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

                    <p className="text-sm text-purple-600">
                        Paid Holiday
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-purple-700">

                        {getStatusCount(
                            "Paid Holiday"
                        )}

                    </p>

                </div>

            </div>


            {/* ----------------------------------- */}
            {/* Sunday Message */}
            {/* ----------------------------------- */}

            {isSunday() && (

                <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">

                    <p className="text-sm font-medium text-purple-700">

                        Sunday is a Paid Holiday. Attendance marking is not required.

                    </p>

                </div>

            )}


            {/* ----------------------------------- */}
            {/* Error */}
            {/* ----------------------------------- */}

            {error && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm text-red-600">

                        {error}

                    </p>

                </div>

            )}


            {/* ----------------------------------- */}
            {/* Loading */}
            {/* ----------------------------------- */}

            {loading && (

                <div className="mt-6 py-4 text-center">

                    <p className="text-sm text-slate-500">

                        Loading attendance...

                    </p>

                </div>

            )}


            {/* ----------------------------------- */}
            {/* Attendance Table */}
            {/* ----------------------------------- */}

            {!loading && !error && (

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-sm">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-4 py-3 text-left font-medium text-slate-600">
                                        Employee ID
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium text-slate-600">
                                        Employee Name
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium text-slate-600">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium text-slate-600">
                                        Remarks
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAttedanceRecords.map(
                                    (record) => {

                                        const isNotEditable =
                                            record.status === "Paid Holiday" ||
                                            record.status === "Not Applicable";

                                        return (

                                            <tr
                                                key={record.employee_id}
                                                onClick={() =>
                                                    handleAttendanceClick(
                                                        record
                                                    )
                                                }
                                                className={`border-t border-slate-200 ${
                                                    isNotEditable
                                                        ? ""
                                                        : "cursor-pointer hover:bg-slate-50"
                                                }`}
                                            >

                                                <td className="px-4 py-4 text-slate-700">

                                                    {record.employee_id}

                                                </td>


                                                <td className="px-4 py-4 font-medium text-slate-800">

                                                    {record.employee_name}

                                                </td>


                                                <td className="px-4 py-4">

                                                    <span
                                                        className={`inline-flex min-w-[55px] justify-center rounded-md px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                            record.status
                                                        )}`}
                                                    >

                                                        {getStatusDisplay(record.status)}

                                                    </span>

                                                </td>


                                                <td className="px-4 py-4 text-slate-600">

                                                    {record.remarks || "-"}

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}


            {/* ----------------------------------- */}
            {/* Mark / Edit Attendance Popup */}
            {/* ----------------------------------- */}

            {showAttendanceForm &&
                selectedEmployee && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">


                            {/* Header */}

                            <div className="mb-6">

                                <h2 className="text-xl font-semibold text-slate-800">

                                    {selectedEmployee.status === "Not Marked"
                                        ? "Mark Attendance"
                                        : "Edit Attendance"}

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">

                                    {selectedEmployee.employee_id}
                                    {" - "}
                                    {selectedEmployee.employee_name}

                                </p>

                            </div>


                            {/* Date */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-medium text-slate-700">

                                    Attendance Date

                                </label>

                                <input
                                    type="date"
                                    value={selectedDate}
                                    disabled
                                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-600"
                                />

                            </div>


                            {/* Status */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-medium text-slate-700">

                                    Status

                                </label>

                                <select
                                    value={attendanceForm.status}
                                    onChange={(event) =>
                                        setAttendanceForm({
                                            ...attendanceForm,
                                            status: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >

                                    <option value="">
                                        Select Status
                                    </option>

                                    <option value="X">
                                        Present
                                    </option>

                                    <option value="WFH">
                                        Work From Home
                                    </option>

                                    <option value="SL">
                                        Sick Leave
                                    </option>

                                    <option value="CL">
                                        Casual Leave
                                    </option>

                                    <option value="0.5SL">
                                        Half Day Sick Leave
                                    </option>

                                    <option value="0.5CL">
                                        Half Day Casual Leave
                                    </option>

                                </select>

                            </div>


                            {/* Remarks */}

                            <div className="mb-6">

                                <label className="mb-2 block text-sm font-medium text-slate-700">

                                    Remarks

                                </label>

                                <textarea
                                    value={
                                        attendanceForm.remarks
                                    }
                                    onChange={(event) =>
                                        setAttendanceForm({
                                            ...attendanceForm,
                                            remarks:
                                                event.target.value
                                        })
                                    }
                                    rows="3"
                                    placeholder="Enter remarks..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Buttons */}

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseAttendanceForm
                                    }
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleSaveAttendance
                                    }
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >

                                    Save Attendance

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
};


export default DailyAttendance;