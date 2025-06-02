import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PostScreen = () => {
  return (
    <View style={styles.container}>
    <Text>PostScreen</Text>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      justifyContent: 'center',
    }
});
