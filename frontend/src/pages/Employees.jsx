import { useEffect, useState } from "react";
import api from "../services/api";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

   const { searchValue } = useOutletContext();

    const [showAddEmployee,setShowAddEmployee] = useState(false)

    const [selectedEmployees, setSelectedEmployees] = useState(null);
    const [showEmployeeOptions,setShowEmployeeOptions] = useState(false);

    const [showEditEmployee,setShowEditEmployee] = useState(false);

    const [teams, setTeams] = useState([]);
    const [locations, setLocations] = useState([]);
    const [reportingManager,setReportingManager] = useState([])


    const [formData,setFormData] = useState({
        employee_name: "",
        dob: "",
        role: "",
        team:"",
        location:"",
        phone: "",
        mail: "",
        joining_date: "",
        employee_type: "EMPLOYEE",
        reporting_person: "",
        is_active: true
    })

    const handleEmployeeDoubleClick = (employee) =>{
            setSelectedEmployees(employee);

            setShowEmployeeOptions(true);
    }

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/employees/");

           console.log("FULL EMPLOYEE RESPONSE:", JSON.stringify(response.data, null, 2));

            setEmployees(response.data);

        } catch (error) {

            console.error("Failed to fetch employees:", error);

            setError("Failed to load employees.");

        } finally {

            setLoading(false);

        }
    };

    const fetchTeams = async () => {
    try {
        const response = await api.get("/employees/teams/");
        setTeams(response.data);
    } catch (error) {
        console.error("Failed to fetch teams:", error);
    }
};

const fetchLocations = async () => {
    try {
        const response = await api.get("/employees/locations/");
        setLocations(response.data);
    } catch (error) {
        console.error("Failed to fetch locations:", error);
    }
};

