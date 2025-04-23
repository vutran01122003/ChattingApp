import React from 'react';
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
import SearchScreen from './screens/SearchScreen';
import ChattingScreen from './screens/ChattingScreen';
import ContactScreen from './screens/ContactScreen';
import FriendRequestScreen from './screens/FriendRequsetScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='AuthLoading'>
        <Stack.Screen name='AuthLoading' component={AuthLoadingScreen} options={{headerShown:false}} />
         <Stack.Screen name="Home" component={WelcomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
          <Stack.Screen name="CountryCodeScreen" component={CountryCodeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} options={{ title: "" }}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="NameInputScreen" component={NameInputScreen} options={{headerShown:false}} />
          <Stack.Screen name ="PersonalInfoScreen" component={PersonalInfoScreen} options={{title:""}}/>
          <Stack.Screen name="MainApp" component={MainAppStack} options={{headerShown: false}} />
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} options={{title:'Cập nhật mật khẩu của bạn'}} />
          <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} options={{headerShown: false}} />
          <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} options={{headerShown: false}} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: true, title: 'Tìm kiếm' }} />
          <Stack.Screen name="ChattingScreen" component={ChattingScreen} options={{headerShown: false}} />
          <Stack.Screen name="ContactScreen" component={ContactScreen} options={{headerShown: false}} />
          <Stack.Screen name="FriendRequestScreen" component={FriendRequestScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
