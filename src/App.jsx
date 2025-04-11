import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CountryCodeScreen from './screens/CountryCodeScreen';
import {AppProvider} from './redux/store';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import './global.css';
import SignUpScreen from './screens/SignUpScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import ForgotPassword from './screens/ForgotPasswordScreen';
import OTPVerificationForgotPassword from './screens/OTPVerificationForgotPassword';
import CreateNewPassword from './screens/CreateNewPassword';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{header: () => <></>}}>
          <Stack.Screen
            name="Home"
            component={WelcomeScreen}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="OTPVerificationForgotPassword" component={OTPVerificationForgotPassword} />
          <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
