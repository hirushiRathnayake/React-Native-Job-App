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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loadUsersFromStorage, deleteUser, User } from '../userSlice';

const AllUsersScreen = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      await dispatch(loadUsersFromStorage());
      setLoading(false);
    };
    loadUsers();
  }, [dispatch]);

  // Filter users by search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id));
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
    <View style={styles.container}>
      {/* Search Bar */}
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

      {/* User List */}
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
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserPress(item)}
            >
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{item.role}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for user details */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>User Details</Text>
              {selectedUser && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedUser.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Role:</Text>
                    <Text style={styles.detailValue}>{selectedUser.role}</Text>
                  </View>
                  
                  {/* Add more details here if needed */}

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDelete}
                  >
                    <Text style={styles.deleteText}>Delete User</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
  },
  detailValue: {
    fontSize: 16,
    color: '#222',
    flexShrink: 1,
    textAlign: 'right',
  },
  deleteBtn: {
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  deleteText: {
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
