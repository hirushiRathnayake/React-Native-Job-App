import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '../../app/store';

export interface User {
  id: string;
  name: string;
  role: string;
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, deleteUser } = userSlice.actions;

export const loadUsersFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const saved = await AsyncStorage.getItem('users');
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch(setUsers(parsed));
    }
  } catch (err) {
    console.error('Failed to load users', err);
  }
};

export const saveUsersToStorage = (users: User[]) => async () => {
  try {
    await AsyncStorage.setItem('users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
};

export default userSlice.reducer;
