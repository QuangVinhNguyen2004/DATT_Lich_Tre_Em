import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
    <Text>SettingsScreen</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      justifyContent: 'center',
    }
});
