import {Text, View} from 'react-native';

function ProfileScreen({navigation, route}) {
  return (
    <View>
      <Text>{`This is ${route.params.name}'s profile`}</Text>
    </View>
  );
}

export default ProfileScreen;
