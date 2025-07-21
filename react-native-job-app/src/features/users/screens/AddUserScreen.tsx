import React, { useState } from 'react';
import 'react-native-get-random-values'; // Required for Hermes when using uuid
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { addUser, saveUsersToStorage } from '../userSlice';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-gesture-handler';

const AddUserScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);

  const handleAdd = () => {
    if (!name || !role) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const newUser = {
      id: uuidv4(), // ✅ Hermes-compatible UUID
      name,
      role,
    };

    dispatch(addUser(newUser));
    dispatch(saveUsersToStorage([newUser, ...users]));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Role"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleAdd}>
  <Text style={styles.floatingButtonText}>Add User</Text>
</TouchableOpacity>

   </SafeAreaView>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  floatingButton: {
  position: 'absolute',
  bottom: '85%', // adjust as needed
  alignSelf: 'center',
  backgroundColor: '#000',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 8,
  width: '98%',
},
floatingButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 16,
},

});
