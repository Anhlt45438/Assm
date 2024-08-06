import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';

export default function AppVietghichu() {
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [visibl, setVisibl] = useState(false);
    const [select, setSelect] = useState('');

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    useEffect(() => {
        const subscriber = firestore()
            .collection('lời biết ơn')
            .onSnapshot(querySnapshot => {
                const notes = [];
                querySnapshot.forEach(documentSnapshot => {
                    notes.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setList(notes);
            });

        return () => subscriber();
    }, [list]);

    const add = () => {
        if (!content) {
            Alert.alert('Bạn không được để trống dữ liệu >.<');
        } else {
            firestore()
                .collection('lời biết ơn')
                .add({
                    content: content,
                    date: `${day}/${month}/${year}`
                }).then((docRef) => {
                    return docRef.set({
                        content: content,
                        id: docRef.id
                    }, { merge: true });
                })
                .then(() => {
                    console.log('User added!');
                    setVisible(false);
                    setContent('');
                    Alert.alert('Đã thêm nhật kí ngày hôm nay');
                }).catch((error) => {
                    console.log('Lỗi add:' + error);
                });
        }
    };

    const xoa = (item) => {
        Alert.alert('Thông báo', 'Bạn có muốn xóa item này?', [
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
            },
            {
                text: 'Hủy',
                style: "cancel"
            }
        ]);
    };

    const render = ({ item }) => {
        return (
            <View style={styles.entryContainer}>
                <View style={styles.entryContent}>
                    <View>
                        <Text style={styles.entryText}>Nội dung: {item.content}</Text>
                        <Text style={styles.entryDate}>Ngày: {item.date}</Text>
                    </View>
                    <Text style={styles.editButton} onPress={() => open(item)}>Sửa</Text>
                </View>
                <Button title="Xóa" onPress={() => xoa(item)} />
            </View>
        );
    };

    const open = (item) => {
        setVisibl(true);
        setContent(item.content);
        setSelect(item);
    };

    const sua = () => {
        firestore()
            .collection('lời biết ơn')
            .doc(select.id)
            .update({
                content: content,
            })
            .then(() => {
                console.log('User updated!');
                setVisibl(false);
                setContent('');
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Viết nhật ký</Text>
            </View>
            <View style={styles.actionBar}>
                <TouchableOpacity>
                    <Image source={require('./img/search.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('./img/more.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={list}
                    renderItem={render}
                />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
                <Image source={require('./img/no.png')} style={styles.addIcon} />
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Nhật ký hôm nay</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={styles.input} onChangeText={(txt) => setContent(txt)} />
                    <View style={styles.modalActions}>
                        <Button title="Thêm" onPress={add} />
                        <Button title="Hủy" onPress={() => setVisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={visibl} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Nhật ký hôm nay</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={styles.input} value={content} onChangeText={(txt) => setContent(txt)} />
                    <View style={styles.modalActions}>
                        <Button title="Sửa" onPress={sua} />
                        <Button title="Hủy" onPress={() => setVisibl(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
    },
    header: {
        width: '100%',
        height: '10%',
        backgroundColor: '#FFB800',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#FFFFFF',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: '3%',
        marginEnd: '2%',
    },
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
    },
    listContainer: {
        flex: 1,
        marginTop: 10,
    },
    entryContainer: {
        borderWidth: 1,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginTop: '3%',
        padding: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    entryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    entryText: {
        fontSize: 16,
    },
    entryDate: {
        fontSize: 14,
        color: '#888',
    },
    editButton: {
        color: '#1E90FF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 40,
        width: 60,
        height: 60,
    },
    addIcon: {
        width: 30,
        height: 30,
        tintColor: '#FFF',
    },
    modalContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
        borderColor: '#CCC',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});
