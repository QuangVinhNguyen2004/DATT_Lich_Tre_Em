import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const PasswordResetNoticeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
  
      <Image
        source={require('../assets/img/muiten.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      {/* Nội dung */}
      <Text style={styles.text}>
        Chúng tôi đã gửi cho bạn{'\n'}Email để đặt lại mật khẩu!
      </Text>

      {/* Nút quay lại đăng nhập */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Quay lại Đăng nhập</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PasswordResetNoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  text: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
