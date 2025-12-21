import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import * as encoding from 'text-encoding';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import AppNavigator from './src/routes/AppNavigator';
import { Provider } from 'react-redux';
import Toast from './src/components/common/toast';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
Object.assign(globalThis, encoding);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <QueryClientProvider client={queryClient}>
              <NavigationContainer>
                <ZegoCallInvitationDialog />
                <AppNavigator />
              </NavigationContainer>
              <Toast />
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
