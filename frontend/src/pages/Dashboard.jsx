import {
    Users,
    UserCheck,
    Home,
    UserMinus,
} from "lucide-react";

const Dashboard = () => {
    const stats = [
        {
            title: "Total Employees",
            value: 4,
            icon: Users,
        },
        {
            title: "Present Today",
            value: 2,
            icon: UserCheck,
        },
        {
            title: "WFH Today",
            value: 1,
            icon: Home,
        },
        {
            title: "On Leave Today",
            value: 1,
            icon: UserMinus,
        },
    ];

    return (
        <div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of your employee attendance system
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                {stats.map((item) => {

                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {item.title}
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Icon size={24} />
                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default Dashboard;