/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import MainNavigator from '@route';
import {StoreProvider} from '@store/root.store';
// import {useStores} from '@store/root.store';

const App = () => {
  return (
    <StoreProvider>
      <MainNavigator />
    </StoreProvider>
  );
};

// const styles = StyleSheet.create({

// });

export default App;
