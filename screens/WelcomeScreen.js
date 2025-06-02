import { Image, StyleSheet, View } from 'react-native'

const WelcomeScreen = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/img/logotreem.png')}
      style={styles.image}
      />
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    header: {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
      image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', 
  },
})