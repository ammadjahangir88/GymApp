import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#F9FBFC',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    subHeader: {
      fontSize: 16,
      color: '#555',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    input: {
      height: 50,
      fontSize: 16,
      color: '#333',
      paddingHorizontal: 15,
    },
    verifyButton: {
      width: '100%',
      backgroundColor: '#ff9900',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    verifyButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: 'red',
      marginTop: 10,
    },
    optInputWrapper: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginBottom: "10%"
    },
    optInputRoot: {
      marginTop: 20,
      width: "98%",
      paddingHorizontal: "2%",
      justifyContent: "space-evenly",
      color: "black",
    },
    optInputCellRoot: {
      color: "black",
      width: 40,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      borderBottomColor: "#ff9900",
      borderBottomWidth: 1,
    },
    optInputCellText: {
      color: "black",
      fontFamily: "Poppins-Regular",
      fontSize: 28,
      textAlign: "center",
    },
    optInputFocusCell: {
      borderBottomColor: "#007AFF",
      borderBottomWidth: 2,
    },
  });



  export default styles;  