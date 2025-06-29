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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';

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
            editButton: isDark ? '#ffffff' : '#121212',
        }),
        [isDark]
    );

    const styles = getStyles(theme);

    const [user, setUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        profile_picture: '',
    });
    const [localImageFile, setLocalImageFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('access');
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
                    username: data.username || '',
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    profile_picture: data.profile_picture || '',
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
            const formData = new FormData();

            formData.append('username', user.username);
            formData.append('first_name', user.first_name);
            formData.append('last_name', user.last_name);

            // Native mobile or web file upload
            if (Platform.OS === 'web') {
                if (localImageFile instanceof File) {
                    formData.append('profile_picture', localImageFile, localImageFile.name);
                }
            } else {
                if (user.profile_picture && user.profile_picture.startsWith('file://')) {
                    // Append only fresh local file URIs
                    const uri = user.profile_picture;
                    const filename = uri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const ext = match ? match[1] : 'jpg';
                    const mimeType = `image/${ext}`;
                    formData.append('profile_picture', { uri, name: filename, type: mimeType });
                }
            }


            const res = await fetch(`http://${IP_address}:8000/api/profile/`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                console.log('Upload failed:', await res.text());
                setResponseMessage('Something went wrong. Try again.');
                return;
            }

            const data = await res.json();

            setUser(prev => ({
                ...prev,
                profile_picture: data.profile_picture
                    ? data.profile_picture + `?v=${Date.now()}`
                    : prev.profile_picture,
            }));
            setLocalImageFile(null);
            setResponseMessage('Your data has been successfully saved.');
        } catch (err) {
            console.log('Save error:', err);
            setResponseMessage('Something went wrong. Try again.');
        }
    };

    const openImagePicker = async () => {
        if (Platform.OS === 'web') {
            // Create file input dynamically
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
                const file = input.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    setUser(prev => ({ ...prev, profile_picture: url }));
                    setLocalImageFile(file);
                }
            };
            input.click();
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission to access photos is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setUser(prev => ({ ...prev, profile_picture: uri }));
        }
    };

    const sourceUri = (() => {
        if (localImageFile) {
            // Web: use preview URL from the File
            if (Platform.OS === 'web') {
                return user.profile_picture; // Should be a blob URL already
            }
        }

        if (user.profile_picture) {
            if (
                user.profile_picture.startsWith('http') ||     // Full URL
                user.profile_picture.startsWith('file://') ||  // Local file (native)
                user.profile_picture.startsWith('blob:')       // Blob URL (web preview)
            ) {
                return user.profile_picture;
            }
            // Backend relative path (e.g. "/media/profile_pictures/...")
            return `http://${IP_address}:8000${user.profile_picture}`;
        }

        return null;
    })();

    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => setResponseMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [responseMessage]);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.select({ ios: 'padding', android: 'height' })}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 30}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        <ImageBackground
                            source={require('../../assets/images/profileBg.png')}
                            style={styles.header}
                        >
                            <Pressable onPress={() => router.replace('/Home')} style={styles.beforeIcon}>
                                <MaterialIcons name="navigate-before" size={28} color={theme.text} />
                            </Pressable>
                        </ImageBackground>

                        <View style={styles.pfpContainer}>
                            {sourceUri ? (
                                <Image source={{ uri: sourceUri }} style={styles.pfp} />
                            ) : (
                                <Image
                                    source={require('../../assets/images/defaultProfile.png')}
                                    style={styles.pfp}
                                />
                            )}

                            <Pressable style={styles.editButton} onPress={openImagePicker}>
                                <Feather name="edit-2" size={24} color={isDark ? 'black' : 'white'} />
                            </Pressable>
                        </View>

                        <View style={styles.inner}>
                            <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
                            {['email', 'first_name', 'last_name', 'username'].map(field => (
                                <View key={field} style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: theme.text }]}>
                                        {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Text>
                                    <TextInput
                                        value={user[field]}
                                        editable={field !== 'email'}
                                        placeholder={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        placeholderTextColor={isDark ? '#888888' : '#aaaaaa'}
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: theme.card,
                                                borderColor: theme.border,
                                                color: theme.text,
                                            },
                                        ]}
                                        onChangeText={text => setUser(u => ({ ...u, [field]: text }))}
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
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        editButton:{
            padding: 4,
            backgroundColor: theme.editButton,
            borderRadius: 30,
            top: -25,
            left: 30,
        }
    });
}
