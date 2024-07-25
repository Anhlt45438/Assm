import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth from '@react-native-firebase/auth';
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';


export default function AppSignup(props) {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [pass, setpass] = useState('')
    const [gender, setGender] = useState('');
    const [name, setname] = useState('')
    const [date, setdate] = useState('')
    const [like, setlike] = useState('')
    const [hight, sethight] = useState('')
    const [weight, setweight] = useState('')

    const infor = () => {
        firestore()
            .collection('Users')
            .add({
                name: name,
                date: date,
                gender: gender,
                like: like,
                hight: hight,
                weight: weight,
                email: email,
                pass: pass
            }).then((docRef) => {
                console.log("id docREF: ", docRef.id);
                return docRef.set({
                    name: name,
                    date: date,
                    gender: gender,
                    like: like,
                    hight: hight,
                    weight: weight,
                    email: email,
                    pass: pass,
                    id: docRef.id
                }, { merge: true })
            })
            .then(() => {
                console.log('User added!');
            }).catch((erro) => {
                console.log('err:' + erro);

            });
    }

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
    const signin = () => {
        if (!email || pass.length < 6 || password.length < 6 || !name || !date || !like || !hight || !weight) {
            Alert.alert('Error', 'All fields are required.');
            return;
        } if (!validateDate(date)) {
            Alert.alert("Lỗi", "Ngày sinh không đúng định dạng dd/MM/yyyy");
            return;
        } if (isNaN(hight) || isNaN(weight)) {
            Alert.alert('chiều cao và cân nặng phải là số')
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Email must be in the format @gmail.com.');
            return;
        } else {
            if (pass === password) {
                auth().
                    createUserWithEmailAndPassword(email, pass)
                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        Alert.alert('Bạn đã đăng ký thành công');
                        // props.navigation.navigate('AppSignin')
                        // ...
                        infor();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // ..
                    });
            } else {
                Alert.alert('password ko trùng lặp')
            }
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => props.navigation.navigate('AppSignin')}>
                <Image source={require('./img/back.png')} style={st.img} />
            </TouchableOpacity>
            <Text style={st.tx}>
                Sign up
            </Text>
            <ScrollView>
                <View style={{ width: '80%', alignSelf: "center" }}>
                    <Text style={st.tx1}>email:</Text>
                    <TextInput style={st.tip} placeholder="Nhập email" onChangeText={(text) => { setemail(text) }} />
                    <Text style={st.tx2}>password:</Text>
                    <TextInput style={st.tip} placeholder="Nhập password" onChangeText={(text) => { setpassword(text) }} />
                    <Text style={st.tx2}>password:</Text>
                    <TextInput style={st.tip} placeholder="Nhập password" onChangeText={(text) => { setpass(text) }} />
                    <Text style={st.tx2}>Nhập họ và tên:</Text>
                    <TextInput style={st.tip} placeholder="Nhập họ tên" onChangeText={(text) => { setname(text) }} />
                    <Text style={st.tx2}>Giới tính:</Text>
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
                    <Text style={st.tx2}>Nhập ngày sinh:</Text>
                    <TextInput style={st.tip} placeholder="Nhập ngày sinh: dd/MM/yyyy" onChangeText={(text) => { setdate(text) }} />
                    <Text style={st.tx2}>Nhập sở thích:</Text>
                    <TextInput style={st.tip} placeholder="Nhập sỏ thích" onChangeText={(text) => { setlike(text) }} />
                    <Text style={st.tx2}>Nhập chiều cao:</Text>
                    <TextInput style={st.tip} placeholder="Nhập chiều cao (cm)" onChangeText={(text) => { sethight(text) }} />
                    <Text style={st.tx2}>Nhập cân nặng:</Text>
                    <TextInput style={st.tip} placeholder="Nhập cân nặng (kg)" onChangeText={(text) => { setweight(text) }} />
                </View>
            </ScrollView>
            <TouchableOpacity style={st.bt} onPress={signin}>
                <Text style={{ color: 'white', fontSize: 17 }}>Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    )
}
const st = StyleSheet.create(
    {
        tx: {
            fontSize: 35, textAlign: "center", marginTop: '15%', fontWeight: 'bold'
        }, tip: {
            borderWidth: 1
        }, tx1: {
            marginTop: '10%', marginBottom: '3%'
        }, tx2: {
            marginTop: '5%', marginBottom: '3%'
        }, bt: {
            backgroundColor: '#F3B412', width: '60%', alignSelf: "center"
            , marginTop: '7%', alignItems: "center", height: '8%', justifyContent: "center",
            borderRadius: 20
        }, img: {
            marginStart: '3%', marginTop: '5%'
        }
    }
)