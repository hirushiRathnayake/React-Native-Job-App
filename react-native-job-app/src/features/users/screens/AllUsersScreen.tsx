import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../app/store';

import {
    loadUsersFromStorage,
    deleteUserAndSave,
    updateUserAndSave,
    User,
} from '../userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllUsersScreen = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users.users);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);


    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            await dispatch(loadUsersFromStorage());
            setLoading(false);
        };
        loadUsers();
    }, [dispatch]);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleUserPress = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditRole(user.role);
        setModalVisible(true);
    };

    const handleDelete = (user: User) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteUserAndSave(user.id));
                        if (selectedUser?.id === user.id) setModalVisible(false);
                    },
                },
            ]
        );
    };


    const handleSave = () => {
        if (!editName.trim() || !editRole.trim()) {
            Alert.alert('Validation', 'Name and Role cannot be empty');
            return;
        }

        if (selectedUser) {
            dispatch(
                updateUserAndSave({
                    ...selectedUser,
                    name: editName.trim(),
                    role: editRole.trim(),
                })
            );
            setModalVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>Loading users...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users"
                    value={search}
                    onChangeText={setSearch}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            </View>

            {filteredUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    renderItem={({ item }) => (
                        <View style={styles.userRow}>
                            <TouchableOpacity
                                style={styles.userInfo}
                                onPress={() => handleUserPress(item)}
                            >
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userRole}>{item.role}</Text>
                                <Text style={styles.userId}>Employee ID: {item.id}</Text>
                            </TouchableOpacity>

                            <View style={styles.actionIcons}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedUser(item);
                                        setEditName(item.name);
                                        setEditRole(item.role);
                                        setModalVisible(true);
                                    }}
                                    style={styles.iconBtn}
                                >
                                    <Ionicons name="pencil" size={22} color="#3182ce" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
                                    <Ionicons name="trash" size={22} color="#e53e3e" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}


            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Edit User</Text>
                            {selectedUser && (
                                <>
                                    <Text style={styles.inputLabel}>Employee ID:</Text>
                                    <Text style={styles.staticText}>{selectedUser.id}</Text>

                                    <Text style={styles.inputLabel}>Name:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editName}
                                        onChangeText={setEditName}
                                        placeholder="Enter name"
                                    />
                                    <Text style={styles.inputLabel}>Role:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editRole}
                                        onChangeText={setEditRole}
                                        placeholder="Enter role"
                                    />

                                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                        <Text style={styles.saveText}>Save</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AllUsersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginBottom: 12,
        height: 40,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    searchIcon: {
        marginLeft: 8,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#fafafa',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    userRole: {
        color: '#666',
        marginTop: 4,
    },
    userId: {
        color: '#888',
        marginTop: 2,
        fontStyle: 'italic',
    },
    actionIcons: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    iconBtn: {
        marginLeft: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 6,
        color: '#444',
    },
    staticText: {
        fontSize: 16,
        marginBottom: 12,
        color: '#222',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 16,
        color: '#222',
    },
    saveBtn: {
        backgroundColor: '#3182ce',
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
    },
    saveText: {
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
    },
    cancelBtn: {
        marginTop: 12,
    },
    cancelText: {
        color: '#3182ce',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
