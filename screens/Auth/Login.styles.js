import { StyleSheet } from 'react-native';


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
    logoContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: '100%',
      opacity: 0.8,
      resizeMode: 'cover',
      position: 'absolute',
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      position: 'absolute',
      top: '35%',
      left: '25%',
    },
    formContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: '10%',
    },
    phoneInput: {
      flex: 1,
      height: 55,
      color: 'black',
      paddingHorizontal: 15,
      fontSize: 16,
    },
    phoneInputContainer: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 10,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    flagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10,
      borderRightWidth: 1,
      borderRightColor: '#ddd',
    },
    flagImage: {
      width: 30,
      height: 20,
      marginRight: 5,
    },
    countryCode: {
      color: 'black',
      fontSize: 16,
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
      color: 'black',
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
  });
  
  export default styles;