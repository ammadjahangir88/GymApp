import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => (
    <View style={styles.inputContainer}>
        <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#666"
        />
    </View>
);

const CustomButton = ({ onPress, text, loading, type = "PRIMARY" }) => (
    <TouchableOpacity 
        onPress={onPress} 
        style={[styles.buttonContainer, styles[`button_${type}`]]}
        disabled={loading}
    >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={[styles.buttonText, styles[`buttonText_${type}`]]}>{text}</Text>
        )}
    </TouchableOpacity>
);

const Signup = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [registration, setRegistration] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !registration || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Replace with your signup API endpoint
            const response = await axios.post('http://10.28.85.178:3000/auth/signup', {
                firstName,
                lastName,
                email,
                registration,
                password,
            });
            setLoading(false);
            Alert.alert('Success', 'Signup successful!');
           navigation.goBack() // Navigate back to Login
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Signup failed');
        }
    };

    const handleLoginNavigation = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.contentContainer}>
                <Text style={styles.headerText}>Create Account</Text>
                <Text style={styles.subtitleText}>Sign up to get started</Text>

                <CustomInput
                    placeholder="First Name"
                    value={firstName}
                    setValue={setFirstName}
                />
                <CustomInput
                    placeholder="Last Name"
                    value={lastName}
                    setValue={setLastName}
                />
                <CustomInput
                    placeholder="Email"
                    value={email}
                    setValue={setEmail}
                />
                <CustomInput
                    placeholder="Registration"
                    value={registration}
                    setValue={setRegistration}
                />
                <CustomInput
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry
                />

                <CustomButton text="Sign Up" onPress={handleSignup} loading={loading} />

                <View style={styles.loginRedirectContainer}>
                    <Text style={styles.loginRedirectText}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleLoginNavigation}>
                        <Text style={styles.loginRedirectLink}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F9FBFC',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'white',
        height: 50,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 10,
    },
    button_PRIMARY: {
        backgroundColor: '#ff9900',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonText_PRIMARY: {
        color: 'white',
    },
    loginRedirectContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    loginRedirectText: {
        color: '#666',
        fontSize: 14,
    },
    loginRedirectLink: {
        color: '#ff9900',
        fontWeight: '600',
        fontSize: 14,
    },
});