const fetchReportingManager = async() =>{
    try{
        const response = await api.get(`/employees/reporting/`)
        setReportingManager(response.data)
    }catch(error){
        console.error('Failed to fetch reporting manager: ',error)
    }
}

    const handleInputChange = (event) =>{
        const {name,value,type,checked} = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked:value,
        })
    }

    const handleAddEmployee = async () => {

            try {

                const data = {
                    employee_name: formData.employee_name,
                    dob: formData.dob,
                    role: formData.role,
                    team: formData.team,
                    location: formData.location,
                    phone: formData.phone,
                    mail: formData.mail,
                    joining_date: formData.joining_date,
                    employee_type: formData.employee_type,
                    reporting_person: formData.reporting_person,
                    is_active: formData.is_active,
                };

                console.log("Adding Employee:", data);

                await api.post(
                    "/employees/",
                    data
                );

                alert("Employee added successfully.");

                setShowAddEmployee(false);

                setFormData({
                    employee_name: "",
                    dob: "",
                    role: "",
                    team: "",
                    location: "",
                    phone: "",
                    mail: "",
                    joining_date: "",
                    employee_type: "EMPLOYEE",
                    reporting_person: "",
                    is_active: true,
                });

                await fetchEmployees();

            } catch (error) {

                console.error(
                    "Add employee failed:",
                    error
                );

                console.error(
                    "Backend error:",
                    error.response?.data
                    //JSON.stringify(error.response?.data, null, 2)
                );

                alert(
                    "Failed to add employee."
                );
            }
    };

    const handleUpdateEmployee = async () => {

        if (!selectedEmployees) {
            return;
        }

        try {

            const data = {
                employee_name: formData.employee_name,
                dob: formData.dob,
                role: formData.role,
                team: formData.team,
                location: formData.location,
                phone: formData.phone,
                mail: formData.mail,
                joining_date: formData.joining_date,
                employee_type: formData.employee_type,
                reporting_person: formData.reporting_person,
                is_active: formData.is_active,
            };

            console.log("Updating Employee:", data);

            await api.patch(
                `/employees/${selectedEmployees.id}/update/`,
                data
            );

            alert("Employee updated successfully.");

            setShowEditEmployee(false);
            setSelectedEmployees(null);

            await fetchEmployees();

        } catch (error) {

            console.error(
                "Update employee failed:",
                error
            );

            console.error(
                "Backend error:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Failed to update employee."
            );
        }
    };

    const handleDeleteEmployee = async () => {

        if (!selectedEmployees) {
            return;
        }

        try {

            console.log( "Deleting Employee:", selectedEmployees.id);

            await api.delete(`/employees/${selectedEmployees.id}/destroy/`);

            alert("Employee deleted successfully.");

            setShowEmployeeOptions(false);
            setSelectedEmployees(null);

            await fetchEmployees();

        } catch (error) {

            console.error("Delete employee failed:", error);

            console.error( "Backend error:", error.response?.data);

            alert( error.response?.data?.detail || "Failed to delete employee.");
        }
    };


    useEffect(() => {

        fetchEmployees();
        fetchTeams();
        fetchLocations();
        fetchReportingManager();

    }, []);

    const filteredEmployees = employees.filter((employee) =>{
        const search = searchValue.toLowerCase()

        const teamName = teams.find((team) => team.id === employee.team)?.name || "";

        const locationName = locations.find((location) => location.id === employee.location)?.name || "";

        return(
            employee.employee_name?.toLowerCase().includes(search) ||
            String(employee.employee_id).includes(search) ||
            employee.role?.toLowerCase().includes(search) ||
            employee.mail?.toLowerCase().includes(search) ||
            teamName.toLowerCase().includes(search) || 
            locationName.toLowerCase().includes(search)
        )
    })


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
                    onClick={() => {
                        setFormData({
                            employee_name: "",
                            dob: "",
                            role: "",
                            team: "",
                            location: "",
                            phone: "",
                            mail: "",
                            joining_date: "",
                            employee_type: "EMPLOYEE",
                            reporting_person: "",
                            is_active: true
                        });
                        setShowAddEmployee(true)}}
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
                                        Reporting Manager
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Team
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Location
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        DOB
                                    </th>

                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Employment Type
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

                                {filteredEmployees.map((employee) => (

                                    <tr
                                        key={employee.id}
                                        onClick={() => handleEmployeeDoubleClick(employee)}
                                        className="border-t border-slate-200 transition hover:bg-slate-50"
                                    >

                                        <td className="px-4 py-4 text-slate-700">
                                            {employee.employee_id}
                                        </td>

                                        <td className="px-4 py-4 font-medium text-slate-800">
                                            {employee.employee_name}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.reporting_person_name || "-"}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {teams.find((team) => team.id === employee.team)?.name || "-"}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {locations.find((location) => location.id === employee.location)?.name || "-"}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {employee.dob}
                                        </td>

                                         <td className="px-4 py-4 text-slate-600">
                                            {employee.employee_type}
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


            {showAddEmployee && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold text-slate-800">
                                    Add Employee
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the employee details below.
                                </p>

                            </div>


                        </div>


                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            {/* Employee Name */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Employee Name
                                </label>

                                <input type="text" name="employee_name" value={formData.employee_name} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"/>

                            </div>


                            {/* DOB */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Date of Birth
                                </label>

                                <input type="date" name="dob"  value={formData.dob}  onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Role */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Phone */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="mail"
                                    value={formData.mail}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Joining Date */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joining_date"
                                    value={formData.joining_date}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* Employee Type */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Employee Type
                                </label>

                                <select
                                    name="employee_type"
                                    value={formData.employee_type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >

                                    <option value="EMPLOYEE">
                                        Employee
                                    </option>

                                    <option value="INTERN">
                                        Intern
                                    </option>

                                </select>

                            </div>


                            {/* Reporting Person */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Reporting Person
                                </label>

                                <select
                                        name="reporting_person"
                                        value={formData.reporting_person}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                    > 

                                    <option value="">Select Reporting Manager</option>

                                    {reportingManager.map((manager) => (
                                        <option key={manager.id} value={manager.id}>
                                            {manager.name}
                                        </option>
                                    ))}
                                </select>


                            </div> 

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Team
                                </label>

                                <select
                                    name="team"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="">Select team</option>
                                    {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Location
                                </label>

                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="">Select location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>

                                    ))}
                                </select>
                            </div>

                        </div>


                        <div className="mt-6 flex items-center justify-between">

                            <label className="flex items-center gap-2 text-sm text-slate-700">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-slate-300"
                                />

                                Active Employee

                            </label>


                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowAddEmployee(false)}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddEmployee}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Save Employee
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {showEmployeeOptions && selectedEmployees && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-5">

                            <h3 className="text-lg font-semibold text-slate-800">
                                Employee Options
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {selectedEmployees.employee_name}
                            </p>

                        </div>

                        <div className="flex flex-col gap-3">

                            <button
                                type="button"
                                 onClick={() => {

                                    setFormData({
                                        employee_name: selectedEmployees.employee_name,
                                        dob: selectedEmployees.dob,
                                        role: selectedEmployees.role,
                                        team: selectedEmployees.team || "",
                                        location: selectedEmployees.location || "",
                                        phone: selectedEmployees.phone,
                                        mail: selectedEmployees.mail,
                                        joining_date: selectedEmployees.joining_date,
                                        employee_type: selectedEmployees.employee_type,
                                        reporting_person: selectedEmployees.reporting_person || "",
                                        is_active: selectedEmployees.is_active,
                                    });

                                    setShowEmployeeOptions(false);
                                    setShowEditEmployee(true);

                                }}
                                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Edit Employee
                            </button>

                            <button
                                type="button"
                                onClick={() => {

                                    const confirmed = window.confirm(
                                        `Are you sure you want to delete ${selectedEmployees.employee_name}?`
                                    );

                                    if (confirmed) {
                                        handleDeleteEmployee();
                                    }

                                }}
                                className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Delete Employee
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedEmployees(null);
                                    setShowEmployeeOptions(false);
                                }}
                                className="w-full rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {showEditEmployee && selectedEmployees && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Edit Employee
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update employee information.
                                </p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Employee Name
                                </label>

                                <input
                                    type="text"
                                    name="employee_name"
                                    value={formData.employee_name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    DOB
                                </label>

                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="mail"
                                    value={formData.mail}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joining_date"
                                    value={formData.joining_date}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Employee Type
                                </label>

                                <select
                                    name="employee_type"
                                    value={formData.employee_type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                >
                                    <option value="EMPLOYEE">
                                        Employee
                                    </option>

                                    <option value="INTERN">
                                        Intern
                                    </option>
                                </select>
                            </div>

                            <div>
                                {/* <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Reporting Manager
                                </label> */}

                                <select
                                    name="reporting_person"
                                    value={formData.reporting_person}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                >

                                    <option value="">Select Reporting Manager</option>

                                    {reportingManager.map((manager)=>(
                                        <option key={manager.id} value={manager.id}>
                                            {manager.name}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Team
                                </label>

                                <select
                                    name="team"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="">Select team</option>
                                    
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Location
                                </label>

                               <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="">Select location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-7">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />

                                <label className="text-sm font-medium text-slate-700">
                                    Active Employee
                                </label>

                            </div>

                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setShowEditEmployee(false)}
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdateEmployee}
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Update Employee
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Employees;