import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>

            <Tabs.Screen name="daily-attendance" options={{
                    title: "Daily Attendance",
                }}
            />

            <Tabs.Screen name="monthly-attendance" options={{
                    title: "Monthly Attendance",
                }}
            />

            <Tabs.Screen name="employees" options={{
                    title: "Employees",
                }}
            />

        </Tabs>
    );
}