import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import AppNavigator from './src/routes/AppNavigator';
import { Provider } from 'react-redux';
import Toast from './src/components/common/toast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </QueryClientProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
