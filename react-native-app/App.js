import React from 'react';
import { View, Text } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import { Provider } from 'react-redux';
import store from './src/store';

const App = () => {
  return (
    <Provider store={store}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <DashboardScreen/>
    </View>
    </Provider>
  );
};

export default App;

