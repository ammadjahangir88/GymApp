import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My App!</Text>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Replace with your preferred color
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});