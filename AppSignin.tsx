import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppSignin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        const getRememberedUser = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('savedEmail');
                const savedPassword = await AsyncStorage.getItem('savedPassword');
                if (savedEmail && savedPassword) {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Failed to load user data', error);
            }
        };
        getRememberedUser();
    }, []);

    const handleRememberMe = async () => {
        if (rememberMe) {
            try {
                await AsyncStorage.setItem('savedEmail', email);
                await AsyncStorage.setItem('savedPassword', password);
            } catch (error) {
                console.error('Failed to save user data', error);
            }
        } else {
            try {
                await AsyncStorage.removeItem('savedEmail');
                await AsyncStorage.removeItem('savedPassword');
            } catch (error) {
                console.error('Failed to remove user data', error);
            }
        }
    };

    const signup = () => {
        props.navigation.navigate('AppSignup');
    };

    const signin = () => {
        if (!email || !password) {
            Alert.alert('Bạn không được để trống');
        } else {
            if (password.length < 6) {
                Alert.alert('Password phải trên 6 ký tự');
            } else {
                auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        Alert.alert('Đăng nhập thành công');
                        handleRememberMe();
                        props.navigation.navigate('AppTopTab');
                    })
                    .catch((error) => {
                        Alert.alert('Sai email hoặc password');
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    });
            }
        }
    };

    const forgotPassword = (email) => {
        auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert(`Reset email đã gửi tới ${email}`);
            })
            .catch(function (e) {
                console.log(e);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} placeholder="Nhập email" value={email} onChangeText={(text) => { setEmail(text) }} />
                <Text style={styles.label}>Password:</Text>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập password"
                        value={password}
                        onChangeText={(text) => { setPassword(text) }}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                </View><View style={styles.rememberMeContainer}>
                    <CheckBox value={rememberMe} onValueChange={setRememberMe} />
                    <Text>Remember Me</Text>
                </View>
                <Text onPress={() => setVisible(true)} style={styles.forgotPassword}>Forgot password</Text>
                <TouchableOpacity style={styles.button} onPress={signin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                    <Text>Didn’t have an account? </Text>
                    <Text style={styles.signupText} onPress={signup}>Sign up</Text>
                </View>
            </View>
            <Modal visible={visible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Change Password</Text>
                    <Text style={styles.modalLabel}>Nhập email:</Text>
                    <TextInput onChangeText={(txt) => setEmail(txt)} style={styles.input} />
                    <View style={styles.modalButtonContainer}>
                        <Button title="OK" onPress={() => forgotPassword(email)} />
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <Button title="Hủy" onPress={() => setVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 35,
        textAlign: "center",
        marginTop: '10%',
        fontWeight: 'bold',
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        alignSelf: "center",
        marginTop: 20,
    },
    label: {
        marginTop: '5%',
        marginBottom: '2%',
        fontSize: 18,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        borderColor: '#CCC',
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '3%',
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: '3%',
        color: '#1E90FF',
    },
    button: {
        backgroundColor: '#F3B412',
        width: '60%',
        alignSelf: "center",
        marginTop: '7%',
        alignItems: "center",
        height: 50,
        justifyContent: "center",
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
    },
    signupContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: '5%',
    },
    signupText: {
        color: 'red',
    },
    modalContainer: {
        width: '80%',
        alignSelf: "center",
        marginTop: '10%',
    },
    modalTitle: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 20,
        marginTop: '5%',
        marginBottom: '3%',
    },
    modalButtonContainer: {
        marginTop: '5%',
        width: '70%',
        alignSelf: "center",
    },
});
