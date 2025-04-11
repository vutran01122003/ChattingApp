import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const LoginScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>
          Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
        </Text>

        {/* Ô nhập số điện thoại */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={[
              styles.input,
              isPhoneFocused ? styles.inputFocused : styles.inputDefault,
            ]}
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={() => setIsPhoneFocused(false)}
          />
          {/* Nếu có giá trị trong ô nhập, hiển thị nút "X" để xóa */}
          {phone.length > 0 && (
            <TouchableOpacity onPress={() => setPhone('')}>
              <Text style={styles.clearText}>X</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ô nhập mật khẩu */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              isPasswordFocused ? styles.inputFocused : styles.inputDefault,
            ]}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showPasswordText}>
              {showPassword ? 'Ẩn' : 'Hiện'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nút "Lấy lại mật khẩu" */}
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Lấy lại mật khẩu</Text>
        </TouchableOpacity>

        {/* Nút Đăng nhập */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={{color: 'white', fontSize: 20}}>Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    marginTop: 5,
  },
  inputDefault: {
    borderBottomColor: '#ccc',
  },
  inputFocused: {
    borderBottomColor: '#007BFF',
  },
  clearText: {
    color: 'red',
    fontSize: 18,
    paddingRight: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
  },
  showPasswordText: {
    color: '#007BFF',
    fontSize: 14,
    marginLeft: 10,
  },
  loginButton: {
    width: 220,
    height: 60,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

export default LoginScreen;
