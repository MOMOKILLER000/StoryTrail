import React, { useEffect, useState, useMemo } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    StyleSheet,
    Dimensions,
    Pressable,
    useColorScheme,
    StatusBar,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { IP_address } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

export default function Profile() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const theme = useMemo(
        () => ({
            background: isDark ? '#121212' : '#ffffff',
            card: isDark ? '#1e1e1e' : '#ffffff',
            text: isDark ? '#e1e1e1' : '#333333',
            border: isDark ? '#333333' : '#cccccc',
            primary: isDark ? '#0f766e' : '#20786e',
            messageBg: isDark ? '#0f766e' : '#20786e',
            statusBarStyle: isDark ? 'light-content' : 'dark-content',
        }),
        [isDark]
    );

    const styles = getStyles(theme);

    const [user, setUser] = useState({ username: 'test', first_name: 'test', last_name: 'test', email: 'test@test.com' });
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('access');
                console.log("The token is: ", token);
                const res = await fetch(`http://${IP_address}:8000/api/profile/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.log('Failed to fetch profile:', res.status);
                    return;
                }

                const data = await res.json();
                setUser({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    username: data.username || '',
                    email: data.email || '',
                });
            } catch (error) {
                console.log('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('access');
            const res = await fetch(`http://${IP_address}:8000/api/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });
            setResponseMessage(res.ok ? 'Your data has been successfully saved.' : 'Something went wrong. Try again.');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (responseMessage) {
            const timeout = setTimeout(() => setResponseMessage(''), 5000);
            return () => clearTimeout(timeout);
        }
    }, [responseMessage]);

    const MainContent = (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios' ? 'padding' :
                        Platform.OS === 'android' ? 'height' :
                            undefined
                }
                keyboardVerticalOffset={30}
            >
                <View style={styles.flex}>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* HEADER */}
                        <ImageBackground
                            source={require('../../assets/images/profileBg.png')}
                            style={styles.header}
                        >
                            <Pressable onPress={() => router.replace('/Home')} style={styles.beforeIcon}>
                                <MaterialIcons name="navigate-before" size={28} color={theme.text} />
                            </Pressable>
                        </ImageBackground>

                        {/* PROFILE PIC */}
                        <View style={styles.pfpContainer}>
                            <Image
                                source={require('../../assets/images/testPfp.png')}
                                style={styles.pfp}
                            />
                        </View>

                        {/* FORM */}
                        <View style={styles.inner}>
                            <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
                            {['first_name', 'last_name', 'username', 'email'].map((field) => (
                                <View key={field} style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: theme.text }]}>
                                        {field === 'first_name'
                                            ? 'First Name'
                                            : field === 'last_name'
                                                ? 'Last Name'
                                                : field === 'username'
                                                    ? 'Username'
                                                    : 'Email'}
                                    </Text>
                                    <TextInput
                                        value={user[field]}
                                        editable={field !== 'email'}
                                        placeholder={
                                            field === 'username'
                                                ? 'Username'
                                                : field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                                        }
                                        placeholderTextColor={isDark ? '#888888' : '#aaaaaa'}
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: theme.card,
                                                borderColor: theme.border,
                                                color: theme.text,
                                            },
                                        ]}
                                        onChangeText={(text) => setUser((u) => ({ ...u, [field]: text }))}
                                    />
                                </View>
                            ))}
                            <Pressable
                                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </Pressable>
                        </View>
                    </ScrollView>

                    {/* FEEDBACK MESSAGE */}
                    {responseMessage ? (
                        <View style={[styles.message, { backgroundColor: theme.messageBg }]}>
                            <Text style={styles.messageText}>{responseMessage}</Text>
                            <AntDesign
                                name="closecircle"
                                size={20}
                                color="white"
                                onPress={() => setResponseMessage('')}
                            />
                        </View>
                    ) : null}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    return Platform.OS !== 'web' ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {MainContent}
        </TouchableWithoutFeedback>
    ) : (
        MainContent
    );
}

function getStyles(theme) {
    return StyleSheet.create({
        safe: { flex: 1 },
        flex: { flex: 1 },
        scroll: { flex: 1 },
        scrollContent: {
            paddingBottom: 100,
            backgroundColor: theme.background,
        },
        header: {
            width: '100%',
            height: 120,
            justifyContent: 'center',
        },
        beforeIcon: {
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : 40,
            left: 16,
            padding: 8,
            borderRadius: 24,
            backgroundColor: theme.card,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.5,
        },
        pfpContainer: {
            alignItems: 'center',
            marginTop: -60,
            marginBottom: 20,
        },
        pfp: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: 'white',
        },
        inner: {
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        title: {
            fontSize: 30,
            fontWeight: '600',
            marginBottom: 24,
        },
        inputGroup: {
            width: '90%',
            marginBottom: 16,
        },
        label: {
            fontSize: 18,
            marginBottom: 8,
        },
        input: {
            width: '100%',
            borderWidth: 1,
            fontSize: 16,
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        saveButton: {
            marginTop: 15,
            width: '60%',
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
        },
        saveButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
        },
        message: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderRadius: 12,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        messageText: {
            color: 'white',
            fontSize: 15,
            flex: 1,
            marginRight: 12,
        },
    });
}
