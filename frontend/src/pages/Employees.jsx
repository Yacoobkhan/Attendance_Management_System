import { useEffect, useState } from "react";
import api from "../services/api";

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/employees/");

            console.log("Employees:", response.data);

            setEmployees(response.data);

        } catch (error) {

            console.error("Failed to fetch employees:", error);

            setError("Failed to load employees.");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchEmployees();

    }, []);


    return (
        <div>

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold text-slate-800">
                        Employee Management
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage employee information and details.
                    </p>

                </div>


                <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Add Employee
                </button>

            </div>


            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                    Loading employees...
                </div>
            )}


            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                    {error}
                </div>
            )}


            {!loading && !error && (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-sm">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Employee ID
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Name
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        DOB
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Role
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Email
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Joining Date
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {employees.map((employee) => (

                                    <tr
                                        key={employee.id}
                                        className="border-t border-slate-200 transition hover:bg-slate-50"
                                    >

                                        <td className="px-4 py-4 text-slate-700">
                                            {employee.employee_id}
                                        </td>

                                        <td className="px-4 py-4 font-medium text-slate-800">
                                            {employee.employee_name}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.dob}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.role}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.phone}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.mail}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.joining_date}
                                        </td>

                                        <td className="px-4 py-4">

                                            <span
                                                className={
                                                    employee.is_active
                                                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                                        : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                                                }
                                            >
                                                {employee.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Employees;