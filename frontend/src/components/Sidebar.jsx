import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    ClipboardList,
} from "lucide-react";

const Sidebar = () => {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard,
        },
        {
            name: "Employees",
            path: "/employees",
            icon: Users,
        },
        {
            name: "Daily Attendance",
            path: "/attendance/daily",
            icon: CalendarCheck,
        },
        {
            name: "Monthly Attendance",
            path: "/attendance/monthly",
            icon: CalendarDays,
        },
        {
            name: "Leave Management",
            path: "/leave",
            icon: ClipboardList,
        },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">

            <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                    <CalendarCheck size={22} />
                </div>

                <div>

                    <h1 className="text-lg font-bold">
                        Attendance
                    </h1>


                </div>

            </div>

            <div className="px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-500">
                    MAIN MENU
                </p>

                <nav className="space-y-1">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >

                                <Icon size={19} />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>

            </div>

            

        </aside>
    );
};

export default Sidebar;