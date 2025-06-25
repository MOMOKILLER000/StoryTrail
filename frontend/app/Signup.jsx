import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import {router, useNavigation} from 'expo-router';
import {useRouter} from "expo-router";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password,
                    'username': username,
                    'first_name': firstName,
                    'last_name': lastName }),
            });

            const data = await response.json();
            console.log("Signup response:", data);

            if (response.ok) {
                Alert.alert("Success", "Signup successful!");
                router.replace('/Home');
            } else {
                Alert.alert("Signup Failed", JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error during signup:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-white px-6">
            <Text className="text-3xl font-bold mb-10 text-center text-black">
                Welcome to StoryTrail!
            </Text>

            <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
                placeholder="First Name"
                onChangeText={setFirstName}
                value={firstName}
            />

            <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
                placeholder="Last Name"
                onChangeText={setLastName}
                value={lastName}
            />

            <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
            />

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
                className="bg-black rounded-xl w-full py-3"
                onPress={handleSubmit}
            >
                <Text className="text-white font-semibold text-center text-base">
                    Sign Up
                </Text>
            </Pressable>
        </View>
    );
};

export default Signup;
