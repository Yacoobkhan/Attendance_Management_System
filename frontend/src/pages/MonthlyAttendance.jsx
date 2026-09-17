import { useState } from "react";
import api from "../services/api";

const MonthlyAttendance = () => {

    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(9);

    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [saving, setSaving] = useState(false);


    const months = [
        { value: 1, name: "January" },
        { value: 2, name: "February" },
        { value: 3, name: "March" },
        { value: 4, name: "April" },
        { value: 5, name: "May" },
        { value: 6, name: "June" },
        { value: 7, name: "July" },
        { value: 8, name: "August" },
        { value: 9, name: "September" },
        { value: 10, name: "October" },
        { value: 11, name: "November" },
        { value: 12, name: "December" },
    ];

    const getDaysInMonth = () => {
        return new Date(year, month, 0).getDate();
    };

    const numberOfDays = getDaysInMonth();

    const handleViewReport = async () => {

        try {
            setLoading(true);
            setError("");
            const response = await api.get(
                `/attendance/report/monthly/?year=${year}&month=${month}`
            );

            console.log("Monthly Attendance Report:", response.data);

            setReport(response.data);

        } catch (error) {
            console.error("Monthly attendance report failed:", error);
            setError("Failed to load monthly attendance report.");
        } finally {
            setLoading(false);
        }
    };


    const getStatusClass = (status) => {
        switch (status) {
            case "X":
                return "bg-green-100 text-green-700";

            case "WFH":
                return "bg-blue-100 text-blue-700";

            case "SL":
                return "bg-red-100 text-red-700";

            case "CL":
                return "bg-yellow-100 text-yellow-700";

            case "0.5SL":
                return "bg-orange-100 text-orange-700";

            case "0.5CL":
                return "bg-amber-100 text-amber-700";

            case "L":
                return "bg-purple-100 text-purple-700";

            case "NA":
                return "bg-slate-200 text-slate-600";

            default:
                return "text-slate-400";
        }
    };

    const handleCellClick = (employee, day) => {

        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const status = employee.attendance[String(day)] || "";

        setSelectedCell({employee: employee.employee, employee_name: employee.employee_name, day: day, date: date, status: status,});
        setSelectedStatus(status);
    };

    console.log("Selected Cell:", selectedCell);

    const handleSaveAttendance = async () => {

    if (!selectedCell) {
        return;
    }

    if (!selectedStatus) {
        alert("Please select an attendance status.");
        return;
    }

    try {

        setSaving(true);

        const data = {employee: selectedCell.employee, date: selectedCell.date,
            day: new Date(selectedCell.date).toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                }
            ),
            status: selectedStatus,
            remarks: "",
        };

        console.log("Saving Attendance:", data);

        await api.post("/attendance/create/",data);

        alert("Attendance saved successfully.");

        setSelectedCell(null);
        setSelectedStatus("");

        await handleViewReport();

    } catch (error) {

        console.error("Save attendance failed:",error);

        console.error("Backend error:",error.response?.data);

        alert(error.response?.data?.detail || "Failed to save attendance.");

    } finally {
        setSaving(false);

    }
};

    return (
        <div>
            {/* Page Header */}

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Monthly Attendance
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage monthly employee attendance
                    </p>

                </div>

                {report.length > 0 && (

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                        <p className="text-xs text-slate-500">
                            Report Period
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">

                            {
                                months.find(
                                    (item) =>
                                        Number(item.value) ===
                                        Number(month)
                                )?.name
                            }

                            {" "}

                            {year}

                        </p>

                    </div>

                )}

            </div>


            {/* Filters */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-4 md:flex-row md:items-end">

                    {/* Year */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Year
                        </label>

                        <select value={year} onChange={(event) => setYear(
                                    Number(event.target.value)
                                )
                            }
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            <option value={2026}>
                                2026
                            </option>

                            <option value={2027}>
                                2027
                            </option>

                            <option value={2028}>
                                2028
                            </option>

                        </select>

                    </div>


                    {/* Month */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(event) =>
                                setMonth(
                                    Number(event.target.value)
                                )
                            }
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            {months.map((item) => (

                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* View Report Button */}

                    <button type="button" onClick={handleViewReport}
                        disabled={loading}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Loading..."
                            : "View Report"
                        }

                    </button>

                </div>

            </div>


            {/* Employee Count */}
            {report.length > 0 && (

                <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm text-slate-500">

                        Showing

                        <span className="mx-1 font-semibold text-slate-800">
                            {report.length}
                        </span>

                        employees

                    </p>

                </div>

            )}


            {/* Report */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


                {/* Loading */}

                {loading && (

                    <p className="text-sm text-slate-500">
                        Loading attendance report...
                    </p>

                )}


                {/* Error */}

                {error && (

                    <p className="text-sm text-red-500">
                        {error}
                    </p>

                )}


                {/* Attendance Table */}

                {!loading &&
                    !error &&
                    report.length > 0 && (

                        <div className="overflow-x-auto">

                            <table className="min-w-max border-collapse text-sm">

                                <thead>

                                    <tr className="bg-slate-100">

                                        <th className="border border-slate-200 px-4 py-3 text-left">
                                            S.No
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-left">
                                            Name
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-left">
                                            Type
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-left">
                                            Reporting Person
                                        </th>


                                        {/* Days */}

                                        {Array.from(
                                            {
                                                length:
                                                    numberOfDays
                                            },
                                            (_, index) => (

                                                <th
                                                    key={
                                                        index +
                                                        1
                                                    }
                                                    className="border border-slate-200 px-3 py-3 text-center"
                                                >
                                                    {index + 1}
                                                </th>

                                            )
                                        )}


                                        {/* Summary Columns */}

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Working Days
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Paid Holidays
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Absent Days
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Total Days
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Holidays
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Half Absent
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            NA Days
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            Extra Days
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-center">
                                            WFH
                                        </th>

                                        <th className="border border-slate-200 px-4 py-3 text-left">
                                            Remarks
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {report.map(
                                        (
                                            employee,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    employee.employee
                                                }
                                                className="hover:bg-slate-50"
                                            >

                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {index + 1}
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 font-medium text-slate-800">
                                                    {
                                                        employee.employee_name
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3">
                                                    {
                                                        employee.employee_type
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3">
                                                    {
                                                        employee.reporting_person ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* Attendance Days */}

                                                {Array.from(
                                                    {
                                                        length:
                                                            numberOfDays
                                                    },
                                                    (
                                                        _,
                                                        index
                                                    ) => {

                                                        const day =
                                                            index +
                                                            1;

                                                        const status =
                                                            employee
                                                                .attendance[
                                                                String(
                                                                    day
                                                                )
                                                            ] ||
                                                            "";

                                                        return (

                                                            <td
                                                                key={day}
                                                                onClick={() =>
                                                                    handleCellClick(
                                                                        employee,
                                                                        day
                                                                    )
                                                                }
                                                                className="cursor-pointer border border-slate-200 px-2 py-2 text-center hover:bg-blue-50"
                                                            >

                                                                <span
                                                                    className={`inline-flex min-w-10 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(
                                                                        status
                                                                    )}`}
                                                                >

                                                                    {
                                                                        status ||
                                                                        "-"
                                                                    }

                                                                </span>

                                                            </td>

                                                        );

                                                    }
                                                )}


                                                {/* Summary Data */}

                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.working_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.paid_holidays
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.absent_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.total_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.holidays
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.half_absent_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.na_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.extra_days
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3 text-center">
                                                    {
                                                        employee.wfh
                                                    }
                                                </td>


                                                <td className="border border-slate-200 px-4 py-3">
                                                    {
                                                        employee.remarks ||
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                {/* Empty State */}

                {!loading &&
                    !error &&
                    report.length === 0 && (

                        <div className="py-10 text-center">

                            <p className="text-sm text-slate-500">
                                Select year and month, then
                                click View Report.
                            </p>

                        </div>

                    )}

                {/* Attendance Legend */}

                {!loading &&
                    !error &&
                    report.length > 0 && (

                        <div className="mt-8 border-t border-slate-200 pt-5">

                            <h3 className="mb-3 text-sm font-semibold text-slate-700">
                                Attendance Legend
                            </h3>


                            <div className="flex flex-wrap gap-3">

                                <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    X - Present
                                </span>


                                <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    WFH - Work From Home
                                </span>


                                <span className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                    SL - Sick Leave
                                </span>


                                <span className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                    CL - Casual Leave
                                </span>


                                <span className="rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                    0.5SL - Half Sick Leave
                                </span>


                                <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                    0.5CL - Half Casual Leave
                                </span>


                                <span className="rounded-md bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                    L - Paid Holiday
                                </span>


                                <span className="rounded-md bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                    NA - Not Applicable
                                </span>

                            </div>

                        </div>

                    )}

            </div>


            {/* Edit Attendance Panel */}

            {selectedCell && (

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">

                        <div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Edit Attendance
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Update attendance for the selected employee and date.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setSelectedCell(null)
                            }
                            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            Cancel
                        </button>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


                        {/* Employee */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Employee
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedCell.employee_name
                                }
                                readOnly
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none"
                            />

                        </div>


                        {/* Date */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Date
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedCell.date
                                }
                                readOnly
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none"
                            />

                        </div>


                        {/* Status */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Attendance Status
                            </label>

                            <select
                                value={selectedStatus}
                                onChange={(event) =>
                                    setSelectedStatus(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select Status
                                </option>


                                <option value="X">
                                    X - Present
                                </option>


                                <option value="WFH">
                                    WFH - Work From Home
                                </option>


                                <option value="SL">
                                    SL - Sick Leave
                                </option>


                                <option value="CL">
                                    CL - Casual Leave
                                </option>


                                <option value="0.5SL">
                                    0.5SL - Half Sick Leave
                                </option>


                                <option value="0.5CL">
                                    0.5CL - Half Casual Leave
                                </option>


                                <option value="L">
                                    L - Leave
                                </option>


                                <option value="NA">
                                    NA - Not Applicable
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Save Button */}

                    <div className="mt-5 flex justify-end">

                        <button
                            type="button"
                            onClick={handleSaveAttendance}
                            disabled={saving}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Attendance"
                            }
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
};


export default MonthlyAttendance;