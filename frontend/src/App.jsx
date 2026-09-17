import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MonthlyAttendance from "./pages/MonthlyAttendance";

const App = () => {
    return (
        <Routes>

            <Route
                path="/"
                element={<Layout />}
            >

                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="employees"
                    element={
                        <div>
                            Employees
                        </div>
                    }
                />

                <Route
                    path="attendance/daily"
                    element={
                        <div>
                            Daily Attendance
                        </div>
                    }
                />

                <Route
                    path="attendance/monthly"
                    element={<MonthlyAttendance />}
                />

                <Route
                    path="leave"
                    element={
                        <div>
                            Leave Management
                        </div>
                    }
                />

            </Route>

        </Routes>
    );
};

export default App;