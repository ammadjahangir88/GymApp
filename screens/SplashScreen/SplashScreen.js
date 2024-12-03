import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const SplashScreen = () => {
  return (
    <ImageBackground 
      source={require('../../assets/images/wp7661163.jpg')}
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.mainText}>Transform Your Body</Text>
        <Text style={styles.subText}>Shape Your Future</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // This pushes content to the bottom
    alignItems: 'center',
   
  },
  mainText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8, // Space between main text and subtext
  },
  subText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SplashScreen;