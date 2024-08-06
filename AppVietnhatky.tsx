import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';

export default function AppVietnhatky() {
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visibl, setVisibl] = useState(false);
    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [select, setSelect] = useState('');

    const date = new Date();

    // Lấy giá trị ngày hiện tại
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    useEffect(() => {
        const subscriber = firestore()
            .collection('viết nhật ký')
            .onSnapshot(querySnapshot => {
                const users = [];

                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setList(users);
            });

        return () => subscriber();
    }, [list]);

    const add = () => {
        firestore()
            .collection('viết nhật ký')
            .add({
                content: content,
                date: `${day}/${month}/${year}`
            }).then((docRef) => {
                return docRef.set({
                    content: content,
                    id: docRef.id
                });
            })
            .then(() => {
                console.log('User added!');
                setContent('');
                setVisible(false);
            });
    };

    const sua = () => {
        firestore()
            .collection('viết nhật ký')
            .doc(select.id)
            .update({
                content: content
            })
            .then(() => {
                console.log('User updated!');
                setContent('');
                setVisibl(false);
            });
    };

    const xoa = (item) => {
        Alert.alert('Thông báo', 'Bạn có muốn xóa?', [
            {
                text: 'Ok',
                onPress: () => {
                    firestore()
                        .collection('viết nhật ký')
                        .doc(item.id)
                        .delete()
                        .then(() => {
                            console.log('User deleted!');
                        });
                }
            },
            {
                text: 'Hủy',
                style: 'cancel'
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Điều biết ơn</Text>
            </View>
            {/* <View style={styles.actionBar}>
                <TouchableOpacity onPress={() => setVisible1(true)}>
                    <Image source={require('./img/search.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('./img/more.png')} style={styles.icon} />
                </TouchableOpacity>
            </View> */}
            <View style={styles.listContainer}>
                <FlatList
                    data={list}
                    renderItem={render}
                />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
                <Image source={require('./img/no.png')} style={styles.addIcon} />
            </TouchableOpacity>

            <Modal visible={visible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Viết lời biết ơn</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={styles.input} onChangeText={(txt) => setContent(txt)} />
                    <View style={styles.modalActions}>
                        <Button title="Thêm" onPress={add} />
                        <Button title="Hủy" onPress={() => setVisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={visibl}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Sửa lời biết ơn</Text>
                    <Text>Nội Dung:</Text>
                    <TextInput style={styles.input} value={content} onChangeText={(txt) => setContent(txt)} />
                    <View style={styles.modalActions}>
                        <Button title="Sửa" onPress={sua} />
                        <Button title="Hủy" onPress={() => { setVisibl(false), setContent('') }} />
                    </View>
                </View>
            </Modal>

            <Modal visible={visible1}>
                <TextInput style={styles.searchInput} placeholder="Tìm kiếm..." />
                <FlatList />
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
        alignItems: 'center',
        justifyContent: 'center',
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
    searchInput: {
        borderWidth: 1,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginTop: '2%',
        padding: 10,
    },
});
