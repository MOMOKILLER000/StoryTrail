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

const Login = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const router = useRouter();
    const screenHeight = Dimensions.get('window').height;
    const [secureTextEntry, setSecureTextEntry] = useState(true);

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
            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                router.replace('/Home');
            } else {
                Alert.alert('Login Failed', JSON.stringify(data));
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
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

    // Dynamic styling tokens
    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-100';
    const cardColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    const placeholderColor = isDark ? '#AAA' : '#666';
    const statusBarStyle = isDark ? 'light-content' : 'dark-content';

    return (
        <SafeAreaView className={`${bgColor} flex-1`}>
            {/* StatusBar: sets text/icons color and background */}
            <StatusBar
                barStyle={statusBarStyle}
                backgroundColor={isDark ? '#000000' : '#e9e6e6'}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: screenHeight > 400 ? screenHeight * 0.11 : 25,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text
                        className={`text-4xl font-extrabold mb-[20%] text-center ${textColor}`}
                        style={{ marginTop: screenHeight > 800 ? '30%' : '15%' }}
                    >
                        Welcome to StoryTrail!
                    </Text>

                    <TextInput
                        className={`w-full border rounded-xl px-4 py-4 mb-[5%] text-xl ${cardColor} ${isDark ? 'border-gray-600' : 'border-gray-400'}`}
                        placeholder="Email"
                        placeholderTextColor={placeholderColor}
                        onChangeText={onChangeEmail}
                        value={email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={{ color: isDark ? 'white' : 'black' }}
                    />
                    {emailError && (
                        <Text className="text-red-500 mb-4 text-sm font-semibold">
                            Email is required
                        </Text>
                    )}

                    <View className="relative mb-[5%]">
                        <TextInput
                            className={`w-full border rounded-xl pr-12 pl-4 py-4 text-xl ${cardColor} ${passwordError || passwordLengthError ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-400'}`}
                            placeholder="Password"
                            placeholderTextColor={placeholderColor}
                            onChangeText={onChangePassword}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry={secureTextEntry}
                            style={{ color: isDark ? 'white' : 'black' }}
                        />
                        <Pressable
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: [{ translateY: -12 }],
                            }}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        >
                            {secureTextEntry ? (
                                <Entypo name="eye" size={24} color={isDark ? 'white' : 'black'} />
                            ) : (
                                <Entypo name="eye-with-line" size={24} color={isDark ? 'white' : 'black'} />
                            )}
                        </Pressable>
                    </View>
                    {passwordError && (
                        <Text className="text-red-500 mb-4 text-sm font-semibold">
                            Password is required
                        </Text>
                    )}
                    {passwordLengthError && (
                        <Text className="text-red-500 mb-4 text-sm font-semibold">
                            Password must be at least 8 characters long
                        </Text>
                    )}

                    <Pressable
                        className={`rounded-xl w-full py-4 shadow-md mb-6 mt-2 ${isDark ? 'bg-teal-600' : 'bg-teal-400'}`}
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-semibold text-center text-xl">
                            Log In
                        </Text>
                    </Pressable>

                    <Text className={`text-center font-semibold mb-6 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Or</Text>

                    <Pressable
                        className={`rounded-xl w-full py-4 shadow-md mb-10 ${isDark ? 'bg-teal-800' : 'bg-teal-700'}`}
                        onPress={() => router.push('/Signup')}
                    >
                        <Text className="text-white font-semibold text-center text-xl">
                            Create an account
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
