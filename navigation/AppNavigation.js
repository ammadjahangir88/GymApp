import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from '../redux/authSlice';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import Dashboard from '../screens/Dashboard/Dashboard';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true); // Splash screen state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Hide splash screen after 3 seconds
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />; // Display splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          // Authenticated routes
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="SignUp" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
