import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
    <Text>Home</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      justifyContent: 'center',
    }
});
