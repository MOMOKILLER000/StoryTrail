import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import React, {useState} from 'react';
import { useRouter } from 'expo-router';
import { IP_address } from '@env';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://${IP_address}:8000/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                Alert.alert("Success", "Login successful!");
                router.replace('/Home');
            } else {
                Alert.alert("Login Failed", JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-white px-6">
            <Text className="text-3xl font-bold mb-12 text-center text-black">
                Welcome to StoryTrail!
            </Text>

            <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base"
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />

            <Pressable
                className="bg-black rounded-xl w-full py-3 shadow-md"
                onPress={handleSubmit}
            >
                <Text className="text-white font-semibold text-center text-base">
                    Log In
                </Text>
            </Pressable>
        </View>
    );
};

export default Login;
