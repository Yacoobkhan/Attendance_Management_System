import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MonthlyAttendance from "./pages/MonthlyAttendance";
import Employees from "./pages/Employees";
import DailyAttendance from "./pages/DailyAttendance";

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
                    element={<Employees />}
                />

                <Route
                    path="attendance/daily"
                    element={<DailyAttendance />}
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