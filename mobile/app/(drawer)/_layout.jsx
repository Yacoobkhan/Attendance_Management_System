import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
    return (
        <Drawer>

            <Drawer.Screen name="daily-attendance" options={{
                    drawerLabel: "Daily Attendance",
                    title: "Daily Attendance",
                }}
            />

            <Drawer.Screen name="monthly-attendance" options={{
                    drawerLabel: "Monthly Attendance",
                    title: "Monthly Attendance",
                }}
            />

            <Drawer.Screen name="employees" options={{
                    drawerLabel: "Employees",
                    title: "Employees",
                }}
            />

        </Drawer>
    );
}