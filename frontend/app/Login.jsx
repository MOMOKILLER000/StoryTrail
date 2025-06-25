import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { IP_address } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const router = useRouter();
    const screenHeight = Dimensions.get('window').height;

    const handleSubmit = async () => {
        setEmailError(false);
        setPasswordError(false);
        setPasswordLengthError(false);

        let valid = true;

        if (!email.trim()) {
            setEmailError(true);
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError(true);
            valid = false;
        } else if (password.trim().length < 8) {
            setPasswordLengthError(true);
            valid = false;
        }

        if (!valid) return;

        try {
            const response = await fetch(`http://${IP_address}:8000/api/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                router.replace('/Home');
            } else {
                Alert.alert("Login Failed", JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    const onChangeEmail = (text) => {
        if (emailError && text.trim()) setEmailError(false);
        setEmail(text);
    };

    const onChangePassword = (text) => {
        if ((passwordError && text.trim()) || (passwordLengthError && text.trim().length >= 8)) {
            setPasswordError(false);
            setPasswordLengthError(false);
        }
        setPassword(text);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#e9e6e6',
                    paddingHorizontal: 24,
                    paddingTop:  screenHeight > 400 ? screenHeight * 0.11 : 25,
                    paddingBottom: 40,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    className="text-4xl font-extrabold mb-[20%] text-center text-black"
                    style={{ marginTop: screenHeight > 800 ? '30%' : '15%' }}
                >
                    Welcome to StoryTrail!
                </Text>

                <TextInput
                    className={`w-full border rounded-xl px-4 py-4 mb-[5%] text-xl bg-white ${
                        emailError ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Email"
                    onChangeText={onChangeEmail}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#666"
                />
                {emailError && (
                    <Text className="text-red-600 mb-4 text-sm font-semibold">
                        Email is required
                    </Text>
                )}

                <TextInput
                    className={`w-full border rounded-xl px-4 py-4 mb-[5%] text-xl bg-white ${
                        passwordError || passwordLengthError ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Password"
                    onChangeText={onChangePassword}
                    value={password}
                    secureTextEntry
                    placeholderTextColor="#666"
                />
                {passwordError && (
                    <Text className="text-red-600 mb-4 text-sm font-semibold">
                        Password is required
                    </Text>
                )}
                {passwordLengthError && (
                    <Text className="text-red-600 mb-4 text-sm font-semibold">
                        Password must be at least 8 characters long
                    </Text>
                )}

                <Pressable
                    className="bg-[#00bfa5] rounded-xl w-full py-4 shadow-md mb-6 mt-2"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-semibold text-center text-xl">
                        Log In
                    </Text>
                </Pressable>

                <Text className="text-center text-gray-600 font-semibold mb-6 text-base">
                    Or
                </Text>

                <Pressable
                    className="bg-[#20786e] rounded-xl w-full py-4 shadow-md mb-10"
                    onPress={() => router.push('/Signup')}
                >
                    <Text className="text-white font-semibold text-center text-xl">
                        Create an account
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
