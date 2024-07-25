import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
export default function AppVietghichu() {
    const [visible, setvisible] = useState(false);
    const [content, setcontent] = useState('')
    const [list, setlist] = useState([]);
    const [con, setcon] = useState('')
    const [visibl, setvisibl] = useState(false);
    const [select, setselect] = useState('')
    const date = new Date();

    // Lấy giá trị ngày hiện tại
    const day = date.getDate();

    // Lấy giá trị tháng hiện tại (0-11, cần +1 để có tháng thực tế)
    const month = date.getMonth() + 1;

    // Lấy giá trị năm hiện tại
    const year = date.getFullYear();


    const add = () => {
        if (!content) {
            Alert.alert('bạn không được để trống dữ liệu >.<');
        } else {
            firestore()
                .collection('lời biết ơn')
                .add({
                    content: content,
                    date: day + "/" + month + "/" + year
                }).then((docRef) => {
                    // docRef.id chứa ID tự sinh ra của tài liệu mới
                    console.log('Document added with ID: ', docRef.id);
                    return docRef.set({
                        content: content,
                        id: docRef.id
                    }, { merge: true })
                })
                .then(() => {
                    console.log('User added!');
                    setvisible(false)
                    setcontent('')
                    Alert.alert('Đã thêm thành công ghi chú')
                }).catch((erro) => {
                    console.log('lỗi add:' + erro);
                });
        }
    }


    const xoa = (item) => {
        Alert.alert('Thông báo', 'bạn có muốn xóa item này', [
            {
                text: 'Ok',
                onPress: () => {
                    firestore()
                        .collection('lời biết ơn')
                        .doc(item.id)
                        .delete()
                        .then(() => {
                            console.log('User deleted!');
                        });
                }
            }, {
                text: 'Hủy',
                style: "cancel"
            }
        ])
    }
    const render = ({ item }) => {
        return (
            <View style={st.g}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginStart: '5%', marginEnd: '5%' }}>
                    <View>
                        <Text style={st.g1}>Nội dung: {item.content}</Text>
                        <Text style={{}}>Ngày: {item.date}</Text>
                    </View>
                    <Text style={{ padding: '1%', color: '#FF0000' }} onPress={() => open(item)}>Sửa</Text>
                </View>
                <Button title="Xóa" onPress={() => xoa(item)} />
            </View>
        )
    }


    const open = (item) => {
        setvisibl(true)
        setcontent(item.content)
        setselect(item)
    }
    const sua = () => {
        firestore()
            .collection('lời biết ơn')
            .doc(select.id)
            .update({
                content: content,
            })
            .then(() => {
                console.log('User updated!');
            });
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('lời biết ơn')
            .onSnapshot(querySnapshot => {
                const list = [];
                querySnapshot.forEach(documentSnapshot => {
                    list.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                setlist(list);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '10%', backgroundColor: '#FFB800', justifyContent: "center" }}>
                <Text style={st.g2}>10 Điều biết ơn</Text>
            </View>
            <View style={st.a}>
                <TouchableOpacity >
                    <Image source={require('./img/search.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('./img/more.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={list}
                    renderItem={render} />
            </View>
            <TouchableOpacity style={st.b} onPress={() => setvisible(true)}>
                <Image source={require('./img/no.png')} />
            </TouchableOpacity>

            <Modal visible={visible}>
                <View style={st.c}>
                    <Text style={st.e}>Viết lời biết ơn</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={st.d} onChangeText={(txt) => setcontent(txt)} />
                    <View style={st.f}>
                        <Button title="Thêm" onPress={add} />
                        <Button title="Hủy" onPress={() => setvisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={visibl}>
                <View style={st.c}>
                    <Text style={st.e}>Viết lời biết ơn</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={st.d} value={content} onChangeText={(txt) => setcontent(txt)} />
                    <View style={st.f}>
                        <Button title="Sửa" onPress={sua} />
                        <Button title="Hủy" onPress={() => setvisibl(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const st = StyleSheet.create(
    {
        a: {
            flexDirection: "row", justifyContent: "flex-end", marginTop: '3%', marginEnd: '2%'
        }, b: {
            position: 'absolute',
            bottom: 0,
            right: 0, justifyContent: "center", marginBottom: '2%', marginRight: '4%',
            backgroundColor: 'red', borderRadius: 40, width: '13%', height: '7%', alignItems: "center"
        }, c: {
            width: '85%', alignSelf: "center", marginTop: '10%'
        }, d: {
            borderWidth: 1, borderRadius: 10, marginTop: '3%'
        }, e: {
            fontSize: 30, fontWeight: "bold", textAlign: "center"
        }, f: {
            marginTop: '5%', width: '70%', alignSelf: "center"
        }, g: {
            borderWidth: 1, borderRadius: 10, width: '90%', alignSelf: "center", marginTop: '3%'
        }, g1: {
            padding: '1%'
        }, g2: {
            fontWeight: "bold", fontSize: 30, textAlign: "center", justifyContent: "center"
        }
    }
)