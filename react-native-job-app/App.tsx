// App.tsx
import 'react-native-get-random-values';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import AppNavigator from './src/app/navigation';



export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
