import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth from '@react-native-firebase/auth';
import { RadioButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

export default function AppSignup(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repass, setRepass] = useState('');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');
    const [like, setLike] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const validateDate = (date) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(date)) return false;
        const [day, month, year] = date.split('/').map(Number);
        if (month < 1 || month > 12 || day < 1 || day > 31) return false;
        return true;
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@gmail\.com$/;
        return regex.test(email);
    };

    const handleNextStep = () => {
        if (!email || !password || !repass) {
            Alert.alert('Error', 'Cần điền đủ thông tin các trường.');
            return;
        }
        if (password.length < 6 || repass.length < 6) {
            Alert.alert('Error', 'Password phải có ít nhất 6 kí tự.');
            return;
        }
        if (password !== repass) {
            Alert.alert('Error', 'Passwords không trùng khớp.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Email phải theo định dạng @gmail.com.');
            return;
        }
        setStep(2);
    };

    const handleSignup = () => {
        if (!name || !date || !like || !height || !weight) {
            Alert.alert('Error', 'Các trường không được để trống.');
            return;
        }
        if (!validateDate(date)) {
            Alert.alert('Error', 'Ngày sinh phải theo định dạng dd/MM/yyyy.');
            return;
        }
        if (isNaN(height) || isNaN(weight)) {
            Alert.alert('Error', 'Chiều cao phải là số (cm).');
            return;
        }

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                firestore()
                    .collection('Users')
                    .add({
                        name,
                        date,
                        gender,
                        like,
                        height,
                        weight,
                        email,
                    })
                    .then(() => {
                        Alert.alert('Success', 'Đăng ký thông tin thành công.');
                        props.navigation.navigate('AppSignin');
                    })
                    .catch((error) => {
                        Alert.alert('Error', 'Đăng ký thông tin người dùng thất bại.');
                    });
            })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => props.navigation.navigate('AppSignin')}>
                <Image source={require('./img/back.png')} style={styles.img} />
            </TouchableOpacity>
            <Text style={styles.tx}>Sign up</Text>
            <ScrollView>
                <View style={{ width: '80%', alignSelf: "center" }}>
                    {step === 1 ? (
                        <>
                            <Text style={styles.tx1}>Email:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập email" value={email} onChangeText={setEmail} />
                            <Text style={styles.tx2}>Password:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập password" value={password}
                                onChangeText={(text) => { setPassword(text) }} onChangeText={setPassword}
                                secureTextEntry={!showPassword} />
                            <Text style={styles.tx2}>Re-enter Password:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập lại password" value={repass}
                                onChangeText={(text) => { setPassword(text) }} onChangeText={setRepass}
                                secureTextEntry={!showPassword} />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bt} onPress={handleNextStep}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Next</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.tx2}>Nhập họ và tên:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập họ tên" value={name} onChangeText={setName} />
                            <Text style={styles.tx2}>Giới tính:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="male"
                                    status={gender === 'male' ? 'checked' : 'unchecked'}
                                    onPress={() => setGender('male')}
                                />
                                <Text>Nam</Text>
                                <RadioButton
                                    value="female"
                                    status={gender === 'female' ? 'checked' : 'unchecked'}
                                    onPress={() => setGender('female')}
                                />
                                <Text>Nữ</Text>
                            </View>
                            <Text style={styles.tx2}>Nhập ngày sinh:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập ngày sinh: dd/MM/yyyy" value={date} onChangeText={setDate} />
                            <Text style={styles.tx2}>Nhập sở thích:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập sở thích" value={like} onChangeText={setLike} />
                            <Text style={styles.tx2}>Nhập chiều cao:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập chiều cao (cm)" value={height} onChangeText={setHeight} />
                            <Text style={styles.tx2}>Nhập cân nặng:</Text>
                            <TextInput style={styles.tip} placeholder="Nhập cân nặng (kg)" value={weight} onChangeText={setWeight} />
                            <TouchableOpacity style={styles.bt} onPress={handleSignup}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Sign Up</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    tx: {
        fontSize: 35,
        textAlign: "center",
        marginTop: '10%',
        fontWeight: 'bold'
    },
    tip: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    tx1: {
        marginTop: '10%',
        marginBottom: '3%'
    },
    tx2: {
        marginTop: '5%',
        marginBottom: '3%'
    },
    bt: {
        backgroundColor: '#F3B412',
        width: '80%',
        alignSelf: "center",
        marginTop: '7%',
        alignItems: "center",
        height: 50,
        justifyContent: "center",
        borderRadius: 20
    },
    img: {
        marginStart: '3%',
        marginTop: '5%'
    }
});