import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },

  title: {
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
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },

  select: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
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

  link: {
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
  },

  error: {
    color: '#e63946',
    fontSize: 12,
    marginBottom: 5,
  }
})

export default styles;