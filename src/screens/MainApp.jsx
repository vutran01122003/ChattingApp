import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, TouchableOpacity, SafeAreaView, Input, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import AccountSecurityScreen from './AccountSecurityScreen';
import PersonalDetailScreen from './PersonalDetailScreen';
import EditProfileScreen from './EditProfileScreen';
import CreatePasswordNotLogoutScreen from './CreatePasswordNotLogout';
import {useNavigation} from '@react-navigation/native';
import ChangePasswordScreen from './ChangePasswordScreen';
import {Scanner} from './CameraScanner';
import ConversationScreen from './ConversationScreen';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateGroupModal from '../component/CreateGroupModal';
import ContactScreen from './ContactScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomHeader = ({route}) => {
  const isProfileScreen = route?.name === 'Me';
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCreateGroup, setVisibleCreateGroup] = useState(false);
  
  const handleSearchInputPress = async () => {
      navigation.navigate('SearchScreen', { searchTerm: searchTerm });
  };

  const handleToggleDisplayCreateGroupModal = () => {
    setVisibleCreateGroup(prev => !prev);
  }

  return (
    <SafeAreaView className="flex-row items-center bg-blue-500 px-4 py-2">
      {
        visibleCreateGroup && <CreateGroupModal handleToggleDisplayCreateGroupModal={handleToggleDisplayCreateGroupModal} visible={visibleCreateGroup}/>
      }

      <View className="flex-row items-center bg-blue-400 flex-1 rounded-md px-2 py-1">
        <Ionicons name="search" size={20} color="#ffffff" />
        <TextInput
          placeholder="Tìm kiếm người dùng"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="text-white ml-2"
          onFocus={handleSearchInputPress}  
        />
      </View>
      {isProfileScreen ? (
        <TouchableOpacity className="ml-3">
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            className="ml-3"
            onPress={() => navigation.navigate('QRScanner')}>
            <Icon name="qrcode-scan" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity className="ml-3" onPress={handleToggleDisplayCreateGroupModal}>
            <AntDesign name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: () => <CustomHeader route={route} />,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Me') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0084ff',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Messages"
        component={ConversationScreen}
        options={{tabBarLabel: 'Tin nhắn'}}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactScreen}
        options={{tabBarLabel: 'Danh bạ'}}
      />
      <Tab.Screen
        name="Groups"
        component={HomeScreen}
        options={{tabBarLabel: 'Nhóm'}}
      />
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{tabBarLabel: 'Khám phá'}}
      />
      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{tabBarLabel: 'Cá nhân'}}
      />
    </Tab.Navigator>
  );
};
const MainAppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AccountSecurity"
        component={AccountSecurityScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PersonalDetail"
        component={PersonalDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePasswordNotLogout"
        component={CreatePasswordNotLogoutScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="QRScanner"
        component={Scanner}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainAppStack;
