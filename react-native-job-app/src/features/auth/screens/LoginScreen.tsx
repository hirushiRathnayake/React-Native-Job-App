import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const MOCKED_PIN = '1234';

const LoginScreen = ({ navigation }: any) => {
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    if (pin === MOCKED_PIN) {
      navigation.replace('Main');
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
      />
      <Button title="Login" onPress={handleLogin} disabled={pin.length === 0} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
  },
});
