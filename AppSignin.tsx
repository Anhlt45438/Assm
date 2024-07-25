import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';


import { signInWithEmailAndPassword, sendPasswordResetEmail, } from "firebase/auth";
export default function AppSignin(props) {
    const [email, setmail] = useState('')
    const [pass, setpass] = useState('')
    const [visible, setvisible] = useState(false)

    const signup = () => {
        props.navigation.navigate('AppSignup')
    }
    const signin = () => {
        if (!email || !pass) {
            Alert.alert('bạn ko được để trống')
        } else {
            if (pass.length < 6) {
                Alert.alert('password phải trên 6 ký tự')
            } else {
                auth().
                    signInWithEmailAndPassword(email, pass)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        Alert.alert('succesfull')
                        props.navigation.navigate('AppTopTab')
                        // ...
                    })
                    .catch((error) => {
                        Alert.alert('sai email hoặc password')
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    });
            }
        }
    }

    const forgotPassword = (email) => {

        console.log("reset email sent to " + email);
        auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("reset email sent to " + email);
            })
            .catch(function (e) {
                console.log(e);
            });
    };

    return (
        <View>
            <Text style={st.tx}>Sign in</Text>
            <View style={{ width: '80%', alignSelf: "center" }}>
                <Text style={st.tx1}>email:</Text>
                <TextInput style={st.tip} placeholder="Nhập email" onChangeText={(text) => { setmail(text) }} />
                <Text style={st.tx2}>password:</Text>
                <TextInput style={st.tip} placeholder="Nhập password" onChangeText={(text) => { setpass(text) }} />
                <Text onPress={() => setvisible(true)} style={{ alignSelf: "flex-end", marginTop: '3%' }}>Forgot password</Text>
                <TouchableOpacity style={st.bt} onPress={signin}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: '5%' }}>
                    <Text>Didn’t have an account? </Text>
                    <Text style={{ color: 'red' }} onPress={signup}>Sign up</Text>
                </View>
            </View>
            <Modal visible={visible}>
                <View style={{ width: '80%', alignSelf: "center" }}>
                    <Text style={st.tx}>Chance Password</Text>
                    <Text style={st.tx3}>Nhap email:</Text>
                    <TextInput onChangeText={(txt) => setmail(txt)} style={st.tip} />
                    <View style={st.bt1}>
                        <Button title="OK" onPress={() => forgotPassword(email)} />
                    </View>
                    <View style={st.bt1}>
                        <Button title="Huy" onPress={() => setvisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const st = StyleSheet.create(
    {
        tx: {
            fontSize: 35, textAlign: "center", marginTop: '25%', fontWeight: 'bold'
        }, tip: {
            borderWidth: 1
        }, tx1: {
            marginTop: '10%', marginBottom: '3%'
        }, tx2: {
            marginTop: '5%', marginBottom: '3%'
        }, bt: {
            backgroundColor: '#F3B412', width: '60%', alignSelf: "center"
            , marginTop: '7%', alignItems: "center", height: '15%', justifyContent: "center",
            borderRadius: 20
        }, tx3: {
            fontSize: 20, marginTop: '5%', marginBottom: '3%'
        }, bt1: {
            marginTop: '5%', width: '70%', alignSelf: "center"
        }
    }
)