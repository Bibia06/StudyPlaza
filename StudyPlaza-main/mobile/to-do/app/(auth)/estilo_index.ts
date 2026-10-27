import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    loginBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },

    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    bemvindo: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },

    input: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 5,
    },

    button: {
        backgroundColor: '#6C63FF',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    registerText: {
        marginTop: 15,
        textAlign: 'center',
    },

    link: {
        color: '#6C63FF',
        fontWeight: 'bold',
    },

    error: {
        color: '#e63946',
        fontSize: 12,
        marginBottom: 5,
    },

    logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },

})

export default styles;
