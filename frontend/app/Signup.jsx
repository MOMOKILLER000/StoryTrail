import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    SafeAreaView,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IP_address } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

const Signup = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { width, height } = Dimensions.get('window');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const router = useRouter();

    const handleSubmit = async () => {
        // Reset errors
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

    // Dynamic styling tokens
    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-100';
    const cardColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    const placeholderColor = isDark ? '#AAA' : '#666';
    const statusBarStyle = isDark ? 'light-content' : 'dark-content';

    return (
        <SafeAreaView className={`${bgColor} flex-1`}>
            {/* StatusBar */}
            <StatusBar barStyle={statusBarStyle} backgroundColor={isDark ? '#000000' : '#e9e6e6'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: height > 400 ? height * 0.14 : 15,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className={`text-4xl font-extrabold text-center mb-10 ${textColor}`}>
                        Create Account
                    </Text>

                    {/* Email */}
                    <TextInput
                        className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl ${cardColor} ${emailError ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                        placeholder="Email"
                        placeholderTextColor={placeholderColor}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                            if (emailError && text.trim()) setEmailError(false);
                            setEmail(text);
                        }}
                        style={{ color: isDark ? 'white' : 'black' }}
                    />
                    {emailError && (
                        <Text className="text-red-500 mb-2 text-sm font-semibold">Email is required</Text>
                    )}

                    {/* Password */}
                    <View className="relative mb-[5%]">
                        <TextInput
                            className={`w-full border rounded-xl pr-12 pl-4 py-4 text-xl ${cardColor} ${(passwordError || passwordLengthError) ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                            placeholder="Password"
                            placeholderTextColor={placeholderColor}
                            secureTextEntry={secureTextEntry}
                            autoCapitalize="none"
                            value={password}
                            style={{ color: isDark ? 'white' : 'black' }}
                            onChangeText={(text) => {
                                if ((passwordError && text.trim()) || (passwordLengthError && text.trim().length >= 8)) {
                                    setPasswordError(false);
                                    setPasswordLengthError(false);
                                }
                                setPassword(text);
                            }}
                        />
                        <Pressable
                            style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] }}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        >
                            {secureTextEntry ? <Entypo name="eye" size={24} color={isDark ? 'white' : 'black'} /> : <Entypo name="eye-with-line" size={24} color={isDark ? 'white' : 'black'} />}
                        </Pressable>
                    </View>
                    {passwordError && (
                        <Text className="text-red-500 mb-2 text-sm font-semibold">Password is required</Text>
                    )}
                    {passwordLengthError && (
                        <Text className="text-red-500 mb-2 text-sm font-semibold">Password must be at least 8 characters</Text>
                    )}

                    {/* Username */}
                    <TextInput
                        className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl ${cardColor} ${usernameError ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                        placeholder="Username"
                        placeholderTextColor={placeholderColor}
                        value={username}
                        onChangeText={(text) => {
                            if (usernameError && text.trim()) setUsernameError(false);
                            setUsername(text);
                        }}
                        style={{ color: isDark ? 'white' : 'black' }}
                    />
                    {usernameError && (
                        <Text className="text-red-500 mb-2 text-sm font-semibold">Username is required</Text>
                    )}

                    {/* First & Last Name */}
                    <View className="w-full flex-row justify-between">
                        <View className="w-[48%]">
                            <TextInput
                                className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl ${cardColor} ${firstNameError ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                                placeholder="First Name"
                                placeholderTextColor={placeholderColor}
                                value={firstName}
                                onChangeText={(text) => {
                                    if (firstNameError && text.trim()) setFirstNameError(false);
                                    setFirstName(text);
                                }}
                                style={{ color: isDark ? 'white' : 'black' }}
                            />
                            {firstNameError && (
                                <Text className="text-red-500 mb-2 text-sm font-semibold">First name is required</Text>
                            )}
                        </View>
                        <View className="w-[48%]">
                            <TextInput
                                className={`w-full border rounded-xl px-4 py-4 mb-2 text-xl ${cardColor} ${lastNameError ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                                placeholder="Last Name"
                                placeholderTextColor={placeholderColor}
                                value={lastName}
                                onChangeText={(text) => {
                                    if (lastNameError && text.trim()) setLastNameError(false);
                                    setLastName(text);
                                }}
                                style={{ color: isDark ? 'white' : 'black' }}
                            />
                            {lastNameError && (
                                <Text className="text-red-500 mb-2 text-sm font-semibold">Last name is required</Text>
                            )}
                        </View>
                    </View>

                    {/* Actions */}
                    <Pressable
                        className={`rounded-xl w-full py-4 shadow-md mt-6 ${isDark ? 'bg-teal-600' : 'bg-teal-400'}`}
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-semibold text-center text-xl">Sign Up</Text>
                    </Pressable>

                    <Text className={`text-center font-semibold my-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Or</Text>

                    <Pressable
                        className={`rounded-xl w-full py-4 shadow-md mb-6 ${isDark ? 'bg-teal-800' : 'bg-teal-700'}`}
                        onPress={() => router.push('/Login')}
                    >
                        <Text className="text-white font-semibold text-center text-xl">Log into your account</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;

