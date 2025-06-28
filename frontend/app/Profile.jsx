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
} from 'react-native';
import { IP_address } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useRouter} from "expo-router";

const { width } = Dimensions.get('window');

export default function Profile() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    // Define all theme colors in one place
    const theme = useMemo(() => ({
        background: isDark ? '#121212' : 'white',
        card: isDark ? '#1e1e1e' : 'white',
        text: isDark ? '#e1e1e1' : '#333',
        border: isDark ? '#333' : '#ccc',
        primary: isDark ? '#0f766e' : '#20786e',
        messageBg: isDark ? '#0f766e' : '#20786e',
    }), [isDark]);

    const styles = getStyles(theme);

    const [user, setUser] = useState({
        username: 'test',
        first_name: 'test',
        last_name: 'test',
    });
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        fetch(`http://${IP_address}:8000/api/profile/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                // populate user state if returned
                setUser(data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch(`http://${IP_address}:8000/api/profile/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                setResponseMessage('Your data has been successfully saved.');
            } else {
                setResponseMessage('Something went wrong. Try again.');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                {/* HEADER */}
                <ImageBackground
                    source={require('../assets/images/profileBg.png')}
                    style={styles.header}
                    resizeMode="cover"
                />

                {/* SCROLLVIEW */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inner}>
                        <Text style={[styles.title, { color: theme.text }]}>Edit profile</Text>

                        {['first_name', 'last_name', 'username'].map((field) => (
                            <View key={field} style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>
                                    {field === 'username'
                                        ? 'Username'
                                        : field === 'first_name'
                                            ? 'First name'
                                            : 'Last name'}
                                </Text>
                                <TextInput
                                    value={user[field]}
                                    placeholder={field === 'username' ? 'Username' : field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    placeholderTextColor={isDark ? '#888' : '#aaa'}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#1e1e1e' : 'white',
                                            borderColor: theme.border,
                                            color: theme.text,
                                        },
                                    ]}
                                    onChangeText={(text) => setUser({ ...user, [field]: text })}
                                />
                            </View>
                        ))}

                        <Pressable style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {responseMessage.length > 1 && (
                    <View style={[styles.message, { backgroundColor: theme.messageBg }]}>
                        <Text style={styles.messageText}>{responseMessage}</Text>
                        <AntDesign
                            name="closecircle"
                            size={20}
                            color="white"
                            style={styles.closeIcon}
                            onPress={() => setResponseMessage('')}
                        />
                    </View>
                )}

                {/* PROFILE PIC */}
                <Image
                    source={require('../assets/images/testPfp.png')}
                    style={styles.pfp}
                />

                <Pressable
                    onPress={() => {
                        router.replace('/Home')
                    }}
                    style={styles.beforeIcon}
                >
                    <MaterialIcons
                        name="navigate-before"
                        size={28}
                        color={theme.text}
                    />
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function getStyles(theme) {
    return StyleSheet.create({
        safe: {
            flex: 1,
        },
        flex: {
            flex: 1,
        },
        header: {
            width: '100%',
            height: 120,
        },
        scroll: {
            width: '100%',
        },
        scrollContent: {
            flexGrow: 1,
            paddingTop: 80,
            paddingBottom: 40,
            paddingHorizontal: 12,
            backgroundColor: theme.background,
        },
        inner: {
            width: '100%',
            alignItems: 'center',
        },
        title: {
            fontSize: 30,
            fontWeight: '600',
            marginBottom: 24,
            textAlign: 'center',
        },
        inputGroup: {
            width: '80%',
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
            bottom: 60,
            left: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
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
        closeIcon: {
            padding: 4,
        },
        beforeIcon: {
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : 40,
            left: 16,
            zIndex: 20,
            padding: 8,
            borderRadius: 24,
            backgroundColor: theme.card,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.5,
        },
        pfp: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: 'white',
            position: 'absolute',
            top: 60,
            left: width / 2 - 60,
            zIndex: 10,
        },
    });
}
