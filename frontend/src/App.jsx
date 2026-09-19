import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
import MonthlyAttendance from "./pages/MonthlyAttendance";
import Employees from "./pages/Employees";
import DailyAttendance from "./pages/DailyAttendance";

import Login from "./pages/Login";

const App = () => {
    return (
        <Routes>

            <Route path='/login' element={<Login />}/>

            <Route path="/" element={<Layout />}>

            <Route index element={<DailyAttendance />}/>

            <Route path='/attendance/daily' element={<DailyAttendance />}/>

            
            <Route path="attendance/monthly" element={<MonthlyAttendance />}/>
                
        {/* <Route index element={<Dashboard />} /> */}
            
            <Route path="employees" element={<Employees />} />

        {/* <Route path="leave" element={ <div> Leave Management </div> }/> */}

            </Route>

        </Routes>
    );
};

export default App;