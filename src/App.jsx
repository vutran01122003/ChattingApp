import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CountryCodeScreen from './screens/CountryCodeScreen';
import {AppProvider} from './redux/store';
import './global.css';
import SignUpScreen from './screens/SignUpScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Welcome'}}
          /> */}
          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
          <Stack.Screen name="CountryCodeScreen" component={CountryCodeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} options={{ title: "" }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
