import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './screens/ProfileScreen';
import CountryCodeScreen from './screens/CountryCodeScreen';
import {AppProvider} from './redux/store';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import './global.css';
import SignUpScreen from './screens/SignUpScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import NameInputScreen from './screens/NameInputScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import CreatePasswordScreen from './screens/CreatePassword';
import MainTabNavigator from './screens/MainApp';
import MainAppStack from './screens/MainApp';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import VerificationCodeScreen from './screens/VerificationRecoveryScreen';
import ConversationScreen from './screens/ConversationScreen';
import ChatMessageScreen from './screens/ChatMessageScreen';
import {SocketProvider} from './context/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForwardMessageScreen from './screens/ForwardMessageScreen';
import SearchScreen from './screens/SearchScreen';
import GroupInfoScreen from './screens/GroupInfoScreen';
import { navigationRef } from './component/NavigationService';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const getUserLogin = async () => {
    try {
      const userId = await AsyncStorage.getItem('client_id');
      const token = await AsyncStorage.getItem('access_token');

      if (userId && token) {
        setUser({userId, token});
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLogin();
  }, []);

  if (loading) return null;

  return (
    <AppProvider>
      <SocketProvider userId={user?.userId} token={user?.token}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="AuthLoading">
            <Stack.Screen
              name="AuthLoading"
              component={AuthLoadingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GroupInfo"
              component={GroupInfoScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CountryCodeScreen"
              component={CountryCodeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OtpVerificationScreen"
              component={OtpVerificationScreen}
              options={{title: ''}}
            />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="NameInputScreen"
              component={NameInputScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PersonalInfoScreen"
              component={PersonalInfoScreen}
              options={{title: ''}}
            />
            <Stack.Screen
              name="MainApp"
              component={MainAppStack}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreatePassword"
              component={CreatePasswordScreen}
              options={{title: 'Cập nhật mật khẩu của bạn'}}
            />
            <Stack.Screen
              name="PasswordRecovery"
              component={PasswordRecoveryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VerificationCode"
              component={VerificationCodeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Conversation"
              component={ConversationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatMessage"
              component={ChatMessageScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForwardMessageScreen"
              component={ForwardMessageScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: true, title: 'Tìm kiếm' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;
