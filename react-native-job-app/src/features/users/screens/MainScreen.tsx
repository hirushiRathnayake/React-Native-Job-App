import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  loadUsersFromStorage,
  deleteUser,
  saveUsersToStorage,
} from '../userSlice';

const MainScreen = ({ navigation }: any) => {
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);

  const fetchQuote = async () => {
    try {
      const res = await axios.get('https://api.realinspire.live/v1/quotes/random');
      const quoteText = res.data?.[0]?.content;
      setQuote(quoteText ?? 'No quote found.');
    } catch (err) {
      console.error('Quote fetch error:', err);
      setQuote('Failed to fetch quote.');
    } finally {
      setLoadingQuote(false);
    }
  };

  const filteredUsers = users
    .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  const groupedUsers = filteredUsers.reduce((acc, user) => {
    const firstLetter = user.name[0].toUpperCase();
    acc[firstLetter] = acc[firstLetter] ? [...acc[firstLetter], user] : [user];
    return acc;
  }, {} as Record<string, typeof users>);

  const renderUserCard = (user: any) => {
    const age = new Date().getFullYear() - new Date(user.dob).getFullYear();
    return (
      <View key={user.id} style={styles.card}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.text}>Age: {age}     DOB: {user.dob}</Text>
        <Text style={styles.text}>Employee ID : {user.id}</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchQuote();
    dispatch(loadUsersFromStorage());
  }, []);

  return (
  
        <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
      </View>
      <View style={styles.separator} />


      {/* Quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteLabel}>Quote</Text>
        {loadingQuote ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.quoteText}>
            “{quote}”{'\n'}
            <Text style={styles.quoteAuthor}>F. Scott Fitzgerald</Text>
          </Text>
        )}
      </View>

      {/* New Employees */}
      <Text style={styles.sectionTitle}>New Employees (Last 10)</Text>

      <ScrollView style={{ marginBottom: 70 }}>
        {Object.keys(groupedUsers)
          .sort()
          .map((letter) => (
            <View key={letter}>
              <Text style={styles.letterHeader}>{letter}</Text>
              {groupedUsers[letter].map((user) => renderUserCard(user))}
            </View>
          ))}
      </ScrollView>

      {/* Add Employee Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddUser')}
        style={styles.floatingButton}
      >
        <Text style={styles.floatingButtonText}>Add new Employee</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showAllButton} onPress={() => navigation.navigate('AllUsers')}>
  <Text style={styles.showAllButtonText}>Show All Users</Text>
</TouchableOpacity>

    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 8,
  },
  quoteBox: {
    backgroundColor: '#A5DBCD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  separator: {
  height:1 ,
  backgroundColor: '#000',
  opacity: 1,
  marginVertical: 12,
},

  quoteLabel: {
    fontWeight: '600',
    marginBottom: 6,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  quoteAuthor: {
    alignSelf: 'flex-end',
    fontStyle: 'normal',
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 6,
  },
  letterHeader: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#EFE6DA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#333',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 130,
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
  },
  showAllButton: {
  backgroundColor: '#000',
   bottom: 0,
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 12,
  width: '98%',
},
showAllButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},

});
