import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My App2!</Text>
    </View>
  );
};

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

export default SplashScreen2;
