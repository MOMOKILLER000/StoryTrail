import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,               // <-- hide header here
                tabBarIcon: ({ color, size }) => {
                    let iconName = "circle";
                    if (route.name === "home") iconName = "home";
                    else if (route.name === "profile") iconName = "user";

                    return <FontAwesome name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#00bfa5",
                tabBarInactiveTintColor: "gray",
            })}
        />
    );
}
