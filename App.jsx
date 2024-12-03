import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './screens/Auth/Login';
import AppNavigation from './navigation/AppNavigation';
import { Provider } from "react-redux";
import { persistor, store } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/SplashScreen/SplashScreen';
export default function App() {
 
    return (
      <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppNavigation />
               
            </PersistGate>

            <Toast/>
        </Provider>
    );
}



