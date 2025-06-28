import { View, Text, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform,  Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { IP_address } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from "@expo/vector-icons/Entypo";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const {width, height} = Dimensions.get('window');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const router = useRouter();

    const handleSubmit = async () => {
        // reset errors
        setEmailError(false);
        setPasswordError(false);
        setPasswordLengthError(false);
        setUsernameError(false);
        setFirstNameError(false);
        setLastNameError(false);

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
        if (!username.trim()) {
            setUsernameError(true);
            valid = false;
        }
        if (!firstName.trim()) {
            setFirstNameError(true);
            valid = false;
        }
        if (!lastName.trim()) {
            setLastNameError(true);
            valid = false;
        }

        if (!valid) return;

        try {
            const response = await fetch(`http://${IP_address}:8000/api/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                Alert.alert('Success', 'Signup successful!');
                router.replace('/Home');
            } else {
                Alert.alert('Signup Failed', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error during signup:', error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-[#e9e6e6]"
        >
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: height > 400 ? height * 0.14 : 15, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text className="text-4xl font-extrabold text-center text-black mb-10">
                    Create Account
                </Text>

                {/* Input Fields */}
                <TextInput
                    className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl bg-white ${emailError ? 'border-red-500' : 'border-gray-400'}`}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={text => {
                        if (emailError && text.trim()) setEmailError(false);
                        setEmail(text);
                    }}
                />
                {emailError && <Text className="text-red-600 mb-2 text-sm font-semibold">Email is required</Text>}
                <View className="relative mb-[5%]">
                <TextInput
                    className={`w-full border rounded-xl pr-12 pl-4 py-4 text-xl bg-white ${
                        passwordError || passwordLengthError ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={text => {
                        if ((passwordError && text.trim()) || (passwordLengthError && text.trim().length >= 8)) {
                            setPasswordError(false);
                            setPasswordLengthError(false);
                        }
                        setPassword(text);
                    }}
                />
                <Pressable style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: [{ translateY: -12 }],
                }}
                           onPress={()=>{setSecureTextEntry(!secureTextEntry)}}
                >
                    {secureTextEntry ? (<Entypo name="eye" size={24} color="black" />) : (<Entypo name="eye-with-line" size={24} color="black" />)}
                </Pressable>
                </View>
                {passwordError && <Text className="text-red-600 mb-2 text-sm font-semibold">Password is required</Text>}
                {passwordLengthError && <Text className="text-red-600 mb-2 text-sm font-semibold">Password must be at least 8 characters</Text>}

                <TextInput
                    className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl bg-white ${usernameError ? 'border-red-500' : 'border-gray-400'}`}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={text => {
                        if (usernameError && text.trim()) setUsernameError(false);
                        setUsername(text);
                    }}
                />
                {usernameError && <Text className="text-red-600 mb-2 text-sm font-semibold">Username is required</Text>}

                <View className="w-full flex-row justify-between">
                    <View className="w-[48%]">
                        <TextInput
                            className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl bg-white ${firstNameError ? 'border-red-500' : 'border-gray-400'}`}
                            placeholder="First Name"
                            placeholderTextColor="#666"
                            value={firstName}
                            onChangeText={text => {
                                if (firstNameError && text.trim()) setFirstNameError(false);
                                setFirstName(text);
                            }}
                        />
                        {firstNameError && <Text className="text-red-600 mb-2 text-sm font-semibold">First name is required</Text>}
                    </View>

                    <View className="w-[48%]">
                        <TextInput
                            className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl bg-white ${lastNameError ? 'border-red-500' : 'border-gray-400'}`}
                            placeholder="Last Name"
                            placeholderTextColor="#666"
                            value={lastName}
                            onChangeText={text => {
                                if (lastNameError && text.trim()) setLastNameError(false);
                                setLastName(text);
                            }}
                        />
                        {lastNameError && <Text className="text-red-600 mb-2 text-sm font-semibold">Last name is required</Text>}
                    </View>
                </View>

                {/* Action Buttons */}
                <Pressable
                    className="bg-[#00bfa5] rounded-xl w-full py-4 shadow-md mt-6"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-semibold text-center text-xl">Sign Up</Text>
                </Pressable>

                <Text className="text-center text-gray-600 font-semibold my-4 text-base">Or</Text>

                <Pressable
                    className="bg-[#20786e] rounded-xl w-full py-4 shadow-md mb-6"
                    onPress={() => router.push('/Login')}
                >
                    <Text className="text-white font-semibold text-center text-xl">Log into you account</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Signup;
