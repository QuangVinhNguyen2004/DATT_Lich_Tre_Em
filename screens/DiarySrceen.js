import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DiaryScreen = () => {
  return (
    <View style={styles.container}>
    <Text>DiaryScreen</Text>
    </View>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      justifyContent: 'center',
    }
});
