import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

const WelcomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Lochat</Text>

      <Text style={styles.title}>Gọi video ổn định</Text>
      <Text style={styles.subtitle}>
        Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi
      </Text>

      {/* Nút Đăng Nhập */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      {/* Nút Đăng Ký */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.registerText}>ĐĂNG KÝ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0084FF',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#0084FF',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    paddingVertical: 12,
    paddingHorizontal: 80,
  },
  registerText: {
    color: '#0084FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
