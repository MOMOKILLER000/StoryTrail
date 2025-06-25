import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem("token").then(token => {
            setAuthenticated(!!token);
        });
    }, []);

    if (authenticated === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <Redirect href={authenticated ? "/Home" : "/Login"} />;
}